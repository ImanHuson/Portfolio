// TSU concept: progressive enhancement only. Every page works without this file.
(() => {
  const d = document;
  d.documentElement.classList.add("js");

  // 1. Phone menu: a real <button> with aria-expanded (the original site's menu can't take keyboard focus).
  const toggle = d.querySelector(".menu-toggle");
  const nav = d.getElementById("site-nav");
  if (toggle && nav) {
    const set = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.dataset.open = String(open);
      toggle.querySelector("[data-label]").textContent = open ? "Close" : "Menu";
    };
    set(false);
    toggle.addEventListener("click", () => set(toggle.getAttribute("aria-expanded") !== "true"));
    d.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { set(false); toggle.focus(); }
    });
  }

  // 2. Philippine Standard Time, computed locally (the original loads a third-party script on every visit).
  const pst = d.querySelector("[data-pst]");
  if (pst) {
    const fmt = new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    const tick = () => { pst.textContent = "Philippine Standard Time: " + fmt.format(new Date()); };
    tick();
    pst.hidden = false;
    setInterval(tick, 30000);
  }

  // Today's date in Manila as YYYY-MM-DD
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const today = parts.slice(0, 10);

  // 3. Calendar rows: mark past and current events for the real date (the build marks them for the build date).
  const rows = d.querySelectorAll("tr[data-start]");
  rows.forEach((tr) => {
    const s = tr.dataset.start, e = tr.dataset.end || s;
    tr.classList.toggle("is-now", s <= today && today <= e);
    tr.classList.toggle("is-past", e < today);
    const tag = tr.querySelector(".tag");
    if (tag) tag.hidden = !(s <= today && today <= e);
  });

  // 4. Home "Coming up": rebuilt for the real date if it differs from the build date.
  const up = d.querySelector("[data-upcoming]");
  if (up && up.dataset.built !== today && window.fetch) {
    fetch(up.dataset.src).then((r) => (r.ok ? r.json() : null)).then((events) => {
      if (!events) return;
      const next = events.filter((ev) => (ev.end || ev.start) >= today).slice(0, 5);
      if (!next.length) return;
      up.innerHTML = next.map((ev) => {
        const now = ev.start <= today;
        return `<li class="${now ? "is-now" : ""}"><time datetime="${ev.start}">${ev.when}</time><span>${ev.what}${now ? '<span class="tag">Now</span>' : ""}</span></li>`;
      }).join("");
    }).catch(() => {});
  }

  // 5. Announcements filter: ?type=class preselects a filter (the filter itself is CSS :has()).
  const type = new URLSearchParams(location.search).get("type");
  const radio = type && d.getElementById("f-" + type);
  if (radio) radio.checked = true;
  const count = d.querySelector("[data-count]");
  if (count) {
    const update = () => {
      const n = [...d.querySelectorAll(".ann")].filter((el) => el.offsetParent !== null).length;
      count.textContent = `Showing ${n} announcement${n === 1 ? "" : "s"}.`;
    };
    d.querySelectorAll(".filter input").forEach((i) => i.addEventListener("change", () => {
      update();
      const url = new URL(location.href);
      if (i.value === "all") url.searchParams.delete("type"); else url.searchParams.set("type", i.value);
      history.replaceState(null, "", url);
    }));
    update();
  }
})();

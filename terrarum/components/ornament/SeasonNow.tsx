"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ARTWORKS, SEASONS, seasonOf, type Season } from "@/lib/ornament";
import { asset } from "@/lib/content/media";

/** WMO weather codes (as Open-Meteo returns them) in plain words. */
function sky(code: number, day: boolean) {
  if (code === 0) return day ? "clear sky" : "clear night";
  if (code <= 2) return "a few clouds";
  if (code === 3) return "overcast";
  if (code <= 48) return "fog";
  if (code <= 57) return "drizzle";
  if (code <= 67) return "rain";
  if (code <= 77) return "snow";
  if (code <= 82) return "showers";
  if (code <= 86) return "snow showers";
  return "thunderstorms";
}

// A clock that ticks once a minute, shared by every strip on the page.
const ticks = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;
let now = 0;
function subscribe(f: () => void) {
  ticks.add(f);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      ticks.forEach((t) => t());
    }, 30_000);
  }
  return () => {
    ticks.delete(f);
    if (!ticks.size) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}
const snapshot = () => now || (now = Date.now());

type Weather = { t: number; code: number; day: boolean } | "unavailable" | null;

/**
 * Japan right now: the time there, its season (and the branch and print that
 * stand for it, from Kamisaka Sekka's "Flowers of a Hundred Worlds" and older
 * painters), and the weather from Open-Meteo. All of it is live, so it needs
 * JavaScript; without it the strip is not shown. `?season=` overrides the
 * season, for checking the other three.
 */
export function SeasonNow({ place, lat, lng, timeZone }: { place: string; lat: number; lng: number; timeZone: string }) {
  const t = useSyncExternalStore(subscribe, snapshot, () => 0);
  const [weather, setWeather] = useState<Weather>(null);

  useEffect(() => {
    const ctl = new AbortController();
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,is_day&timezone=${encodeURIComponent(timeZone)}`, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setWeather({ t: Math.round(d.current.temperature_2m), code: d.current.weather_code, day: d.current.is_day === 1 }))
      .catch((e) => {
        if (!ctl.signal.aborted) setWeather("unavailable");
        return e;
      });
    return () => ctl.abort();
  }, [lat, lng, timeZone]);

  if (!t) return null;
  const date = new Date(t);
  const forced = typeof window !== "undefined" ? (new URLSearchParams(window.location.search).get("season") as Season | null) : null;
  const season: Season = forced && forced in SEASONS ? forced : seasonOf(date, timeZone);
  const s = SEASONS[season];
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone }).format(date);
  const day = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone }).format(date);
  const branch = ARTWORKS[s.branch.from];
  const plate = ARTWORKS[s.plate.from];

  return (
    <section aria-labelledby="now-h" data-season={season} className="relative isolate overflow-hidden py-[12vh]">
      <img src={asset(s.branch.file)} alt={s.branch.alt} loading="lazy" decoding="async" data-season-branch className="season-branch pointer-events-none absolute right-[-4vw] top-[4vh] -z-10 h-auto w-[min(60vw,820px)] opacity-90 max-md:top-0 max-md:w-[80vw] max-md:opacity-50 max-md:[mask-image:linear-gradient(#000_35%,transparent_70%)]" />
      <div className="mx-auto grid max-w-[1400px] items-end gap-10 px-4 md:px-8 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,22rem)]">
        <p lang="ja" aria-hidden className="tategaki font-display text-[clamp(5rem,14vw,10rem)] leading-none text-accent">
          {s.ja}
        </p>
        <div>
          <h2 id="now-h" className="text-sm font-medium tracking-wide text-accent-text">
            {place} right now
          </h2>
          <p className="mt-4 font-display text-4xl leading-tight md:text-6xl">
            {time}, {s.en.toLowerCase()}
          </p>
          <p className="mt-4 max-w-[46ch] text-lg text-muted">
            {day}: the season of {s.sign}.{" "}
            {weather && weather !== "unavailable" && (
              <span className="text-ink">
                {weather.t}°C and {sky(weather.code, weather.day)}.
              </span>
            )}
            {weather === "unavailable" && <span>The weather service could not be reached just now.</span>}
          </p>
        </div>
        <figure className="max-lg:max-w-[22rem]">
          <img src={asset(s.plate.file)} alt={s.plate.alt} loading="lazy" decoding="async" className="w-full shadow-[0_18px_40px_rgb(0_0_0/0.5)]" />
          <figcaption className="mt-2 text-[13px] leading-snug text-muted">
            <a href={plate.url} className="underline decoration-line underline-offset-2 hover:decoration-current">{plate.title}</a>, {plate.artist}, {plate.date}, CC0. Branch: <a href={branch.url} className="underline decoration-line underline-offset-2 hover:decoration-current">{branch.title}</a>, {branch.artist}. Weather: Open-Meteo.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

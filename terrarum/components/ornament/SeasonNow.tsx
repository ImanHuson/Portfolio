"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { SEASONS, seasonOf, type Season } from "@/lib/ornament";

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
 * Japan right now: the time there and its season, worked out in the browser so
 * they always show, plus the weather from Open-Meteo when it answers. Weather
 * that fails or takes more than six seconds is simply left out, so no page
 * shows a gap or an error. Needs JavaScript; without it the strip is not
 * shown. `?season=` overrides the season, for checking the other three.
 */
export function SeasonNow({ place, lat, lng, timeZone }: { place: string; lat: number; lng: number; timeZone: string }) {
  const t = useSyncExternalStore(subscribe, snapshot, () => 0);
  const [weather, setWeather] = useState<Weather>(null);

  useEffect(() => {
    const ctl = new AbortController();
    const slow = setTimeout(() => ctl.abort(), 6000);
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,is_day&timezone=${encodeURIComponent(timeZone)}`, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setWeather({ t: Math.round(d.current.temperature_2m), code: d.current.weather_code, day: d.current.is_day === 1 }))
      .catch(() => setWeather("unavailable"))
      .finally(() => clearTimeout(slow));
    return () => {
      clearTimeout(slow);
      ctl.abort();
    };
  }, [lat, lng, timeZone]);

  if (!t) return null;
  const date = new Date(t);
  const forced = typeof window !== "undefined" ? (new URLSearchParams(window.location.search).get("season") as Season | null) : null;
  const season: Season = forced && forced in SEASONS ? forced : seasonOf(date, timeZone);
  const s = SEASONS[season];
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone }).format(date);
  const day = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone }).format(date);

  return (
    <section aria-labelledby="now-h" data-season={season} className="relative isolate overflow-hidden py-[12vh]">
      <div className="mx-auto grid max-w-[1400px] items-end gap-10 px-4 md:px-8 sm:grid-cols-[auto_minmax(0,1fr)]">
        <p lang="ja" aria-hidden className="tategaki w-fit justify-self-start font-display text-[clamp(5rem,14vw,10rem)] leading-none text-accent">
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
          </p>
          {weather && weather !== "unavailable" && (
            <p className="mt-2 text-[13px] text-muted">
              Weather from <a href="https://open-meteo.com/" className="underline decoration-line underline-offset-2 hover:decoration-current">Open-Meteo</a>.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

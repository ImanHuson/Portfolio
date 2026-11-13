import geo from "@/public/data/jp-prefectures.json";
import { CLIMATE_NORMALS } from "@/lib/content/japan/data/climate";
import { NATIONAL_PARKS } from "@/lib/content/japan/data/parks";
import { ClimateChart } from "./ClimateChart";
import { ParksExplorer } from "./ParksExplorer";
import { QuakeMap } from "./QuakeMap";

/** Interactive pieces a passage can carry (`Passage.widget`), by name. */
export const WIDGETS = ["jp-climate", "jp-parks", "jp-quakes"] as const;
export type WidgetName = (typeof WIDGETS)[number];

const JP_PREFS = (geo as GeoJSON.FeatureCollection).features
  .map((f) => ({ iso: String(f.properties?.iso), name: String(f.properties?.name) }))
  .sort((a, b) => a.iso.localeCompare(b.iso));

export function Widget({ name }: { name: WidgetName }) {
  switch (name) {
    case "jp-climate":
      return <ClimateChart stations={CLIMATE_NORMALS} source="Data: Japan Meteorological Agency, via the Statistical Handbook of Japan 2026." />;
    case "jp-quakes":
      return <QuakeMap />;
    case "jp-parks":
      return <ParksExplorer parks={NATIONAL_PARKS} prefectures={JP_PREFS} source="Data: Ministry of the Environment, Overview of National Parks." />;
  }
}

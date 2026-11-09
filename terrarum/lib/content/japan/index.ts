import type { City, Place, Region } from "../types";
import * as kansai from "./regions/kansai";

export { japan } from "./country";

/** One module per region, in the country's own order (north to south). */
const REGIONS = [kansai];

export const regions: Region[] = REGIONS.map((r) => r.region);
export const cities: City[] = REGIONS.flatMap((r) => r.cities);
export const places: Place[] = REGIONS.flatMap((r) => r.places);

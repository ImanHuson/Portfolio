import type { City, Place, Region } from "../types";
import * as kanto from "./regions/kanto";
import * as chubu from "./regions/chubu";
import * as kansai from "./regions/kansai";
import * as chugoku from "./regions/chugoku";
import * as shikoku from "./regions/shikoku";
import * as tohoku from "./regions/tohoku";
import * as hokkaido from "./regions/hokkaido";

export { japan } from "./country";

/** One module per region, in the country's own order (north to south). */
const REGIONS = [hokkaido, tohoku, kanto, chubu, kansai, chugoku, shikoku];

export const regions: Region[] = REGIONS.map((r) => r.region);
export const cities: City[] = REGIONS.flatMap((r) => r.cities);
export const places: Place[] = REGIONS.flatMap((r) => r.places);

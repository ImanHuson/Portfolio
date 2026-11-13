import type { ChapterSlug, Side } from "./brief";

/**
 * The Terrarum content model. Pages render these shapes; they never hold facts
 * themselves. A country is added by adding data (lib/content/<country>/), a
 * theme (lib/themes.ts) and a research dossier (research/countries/<slug>/),
 * not by writing new page components.
 */

/** Editorial workflow state of a content item (brief section 12). */
export type ReviewStatus =
  | "research-needed"
  | "research-in-progress"
  | "sources-collected"
  | "draft"
  | "fact-checked"
  | "editorial-review"
  | "approved"
  | "published"
  | "needs-updating";

export type SourceType =
  | "official"
  | "government-statistics"
  | "academic"
  | "museum"
  | "heritage-body"
  | "news"
  | "reference"
  | "secondary"
  | "dataset";

/** One reference. Every factual block points at one or more of these by id. */
export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  /** Publication date or edition, when the source states one. */
  published?: string;
  /** ISO date this project read it. */
  accessed: string;
  type: SourceType;
  /** What it supports, and any caveat about how far it can be trusted. */
  notes?: string;
}

/** Ids of Sources that support a claim. Never empty on a published fact. */
export type Cite = string[];

export interface Fact {
  label: string;
  value: string;
  note?: string;
  cite: Cite;
  /** For figures that change: the date the figure describes. */
  asOf?: string;
}

/** A short piece of explanatory prose with its references. */
export interface Passage {
  id: string;
  heading: string;
  body: string[];
  cite: Cite;
  status: ReviewStatus;
  /** Brief topics this passage covers (keys of CHAPTER_TOPICS / CITY_TOPICS in brief.ts). */
  covers?: string[];
  /** Pictures that belong with this passage, by media id. */
  images?: string[];
  /** Places in this country the passage is about, linked beside it. */
  places?: string[];
  /** An interactive piece shown full width under the passage (components/chapter/Widget.tsx). */
  widget?: "jp-climate" | "jp-parks" | "jp-quakes";
  /** A place in this country the passage leads to. */
  seeAlso?: { place: string; label: string };
  /** Optional comparison drawn beside the text (same sources as the passage). */
  figure?: { caption: string; rows: { label: string; value: number; display: string }[] };
}

export type License =
  | "CC0 1.0"
  | "Public domain"
  | "CC BY 2.0"
  | "CC BY 2.5"
  | "CC BY 4.0"
  | "CC BY 3.0"
  | "CC BY-SA 2.0"
  | "CC BY-SA 2.5"
  | "CC BY-SA 3.0"
  | "CC BY-SA 4.0"
  | "ODbL 1.0";

export type MediaStatus = "pending-review" | "license-verified" | "approved" | "rejected" | "needs-replacement";

/** A licensed image, panorama or artwork, with everything attribution needs. */
export interface MediaAsset {
  id: string;
  kind: "photo" | "panorama" | "artwork";
  title: string;
  creator: string;
  creatorUrl?: string;
  /** The page where the file is published (the attribution link). */
  sourceUrl: string;
  /** Where it came from: Wikimedia Commons, Flickr, a museum. */
  repository: string;
  license: License;
  licenseUrl: string;
  /** Path under public/, without basePath (local copies). */
  src?: string;
  /**
   * Files served from Wikimedia Commons' own image host instead of a local
   * copy: GitHub Pages caps a site at 1 GB, and full galleries for every
   * country would pass it. `file` is the Commons file name, underscores for spaces.
   */
  remote?: { host: "commons"; file: string; /** "a/ab/<file>", the hashed directory the host serves it from. */ path: string };
  /** A small local copy (public/media/c/) used if the remote file fails to load. */
  fallback?: string;
  /** For gallery photos: which side of the place it shows (brief.ts SIDES). */
  side?: Side;
  width: number;
  height: number;
  alt: string;
  /** Where it was taken or what it shows, in plain words. */
  location?: string;
  /** Date of the work, for artworks and dated photos. */
  date?: string;
  /** What we changed (crop, resize, format), for share-alike licences. */
  modified?: string;
  accessed: string;
  status: MediaStatus;
  hosting: "local-copy" | "embed";
}

/** A 360° scene. Hotspots connect scenes only where the photos really do. */
export interface PanoScene {
  id: string;
  media: string;
  title: string;
  /** Initial view direction in degrees. */
  yaw: number;
  pitch?: number;
  hfov?: number;
  /** Partial panoramas: horizontal and vertical angle of view in degrees. */
  haov?: number;
  vaov?: number;
  description: string;
  hotspots?: { yaw: number; pitch: number; text: string }[];
}

export interface LatLng {
  lat: number;
  lng: number;
  /** Where the coordinate came from (an OSM object, a map reading). */
  ref: string;
}

/** Something the content still lacks, kept visible instead of papered over. */
export interface Gap {
  topic: string;
  why: string;
}

export interface Place {
  slug: string;
  name: string;
  native?: string;
  kind: string;
  where: LatLng;
  summary: string;
  /** "Why it matters", one or two sentences. */
  matters: string;
  facts: Fact[];
  passages: Passage[];
  hero: string;
  gallery: string[];
  panoramas: PanoScene[];
  /** A virtual tour published by the place itself: linked, never embedded or copied. */
  tour?: { url: string; label: string; by: string };
  /** Other places in this collection worth seeing next. */
  related: string[];
  gaps: Gap[];
  status: ReviewStatus;
}

export interface City {
  slug: string;
  /** City, town, village, or a natural area visited from a town. */
  kind: "city" | "town" | "village" | "area";
  name: string;
  native?: string;
  where: LatLng;
  summary: string;
  facts: Fact[];
  passages: Passage[];
  hero: string;
  artwork?: string;
  panoramas: PanoScene[];
  places: string[];
  /** Places elsewhere in the country that are worth combining with this one. */
  nearby: string[];
  /** Brief 6B topics that do not apply here, with the reason. */
  notApplicable?: { topic: string; why: string }[];
  gaps: Gap[];
  status: ReviewStatus;
}

/** A city or place that is known to belong here but is not researched yet. */
export interface Pending {
  name: string;
  native?: string;
  where?: LatLng;
}

export interface Region {
  slug: string;
  name: string;
  native?: string;
  /** Matches the `region` property in the country's region GeoJSON. */
  geoKey: string;
  summary: string;
  definition: Passage;
  facts: Fact[];
  cities: string[];
  pendingCities: Pending[];
  /** The sub-areas drawn on the region map (prefectures, atolls, cantons). */
  areasGeo: { url: string; key: string; only: string[]; labelProp?: string };
  /** Where the region map frames: [[west, south], [east, north]]. */
  bounds: [[number, number], [number, number]];
  /** Optional picture beside the definition (an artwork or landscape). */
  image?: string;
  gaps: Gap[];
  status: ReviewStatus;
}

export interface TimelinePeriod {
  name: string;
  native?: string;
  from: string;
  to: string;
  /** A centre point in years for laying the period out (negative = BCE). */
  start: number;
  end: number;
  note: string;
}

export interface Journey {
  slug: string;
  title: string;
  summary: string;
  /** Ordered stops, as place slugs within this country. */
  stops: { place: string; why: string }[];
  /** Honest limits: what the journey can and cannot show. */
  limits: string;
}

/** A country-wide chapter for one of the brief's content areas (A, D-J). */
export interface Chapter {
  slug: ChapterSlug;
  title: string;
  native?: string;
  summary: string;
  hero: string;
  passages: Passage[];
  facts?: Fact[];
  /** Brief topics with no real content in this country, and why. */
  notApplicable?: { topic: string; why: string }[];
  status: ReviewStatus;
}

export type CountryStatus = "open" | "in-research";

/** Every country the platform knows about, open or not. */
export interface CountryEntry {
  slug: string;
  name: string;
  native?: string;
  /** ISO 3166-1 numeric, as used by Natural Earth / world-atlas. */
  isoN: number;
  /** Where the globe marker sits (capital or a central point). */
  marker: LatLng;
  status: CountryStatus;
  /** BCP 47 tag and direction of the native name (ja, dv rtl, de/fr/it/rm). */
  nativeLang?: string;
  nativeDir?: "ltr" | "rtl";
  collection: "founding" | "expansion";
  /** One-line hint shown while a country is still in research. */
  researchNote: string;
}

export interface Country {
  entry: CountryEntry;
  summary: string;
  facts: Fact[];
  hero: string;
  /** Photograph used for the country's card on the home page. */
  card: string;
  regionsGeo: string;
  /** Frame for the regions map: [[west, south], [east, north]]. */
  regionsBounds: [[number, number], [number, number]];
  /** Draw each region as a dot too (island nations, where shapes are specks). */
  regionsAsPoints?: boolean;
  /** What the regions are (a convention, cantons, atolls) in one or two lines. */
  regionsHeading: string;
  regionsNote: string;
  regions: string[];
  pendingRegions: { geoKey: string; name: string; native?: string }[];
  passages: Passage[];
  timeline: { title: string; periods: TimelinePeriod[]; cite: Cite; caveat: string };
  journeys: Journey[];
  chapters: Chapter[];
  gaps: Gap[];
}

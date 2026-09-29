// Public-domain images that replaced the archive's generated plates where a
// real thing came close to the description (scripts/art/sourced.py). Every
// one is public domain: The Metropolitan Museum of Art's Open Access
// (CC0) and NASA imagery (not copyrighted). The generated originals are
// kept in /images/renders/ for the Fan Art page. Dreadnoughts, starships
// and PsychoSpikes keep their renders: nothing real comes close.

export type Credit = { title: string; by: string; source: string; url: string; alt: string };

const met = (id: number) => `https://www.metmuseum.org/art/collection/search/${id}`;
const nasa = (id: string) => `https://images.nasa.gov/details/${id}`;
const MET = "The Metropolitan Museum of Art, Open Access (public domain)";
const NASA = "NASA (public domain)";

export const CREDITS: Record<string, Credit> = {
  "/images/vault/razor.webp": { title: "Rapier", by: "Italian, ca. 1610–20", source: MET, url: met(22369), alt: "A rapier’s ornate steel hilt, standing in for a razor." },
  "/images/vault/starshell.webp": { title: "Armor", by: "Italian, ca. 1400–1450", source: MET, url: met(23205), alt: "A full suit of plate armour, standing in for a StarShell." },
  "/images/vault/minds-eye.webp": { title: "Wedjat Eye Amulet", by: "Egyptian, 332–30 BCE", source: MET, url: met(550940), alt: "A gold Eye of Horus amulet." },
  "/images/vault/carving.webp": { title: "Bronze scalpel", by: "Roman, 1st–2nd century CE", source: MET, url: met(244206), alt: "A Roman bronze scalpel." },
  "/images/vault/holotech.webp": { title: "Terracotta roundels in the form of theatrical masks", by: "Greek, 1st century BCE", source: MET, url: met(257595), alt: "Two theatre masks, one grave, one grinning." },
  "/images/houses/augustus.webp": { title: "Marble statue of a lion", by: "Greek, ca. 400–390 BCE", source: MET, url: met(248140), alt: "A marble lion, crouched to spring." },
  "/images/houses/bellona.webp": { title: "Eagle", by: "American, 1809–11", source: MET, url: met(17139), alt: "A gilded eagle, wings spread." },
  "/images/houses/telemanus.webp": { title: "Netsuke of Fox", by: "Japanese, 19th century", source: MET, url: met(60375), alt: "A carved ivory fox." },
  "/images/houses/lune.webp": { title: "Terracotta oil lamp", by: "Roman, 1st century CE", source: MET, url: met(246270), alt: "A Roman oil lamp, lit: light from darkness." },
  "/images/houses/raa.webp": { title: "Portable horizontal sundial", by: "French, before 1681", source: MET, url: met(188861), alt: "A sundial, which tells time by shadow." },
  "/images/places/mars.webp": { title: "Global Color Views of Mars (PIA00407)", by: "NASA/JPL, Viking", source: NASA, url: nasa("PIA00407"), alt: "Mars, the real planet: red, with Valles Marineris across its face." },
  "/images/places/luna.webp": { title: "Earth Moon (PIA00405)", by: "NASA/JPL, Galileo", source: NASA, url: nasa("PIA00405"), alt: "The Moon." },
  "/images/places/mercury.webp": { title: "Mercury Globe (PIA15160)", by: "NASA/JHUAPL/Carnegie, MESSENGER", source: NASA, url: nasa("PIA15160"), alt: "Mercury, grey and cratered." },
  "/images/places/venus.webp": { title: "Venus from Mariner 10 (PIA23791)", by: "NASA/JPL-Caltech", source: NASA, url: nasa("PIA23791"), alt: "Venus under its clouds." },
  "/images/places/io.webp": { title: "Global image of Io (PIA02308)", by: "NASA/JPL/University of Arizona, Galileo", source: NASA, url: nasa("PIA02308"), alt: "Io, yellow and volcanic." },
  "/images/places/earth.webp": { title: "Blue Marble 2007 West", by: "NASA Goddard", source: NASA, url: nasa("GSFC_20171208_Archive_e002131"), alt: "Earth." },
  "/images/rising/movement.webp": { title: "Washington Crossing the Delaware", by: "Emanuel Leutze, 1851", source: MET, url: met(11417), alt: "Washington Crossing the Delaware: a boat of rebels crossing a frozen river." },
  "/images/rising/war.webp": { title: "The Battle of Vercellae", by: "Giovanni Battista Tiepolo, 1725–29", source: MET, url: met(437794), alt: "The Battle of Vercellae: Roman cavalry in the crush of a battle." },
  "/images/rising/myth.webp": { title: "The Harvesters", by: "Pieter Bruegel the Elder, 1565", source: MET, url: met(435809), alt: "The Harvesters: reapers with scythes in a golden field." },
  "/images/rising/government.webp": { title: "The Death of Socrates", by: "Jacques Louis David, 1787", source: MET, url: met(436105), alt: "The Death of Socrates: a state executes its own philosopher." },
};

export const creditLine = (src: string) => {
  const c = CREDITS[src];
  return c ? `${c.title}. ${c.by}. ${c.source.split(",")[0].replace(" (public domain)", "")}` : "";
};
export const altFor = (src: string, fallback: string) => CREDITS[src]?.alt ?? fallback;

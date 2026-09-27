// Spoiler clearance: how far the reader has read. 0 = nothing yet.
// A block tagged `book: n` is safe for readers at clearance >= n.
export type Clearance = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const CLEARANCE_LEVELS: { value: Clearance; label: string; short: string }[] = [
  { value: 0, label: "I haven’t started", short: "No clearance" },
  { value: 1, label: "Through Red Rising", short: "Through I" },
  { value: 2, label: "Through Golden Son", short: "Through II" },
  { value: 3, label: "Through Morning Star", short: "Through III" },
  { value: 4, label: "Through Iron Gold", short: "Through IV" },
  { value: 5, label: "Through Dark Age", short: "Through V" },
  { value: 6, label: "Through Light Bringer", short: "Full clearance" },
];

export const BOOK_TITLES: Record<number, string> = {
  1: "Red Rising",
  2: "Golden Son",
  3: "Morning Star",
  4: "Iron Gold",
  5: "Dark Age",
  6: "Light Bringer",
};

export const STORAGE_KEY = "rra-clearance";

import type { Chapter } from "../../types";
import { belief } from "./belief";
import { history } from "./history";
import { land } from "./land";

/** Japan's country-wide chapters, in reading order (brief sections A, D-J). */
export const chapters: Chapter[] = [land, history, belief];

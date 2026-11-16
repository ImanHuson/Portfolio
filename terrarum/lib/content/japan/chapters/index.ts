import type { Chapter } from "../../types";
import { art } from "./art";
import { belief } from "./belief";
import { food } from "./food";
import { history } from "./history";
import { land } from "./land";
import { language } from "./language";
import { performance } from "./performance";

/** Japan's country-wide chapters, in reading order (brief sections A, D-J). */
export const chapters: Chapter[] = [land, history, belief, food, art, performance, language];

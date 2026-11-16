import type { Chapter } from "../../types";
import { belief } from "./belief";
import { food } from "./food";
import { history } from "./history";
import { land } from "./land";
import { language } from "./language";

/** Japan's country-wide chapters, in reading order (brief sections A, D-J). */
export const chapters: Chapter[] = [land, history, belief, food, language];

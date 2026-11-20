import { ViewTransition } from "react";

/** Every route change, as a cut in the archive: the old page dims away, the
 * new one rises in (CSS in globals.css, `page-in` / `page-out`). The header
 * stays put. A template remounts on each navigation, so enter/exit fire. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}

import { ViewTransition } from "react";

/** Each navigation is an arrival: the old page dims, the new one comes in. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}

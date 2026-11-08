import type { Gap } from "@/lib/content/types";

/** What this page does not cover yet, said plainly instead of padded over. */
export function Gaps({ gaps }: { gaps: Gap[] }) {
  if (!gaps.length) return null;
  return (
    <details className="group border-t border-line pt-4 text-sm">
      <summary className="cursor-pointer list-none text-muted hover:text-ink">
        <span className="underline decoration-line underline-offset-4">Not covered yet ({gaps.length})</span>
      </summary>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {gaps.map((g) => (
          <li key={g.topic}>
            <span className="font-medium">{g.topic}.</span> <span className="text-muted">{g.why}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

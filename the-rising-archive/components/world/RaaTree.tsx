"use client";

import { useArchive } from "@/components/providers/ArchiveProvider";
import { RAA_TREE, type TreeNode } from "@/lib/data/houses";
import { BOOK_TITLES } from "@/lib/data/spoilers";

function Node({ node }: { node: TreeNode }) {
  const { clearance } = useArchive();
  const open = node.book <= clearance;
  return (
    <li className="relative pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-px before:bg-line-strong after:absolute after:top-[1.1rem] after:left-0 after:h-px after:w-4 after:bg-line-strong last:before:h-[1.1rem]">
      <div className="py-2">
        {open ? (
          <>
            <span className="font-serif text-2xl text-rim">{node.name}</span>
            {node.note && <span className="ml-3 font-mono text-meta tracking-[0.16em] text-ash-2 uppercase">{node.note}</span>}
          </>
        ) : (
          <span className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">
            <span aria-hidden className="mr-2 inline-block h-3 w-24 translate-y-0.5 bg-line-strong" />
            Sealed to {BOOK_TITLES[node.book]}
          </span>
        )}
      </div>
      {node.children && (
        <ul role="list" className="ml-2">
          {node.children.map((c) => (
            <Node key={c.name} node={c} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function RaaTree() {
  return (
    <figure>
      <ul role="list" aria-label="House Raa family tree">
        <Node node={RAA_TREE} />
      </ul>
      <figcaption className="mt-6 max-w-[56ch] text-sm text-ash">
        Only the branches this archive has verified. The real tree is larger: Romulus and Dido have more children than are shown here.
      </figcaption>
    </figure>
  );
}

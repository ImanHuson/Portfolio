/**
 * The three Walls to scale, from the figures given in the story: Wall Sina's
 * radius about 250 km, Wall Rose 130 km beyond it, Wall Maria 100 km beyond
 * that. Districts are drawn larger than scale so they can be seen at all
 * (said so in the key). The land lost in 845 is hatched.
 */
export default function WallsMap({ className }: { className?: string }) {
  const S = 250, R = 380, M = 480;
  // Shiganshina bulges south from Wall Maria, Trost south from Wall Rose.
  const district = (r: number) => `M ${-34} ${r} A 34 34 0 0 0 ${34} ${r}`;
  return (
    <figure className={className}>
      <svg viewBox="-540 -540 1080 1160" role="img" aria-labelledby="walls-map-title walls-map-desc" className="h-auto w-full">
        <title id="walls-map-title">The Walls, to scale</title>
        <desc id="walls-map-desc">
          Three concentric Walls: Sina at about 250 km radius, Rose at 380 km, Maria at 480 km. Shiganshina juts south from
          Wall Maria, Trost south from Wall Rose. The ring between Maria and Rose, lost in 845, is hatched. An arrow runs
          from the breach at Shiganshina north to Wall Rose.
        </desc>
        <defs>
          <pattern id="lost" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
            <line x1="0" y1="0" x2="0" y2="12" stroke="var(--flare)" strokeWidth="3" opacity="0.8" />
          </pattern>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--paper)" />
          </marker>
        </defs>
        {/* the lost ring */}
        <path d={`M ${-M} 0 A ${M} ${M} 0 1 0 ${M} 0 A ${M} ${M} 0 1 0 ${-M} 0 Z M ${-R} 0 A ${R} ${R} 0 1 1 ${R} 0 A ${R} ${R} 0 1 1 ${-R} 0 Z`} fill="url(#lost)" fillRule="evenodd" />
        {[M, R, S].map((r) => (
          <circle key={r} cx="0" cy="0" r={r} fill="none" stroke="var(--paper)" strokeWidth={r === M ? 3 : 2.2} opacity={r === M ? 0.9 : 0.75} />
        ))}
        <path d={district(M)} fill="none" stroke="var(--paper)" strokeWidth="3" />
        <path d={district(R)} fill="none" stroke="var(--paper)" strokeWidth="2.2" opacity="0.75" />
        {/* the breach and the retreat */}
        <circle cx="0" cy={M + 34} r="9" fill="var(--flare)" />
        <line x1="0" y1={M + 12} x2="0" y2={R + 44} stroke="var(--paper)" strokeWidth="2" strokeDasharray="7 7" markerEnd="url(#arrow)" />
        <g fontFamily="var(--font-military)" fontWeight="600" letterSpacing="4" fill="var(--paper)" fontSize="26" textAnchor="middle">
          <text y={-M + 36}>WALL MARIA</text>
          <text y={-R + 34} opacity="0.85">WALL ROSE</text>
          <text y={-S + 32} opacity="0.85">WALL SINA</text>
          <text y={M + 96}>SHIGANSHINA</text>
          <text x="118" y={R + 60} fontSize="20" opacity="0.85">TROST</text>
        </g>
        <g fontFamily="var(--font-mono)" fill="var(--paper)" fontSize="17" opacity="0.7">
          <text x="-520" y="590">0</text>
          <line x1="-520" y1="566" x2="-420" y2="566" stroke="var(--paper)" strokeWidth="2" />
          <text x="-445" y="590">100 KM</text>
          <text x="520" y="590" textAnchor="end">DISTRICTS NOT TO SCALE</text>
        </g>
      </svg>
      <figcaption className="mt-4 font-mono text-meta tracking-[0.12em] text-ash uppercase">
        Hatched: the land between Wall Maria and Wall Rose, lost in 845.
      </figcaption>
    </figure>
  );
}

// Two tiny silhouettes for the fan easter eggs. Decorative only.
export function FoxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path fillRule="evenodd" d="M3 2 L9 8 H15 L21 2 L20.5 12 L12 22 L3.5 12 Z M8.5 12.5 a1 1 0 1 0 0.01 0 Z M15.5 12.5 a1 1 0 1 0 0.01 0 Z" />
    </svg>
  );
}
/** Side-on, mid-stride: for the fox that crosses the screen. */
export function FoxRunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 24" className={className} aria-hidden fill="currentColor">
      <path d="M1 9 Q8 4 15 10 L30 10 L33 4 L35 8 L38 7 L45 10 L41 12 L36 12 L35 15 L39 21 L36 21 L32 16 L22 16 L17 21 L14 21 L17 15 Q9 15 1 9 Z" />
    </svg>
  );
}
export function WolfIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="currentColor">
      <path d="M4 30 L8 18 L6 6 L11 11 L14 9 L17 2 L18 9 L25 14 L21 15 L23 18 L19 19 L21 30 Z" />
    </svg>
  );
}

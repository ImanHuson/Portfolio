/** The layers of the card wash (see `.wash-card` in globals.css). Render
 * inside an element that carries `wash-card` and, optionally, `data-wash`. */
export default function CardWash() {
  return (
    <>
      <span aria-hidden className="wash-layer wash-rest" />
      <span aria-hidden className="wash-layer wash-hot" />
      <span aria-hidden className="wash-edge" />
    </>
  );
}

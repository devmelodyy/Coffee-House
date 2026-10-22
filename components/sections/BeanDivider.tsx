import { Art, type ArtName } from "../illustrations";
import { rng } from "../sketch/rough";

// Scattered beans with a few treats in the middle, as in the sketch.
const row: ArtName[] = ["bean", "bean", "bean", "bean", "bean", "bean", "bean", "croissant", "fries", "steam", "bean", "bean", "bean", "bean", "bean", "bean", "bean"];

export function BeanDivider() {
  const r = rng(42);
  return (
    <div className="beans" aria-hidden="true">
      {row.map((name, i) => {
        const rot = name === "bean" ? (r() - 0.5) * 110 : (r() - 0.5) * 16;
        const dy = (r() - 0.5) * 22;
        return (
          <span key={i} className={`beans__item beans__item--${name}`} style={{ transform: `translateY(${dy}px) rotate(${rot}deg)` }}>
            <Art name={name} />
          </span>
        );
      })}
    </div>
  );
}

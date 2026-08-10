// Capa gráfica gerada — gradiente azul→navy + rede de nós (determinística por seed).
// Sem imagens externas: coerente com a identidade da marca (azul elétrico + navy do logótipo).

function lcg(seed: number) {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function CoverArt({
  color = "#1E6FE8",
  seed = 1,
  label,
  className = "",
  height = 150,
}: {
  color?: string;
  seed?: number;
  label?: string;
  className?: string;
  height?: number;
}) {
  const rand = lcg(seed + 7);
  const top = color && color.startsWith("#") ? color : "#1E6FE8";
  const nodes = Array.from({ length: 7 }, () => ({
    x: 8 + rand() * 84,
    y: 12 + rand() * 76,
    r: 1.5 + rand() * 2.5,
  }));
  const gid = `cov${seed}`;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        height,
        background: `linear-gradient(150deg, ${top}, #0A1526 90%)`,
      }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-70">
        <defs>
          <radialGradient id={gid}>
            <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
            <stop offset="100%" stopColor="rgba(150,190,255,0.25)" />
          </radialGradient>
        </defs>
        {nodes.map((n, i) =>
          nodes.slice(i + 1, i + 3).map((m, j) => (
            <line
              key={`l${i}-${j}`}
              x1={n.x} y1={n.y} x2={m.x} y2={m.y}
              stroke="rgba(255,255,255,0.24)" strokeWidth="0.4"
            />
          ))
        )}
        {nodes.map((n, i) => (
          <circle key={`c${i}`} cx={n.x} cy={n.y} r={n.r} fill={`url(#${gid})`} />
        ))}
      </svg>
      {label && (
        <span className="absolute inset-0 grid place-items-center text-serif text-white/90"
          style={{ fontSize: height * 0.36 }}>
          {label}
        </span>
      )}
    </div>
  );
}

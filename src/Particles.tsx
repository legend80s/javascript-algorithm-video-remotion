import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface ParticleProps {
  count?: number;
}

const CONFETTI_COLORS = [
  "#FF6B6B",
  "#FECA57",
  "#48DBFB",
  "#FF9FF3",
  "#54A0FF",
  "#5F27CD",
  "#00D2D3",
  "#FF9F43",
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

const particleData = Array.from({ length: 60 }, (_, i) => ({
  rand1: seededRandom(i * 7 + 1),
  rand2: seededRandom(i * 13 + 3),
  rand3: seededRandom(i * 19 + 5),
  rand4: seededRandom(i * 23 + 7),
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
}));

export const Particles: React.FC<ParticleProps> = ({ count = 60 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const particles = particleData.slice(0, count).map((p, i) => {
    const startX = p.rand1 * 1280;
    const startY = -20 - p.rand2 * 100;
    const size = 6 + p.rand3 * 10;
    const rotationSpeed = 2 + p.rand4 * 6;
    const shape = p.rand3 > 0.5 ? "rect" : "circle";
    const fallSpeed = 1.5 + p.rand2 * 2;
    const drift = (p.rand1 - 0.5) * 2;

    const elapsed = frame / fps;
    const y = startY + elapsed * 120 * fallSpeed;
    const x = startX + Math.sin(elapsed * 2 + i) * 30 + drift * elapsed * 20;
    const rotation = elapsed * rotationSpeed * 360;
    const opacity = interpolate(
      frame,
      [durationInFrames - 30, durationInFrames],
      [1, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

    return (
      <div
        key={`confetti-${startX.toFixed(2)}-${startY.toFixed(2)}`}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: shape === "rect" ? size * 0.6 : size,
          height: size,
          backgroundColor: p.color,
          borderRadius: shape === "circle" ? "50%" : "2px",
          transform: `rotate(${rotation}deg)`,
          opacity,
        }}
      />
    );
  });

  return <>{particles}</>;
};

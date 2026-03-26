import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { MotorcycleGopher } from "./components/motorcycle"

interface SortBarProps {
  value: number
  maxValue: number
  colors: [string, string]
  isComparing: boolean
  isSwapping: boolean
  isSorted: boolean
  isPivot?: boolean
  index: number
  totalBars: number
  entranceDelay: number
}

export const SortBar: React.FC<SortBarProps> = ({
  value,
  maxValue,
  colors,
  isComparing,
  isSwapping,
  isSorted,
  isPivot = false,
  index,
  totalBars,
  entranceDelay,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const entrance = spring({
    frame,
    fps,
    delay: entranceDelay + index * 3,
    config: { damping: 8, stiffness: 200, mass: 0.8 },
  })

  const height = interpolate(entrance, [0, 1], [0, (value / maxValue) * 380])

  const bounce = isComparing
    ? Math.sin(frame * 0.5) * 4
    : isSwapping
      ? Math.sin(frame * 0.3) * 8
      : 0

  const scale = isSwapping
    ? 1.08 + Math.sin(frame * 0.4) * 0.05
    : isComparing
      ? 1.04
      : 1

  const glow = isSwapping
    ? interpolate(Math.sin(frame * 0.4), [-1, 1], [10, 25])
    : isComparing
      ? interpolate(Math.sin(frame * 0.5), [-1, 1], [5, 15])
      : isPivot
        ? interpolate(Math.sin(frame * 0.3), [-1, 1], [8, 20])
        : isSorted
          ? 12
          : 0

  const glowColor = isSwapping
    ? "255, 159, 67"
    : isComparing
      ? "255, 255, 255"
      : isPivot
        ? "255, 215, 0"
        : isSorted
          ? "255, 215, 0"
          : "0, 0, 0"

  const barWidth = Math.min(80, (1000 - (totalBars - 1) * 12) / totalBars)
  const leftPos = index * (barWidth + 12)

  return (
    <div
      style={{
        position: "absolute",
        bottom: 100,
        left: leftPos,
        width: barWidth,
        height,
        background: `linear-gradient(180deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
        borderRadius: `${barWidth / 2}px`,
        transform: `translateY(${bounce}px) scale(${scale})`,
        boxShadow: `0 0 ${glow}px rgba(${glowColor}, ${glow > 0 ? 0.6 : 0})`,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: value > 8 ? 8 : 3,
        fontWeight: 800,
        fontSize: Math.min(18, barWidth * 0.3),
        color: "white",
        textShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }}
    >
      {height > 30 && value}

      <MotorcycleGopher
        className="absolute top-[-3.1rem] text-xl w-[60%]"
        bodyColor={colors[1]}
      />

      <span
        className="absolute bottom-[-2em] text-xl"
        style={{
          color: colors[1],
        }}
      >
        {index}
      </span>
    </div>
  )
}

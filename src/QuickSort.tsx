/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion"
import { Particles } from "./Particles"
import { SortBar } from "./SortBar"
import { SoundEffects } from "./SoundEffects"
import { generateQuickSortSteps, type QuickSortStep } from "./utils/quickSort"
import { INITIAL_ARRAY, VALUE_COLORS } from "./utils/sort"

const INTRO_FRAMES = 75
const SETUP_FRAMES = 50
const FRAMES_PER_STEP = 15
const CELEBRATION_FRAMES = 90

export const QuickSort: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()

  const steps = generateQuickSortSteps(INITIAL_ARRAY)
  const maxVal = Math.max(...INITIAL_ARRAY)

  const sortStart = INTRO_FRAMES + SETUP_FRAMES
  const sortEnd = sortStart + steps.length * FRAMES_PER_STEP
  const isSorting = frame >= sortStart && frame < sortEnd
  const isCelebrating = frame >= sortEnd

  const stepIndex = isSorting
    ? Math.min(
        Math.floor((frame - sortStart) / FRAMES_PER_STEP),
        steps.length - 1,
      )
    : isCelebrating
      ? steps.length - 1
      : -1

  const currentStep: QuickSortStep | null =
    stepIndex >= 0 ? steps[stepIndex] : null
  const currentArray = currentStep ? currentStep.array : INITIAL_ARRAY

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  })
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 6, stiffness: 120 },
  })

  const subtitleOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateRight: "clamp",
  })

  const infoOpacity = isSorting || isCelebrating ? 1 : 0

  const bgHue = interpolate(
    frame,
    [0, sortEnd + CELEBRATION_FRAMES],
    [260, 320],
    {
      extrapolateRight: "clamp",
    },
  )

  const comparisonCount = steps
    .slice(0, stepIndex + 1)
    .filter((s) => s.comparing.length > 0).length
  const swapCount = steps
    .slice(0, stepIndex + 1)
    .filter((s) => s.swapping.length > 0).length

  const celebrationScale = isCelebrating
    ? spring({
        frame: frame - sortEnd,
        fps,
        config: { damping: 5, stiffness: 100 },
      })
    : 0

  const barPitch = 102
  const n = INITIAL_ARRAY.length

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, 
          hsl(${bgHue}, 70%, 15%) 0%, 
          hsl(${bgHue + 30}, 60%, 10%) 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Background bubbles */}
      {Array.from({ length: 15 }, (_, i) => {
        const bx = interpolate(
          Math.sin(frame * 0.01 + i * 1.3),
          [-1, 1],
          [0, width],
        )
        const by = interpolate(
          Math.cos(frame * 0.008 + i * 0.9),
          [-1, 1],
          [0, height],
        )
        const bs = 30 + Math.sin(i * 2.1) * 20

        return (
          <div
            key={`bg-bubble-${bx.toFixed(1)}-${by.toFixed(1)}`}
            style={{
              position: "absolute",
              left: bx,
              top: by,
              width: bs,
              height: bs,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)`,
            }}
          />
        )
      })}

      {/* Sound effects */}
      <SoundEffects
        steps={steps}
        sortStart={sortStart}
        framesPerStep={FRAMES_PER_STEP}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 30,
          width: "100%",
          textAlign: "center",
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: "white",
            textShadow:
              "0 0 20px rgba(107,107,255,0.8), 0 0 40px rgba(107,107,255,0.4)",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: 2,
          }}
        >
          排序算法 ②：快速排序
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#FECA57",
            fontWeight: 700,
            marginTop: 4,
            opacity: subtitleOpacity,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          分而治之 ⚡
        </div>
      </div>

      {/* Bars container */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: "50%",
          transform: `translateX(-${(n * barPitch) / 2}px)`,
          width: n * barPitch,
          height: 400,
        }}
      >
        {/* Range highlight */}
        {currentStep && currentStep.range[0] <= currentStep.range[1] && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: currentStep.range[0] * barPitch - 6,
              width:
                (currentStep.range[1] - currentStep.range[0] + 1) * barPitch -
                12,
              height: "100%",
              background: "rgba(162, 155, 254, 0.12)",
              borderRadius: 12,
              zIndex: -1,
            }}
          />
        )}

        {/* Pivot marker */}
        {currentStep &&
          currentStep.pivot >= 0 &&
          currentStep.pivot < n &&
          (() => {
            const pivotVal = currentArray[currentStep.pivot]
            const markerHeight =
              spring({
                frame,
                fps,
                delay: INTRO_FRAMES + currentStep.pivot * 3,
                config: { damping: 8, stiffness: 200, mass: 0.8 },
              }) *
              (pivotVal / maxVal) *
              380

            return (
              <div
                style={{
                  position: "absolute",
                  bottom: 100,
                  left: currentStep.pivot * barPitch + 39,
                  width: 2,
                  height: markerHeight,
                  borderLeft: "2px dashed rgba(255, 215, 0, 0.7)",
                }}
              />
            )
          })()}

        {/* Sorted markers */}
        {currentStep?.sorted.map((idx) => {
          if (idx === currentStep.pivot) return null
          const sortedVal = currentArray[idx]
          const markerHeight =
            spring({
              frame,
              fps,
              delay: INTRO_FRAMES + idx * 3,
              config: { damping: 8, stiffness: 200, mass: 0.8 },
            }) *
            (sortedVal / maxVal) *
            380

          return (
            <div
              key={`sorted-marker-${idx}`}
              style={{
                position: "absolute",
                bottom: 100,
                left: idx * barPitch + 39,
                width: 2,
                height: markerHeight,
                borderLeft: "2px dashed rgba(46, 204, 113, 0.5)",
              }}
            />
          )
        })}

        {currentArray.map((value, i) => {
          const isComparing = currentStep?.comparing.includes(i) ?? false
          const isSwapping = currentStep?.swapping.includes(i) ?? false
          const isSorted = currentStep?.sorted.includes(i) ?? false
          const isPivot = currentStep?.pivot === i

          return (
            <SortBar
              key={`bar-${value}-${i}`}
              value={value}
              maxValue={maxVal}
              colors={VALUE_COLORS[value] as [string, string]}
              isComparing={isComparing}
              isSwapping={isSwapping}
              isSorted={isSorted}
              isPivot={isPivot}
              index={i}
              totalBars={n}
              entranceDelay={INTRO_FRAMES}
            />
          )
        })}
      </div>

      {/* Info panel */}
      <div
        className="absolute w-full flex justify-center items-center"
        style={{
          bottom: 50,
          gap: 20,
          opacity: infoOpacity,
        }}
      >
        {currentStep?.depth !== undefined && currentStep.depth > 0 && (
          <div
            style={{
              background: "rgba(162,155,254,0.3)",
              borderRadius: 12,
              padding: "10px 20px",
              color: "white",
              fontFamily: "system-ui, sans-serif",
              fontSize: 16,
              fontWeight: 600,
              backdropFilter: "blur(10px)",
            }}
          >
            深度: {currentStep.depth}
          </div>
        )}

        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "10px 20px",
            color: "white",
            fontFamily: "system-ui, sans-serif",
            fontSize: 16,
            fontWeight: 600,
            backdropFilter: "blur(10px)",
          }}
        >
          比较次数: {comparisonCount}
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "10px 20px",
            color: "white",
            fontFamily: "system-ui, sans-serif",
            fontSize: 16,
            fontWeight: 600,
            backdropFilter: "blur(10px)",
          }}
        >
          交换次数: {swapCount}
        </div>

        <div
          className="text-2xl"
          style={{
            background: currentStep?.swapping.length
              ? "rgba(255,159,67,0.3)"
              : currentStep?.pivot !== undefined && currentStep.pivot >= 0
                ? "rgba(255,215,0,0.2)"
                : isCelebrating
                  ? "rgba(255,215,0,0.3)"
                  : "rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "10px 24px",
            color: "white",
            fontFamily: "system-ui, sans-serif",
            fontWeight: 600,
            backdropFilter: "blur(10px)",
            minWidth: 220,
            textAlign: "center",
          }}
        >
          {currentStep?.description ?? "Ready!"}
        </div>
      </div>

      {/* Celebration */}
      {isCelebrating && (
        <>
          <Particles count={70} />
          <div
            style={{
              position: "absolute",
              top: "38%",
              left: "46%",
              transform: `translate(-50%, -50%) scale(${celebrationScale})`,
              fontSize: 64,
              fontWeight: 900,
              color: "#FECA57",
              textShadow:
                "0 0 30px rgba(254,202,87,0.8), 0 0 60px rgba(254,202,87,0.4)",
              fontFamily: "system-ui, sans-serif",
              rotate: "10deg",
            }}
          >
            排序完成！🎉
          </div>
        </>
      )}
    </AbsoluteFill>
  )
}

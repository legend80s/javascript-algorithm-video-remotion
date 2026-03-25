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
import {
  generateBubbleSortSteps,
  INITIAL_ARRAY,
  VALUE_COLORS,
} from "./utils/sort"

const INTRO_FRAMES = 75
const SETUP_FRAMES = 50
const FRAMES_PER_STEP = 20
const CELEBRATION_FRAMES = 90

export const BubbleSort: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()

  const steps = generateBubbleSortSteps(INITIAL_ARRAY)
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

  const currentStep = stepIndex >= 0 ? steps[stepIndex] : null
  const currentArray = currentStep ? currentStep.array : INITIAL_ARRAY

  const sortedIndices = currentStep?.sorted ?? []

  const calcConsecutive = (indices: number[], n: number) => {
    let count = 0
    for (let i = n - 1; i >= 0; i--) {
      if (indices.includes(i)) count++
      else break
    }
    return count
  }

  const n = INITIAL_ARRAY.length
  const consecutiveSorted = calcConsecutive(sortedIndices, n)
  const dividerX = (n - consecutiveSorted) * 92 - 7

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
    [220, 280],
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
              "0 0 20px rgba(255,107,107,0.8), 0 0 40px rgba(255,107,107,0.4)",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: 2,
          }}
        >
          排序算法 ①：冒泡排序
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
          排序派对开始咯 💃
        </div>
      </div>

      {/* Bars container */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: "50%",
          transform: `translateX(-${(INITIAL_ARRAY.length * 92) / 2}px)`,
          width: INITIAL_ARRAY.length * 92,
          height: 400,
        }}
      >
        {/* Sorted/unsorted divider line */}
        {consecutiveSorted > 0 &&
          consecutiveSorted < n &&
          (() => {
            const firstSortedIdx = n - consecutiveSorted
            const firstSortedVal = currentArray[firstSortedIdx]
            const dividerHeight =
              spring({
                frame,
                fps,
                delay: INTRO_FRAMES + firstSortedIdx * 3,
                config: { damping: 8, stiffness: 200, mass: 0.8 },
              }) *
              (firstSortedVal / maxVal) *
              380

            return (
              <div
                style={{
                  position: "absolute",
                  bottom: 100,
                  left: dividerX,
                  width: 2,
                  height: dividerHeight - 9,
                  borderLeft: "2px dashed rgba(46, 204, 113, 0.8)",
                }}
              />
            )
          })()}

        {currentArray.map((value, i) => {
          const isComparing = currentStep?.comparing.includes(i) ?? false
          const isSwapping = currentStep?.swapping.includes(i) ?? false
          const isSorted = currentStep?.sorted.includes(i) ?? false

          return (
            <SortBar
              key={`bar-${value}-${i}`}
              value={value}
              maxValue={maxVal}
              colors={VALUE_COLORS[value] as [string, string]}
              isComparing={isComparing}
              isSwapping={isSwapping}
              isSorted={isSorted}
              index={i}
              totalBars={INITIAL_ARRAY.length}
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
        {currentStep?.passIndex !== undefined && (
          <div
            className="absolute top-[3rem]"
            style={{
              // background: "rgba(255,107,107,0.3)",
              borderRadius: 12,
              padding: "10px 20px",
              color: "white",
              fontFamily: "system-ui, sans-serif",
              fontSize: 16,
              fontWeight: 600,
              backdropFilter: "blur(10px)",
            }}
          >
            i = {currentStep.passIndex}
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

        {/* <div
          className="text-2xl"
          style={{
            background: currentStep?.swapping.length
              ? "rgba(255,159,67,0.3)"
              : currentStep?.comparing.length
                ? "rgba(255,255,255,0.2)"
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
          {currentStep?.description}
        </div> */}
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

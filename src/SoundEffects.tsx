import { Audio } from "@remotion/media"
import { Sequence, staticFile } from "remotion"
import type { SortStep } from "./utils/sort"

interface SoundEffectsProps {
  steps: SortStep[]
  sortStart: number
  framesPerStep: number
}

export const SoundEffects: React.FC<SoundEffectsProps> = ({
  steps,
  sortStart,
  framesPerStep,
}) => {
  const audioElements: React.ReactNode[] = []

  steps.forEach((step, stepIndex) => {
    const stepFrame = sortStart + stepIndex * framesPerStep
    const nextStep = steps[stepIndex + 1]

    if (step.swapping.length > 0) {
      audioElements.push(
        <Sequence key={`swap-${stepFrame}`} from={stepFrame} layout="none">
          <Audio src={staticFile("sfx/notification-pop.mp3")} volume={0.5} />
        </Sequence>,
      )
    } else if (step.comparing.length > 0 && !nextStep?.swapping.length) {
      audioElements.push(
        <Sequence key={`no-swap-${stepFrame}`} from={stepFrame} layout="none">
          <Audio src={staticFile("sfx/back-001.mp3")} volume={0.4} />
        </Sequence>,
      )
    }
  })

  return <>{audioElements}</>
}

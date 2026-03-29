import "./index.css"
import { Composition } from "remotion"
import { MyComposition } from "./Composition"
import { QuickSort } from "./QuickSort"
import { SelectionSort } from "./SelectionSort"

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BubbleSort"
        component={MyComposition}
        durationInFrames={1275}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="QuickSort"
        component={QuickSort}
        durationInFrames={810}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="SelectionSort"
        component={SelectionSort}
        durationInFrames={1075}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  )
}

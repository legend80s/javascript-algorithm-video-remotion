// import { ArrowRightLeft } from "lucide-react"

export interface SortStep {
  array: number[]
  comparing: number[]
  swapping: number[]
  sorted: number[]
  description?: string | React.ReactElement
  passIndex?: number
  compareIndex?: number
}

export function generateBubbleSortSteps(input: number[]): SortStep[] {
  const arr = [...input]
  const steps: SortStep[] = []
  const sorted: number[] = []

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [...sorted],
    // description: "Let's start sorting!",
  })

  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      // const bigger = arr[j] > arr[j + 1]
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        // description: `${arr[j]} > ${arr[j + 1]} ? ${bigger ? "✅" : "❌"}`,
        passIndex: i,
        compareIndex: j,
      })

      if (arr[j] > arr[j + 1]) {
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sorted],
          // description: (
          //   <span className="flex gap-1 justify-center items-center">
          //     {arr[j]} <ArrowRightLeft /> {arr[j + 1]}
          //   </span>
          // ),
          passIndex: i,
          compareIndex: j,
        })

        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }

    sorted.push(n - 1 - i)
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      description: `${arr[n - 1 - i]} 不参与下次排序 🎉`,
    })
  }

  sorted.push(0)
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [...sorted],
    description: "排序全部完成 🎉",
  })

  return steps
}

export const INITIAL_ARRAY = [64, 34, 25, 12, 22, 8, 90, 45]

export const RAINBOW_COLORS: [string, string][] = [
  ["#FF6B6B", "#EE5A5A"],
  ["#FF9F43", "#EE8E32"],
  ["#FECA57", "#EDB946"],
  ["#48DBFB", "#37CAF0"],
  ["#FF6BD6", "#EE5AC5"],
  ["#A29BFE", "#918AED"],
  ["#54A0FF", "#438FEE"],
  ["#00D2D3", "#00C1C2"],
]

export const VALUE_COLORS: Record<number, [string, string]> = {}
INITIAL_ARRAY.forEach((val, i) => {
  VALUE_COLORS[val] = RAINBOW_COLORS[i]
})

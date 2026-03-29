export interface QuickSortStep {
  array: number[]
  comparing: number[]
  swapping: number[]
  sorted: number[]
  pivot: number
  range: [number, number]
  description?: string
  depth: number
}

export function generateQuickSortSteps(input: number[]): QuickSortStep[] {
  const arr = [...input]
  const steps: QuickSortStep[] = []
  const sorted: number[] = []

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [...sorted],
    pivot: -1,
    range: [0, arr.length - 1],
    depth: 0,
  })

  function partition(low: number, high: number, depth: number): number {
    const pivotVal = arr[high]
    let i = low - 1

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      pivot: high,
      range: [low, high],
      description: `选择 ${pivotVal} 作为基准`,
      depth,
    })

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, high],
        swapping: [],
        sorted: [...sorted],
        pivot: high,
        range: [low, high],
        description: `${arr[j]} ${arr[j] <= pivotVal ? "≤" : ">"} ${pivotVal}`,
        depth,
      })

      if (arr[j] <= pivotVal) {
        i++
        if (i !== j) {
          steps.push({
            array: [...arr],
            comparing: [],
            swapping: [i, j],
            sorted: [...sorted],
            pivot: high,
            range: [low, high],
            description: `交换 ${arr[i]} ↔ ${arr[j]}`,
            depth,
          })
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
        }
      }
    }

    if (i + 1 !== high) {
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [i + 1, high],
        sorted: [...sorted],
        pivot: i + 1,
        range: [low, high],
        description: `基准归位: ${arr[i + 1]} ↔ ${arr[high]}`,
        depth,
      })
      ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    }

    sorted.push(i + 1)
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      pivot: i + 1,
      range: [low, high],
      description: `${arr[i + 1]} 已就位 (索引 ${i + 1})`,
      depth,
    })

    return i + 1
  }

  function quickSort(low: number, high: number, depth: number) {
    if (low < high) {
      const pi = partition(low, high, depth)
      quickSort(low, pi - 1, depth + 1)
      quickSort(pi + 1, high, depth + 1)
    } else if (low === high) {
      sorted.push(low)
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: [...sorted],
        pivot: low,
        range: [low, high],
        description: `${arr[low]} 已就位`,
        depth,
      })
    }
  }

  quickSort(0, arr.length - 1, 0)

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: arr.length }, (_, i) => i),
    pivot: -1,
    range: [0, arr.length - 1],
    description: "快速排序完成 🎉",
    depth: 0,
  })

  return steps
}

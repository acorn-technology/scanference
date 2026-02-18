import { useState, useEffect } from 'react'

function scoreKey(userName: string) { return `scanference_score_${userName}` }
function completedKey(userName: string) { return `scanference_completed_${userName}` }

function pairKey(a: string, b: string): string {
  return [a, b].sort().join('+')
}

export function useScore(userName: string | null) {
  const key = userName ?? '__guest__'

  const [score, setScore] = useState<number>(() =>
    parseInt(localStorage.getItem(scoreKey(key)) ?? '0', 10),
  )
  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(JSON.parse(localStorage.getItem(completedKey(key)) ?? '[]')),
  )

  useEffect(() => {
    setScore(parseInt(localStorage.getItem(scoreKey(key)) ?? '0', 10))
    setCompleted(new Set(JSON.parse(localStorage.getItem(completedKey(key)) ?? '[]')))
  }, [key])

  const addPoint = (nameA: string, nameB: string): boolean => {
    const pk = pairKey(nameA, nameB)
    if (completed.has(pk)) return false
    const newScore = score + 1
    const newCompleted = new Set(completed)
    newCompleted.add(pk)
    localStorage.setItem(scoreKey(key), String(newScore))
    localStorage.setItem(completedKey(key), JSON.stringify([...newCompleted]))
    setScore(newScore)
    setCompleted(newCompleted)
    return true
  }

  const isCompleted = (nameA: string, nameB: string): boolean =>
    completed.has(pairKey(nameA, nameB))

  return { score, completedCount: completed.size, addPoint, isCompleted }
}

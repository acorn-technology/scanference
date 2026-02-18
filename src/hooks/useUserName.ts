import { useState } from 'react'

const STORAGE_KEY = 'scanference_user_name'

export function useUserName(): [string | null, (name: string) => void] {
  const [name, setNameState] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEY),
  )

  const setName = (newName: string) => {
    const trimmed = newName.trim()
    localStorage.setItem(STORAGE_KEY, trimmed)
    setNameState(trimmed)
  }

  return [name, setName]
}

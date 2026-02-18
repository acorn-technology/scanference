import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'scanference_user_id'

function getOrCreateUserId(): string {
  const existing = localStorage.getItem(STORAGE_KEY)
  if (existing) return existing
  const newId = uuidv4()
  localStorage.setItem(STORAGE_KEY, newId)
  return newId
}

export function useUserId(): string {
  const [userId] = useState<string>(getOrCreateUserId)
  return userId
}

import { useState, useEffect } from 'react'

export function useAttendees() {
  const [attendees, setAttendees] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}attendees.json`)
      .then((r) => r.json())
      .then((data: string[]) => setAttendees(data))
      .catch(() => setAttendees([]))
      .finally(() => setLoading(false))
  }, [])

  return { attendees, loading }
}

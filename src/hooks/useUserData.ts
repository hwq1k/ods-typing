import { useCallback, useEffect, useState } from 'react'
import type { UserData, UserProfile, UserSettings } from '../types/user'
import {
  loadUserData,
  updateProfile,
  updateSettings,
} from '../storage/userStore'

export function useUserData() {
  const [data, setData] = useState<UserData>(() => loadUserData())

  const refresh = useCallback(() => {
    setData(loadUserData())
  }, [])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'ods-typing-user') refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refresh])

  const setProfile = useCallback((profile: Partial<UserProfile>) => {
    const updated = updateProfile(profile)
    setData(updated)
    return updated
  }, [])

  const setSettings = useCallback((settings: Partial<UserSettings>) => {
    const updated = updateSettings(settings)
    setData(updated)
    return updated
  }, [])

  return { data, refresh, setProfile, setSettings }
}

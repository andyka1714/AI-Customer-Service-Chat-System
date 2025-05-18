"use client"
import { store } from '@/redux/store'
import { Provider as ReduxProvider } from 'react-redux'
import { useState, useEffect } from 'react'
import { useAppDispatch } from '@/redux/store'
import { restoreUserFromStorage } from '@/redux/userSlice'

function ReduxInitializer({ onHydrated }: { onHydrated: () => void }) {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(restoreUserFromStorage())
    onHydrated()
  }, [dispatch, onHydrated])
  return null
}

export default function Provider({ children }: { children: React.ReactNode }) {
  const [isUserHydrated, setIsUserHydrated] = useState(false)
  return (
    <ReduxProvider store={store}>
      <ReduxInitializer onHydrated={() => setIsUserHydrated(true)} />
      {isUserHydrated ? children : null}
    </ReduxProvider>
  )
}

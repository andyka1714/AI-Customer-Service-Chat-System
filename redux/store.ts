// redux/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import userReducer from './userSlice'
import sessionsReducer from './sessionsSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    sessions: sessionsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

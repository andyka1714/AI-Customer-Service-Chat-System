import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Session } from '@/types/sessions'

// 非同步 thunk：取得 sessions，支援搜尋
export const fetchSessions = createAsyncThunk<Session[], string | undefined>(
  'sessions/fetchSessions',
  async (search, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/sessions?search=${encodeURIComponent(search || '')}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || '取得 sessions 失敗')
      return json.sessions as Session[]
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

interface SessionsState {
  sessions: Session[]
  loading: boolean
  error: string | null
}

const initialState: SessionsState = {
  sessions: [],
  loading: false,
  error: null,
}

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false
        state.sessions = action.payload
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default sessionsSlice.reducer

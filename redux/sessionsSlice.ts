import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Session } from '@/types/sessions'

// 非同步 thunk：取得 sessions，支援搜尋與分頁，回傳 total 及 sessions
export const fetchSessions = createAsyncThunk<
  { sessions: Session[]; total: number },
  { search?: string; page?: number; pageSize?: number } | undefined
>(
  'sessions/fetchSessions',
  async (params, { rejectWithValue }) => {
    const search = params?.search || ''
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    try {
      const res = await fetch(`/api/sessions?search=${encodeURIComponent(search)}&page=${page}&pageSize=${pageSize}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || '取得 sessions 失敗')
      // 回傳 payload 結構：{ sessions, total }
      return { sessions: json.sessions as Session[], total: json.total as number }
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

// 非同步 thunk：取得活躍對話數（1小時內）
export const fetchActiveCount = createAsyncThunk<number>(
  'sessions/fetchActiveCount',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/sessions/active-count')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || '取得活躍對話數失敗')
      return json.activeCount as number
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

// 非同步 thunk：更新 session notes
export const updateSessionNotes = createAsyncThunk<
  { sessionId: string; notes: string },
  { sessionId: string; notes: string }
>(
  'sessions/updateSessionNotes',
  async ({ sessionId, notes }, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/sessions/update-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, notes }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || '更新 notes 失敗')
      return { sessionId, notes }
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

interface SessionsState {
  sessions: Session[]
  loading: boolean
  error: string | null
  activeCount: number | null
}

const initialState: SessionsState = {
  sessions: [],
  loading: false,
  error: null,
  activeCount: null,
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
        state.sessions = action.payload.sessions
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchActiveCount.fulfilled, (state, action) => {
        state.activeCount = action.payload ?? null
      })
      .addCase(fetchActiveCount.rejected, (state) => {
        state.activeCount = null
      })
      .addCase(updateSessionNotes.fulfilled, (state, action) => {
        // 直接更新對應 session 的 notes
        const idx = state.sessions.findIndex(s => s.id === action.payload.sessionId)
        if (idx !== -1) {
          state.sessions[idx].notes = action.payload.notes
        }
      })
  },
})

export default sessionsSlice.reducer

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
        state.sessions = action.payload.sessions
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default sessionsSlice.reducer

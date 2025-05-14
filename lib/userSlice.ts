import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  user: {
    email: string
    name: string
    role: 'user' | 'admin'
    token?: string
  } | null
  loading: boolean
  errors: { email?: string; password?: string; api?: string }
}

const initialState: UserState = {
  user: null,
  loading: false,
  errors: {},
}

export const signinUser = createAsyncThunk(
  'user/signinUser',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        // 將 token 存到 localStorage
        if (typeof window !== 'undefined' && data.user?.token) {
          localStorage.setItem('user_token', data.user.token)
        }
        return data.user
      } else {
        return rejectWithValue(data.errors)
      }
    } catch (err) {
      return rejectWithValue({ api: '伺服器錯誤，請稍後再試' })
    }
  }
)

export const signoutUser = createAsyncThunk('user/signoutUser', async (_, { dispatch }) => {
  // 清空 redux user 狀態
  dispatch(clearUser())
  // 清除 localStorage token
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_token')
  }
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState['user']>) {
      state.user = action.payload
    },
    clearUser(state) {
      state.user = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signinUser.pending, (state) => {
        state.loading = true
        state.errors = {}
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.errors = {}
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.loading = false
        state.errors = (action.payload as any) || { api: '登入失敗' }
      })
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer

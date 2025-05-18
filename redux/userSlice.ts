// redux/userSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UserState, UserInfo } from '@/types/redux/user'
import type { AccountAuthParams } from '@/types/account'

const initialState: UserState = {
  user: null,
  loading: false,
  errors: {},
}

export const signinUser = createAsyncThunk(
  'user/signinUser',
  async (
    params: AccountAuthParams,
    { rejectWithValue }
  ) => {
    const { email, password } = params
    try {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // 確保 cookie 能帶回前端
      })
      const data = await res.json()
      if (res.ok && data.success) {
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

// 新增：還原 localStorage user 狀態
export const restoreUserFromStorage = () => (dispatch: any) => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('mock_user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        dispatch(setUser(user))
      } catch {}
    }
  }
}

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
        // 登入成功時將 user 狀態存入 localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('mock_user', JSON.stringify(action.payload))
        }
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.loading = false
        state.errors = (action.payload as any) || { api: '登入失敗' }
      })
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer

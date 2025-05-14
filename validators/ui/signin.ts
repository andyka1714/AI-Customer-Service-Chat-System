export function validateLogin({ email, password }: { email: string; password: string }) {
  const errors: { email?: string; password?: string } = {}

  // Email 驗證
  if (!email) {
    errors.email = '請輸入電子郵件'
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = '電子郵件格式不正確'
  }

  // 密碼驗證
  if (!password) {
    errors.password = '請輸入密碼'
  } else if (password.length < 6) {
    errors.password = '密碼長度至少 6 碼'
  }

  return errors
}

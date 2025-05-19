# 智能客服對話系統專案說明

## 專案目標與特色

- 提供企業級智能客服解決方案，結合 AI 智能回覆與即時對話監控。
- 支援 Amazon 關鍵字自動標記、訊息高亮、備註管理、分頁與用戶篩選。
- 管理端可即時監控所有對話，提升客服效率與服務品質。
- 前後端分離、響應式設計，支援多裝置流暢體驗。

---

## 專案目錄結構說明

- `app/`：Next.js 應用主目錄，包含各頁面、API route 與全域 Provider。
  - `chat/`：客戶聊天介面
  - `monitor/`：管理員監控平台
  - `sessions/`：對話管理頁
  - `signin/`：登入頁與 API
  - `api/`：後端 API route（如 chat-completion、sessions、signin 等）
- `components/`：共用元件（UI、Layout、shadcn 元件等）
- `lib/`：工具庫（supabase、openai、關鍵字比對等）
- `redux/`：Redux 狀態管理（user、sessions 等 slice）
- `types/`：TypeScript 型別定義
- `hooks/`：自訂 React hooks
- `public/`：靜態資源

---

## 主要功能列表

- 客戶端聊天介面（訊息發送、AI 回覆、狀態顯示、關鍵字高亮）
- AI 助手自動回覆（OpenAI Chat API 串接、上下文管理、Amazon 關鍵字標記）
- 管理端監控平台（即時監控、訊息分頁、用戶篩選、備註編輯、統計數據）
- Supabase Realtime 即時訊息同步
- shadcn UI 元件、響應式設計
- Toast 通知、Dialog 編輯、Skeleton loading 等 UX 強化

---

## 主要頁面路徑

| 頁面         | 路徑              | 說明                     |
|--------------|-------------------|--------------------------|
| 登入         | /signin           | 使用者登入頁             |
| 客戶聊天     | /chat             | 客戶端聊天介面           |
| 管理監控     | /monitor          | 管理員監控管理平台       |
| 對話管理     | /sessions         | 管理員對話列表與管理     |

---

## API 文件/介接說明

- `/api/signin`：POST，登入驗證，回傳 user 資訊與權限
- `/api/sessions`：GET，查詢對話列表，支援分頁、搜尋、訊息/需注意訊息數量
- `/api/sessions/active-count`：GET，查詢活躍對話數
- `/api/sessions/update-notes`：POST，更新對話備註
- `/api/chat-completion`：POST，AI 對話回覆（串接 OpenAI Chat API）

---

## 資料庫結構說明（Supabase Tables）

| Table              | 主要欄位說明                                                                 |
|--------------------|------------------------------------------------------------------------------|
| users              | id (uuid), role (text), name (text), email (text), password (text), created_at (timestamp) |
| sessions           | id (uuid), user_id (uuid), latest_message_sent_at (timestamp), notes (text), created_at (timestamp) |
| messages           | id (uuid), content (text), created_at (timestamp), session_id (uuid), user_id (uuid), role (text) |
| message_keywords   | id (int), session_id (uuid), message_id (uuid), keyword (text), created_at (timestamp) |

- `users`：儲存用戶帳號、角色、名稱、信箱、密碼等資訊。
- `sessions`：儲存每一個對話 session，關聯 user。
- `messages`：儲存所有訊息，關聯 session 與 user，並標記角色（user/assistant）。
- `message_keywords`：儲存訊息中出現的關鍵字，關聯 session、message。

Supabase 需設定資料表：`messages`、`sessions`、`users`，並啟用 Realtime。

---

## 環境變數與設定

請於專案根目錄建立 `.env.local`，範例如下：

```
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase 專案 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase 匿名金鑰
OPENAI_API_KEY=你的 OpenAI API 金鑰
```

---

## 安裝和運行指南

1. **安裝依賴套件**
   ```bash
   npm install
   # 或
   yarn install
   ```

2. **啟動開發伺服器**
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

3. **開啟瀏覽器**
   - 本地開發：http://localhost:3000
   - 正式站：https://nextjs-boilerplate-beta-rosy-50.vercel.app/

---

## 技術選型說明

- **前端框架**：Next.js 15 + TypeScript
- **UI 庫**：Tailwind CSS、shadcn/ui、Lucide React Icons
- **狀態管理**：Redux Toolkit
- **即時通訊/資料庫**：Supabase Realtime & Database
- **AI 服務**：OpenAI Chat API
- **通知元件**：sonner
- **其他**：clsx、cookie

---

## 部署說明（Vercel）

1. 於 [Vercel](https://vercel.com/) 建立新專案，連接本 GitHub repository。
2. 於 Vercel 專案設定環境變數（同上 .env.local）。
3. 點擊 Deploy 即可自動部署。
4. 正式站網址範例：https://nextjs-boilerplate-beta-rosy-50.vercel.app/

---

## 測試帳號資訊

| 角色   | 帳號 (email)         | 密碼      | 顯示名稱 |
|--------|----------------------|-----------|----------|
| 管理員 | admin@acme.com       | admin888  | 管理員   |
| 用戶   | user1@acme.com       | 123456    | 用戶一   |
| 用戶   | user2@acme.com       | 123456    | 用戶二   |
| 用戶   | user3@acme.com       | 123456    | 用戶三   |


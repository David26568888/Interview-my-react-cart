"# Interview-my-react-cart" 


🛒 React 電商前端系統 (Shopping Cart Frontend)

本專案為 React + Vite 開發的購物網站前端介面，
透過 REST API 與 Spring Boot 後端整合，提供購物車、登入驗證、商品管理、訂單查詢、銷售統計、會員管理等功能。

此專案可作為作品集、面試展示或 Demo 使用。

✨ 主要功能 (Features)
👤 使用者介面

註冊帳號

使用者登入（含驗證碼 Captcha）

忘記密碼（需比對身分證號 + 電話）

顯示登入使用者名稱（含角色）

登入後自動跳轉首頁

更新會員資料

使用者角色：

USER

ADMIN（可以進入商品管理與銷售統計）

🛒 商品頁面

商品卡片式呈現（含圖片、價格）

支援 分頁（每頁 6 筆）

支援 搜尋商品

新增商品（僅 admin）

刪除商品（僅 admin）

加入購物車

加入/移除關注（Favorites）

顯示使用者「關注商品區塊」

❤️ 關注清單 (Favorites)

顯示使用者關注商品列表

商品列表中可快速切換關注 / 取消關注狀態

🛒 購物車 (Cart)

加入/移除商品

計算總金額

提交結帳 → 呼叫後端建立訂單

結帳後清空購物車

📦 訂單紀錄 (Order History)

查詢使用者歷史訂單

訂單內商品使用卡片呈現

可合併相同商品數量

計算單項小計與總額

可視化區塊顯示訂單

📊 銷售統計（Admin Only）

必須為管理員 (ROLE_ADMIN)

顯示後端計算的商品銷售數量與總額

使用 Recharts 顯示長條圖

表格顯示詳細資料

圖表 + 表格並排呈現

📂 專案結構 (Project Structure)
src/
│── assets/           # 圖片、Logo 等
│── components/       # Navbar、Footer 等 UI 元件
│── pages/            # 各功能頁面 (Home, Products, Cart...)
│── services/         # API 呼叫封裝
│── App.jsx           # 路由與全域狀態
│── main.jsx          # React entry point
│── App.css           # 全域樣式

🔗 與後端 API 整合

本專案透過 services/*.js 封裝 fetch API：

✔ authService.js

login()

logout()

checkLoginStatus()

✔ productService.js

fetchProducts(page, size, keyword)

addProduct()

deleteProduct()

✔ favoriteService.js

fetchFavorites()

addFavorite()

removeFavorite()

✔ cartService.js

checkoutCart()

✔ orderService.js

fetchOrderHistory()

✔ salesService.js

fetchProductSales()

🛠 使用技術 (Tech Stack)

React 18 / Vite

React Router

Recharts（長條圖）

Context + Props 狀態管理

CSS（自訂 + layout 設計）

Fetch API（含 credentials: include，用於 Session 維護）

🚀 專案啟動方式
1️⃣ 安裝依賴
npm install

2️⃣ 啟動開發伺服器
npm run dev

3️⃣ 開啟瀏覽器
http://localhost:5173


前端會自動向後端（http://localhost:8080）發送 API 請求。

🔧 修改 API Base URL（如有需要）

可於 services/*Service.js 修改：

const API_BASE_URL = "http://localhost:8080";

🧪 角色測試建議
帳號	密碼	角色
admin	123456	ROLE_ADMIN
user	123456	ROLE_USER

若後端未預設，請自行註冊或使用 SQL 新增角色。
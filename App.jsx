// 需安裝 npm install react-router-dom
import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// 登入相關 API
import { checkLoginStatus, login, logout } from "./services/authService";

// 導航列相關模組
import Navbar from "./components/Navbar";

// 首頁相關模組
import Home from "./pages/Home";

// 頁尾相關模組
import Footer from "./components/Footer";

// 登入相關模組
import LoginPage from "./pages/LoginPage";

// 商品相關模組
import Products from "./pages/Products";

// 購物車模組
import Cart from "./pages/Cart";

// 查看銷售模組（原本 Checkout，現在是查看銷售）
import Checksales from "./pages/Checksales";

// 歷史訂單模組
import OrderHistory from "./pages/OrderHistory";

// 註冊模組
import RegisterPage from "./pages/RegisterPage";

// 忘記密碼模組
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// 更新會員資料模組
import ProfilePage from "./pages/ProfilePage";

function App() {
  // 登入狀態
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // ⭐ 這裡存整個 userDTO：{ id, username, roles, name, phone, birthday, ... }
  // 現在登入的使用者（要顯示名字、權限時可以用）
  const [currentUser, setCurrentUser] = useState(null);
  // 定義購物車內容
  const [cartItems, setCartItems] = useState([]);

  // ⭐ 目前登入者是否為管理員（ROLE_ADMIN）
  const isAdmin = currentUser?.roles?.includes("ROLE_ADMIN") || false;

  // ⭐ 一進來先問後端目前是否已登入（依照 Session 判斷）
  useEffect(() => {
    const fetchLoginStatus = async () => {
      try {
        const res = await checkLoginStatus();
        // 後端有登入：status = 200, data.isLoggedIn = true
        if (res.status === 200 && res.data && res.data.isLoggedIn) {
          setIsLoggedIn(true);
          // /auth/isLoggedIn 目前只給 username + password
          // 如果你想開機就知道 id / roles，需要後端另外做 "/auth/me"
          setCurrentUser((prev) => ({
            ...(prev || {}),
            username: res.data.username,
          }));
        } else {
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      } catch (e) {
        // 例如未登入時，後端可能回 400，authService 會 throw Error
        console.error("檢查登入狀態發生錯誤：", e);
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    };

    fetchLoginStatus();
  }, []);

  // 登入處理
  const handleLogin = async (username, password, captcha) => {
    console.log("username:", username);
    console.log("password:", password);
    console.log("captcha:", captcha);
    try {
      const data = await login(username, password, captcha); // 使用登入服務方法
      console.log("登入結果:", JSON.stringify(data)); // 登入結果

      if (data.status === 200) {
        setIsLoggedIn(true);
        // ⭐ 這裡直接保存後端回傳的 userDTO（裡面有 roles）
        setCurrentUser(data.data); // 後端的 userDTO
        alert("登入成功");
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
        alert("登入失敗: " + data.message);
      }
    } catch (e) {
      setIsLoggedIn(false);
      setCurrentUser(null);
      alert(e.message || "登入發生錯誤");
      console.error("登入錯誤:", e);
    }
  };

  // 登出處理
  const handleLogout = async () => {
    try {
      const data = await logout();
      console.log("登出結果:", data);
    } catch (e) {
      console.error("登出錯誤:", e);
      alert(e.message || "登出失敗");
    }
    // 無論如何都清掉前端登入狀態
    setIsLoggedIn(false);
    setCurrentUser(null);
    window.location.href = "/"; // 回到首頁
  };

  // 加入購物車
  const addToCart = (product) => {
    const item = {
      product: product,
      qty: 1,
    };
    console.log(item);
    setCartItems([...cartItems, item]);
  };

  // 移除購物項目
  const removeFromCart = (indexToRemove) => {
    setCartItems(cartItems.filter((_, index) => index !== indexToRemove));
  };

  // 清除購物車
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <Router>
      {/* 導航列-位於最上方 */}
      <Navbar
        cartCount={cartItems.length}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        userName={currentUser?.username}
        isAdmin={isAdmin}
      />

      {/* 主要內容區-位於中間部分 */}
      <div className="content">
        <Routes>
          {/* 首頁路由 */}
          <Route path="/" element={<Home />} />

          {/* 商品路由 */}
          <Route
            path="/products"
            element={
              <Products
                addToCart={addToCart}
                isLoggedIn={isLoggedIn}
                currentUser={currentUser}
              />
            }
          />

          {/* 購物車路由 */}
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
                isLoggedIn={isLoggedIn}
              />
            }
          />

          {/* 查看銷售路由（只給 ADMIN，看畫面時也要檢查 isAdmin） */}
          <Route
            path="/checksales"
            element={
              <Checksales
                isLoggedIn={isLoggedIn}
                isAdmin={isAdmin}
              />
            }
          />

          {/* 登入路由 */}
          <Route
            path="/login"
            element={
              <LoginPage
                onLogin={handleLogin}   // 會收到 (username, password, captcha)
                isLoggedIn={isLoggedIn}
              />
            }
          />

          {/* 新增註冊頁 */}
          <Route path="/register" element={<RegisterPage />} />

          {/* 忘記密碼頁 */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* 會員資料頁 */}
          <Route
            path="/profile"
            element={
              <ProfilePage
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                isLoggedIn={isLoggedIn}
              />
            }
          />

          {/* 歷史訂單路由 */}
          <Route
            path="/orders/history"
            element={<OrderHistory isLoggedIn={isLoggedIn} />}
          />
        </Routes>
      </div>

      {/* 頁尾-位於最下方 */}
      <Footer />
    </Router>
  );
}

export default App;

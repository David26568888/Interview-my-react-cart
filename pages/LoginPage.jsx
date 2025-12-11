import React, { useState } from "react";
import { useNavigate } from "react-router-dom";   // ⭐ 新增：導頁 Hook
import "./LoginPage.css";

function LoginPage({ onLogin, isLoggedIn }) {
  const [username, setUsername] = useState("admin");      // 建議先用 admin 測試
  const [password, setPassword] = useState("123456");     // 和後端測試帳號一致
  const [captcha, setCaptcha] = useState("");             // 驗證碼輸入
  const [error, setError] = useState("");                 // 錯誤訊息顯示用
  const [loading, setLoading] = useState(false);          // 登入中狀態

  const navigate = useNavigate();  // ⭐ 新增：用來跳轉頁面

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 呼叫父層傳進來的 onLogin，並把 captcha 一起帶上去
      await onLogin(username, password, captcha);

      // ⭐⭐⭐ 登入成功 → 自動跳轉到首頁
      navigate("/");
      
    } catch (err) {
      // 父層丟出來的 Error 物件
      setError(err.message || "登入失敗");
    } finally {
      setLoading(false);
    }
  };

  // 重新載入驗證碼圖片（避免快取）
  const refreshCaptcha = () => {
    const img = document.getElementById("captcha-img");
    if (img) {
      img.src = `http://localhost:8080/captcha?${Date.now()}`;
    }
  };

  return (
    <div className="login-page">
      {isLoggedIn ? (
        <>
          <h2>登入成功</h2>
        </>
      ) : (
        <>
          <h2>登入</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">帳號：</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">密碼：</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* 驗證碼區塊 */}
            <div className="form-group">
              <label htmlFor="captcha">驗證碼：</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="text"
                  id="captcha"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  required
                  maxLength={4}
                />
                <img
                  id="captcha-img"
                  src="http://localhost:8080/captcha"
                  alt="驗證碼"
                  onClick={refreshCaptcha}
                  style={{ cursor: "pointer", border: "1px solid #ccc" }}
                />
              </div>
              <small>點擊圖片可重新產生驗證碼</small>
            </div>

            {/* 錯誤訊息 */}
            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "登入中..." : "登入"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default LoginPage;

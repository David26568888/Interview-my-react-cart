// services/authService.js

const API_BASE_URL = "http://localhost:8080";

/**
 * 檢查登入狀態
 * @returns {Promise<Object>} 包含登入狀態的 API 回應
 */
export const checkLoginStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/isLoggedIn`, {
    method: "GET",
    credentials: "include",// ⭐ 一定要帶 cookie，才知道是哪個 session
  });

  const data = await response.json(); // { status, message, data }
  
  
    // 不要在這裡 throw，讓 App 判斷
  return data;
};


/**
 * 登入
 * @param {string} username 用戶名
 * @param {string} password 密碼
 * @param {string} captcha 驗證碼
 * @returns {Promise<Object>} 包含登入結果的 API 回應
 */
export const login = async (username, password, captcha) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 帶 Cookie (JSESSIONID)
    body: JSON.stringify({ username, password, captcha }),
  });

  const data = await response.json(); // { status, message, data }

  if (!response.ok) {
    // 把後端的錯誤訊息丟給呼叫端（LoginPage）
    throw new Error(data.message || "登入失敗");
  }

  return data;
};

/**
 * 登出
 * @returns {Promise<Object>} 包含登出結果的 API 回應
 */
export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "登出失敗");
  }

  return data;
};

/**
 * 註冊
 * @param {Object} payload 註冊資料：{ username, password, name, idNumber, phone, birthday }
 * birthday 建議用 "YYYY-MM-DD" 字串格式
 */
export const register = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 可有可無，看你要不要註冊後自動登入
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "註冊失敗");
  }

  return data; // { status, message, data: userDTO }
};

/**
 * 忘記密碼（重設密碼）
 * @param {Object} payload { username, idNumber, phone, newPassword }
 */
export const forgotPassword = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "重設密碼失敗");
  }

  return data; // { status, message, data: null }
};
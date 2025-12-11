// src/services/orderService.js

const API_BASE_URL = "http://localhost:8080";

/**
 * 取得目前登入使用者的歷史訂單
 * @returns {Promise<Object>} ApiResponse<List<OrderDTO>>
 */
export const fetchOrderHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/orders/history`, {
    method: "GET",
    credentials: "include", // ⭐ 要帶上 Session Cookie
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // 後端未登入會給 401 + message
    throw new Error(data?.message || "無法取得歷史訂單");
  }

  return data; // { status, message, data: [...] }
};

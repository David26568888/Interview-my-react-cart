// src/services/salesService.js

const API_BASE_URL = "http://localhost:8080";

/**
 * 取得商品銷售統計
 * 回傳格式：{ status, message, data: [ { productId, productName, totalQty, totalAmount }, ... ] }
 */
export const fetchProductSales = async () => {
  const response = await fetch(`${API_BASE_URL}/orders/sales/summary`, {
    method: "GET",
    credentials: "include", // ⭐ 要帶 cookie 才有 Session / 權限
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "無法取得銷售統計");
  }

  return data;
};

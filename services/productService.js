// services/productService.js

const API_BASE_URL = "http://localhost:8080";

/**
 * 分頁取得產品列表 ＋ 搜尋
 * @param {number} page 第幾頁（0-based）
 * @param {number} size 每頁筆數
 * @param {string} keyword 搜尋關鍵字（可為空字串）
 * @returns {Promise<Object>} { status, message, data: { products, page, size, totalElements, totalPages, last } }
 */
export const fetchProducts = async (page = 0, size = 6, keyword = "") => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);
  if (keyword && keyword.trim() !== "") {
    params.append("keyword", keyword.trim());
  }
  
  const queryString = params.toString();
  console.log("產品查詢 URL =", `${API_BASE_URL}/products?${queryString}`);

  const response = await fetch(`${API_BASE_URL}/products?${queryString}`, {
    method: "GET",
    credentials: "include", // 可有可無（GET 商品列表通常不用登入），但保留也沒差
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "無法取得產品資料");
  }

  return data; // { status, message, data: { products, page, size, totalPages, ... } }
};

/**
 * 新增產品
 * @param {Object} newProduct 新產品的資料
 * @returns {Promise<Object>} API 回應
 */
export const addProduct = async (newProduct) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 管理員新增商品需要 Session
    body: JSON.stringify(newProduct),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "新增商品失敗");
  }

  return data; // { status, message, data: ProductDTO }
};

/**
 * 更新產品
 * @param {number} id 產品 ID
 * @param {Object} product 更新內容
 */
export const updateProduct = async (id, product) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(product),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "更新商品失敗");
  }

  return data; // { status, message, data: 更新後 ProductDTO }
};

/**
 * 刪除產品
 * @param {number} id 產品 ID
 */
export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    // 有些刪除 API 可能不回 body
  }

  if (!response.ok) {
    throw new Error(data?.message || "刪除商品失敗");
  }

  return data; // 可有可無，看你後端怎寫
};
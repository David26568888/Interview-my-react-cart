// services/userService.js

const API_BASE_URL = "http://localhost:8080";

/**
 * 更新使用者資料
 * @param {number} userId
 * @param {{name:string, phone:string, birthday:string}} payload
 * birthday 用 "YYYY-MM-DD" 字串
 */
export const updateUser = async (userId, payload) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 需要帶 session
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "更新使用者資料失敗");
  }

  return data; // { status, message, data: userDTO }
};

/**
 * 刪除使用者（只允許 ROLE_ADMIN）
 * @param {number} userId
 */
export const deleteUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "刪除使用者失敗");
  }

  return data; // { status, message, data: null }
};

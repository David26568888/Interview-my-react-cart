// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import "./LoginPage.css"; // 先沿用
import { updateUser, deleteUser } from "../services/userService";

function ProfilePage({ currentUser, setCurrentUser, isLoggedIn }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    birthday: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        birthday: currentUser.birthday || "",
      });
    }
  }, [currentUser]);

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <h2>會員資料</h2>
        <p>請先登入後再查看會員資料。</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="login-page">
        <h2>會員資料</h2>
        <p>尚未取得使用者資料，請重新登入。</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        birthday: form.birthday || null,
      };

      const res = await updateUser(currentUser.id, payload);
      if (res.status === 200 && res.data) {
        setMessage("更新成功");
        // 更新 App 裡的 currentUser
        setCurrentUser(res.data);
      } else {
        setMessage(res.message || "更新失敗");
      }
    } catch (e2) {
      console.error(e2);
      setMessage(e2.message || "更新發生錯誤");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("確定要刪除這個帳號嗎？此動作無法復原！")) {
      return;
    }
    try {
      const res = await deleteUser(currentUser.id);
      if (res.status === 200) {
        alert("使用者已刪除，請重新整理系統或以管理人身分重新登入。");
      } else {
        alert(res.message || "刪除失敗");
      }
    } catch (e2) {
      console.error(e2);
      alert(e2.message || "刪除發生錯誤（注意：只有 ADMIN 可刪除）");
    }
  };

  return (
    <div className="login-page">
      <h2>會員資料</h2>
      <p>帳號：{currentUser.username}</p>

      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label htmlFor="name">姓名：</label>
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">電話：</label>
          <input
            type="text"
            id="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="birthday">生日：</label>
          <input
            type="date"
            id="birthday"
            value={form.birthday || ""}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="login-button">
          更新資料
        </button>
      </form>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}

      {/* 刪除帳號 - 建議只給 ADMIN 在別的畫面操作，這裡只是示範 */}
      <hr style={{ margin: "20px 0" }} />
      <button
        type="button"
        className="login-button"
        style={{ backgroundColor: "#dc3545" }}
        onClick={handleDelete}
      >
        刪除此使用者（需 ADMIN）
      </button>
    </div>
  );
}

export default ProfilePage;

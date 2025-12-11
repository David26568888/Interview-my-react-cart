// src/pages/ForgotPasswordPage.jsx
import React, { useState } from "react";
import "./LoginPage.css";
import { forgotPassword } from "../services/authService";

function ForgotPasswordPage() {
  const [form, setForm] = useState({
    username: "",
    idNumber: "",
    phone: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.newPassword !== form.confirmNewPassword) {
      setMessage("兩次輸入的新密碼不一致");
      return;
    }

    try {
      const payload = {
        username: form.username,
        idNumber: form.idNumber,
        phone: form.phone,
        newPassword: form.newPassword,
      };

      const res = await forgotPassword(payload);
      if (res.status === 200) {
        setMessage("密碼更新成功，請回登入頁使用新密碼登入");
      } else {
        setMessage(res.message || "密碼更新失敗");
      }
    } catch (e2) {
      setMessage(e2.message || "密碼更新發生錯誤");
      console.error(e2);
    }
  };

  return (
    <div className="login-page">
      <h2>忘記密碼</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">帳號：</label>
          <input
            type="text"
            id="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="idNumber">身分證號：</label>
          <input
            type="text"
            id="idNumber"
            value={form.idNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">電話：</label>
          <input
            type="text"
            id="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">新密碼：</label>
          <input
            type="password"
            id="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmNewPassword">確認新密碼：</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={form.confirmNewPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="login-button">
          提交
        </button>
      </form>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
}

export default ForgotPasswordPage;

// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import "./LoginPage.css"; // 先沿用登入頁的樣式
import { register } from "../services/authService";

function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    idNumber: "",
    phone: "",
    birthday: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setMessage("兩次輸入的密碼不一致");
      return;
    }

    try {
      const payload = {
        username: form.username,
        password: form.password,
        name: form.name,
        idNumber: form.idNumber,
        phone: form.phone,
        birthday: form.birthday || null, // 後端 LocalDate
      };

      const res = await register(payload);
      if (res.status === 200) {
        setMessage("註冊成功，請回登入頁登入");
      } else {
        setMessage(res.message || "註冊失敗");
      }
    } catch (e2) {
      setMessage(e2.message || "註冊發生錯誤");
      console.error(e2);
    }
  };

  return (
    <div className="login-page">
      <h2>註冊</h2>
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
          <label htmlFor="password">密碼：</label>
          <input
            type="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">確認密碼：</label>
          <input
            type="password"
            id="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

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
          <label htmlFor="idNumber">身分證號：</label>
          <input
            type="text"
            id="idNumber"
            value={form.idNumber}
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
            value={form.birthday}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="login-button">
          送出註冊
        </button>
      </form>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
}

export default RegisterPage;

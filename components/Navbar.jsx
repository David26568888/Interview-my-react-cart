// src/components/Navbar.jsx

import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ cartCount, isLoggedIn, onLogout, userName, userRoles = [], isAdmin }) {
  
  // 顯示角色名稱（中文化）
  const roleLabel = isAdmin
    ? "（管理員）"
    : userRoles.includes("ROLE_USER")
    ? "（會員）"
    : "";

  return (
    <nav className="navbar">
      <h2 className="navbar-title">購物車範例</h2>

      <ul className="navbar-links">

        <li><Link to="/">首頁</Link></li>
        <li><Link to="/products">商品</Link></li>

        {/* ⭐ 如果是管理員才顯示查看銷售 */}
        {isAdmin && (
          <li>
            <Link to="/checksales">查看銷售</Link>
          </li>
        )}

        {/* ⭐ 登入後功能 */}
        {isLoggedIn ? (
          <>
            <li><Link to="/cart">購物車 ({cartCount})</Link></li>
            <li><Link to="/orders/history">歷史訂單</Link></li>

            {/* ⭐ 顯示 Hi, username（角色） */}
            <li className="user-info">
              Hi, {userName} {roleLabel}
            </li>

            <li>
              <button className="navbar-button" onClick={onLogout}>
                登出
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="navbar-button">登入</Link></li>
            <li><Link to="/register" className="navbar-button">註冊</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;

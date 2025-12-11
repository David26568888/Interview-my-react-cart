
// src/pages/Home.jsx

import React from "react";
import "./Home.css";
import banner from "../assets/home-banner.jpg";

function Home() {
  return (
    <div className="home-container">
      <img src={banner} alt="首頁圖片" className="home-banner" />

      <h1>歡迎來到 水果購物車系統</h1>
      <p>立即開始探索商品，享受購物樂趣！</p>
    </div>
  );
}

export default Home;

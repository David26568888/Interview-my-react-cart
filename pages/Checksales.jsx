// src/pages/Checkout.jsx  （查看銷售）

import React, { useEffect, useState } from "react";
import "./Checksales.css";
import { fetchProductSales } from "../services/salesService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

function Checkout({ isLoggedIn, isAdmin }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadSales = async () => {
      if (!isLoggedIn|| !isAdmin) {
        setLoading(false);
        setErrorMsg("請先登入管理帳號再查看銷售狀況");
        return;
      }

      try {
        const res = await fetchProductSales(); // { status, message, data }
        if (res.status === 200) {
          const chartData = (res.data || []).map((item) => ({
            productId: item.productId,
            productName: item.productName,
            totalQty: item.totalQty,
            totalAmount: item.totalAmount,
          }));
          setSales(chartData);
          setErrorMsg("");
        } else {
          setErrorMsg(res.message || "取得銷售統計失敗");
        }
      } catch (e) {
        console.error("載入銷售統計發生錯誤:", e);
        setErrorMsg(e.message || "無法取得銷售統計");
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, [isLoggedIn, isAdmin]);

  if (loading) {
    return (
      <div className="sales-container">
        <h1>銷售統計</h1>
        <p>載入中...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="sales-container">
        <h1>銷售統計</h1>
        <p className="sales-error">{errorMsg}</p>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="sales-container">
        <h1>銷售統計</h1>
        <p>目前尚無銷售資料。</p>
      </div>
    );
  }

  return (
    <div className="sales-container">
      <h1>銷售統計</h1>

      {/* ⭐ 圖表 + 表格 並排 */}
      <div className="sales-main">
        {/* 左邊：長條圖 */}
        <div className="sales-chart-wrapper">
          <h2>商品銷量長條圖（依銷售數量）</h2>
          <div className="sales-chart-inner">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sales}
                margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="productName"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalQty" name="銷售數量" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 右邊：表格：細部銷售資料 */}
        <div className="sales-table-wrapper">
          <h2>銷售明細</h2>
          <table className="sales-table">
            <thead>
              <tr>
                <th>商品 ID</th>
                <th>商品名稱</th>
                <th>銷售數量</th>
                <th>銷售總額</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productId}</td>
                  <td>{item.productName}</td>
                  <td>{item.totalQty}</td>
                  <td>${item.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

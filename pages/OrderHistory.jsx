// src/pages/OrderHistory.jsx

import React, { useEffect, useState } from "react";
import "./OrderHistory.css";
import { fetchOrderHistory } from "../services/orderService";

function OrderHistory({ isLoggedIn }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // ---------- Helper：針對你實際的 DTO 結構 ----------

  const getItemName = (item) => item.product?.name || "未命名商品";
  const getItemPrice = (item) => item.product?.price ?? 0;
  const getItemQty = (item) => item.qty ?? 1;
  const getItemImageBase64 = (item) => item.product?.imageBase64 || null;

  const getImageSrc = (item) => {
    const base64 = getItemImageBase64(item);
    if (!base64) return null;
    if (base64.startsWith("data:")) return base64;
    return `data:image/png;base64,${base64}`;
  };

  // ⭐ 合併同品項（product.id 相同就加總 qty）
  const mergeOrderItems = (items = []) => {
    const map = new Map();

    items.forEach((item) => {
      const pid = item.product?.id;
      if (!pid) {
        const key = `noid-${Math.random()}`;
        map.set(key, { ...item });
        return;
      }

      if (!map.has(pid)) {
        map.set(pid, { ...item });
      } else {
        const existing = map.get(pid);
        const newQty = getItemQty(existing) + getItemQty(item);
        existing.qty = newQty;
        map.set(pid, existing);
      }
    });

    return Array.from(map.values());
  };

  // 訂單總額：sum(orderItems.qty * product.price)
  const calcOrderTotal = (order) => {
    if (!order.orderItems) return 0;
    return order.orderItems.reduce(
      (sum, item) => sum + getItemPrice(item) * getItemQty(item),
      0
    );
  };

  // ---------- 載入歷史訂單 ----------

  useEffect(() => {
    const loadHistory = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        setErrorMsg("請先登入再查看歷史訂單");
        return;
      }

      try {
        const res = await fetchOrderHistory(); // { status, message, data }

        if (res.status === 200) {
          console.log("歷史訂單資料:", res.data);
          const validOrders = (res.data || []).filter(
            (o) => o && o.id != null
          );
          setOrders(validOrders);
          setErrorMsg("");
        } else {
          setErrorMsg(res.message || "取得歷史訂單失敗");
        }
      } catch (err) {
        console.error("載入歷史訂單錯誤:", err);
        setErrorMsg(err.message || "取得歷史訂單時發生錯誤");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [isLoggedIn]);

  // ---------- 狀態頁 ----------

  if (loading) {
    return (
      <div className="order-history-container">
        <h1 className="order-history-title">歷史訂單</h1>
        <p>載入中...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="order-history-container">
        <h1 className="order-history-title">歷史訂單</h1>
        <p className="order-history-error">{errorMsg}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-history-container">
        <h1 className="order-history-title">歷史訂單</h1>
        <p>目前尚無訂單紀錄。</p>
      </div>
    );
  }

  // ---------- 主畫面 ----------

  return (
    <div className="order-history-container">
      <h1 className="order-history-title">歷史訂單</h1>

      {orders.map((order) => {
        const orderTotal = calcOrderTotal(order);

        return (
          <div key={order.id} className="order-card">
            {/* 訂單資訊：編號 + 總額 */}
            <div className="order-header">
              <div className="order-number">訂單編號：{order.id}</div>
              <div className="order-total">總金額：${orderTotal}</div>
            </div>

            {/* 該訂單內的商品卡片（已合併同品項） */}
            <div className="order-items-container">
              {mergeOrderItems(order.orderItems)?.map((item, index) => {
                const name = getItemName(item);
                const price = getItemPrice(item);
                const qty = getItemQty(item);
                const subTotal = price * qty;
                const imgSrc = getImageSrc(item);

                return (
                  <div
                    key={`${item.id || "item"}-${index}`}
                    className="order-item-card"
                  >
                    <div className="order-item-image-wrapper">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={name}
                          className="order-item-image"
                        />
                      ) : (
                        <div className="no-image">無圖片</div>
                      )}
                    </div>

                    <div className="order-item-right">
                      <div className="item-name">{name}</div>
                      <div className="item-detail">單價：${price}</div>
                      <div className="item-detail">數量：{qty}</div>
                      <div className="item-detail">小計：${subTotal}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OrderHistory;

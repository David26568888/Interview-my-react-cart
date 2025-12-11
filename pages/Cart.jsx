import React, { useState } from "react";
import "./Cart.css";
import { checkoutCart } from "../services/cartService";

function Cart({ cartItems, removeFromCart, clearCart, isLoggedIn }) {
  const [checkoutMessage, setCheckoutMessage] = useState("");
   
  // 將 product.imageBase64 轉成 <img> 可以用的 src
  const getImageSrc = (product) => {
    if (!product || !product.imageBase64) return null;

    // 若後端已經是 data:image/... 開頭，就直接用
    if (product.imageBase64.startsWith("data:")) {
      return product.imageBase64;
    }

    // 一般情況：只有純 base64，就補前綴
    return `data:image/png;base64,${product.imageBase64}`;
  };

  // 計算總價（記得乘上數量）
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.product.price * item.qty,
    0
  );

  // 結帳處理邏輯
  const handleCheckout = async () => {
    if (!isLoggedIn) {
      setCheckoutMessage("請先登入以提交結帳");
      return;
    }

    if (cartItems.length === 0) {
      setCheckoutMessage("購物車是空的，無法結帳");
      return;
    }

    try {
      const apiResponse = await checkoutCart(cartItems); // 結帳處理服務
      setCheckoutMessage(apiResponse.message || "結帳成功");
      clearCart(); // 清空購物車
    } catch (error) {
      console.error("Error during checkout:", error);
      setCheckoutMessage(error.message || "結帳失敗，請重試");
    }
  };

  return (
    <div className="cart-container">
      <h1>購物車</h1>
      {cartItems.length === 0 ? (
        <p>購物車是空的</p>
      ) : (
        <div className="cart-items">
          <ul>
            {cartItems.map((item, index) => {
              const product = item.product;
              const imgSrc = getImageSrc(product);

              return (
                <li key={index} className="cart-item">
                  <span className="cart-item-main">
                    {/* 商品圖片 */}
                    {imgSrc && (
                      <img
                        src={imgSrc}
                        alt={product.name}
                        className="cart-item-image"
                      />
                    )}

                    {/* 商品文字資訊 */}
                    <span className="cart-item-text">
                      {product.name} - ${product.price} - 數量: {item.qty} - 小計: $
                      {product.price * item.qty}
                    </span>
                  </span>

                  <button
                    className="remove-button"
                    onClick={() => removeFromCart(index)}
                  >
                    移除
                  </button>
                </li>
              );
            })}
          </ul>

          <h3 className="cart-total">總價: ${totalAmount}</h3>

          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={!isLoggedIn}
          >
            提交結帳
          </button>

          {!isLoggedIn && (
            <p className="login-warning">請先登入才能提交結帳。</p>
          )}
        </div>
      )}

      {checkoutMessage && (
        <p className="checkout-message">{checkoutMessage}</p>
      )}
    </div>
  );
}

export default Cart;

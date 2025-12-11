// src/pages/Products.jsx

import React, { useState, useEffect } from "react";
import "./Products.css";
import { fetchProducts, addProduct ,deleteProduct } from "../services/productService";
import { addFavorite, removeFavorite, fetchFavorites } from "../services/favoriteService";

function Products({ addToCart, isLoggedIn, currentUser }) {

  //判斷角色
  const isAdmin = currentUser?.roles?.includes("ROLE_ADMIN");

  const [products, setProducts] = useState([]);

  // 新增商品表單
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductImageBase64, setNewProductImageBase64] = useState("");

  // 關注清單（商品 id 集合，用來控制按鈕狀態）
  const [favorites, setFavorites] = useState(new Set());
  // 關注商品詳細資料，用來顯示「我的關注商品」區塊
  const [favoriteList, setFavoriteList] = useState([]);

  // 分頁 & 搜尋
  const [page, setPage] = useState(0);     // 0-based
  const [size] = useState(6);             // 每頁固定 6 個
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");          // 搜尋輸入框
  const [searchKeyword, setSearchKeyword] = useState(""); // 真正用來查詢的關鍵字

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 圖片 src helper（後端是 base64 or dataURL 都支援）
  const getImageSrc = (productLike) => {
    if (!productLike || !productLike.imageBase64) return null;
    if (productLike.imageBase64.startsWith("data:")) return productLike.imageBase64;
    return `data:image/png;base64,${productLike.imageBase64}`;
  };

  // 從後端載入商品（分頁 + 搜尋）
  const loadProducts = async (pageParam = page, keywordParam = searchKeyword) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetchProducts(pageParam, size, keywordParam);
      // res = { status, message, data: { products, page, size, totalElements, totalPages, last } }

      if (res.status === 200 && res.data) {
        setProducts(res.data.products || []);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
      } else {
        setProducts([]);
        setTotalPages(0);
        setErrorMsg(res.message || "無法取得商品資料");
      }

      // 如果有登入，順便載入關注清單（用於右側清單 + 按鈕狀態）
      if (isLoggedIn) {
        try {
          const favRes = await fetchFavorites();
          if (favRes.status === 200 && favRes.data) {
            const favoriteIds = new Set(favRes.data.map((fav) => fav.id));
            setFavorites(favoriteIds);
            setFavoriteList(favRes.data); // 儲存完整關注商品列表
          } else {
            setFavorites(new Set());
            setFavoriteList([]);
          }
        } catch (e) {
          console.error("載入關注清單失敗:", e);
          setFavoriteList([]);
        }
      } else {
        // 若未登入，清空關注狀態
        setFavorites(new Set());
        setFavoriteList([]);
      }

    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorMsg(error.message || "載入商品時發生錯誤");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // 第一次載入 + 登入狀態改變時重新載入
  useEffect(() => {
    loadProducts(0, searchKeyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // 點「搜尋」時觸發：將輸入框的 keyword 套用為真正查詢條件
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchKeyword(keyword);
    // 每次換關鍵字就從第 0 頁開始
    loadProducts(0, keyword);
  };

  // 換頁
  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return;
    loadProducts(newPage, searchKeyword);
  };

  // 新增商品
  const handleAddProduct = async () => {
    const newProduct = {
      name: newProductName,
      price: parseFloat(newProductPrice),
      imageBase64: newProductImageBase64,
    };

    try {
      const saved = await addProduct(newProduct);
      alert(saved.message || "新增商品成功");
      // 新增後重新載入當前頁（也可以改成跳回第一頁）
      loadProducts(page, searchKeyword);

      // 清空表單
      setNewProductName("");
      setNewProductPrice("");
      setNewProductImageBase64("");
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.message || "新增商品失敗");
    }
  };

  // 上傳圖片轉 base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProductImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

 // 刪除商品
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("確定要刪除這個商品嗎？")) {
      return;
    }

    try {
      const res = await deleteProduct(productId);
      alert(res.message || "刪除商品成功");

      // 方式一：重新載入當前頁
      await loadProducts(page, searchKeyword);

      // 方式二（可選）：直接從前端 state 移除
      // setProducts(products.filter(p => p.id !== productId));

    } catch (error) {
      console.error("刪除商品失敗:", error);
      alert(error.message || "刪除商品失敗");
    }
  };

  // 關注 / 取消關注
  const handleFavoriteToggle = async (productId) => {
    try {
      if (favorites.has(productId)) {
        // 目前已關注 → 要取消
        await removeFavorite(productId);

        // 更新 id 集合
        const updatedIds = new Set(favorites);
        updatedIds.delete(productId);
        setFavorites(updatedIds);

        // 更新關注清單
        const updatedList = favoriteList.filter((item) => item.id !== productId);
        setFavoriteList(updatedList);

      } else {
        // 目前未關注 → 要新增關注
        await addFavorite(productId);

        // 更新 id 集合
        const updatedIds = new Set(favorites);
        updatedIds.add(productId);
        setFavorites(updatedIds);

        // 從目前商品列表中找出這個商品，加入關注清單
        const product = products.find((p) => p.id === productId);
        if (product) {
          setFavoriteList((prev) => {
            if (prev.some((p) => p.id === product.id)) {
              return prev;
            }
            return [...prev, product];
          });
        } else {
          // 若不在當前頁，可重新查 favorites
          try {
            const favRes = await fetchFavorites();
            if (favRes.status === 200 && favRes.data) {
              setFavoriteList(favRes.data);
            }
          } catch (e) {
            console.error("重新載入關注清單失敗:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert(error.message || "變更關注狀態失敗");
    }
  };

  

  return (
    <div className="products-container">

      {/* 🔍 最上方：置中搜尋區塊 */}
      <div className="search-bar search-bar-center">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="搜尋商品名稱..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">搜尋</button>
        </form>
      </div>

      {/* 🧱 搜尋列下：三欄併排（左：新增，中：商品，右：關注） */}
      <div className="main-layout">
        {/* 左邊：新增商品（登入才顯示） */}
        {isAdmin&& (
          <div className="side-column add-product-form">
            <h2>新增商品</h2>
            <input
              type="text"
              placeholder="商品名稱"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
            />
            <input
              type="number"
              placeholder="價格"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <button onClick={handleAddProduct}>新增商品</button>
          </div>
        )}

        {/* 中間：商品列表（卡片＋分頁） */}
        <div className="center-column">
          <div className="product-list-card">
            <h1>商品列表</h1>

            {loading && <p>載入中...</p>}
            {errorMsg && <p className="error-text">{errorMsg}</p>}

            {!loading && products.length === 0 && !errorMsg && (
              <p>無商品資料...</p>
            )}

            <div className="product-card-grid">
              {products.map((product) => {
                const imgSrc = getImageSrc(product);
                const isFav = favorites.has(product.id);

                return (
                  <div key={product.id} className="product-card">
                    <div className="product-image-wrapper">
                      {imgSrc ? (
                        <img src={imgSrc} alt={product.name} className="product-image" />
                      ) : (
                        <div className="no-image">無圖片</div>
                      )}
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-price">${product.price}</p>
                    </div>
                    <div className="product-actions">
                      {isLoggedIn && (
                        <>
                          <button onClick={() => addToCart(product)}>
                            加入購物車
                          </button>
                          <button
                            className={`favorite-button ${isFav ? "unfollow" : "follow"}`}
                            onClick={() => handleFavoriteToggle(product.id)}
                          >
                            {isFav ? "移除關注" : "加入關注"}
                          </button>
                      {/* 刪除商品按鈕 判斷isAdmin 才顯示 ） */}
                          {isAdmin && (
                              <button
                                className="delete-button"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                刪除
                              </button>
                            )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 分頁控制區 */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                >
                  上一頁
                </button>
                <span>
                  第 {page + 1} / {totalPages} 頁
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page + 1 >= totalPages}
                >
                  下一頁
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 右邊：我的關注商品（登入才顯示） */}
        {isLoggedIn && (
          <div className="side-column favorite-section">
            <h2>我的關注商品</h2>
            {favoriteList.length === 0 ? (
              <p>目前沒有關注任何商品</p>
            ) : (
              <ul>
                {favoriteList.map((item) => {
                  const imgSrc = getImageSrc(item);
                  return (
                    <li key={item.id}>
                      {imgSrc && <img src={imgSrc} alt={item.name} />}
                      <span>
                        {item.name} - ${item.price}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;

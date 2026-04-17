import CryptoJS from 'crypto-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  const getCartKey = () => user ? `dvn_cart_${user.username}` : 'dvn_cart_guest';

  // Chạy mỗi khi user đổi (đăng nhập / đăng xuất) => Load lại giỏ hàng của chính user đó từ LocalStorage
  useEffect(() => {
    const cartKey = getCartKey();
    const saved = localStorage.getItem(cartKey);
    if (saved) {
      if (saved.startsWith('[')) {
        try { setCartItems(JSON.parse(saved)); return; } catch (e) { setCartItems([]); return; }
      }
      try {
        const bytes = CryptoJS.AES.decrypt(saved, SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        setCartItems(JSON.parse(decryptedData));
      } catch (e) {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [user]);

  useEffect(() => {
    const cartKey = getCartKey();
    if (cartItems.length === 0) {
      localStorage.removeItem(cartKey);
    } else {
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(cartItems), SECRET_KEY).toString();
      localStorage.setItem(cartKey, encryptedData);
    }
  }, [cartItems, user]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id) => setCartItems((prev) => prev.filter((item) => item.id !== id));

  const updateQuantity = (id, quantity) =>
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  const cartCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

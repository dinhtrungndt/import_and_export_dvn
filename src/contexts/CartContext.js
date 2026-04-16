import React, { createContext, useContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const CartContext = createContext();
const SECRET_KEY = 'dvnvlxd_cart_obfuscation_key_2026';

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('dvn_cart');
    if (saved) {
      if (saved.startsWith('[')) {
        try { return JSON.parse(saved); } catch (e) { return []; }
      }
      try {
        const bytes = CryptoJS.AES.decrypt(saved, SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(cartItems), SECRET_KEY).toString();
    localStorage.setItem('dvn_cart', encryptedData);
  }, [cartItems]);

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

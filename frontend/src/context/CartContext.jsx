import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  console.log('CartProvider loaded!', cartItems);

  // โหลดตะกร้าจาก localStorage เมื่อเริ่มต้น
  useEffect(() => {
    console.log('Loading cart from localStorage...');
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
        console.log('Cart loaded:', JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
  }, []);

  // บันทึกตะกร้าลง localStorage ทุกครั้งที่เปลี่ยน
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // เพิ่มสินค้าลงตะกร้า
  const addToCart = (product, quantity = 1, variant = null) => {
    console.log('addToCart called:', product.name, quantity); // ย้ายมาบรรทัดแรก
    
    const existingItemIndex = cartItems.findIndex(
      item => item.id === product.id && JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existingItemIndex > -1) {
      // มีสินค้าอยู่แล้ว เพิ่มจำนวน
      const newCartItems = [...cartItems];
      newCartItems[existingItemIndex].quantity += quantity;
      newCartItems[existingItemIndex].selected = true;
      setCartItems(newCartItems);
      console.log('Updated existing item:', newCartItems);
    } else {
      // สินค้าใหม่
      const newItem = {
        ...product,
        quantity,
        variant,
        selected: true,
        cartItemId: Date.now() + Math.random()
      };
      console.log('Added new item:', newItem); // ย้ายมาหลังสร้าง newItem
      setCartItems([...cartItems, newItem]);
    }
  };

  // ลบสินค้าออกจากตะกร้า
  const removeFromCart = (cartItemId) => {
    setCartItems(cartItems.filter(item => item.cartItemId !== cartItemId));
  };

  // อัพเดทจำนวนสินค้า
  const updateQuantity = (cartItemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems(cartItems.map(item =>
      item.cartItemId === cartItemId
        ? { ...item, quantity }
        : item
    ));
  };

  // ล้างตะกร้า
  const clearCart = () => {
    setCartItems([]);
  };

  // เลือก/ยกเลิกเลือกสินค้า
  const toggleSelectItem = (cartItemId) => {
    setCartItems(cartItems.map(item =>
      item.cartItemId === cartItemId
        ? { ...item, selected: !item.selected }
        : item
    ));
  };

  // เลือกทั้งหมด
  const selectAll = (selected) => {
    setCartItems(cartItems.map(item => ({ ...item, selected })));
  };

  // คำนวณราคารวม
  const getTotal = () => {
    return cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // นับจำนวนสินค้าทั้งหมด
  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // นับจำนวนสินค้าที่เลือก
  const getSelectedCount = () => {
    return cartItems.filter(item => item.selected).length;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleSelectItem,
    selectAll,
    getTotal,
    getItemCount,
    getSelectedCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
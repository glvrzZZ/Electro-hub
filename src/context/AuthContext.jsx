import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedCart = localStorage.getItem('cart');

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedCart) setCart(JSON.parse(storedCart));
    } catch (err) {
      console.error('Ошибка чтения из localStorage:', err);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (err) {
        console.error('Ошибка записи в localStorage:', err);
      }
    }
  }, [cart, loading]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  };

  const addToCart = (product, quantity = 1) => {
    if (loading) return; 
    if (quantity <= 0) return;

    setCart(prev => {
      const index = prev.findIndex(item => item.product.product_id === product.product_id);
      if (index !== -1) {
        
        return prev.map((item, i) =>
          i === index
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    if (loading) return;
    setCart(prev => prev.filter(item => item.product.product_id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (loading) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item.product.product_id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  return (
    <AuthContext.Provider value={{
      user,
      cart,
      loading,
      login,
      logout,
      addToCart,
      removeFromCart,
      updateQuantity
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

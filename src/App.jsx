import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from './styles/theme'; 

import { useAuth } from './context/AuthContext'; 

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Product from './pages/Product';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Login from './pages/Login'; 
import Profile from './pages/Profile'; 

import { AuthProvider } from './context/AuthContext'; 
import FlyingStars from './components/FlyingStars'; 
function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <FlyingStars /> {/* Звезды на фоне */}
        <MainLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}

const MainLayout = () => {
  const { cart, addToCart, removeFromCart, updateQuantity } = useAuth();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0); // Подсчитываем количество товаров в корзине

  return (
    <>
      <Navbar cartItemCount={cartItemCount} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product addToCart={addToCart} />} />
        <Route path="/cart" element={<CartPage cartItems={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} /> {/* Страница логина */}
        <Route path="/profile" element={<Profile />} /> {/* Страница профиля */}
      </Routes>
    </>
  );
}

export default App;

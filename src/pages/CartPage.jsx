import React from 'react';
import { useAuth } from '../context/AuthContext'; // путь подставь свой
import Cart from '../components/Cart';
import DeliveryOptions from '../components/DeliveryOptions';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useAuth();

  return (
    <div style={{ padding: '20px 0', color: '#fff', backgroundColor: '#121212', minHeight: '100vh' }}>
      <Cart 
        cartItems={cart} 
        removeFromCart={removeFromCart} 
        updateQuantity={updateQuantity} 
      />

      {cart.length > 0 && (
        <>
          <DeliveryOptions />
          <div style={{ marginTop: '30px', textAlign: 'right' }}>
            <Link
              to="/checkout"
              style={{
                display: 'inline-block',
                padding: '12px 30px',
                backgroundColor: '#00ffea',
                color: '#000',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
              }}
            >
              Оформить заказ
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;

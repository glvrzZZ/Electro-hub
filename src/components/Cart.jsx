import React from 'react';

export default function Cart({ cartItems, removeFromCart, updateQuantity }) {
  // Вычисляем общую стоимость товаров в корзине
  const total = cartItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  return (
    <div
      style={{
        maxWidth: 800,
        margin: '0 auto',
        color: '#fff', // Белый цвет текста для контраста с темным фоном
        backgroundColor: '#1e1e1e', // Темный фон для контейнера корзины
        padding: 20,
        borderRadius: 8,
        boxShadow: '0 0 10px rgba(0,0,0,0.7)',
      }}
    >
      <h2 style={{ marginBottom: 20 }}>Корзина</h2>

      {cartItems.length === 0 ? (
        <p style={{ fontSize: 18, textAlign: 'center' }}>Ваша корзина пуста.</p>
      ) : (
        <>
          {cartItems.map(({ product, quantity }) => (
            <div
              key={product.product_id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                paddingBottom: 15,
                borderBottom: '1px solid #444',
              }}
            >
              <div>
                <strong style={{ fontSize: 18 }}>{product.name}</strong>
                <br />
                <span style={{ color: '#aaa' }}>
                  Цена: {product.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  max={product.stock_quantity}
                  onChange={(e) => updateQuantity(product.product_id, Number(e.target.value))}
                  style={{
                    width: 60,
                    padding: '6px 8px',
                    borderRadius: 4,
                    border: '1px solid #555',
                    backgroundColor: '#2c2c2c',
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: 16,
                  }}
                />
                <button
                  onClick={() => removeFromCart(product.product_id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ff4d4d',
                    border: 'none',
                    borderRadius: 4,
                    color: '#fff',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ff1a1a'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff4d4d'}
                  aria-label={`Удалить ${product.name} из корзины`}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}

          <hr style={{ borderColor: '#444' }} />

          <h3 style={{ textAlign: 'right', marginTop: 20 }}>
            Итого: {total.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
          </h3>
        </>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Button, Radio, FormControlLabel, Paper } from '@mui/material';

const DeliveryOptions = () => {
  const options = [
    { id: 1, name: "Самовывоз", price: 0, time: "1-2 дня", details: "Заберёте из нашего магазина по адресу..." },
    { id: 2, name: "Курьером", price: 500, time: "1 день", details: "Доставка курьером до двери" },
    { id: 3, name: "Почта России", price: 300, time: "3-7 дней", details: "Отправка почтой с номером отслеживания" }
  ];

  const [selectedOption, setSelectedOption] = useState(1);

  return (
    <Paper 
      elevation={3} 
      style={{ 
        padding: 20, 
        margin: '20px 0', 
        backgroundColor: '#222',  // тёмный фон
        color: '#eee',            // светлый текст чуть светлее
        borderRadius: 8,
      }}
    >
      <h3 style={{ marginBottom: 20, color: '#fff' }}>Варианты доставки</h3>
      
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {options.map(option => (
          <Paper 
            key={option.id}
            elevation={selectedOption === option.id ? 6 : 1}
            style={{ 
              padding: 20,
              flex: '1 1 200px',
              cursor: 'pointer',
              border: selectedOption === option.id ? '2px solid #1976d2' : '1px solid #444',
              backgroundColor: selectedOption === option.id ? '#333' : '#222',
              color: '#eee',
              transition: 'all 0.3s ease',
              borderRadius: 6,
            }}
            onClick={() => setSelectedOption(option.id)}
          >
            <FormControlLabel
              control={
                <Radio 
                  checked={selectedOption === option.id} 
                  style={{ color: '#1976d2' }} 
                  onChange={() => setSelectedOption(option.id)}
                />
              }
              label={
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: 16 }}>{option.name}</div>
                  <div style={{ marginTop: 4 }}>{option.price === 0 ? 'Бесплатно' : `${option.price} ₽`}</div>
                  <div style={{ color: '#aaa', fontSize: '0.9rem', marginTop: 2 }}>{option.time}</div>
                </div>
              }
              labelPlacement="end"
              style={{ width: '100%' }}
            />
            
            {selectedOption === option.id && (
              <div style={{ marginTop: 10, fontSize: '0.9rem', color: '#bbb' }}>
                {option.details}
              </div>
            )}
          </Paper>
        ))}
      </div>
      
      <Button
        variant="contained"
        style={{ 
          backgroundColor: '#1976d2',  // синий акцент
          color: '#fff',
          marginTop: 20,
          borderRadius: 6,
          textTransform: 'none',       // чтобы текст кнопки не был капсом
          fontWeight: 'bold',
        }}
      >
        Подтвердить выбор доставки
      </Button>
    </Paper>
  );
};

export default DeliveryOptions;

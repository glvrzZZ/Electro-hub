import React from 'react';
import { Button, Paper, Typography } from '@mui/material';

const InstallmentOptions = ({ price }) => {
  const options = [
    { months: 3, percent: 0, bank: 'Сбербанк' },
    { months: 6, percent: 5, bank: 'Тинькофф' },
    { months: 12, percent: 10, bank: 'Альфа-Банк' }
  ];

  const [selectedOption, setSelectedOption] = React.useState(null);

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px 0', border: '1px solid #000' }}>
      <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
        Варианты рассрочки
      </Typography>
      
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '20px' }}>
        {options.map((option, index) => {
          const monthlyPayment = (price * (1 + option.percent/100)) / option.months;
          
          return (
            <Paper
              key={index}
              elevation={selectedOption === index ? 3 : 1}
              style={{ 
                padding: '15px',
                flex: '1 1 200px',
                cursor: 'pointer',
                border: selectedOption === index ? '2px solid #000' : '1px solid #ddd'
              }}
              onClick={() => setSelectedOption(index)}
            >
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                {option.months} месяцев
              </Typography>
              <Typography variant="body2" style={{ margin: '8px 0' }}>
                {option.percent > 0 ? `Переплата ${option.percent}%` : 'Без переплаты'}
              </Typography>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                {Math.round(monthlyPayment).toLocaleString()} ₽/мес
              </Typography>
              <Typography variant="caption" display="block" style={{ marginTop: '8px' }}>
                {option.bank}
              </Typography>
            </Paper>
          );
        })}
      </div>
      
      {selectedOption !== null && (
        <Button
          variant="contained"
          fullWidth
          style={{ 
            backgroundColor: '#000',
            color: '#fff',
            marginTop: '20px',
            padding: '10px'
          }}
        >
          Оформить рассрочку {options[selectedOption].months} мес.
        </Button>
      )}
    </Paper>
  );
};

export default InstallmentOptions;
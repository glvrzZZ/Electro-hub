import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, List, ListItem, ListItemText, Button } from '@mui/material';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    
    const userData = { name: 'Иван Иванов', email: 'ivan@mail.com' }; 
    setUser(userData);

    
    const userOrders = [
      { id: 1, date: '2025-05-01', total: '5000 руб.' },
      { id: 2, date: '2025-06-10', total: '2500 руб.' }
    ];
    setOrders(userOrders);

    
    const userAddresses = [
      { id: 1, address: 'г. Санкт-Петербург, ул. Электронная, д. 5' },
      { id: 2, address: 'г. Москва, ул. Технопарковая, д. 15' }
    ];
    setAddresses(userAddresses);
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Профиль
      </Typography>
      {user ? (
        <>
          <Typography variant="h6">Добро пожаловать, {user.name}!</Typography>
          <Typography variant="body1">Email: {user.email}</Typography>

          <Paper sx={{ p: 2, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              История заказов
            </Typography>
            <List>
              {orders.map(order => (
                <ListItem key={order.id}>
                  <ListItemText
                    primary={`Заказ от ${order.date}`}
                    secondary={`Сумма: ${order.total}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 2, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Адреса доставки
            </Typography>
            <List>
              {addresses.map(address => (
                <ListItem key={address.id}>
                  <ListItemText primary={address.address} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </>
      ) : (
        <Typography variant="body1">Загрузка...</Typography>
      )}

      <Box mt={4}>
        <Button variant="contained" color="secondary" href="/" fullWidth>
          Назад на главную
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;

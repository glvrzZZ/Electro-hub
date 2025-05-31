import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

const Layout = () => (
  <>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ElectroHubb
        </Typography>
        <Button color="inherit" component={Link} to="/product/1">
          Товары
        </Button>
        <Button color="inherit" component={Link} to="/cart">
          Корзина
        </Button>
      </Toolbar>
    </AppBar>

    <Container maxWidth="lg" sx={{ mt: 4, minHeight: '80vh' }}>
      <Outlet />
    </Container>
  </>
);

export default Layout;

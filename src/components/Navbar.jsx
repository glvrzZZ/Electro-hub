import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Menu, MenuItem, IconButton, Tooltip, Badge, AppBar, Toolbar } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, cart } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const starsContainerRef = useRef(null);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const open = Boolean(anchorEl);

  const handleMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    handleMenuClose();
    navigate('/');
  }, [logout, navigate, handleMenuClose]);

  // Generate random stars for background animation
  useEffect(() => {
    const container = starsContainerRef.current;
    const stars = [];
    const numStars = 60;

    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.style.position = 'absolute';
      star.style.width = '2px';
      star.style.height = '2px';
      star.style.backgroundColor = 'white';
      star.style.borderRadius = '50%';
      star.style.opacity = Math.random() * 0.6 + 0.3;
      star.style.top = Math.random() * 100 + '%';
      star.style.left = Math.random() * 100 + '%';
      star.style.animation = `flyStar ${5 + Math.random() * 5}s linear infinite`;
      star.style.animationDelay = `${Math.random() * 10}s`;
      container.appendChild(star);
      stars.push(star);
    }

    return () => {
      stars.forEach(star => container.removeChild(star));
    };
  }, []);

  return (
    <>
      <div
        ref={starsContainerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      />
      <style>{`
        @keyframes flyStar {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(150px, -150px);
            opacity: 0;
          }
        }
      `}</style>

      <AppBar position="sticky" sx={{ backgroundColor: '#000', zIndex: 1200 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: 24 }}>
            ElectroHubb
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/cart" aria-label="Корзина" style={{ color: '#fff', textDecoration: 'none' }}>
              <Badge badgeContent={cartItemCount} color="error" overlap="circular">
                <ShoppingCartIcon fontSize="large" />
              </Badge>
            </Link>

            {user ? (
              <>
                <Tooltip title="Аккаунт">
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{ color: 'white' }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <AccountCircleIcon fontSize="large" />
                  </IconButton>
                </Tooltip>

                <Menu
                  id="account-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  MenuListProps={{
                    'aria-labelledby': 'account-button',
                    onKeyDown: (e) => {
                      if (e.key === 'Tab') {
                        e.preventDefault();
                        handleMenuClose();
                      }
                    }
                  }}
                >
                  <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                    Профиль
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/orders'); handleMenuClose(); }}>
                    История заказов
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                </Menu>
              </>
            ) : (
              <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: 16 }}>
                Войти
              </Link>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}

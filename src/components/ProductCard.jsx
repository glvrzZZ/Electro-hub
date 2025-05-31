import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Button
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useAuth();

  const {
    product_id,
    name,
    price,
    old_price,
    average_rating,
    main_image
  } = product;

  if (!product_id) {
    console.warn('❌ Нет product_id в product:', product);
    return null;
  }

  return (
    <Card
      className="product-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        color: '#000',
        border: '1px solid #000',
        borderRadius: '10px',
        boxShadow: 'none'
      }}
    >
      <CardActionArea
        component={Link}
        to={`/product/${product_id}`}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          textDecoration: 'none'
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={main_image || '/placeholder-product.jpg'}
          alt={name}
          sx={{
            objectFit: 'contain',
            backgroundColor: '#f5f5f5'
          }}
        />
        <CardContent sx={{ flexGrow: 1, padding: 2 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            noWrap
            className="product-title"
            sx={{ color: '#000', fontWeight: 600 }}
          >
            {name}
          </Typography>

          <Box display="flex" alignItems="center" mb={1}>
            <Typography
              variant="h6"
              sx={{ color: '#000', fontWeight: 700, marginRight: 1 }}
            >
              {price.toLocaleString('ru-RU')} ₽
            </Typography>
            {old_price && (
              <Typography
                variant="body2"
                sx={{
                  color: '#555',
                  textDecoration: 'line-through'
                }}
              >
                {old_price.toLocaleString('ru-RU')} ₽
              </Typography>
            )}
          </Box>

          <Rating
            value={average_rating || 0}
            precision={0.5}
            readOnly
            size="small"
            sx={{ color: '#000' }}
          />
        </CardContent>
      </CardActionArea>

      <Box sx={{ padding: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => addToCart(product, 1)}
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: '25px',
            padding: '10px',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#333'
            }
          }}
        >
          В корзину
        </Button>
      </Box>
    </Card>
  );
};

export default ProductCard;

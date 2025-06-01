import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Rating,
  Chip,
  CircularProgress,
  Button,
  Tabs,
  Tab,
  TextField,
  Container,
  IconButton
} from '@mui/material';
import { Add, Remove, Favorite } from '@mui/icons-material';
import { fetchProductDetails } from '../utils/api';
import { ProductAttributes } from '../components/ProductAttributes';
import { ProductReviews } from '../components/ProductReviews';
import DeliveryOptions from '../components/DeliveryOptions';
import InstallmentOptions from '../components/InstallmentOptions';

const Product = ({ addToCart }) => {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  
  const productImageRef = useRef(null);

  useEffect(() => {
    const loadProductData = async () => {
      if (!id || isNaN(Number(id))) {
        setError('Неверный идентификатор товара');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchProductDetails(id);
        setProductData(data);
        setQuantity(1);
        setSelectedImage(0);
        setError(null);
      } catch (err) {
        setError(err.message || 'Ошибка при загрузке данных товара');
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
  }, [id]);

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        {error}
      </Typography>
    );
  }

  if (loading || !productData) {
    return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
  }

  const {
    product = {},
    attributes = [],
    reviews = [],
    images = []
  } = productData || {};

  const {
    name = 'Без названия',
    description = '',
    price = 0,
    old_price,
    sku = '—',
    category_name = '',
    manufacturer_name = '',
    average_rating = 0,
    stock_quantity = 0,
    product_id
  } = product || {};

  const formatPrice = (value) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(value);

  const formattedPrice = formatPrice(price);
  const formattedOldPrice = old_price ? formatPrice(old_price) : null;

  const handleQuantityChange = (val) => {
    let number = Number(val);
    if (isNaN(number)) number = 1;
    number = Math.max(1, Math.min(stock_quantity, number));
    setQuantity(number);
  };

  
  const animateFlyToCart = () => {
    const cartIcon = document.getElementById('cart-icon');
    const image = productImageRef.current;
    if (!cartIcon || !image) return;

    const imageRect = image.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyingImage = image.cloneNode(true);
    flyingImage.style.position = 'fixed';
    flyingImage.style.left = `${imageRect.left}px`;
    flyingImage.style.top = `${imageRect.top}px`;
    flyingImage.style.width = `${imageRect.width}px`;
    flyingImage.style.height = `${imageRect.height}px`;
    flyingImage.style.transition = 'all 0.7s ease-in-out';
    flyingImage.style.zIndex = 1000;
    flyingImage.style.borderRadius = '8px';
    flyingImage.style.pointerEvents = 'none';
    flyingImage.style.opacity = '1';

    document.body.appendChild(flyingImage);

    requestAnimationFrame(() => {
      flyingImage.style.left = `${cartRect.left + cartRect.width / 2 - imageRect.width / 4}px`;
      flyingImage.style.top = `${cartRect.top + cartRect.height / 2 - imageRect.height / 4}px`;
      flyingImage.style.width = `${imageRect.width / 2}px`;
      flyingImage.style.height = `${imageRect.height / 2}px`;
      flyingImage.style.opacity = '0.5';
      flyingImage.style.transform = 'rotate(20deg)';
    });

    flyingImage.addEventListener('transitionend', () => {
      flyingImage.remove();
    });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    animateFlyToCart();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 2 }}>
            <CardMedia
              ref={productImageRef} 
              component="img"
              height="500"
              image={(images && images[selectedImage]?.image_url) || '/placeholder-product.jpg'}
              alt={name}
              sx={{ objectFit: 'contain', p: 2, bgcolor: '#f5f5f5' }}
            />
          </Card>
          <Grid container spacing={1}>
            {Array.isArray(images) && images.length > 0 ? (
              images
                .filter(Boolean)
                .map((img, index) => (
                  <Grid item key={img?.image_id ?? index}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: index === selectedImage ? '2px solid #1976d2' : '1px solid transparent',
                        '&:hover': { borderColor: '#1976d2' }
                      }}
                      onClick={() => setSelectedImage(index)}
                    >
                      <CardMedia
                        component="img"
                        height="80"
                        image={img?.image_url || '/placeholder-product.jpg'}
                        alt={`Изображение ${index + 1}`}
                        sx={{ objectFit: 'contain' }}
                      />
                    </Card>
                  </Grid>
                ))
            ) : (
              <Grid item xs={12}>
                <Typography>Изображения отсутствуют</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h3" gutterBottom>
            {name}
          </Typography>

          <Box display="flex" alignItems="center" mb={2}>
            <Rating value={Number(average_rating)} precision={0.5} readOnly />
            <Typography variant="body1" ml={1} color="text.secondary">
              {average_rating ? Number(average_rating).toFixed(1) : 'Нет оценок'} ({reviews.length} отзыв
              {reviews.length === 1 ? '' : 'ов'})
            </Typography>
          </Box>

          <Box mb={3}>
            <Box display="flex" alignItems="center">
              <Typography variant="h3" color="primary" mr={2}>
                {formattedPrice}
              </Typography>
              {formattedOldPrice && (
                <Typography variant="h5" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                  {formattedOldPrice}
                </Typography>
              )}
            </Box>
            <Chip label={`Артикул: ${sku}`} size="small" />
          </Box>

          <Box mb={3}>
            {category_name && <Chip label={category_name} color="primary" sx={{ mr: 1, mb: 1 }} />}
            {manufacturer_name && <Chip label={manufacturer_name} color="secondary" sx={{ mb: 1 }} />}
          </Box>

          <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
            {description}
          </Typography>

          <Box display="flex" alignItems="center" mb={3}>
            <Typography variant="body1" mr={2}>
              Количество:
            </Typography>
            <IconButton onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1}>
              <Remove />
            </IconButton>
            <TextField
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              type="number"
              inputProps={{ min: 1, max: stock_quantity }}
              sx={{ width: 80, mx: 1 }}
            />
            <IconButton onClick={() => setQuantity((q) => Math.min(stock_quantity, q + 1))} disabled={quantity >= stock_quantity}>
              <Add />
            </IconButton>
            <Typography variant="body2" color="text.secondary" ml={2}>
              В наличии: {stock_quantity} шт.
            </Typography>
          </Box>

          <Box display="flex" gap={2} mb={4}>
            <Button
              variant="contained"
              size="large"
              sx={{ flex: 2 }}
              disabled={stock_quantity === 0}
              onClick={handleAddToCart}
            >
              {stock_quantity > 0 ? 'Добавить в корзину' : 'Нет в наличии'}
            </Button>
            <Button variant="outlined" size="large" sx={{ flex: 1 }} startIcon={<Favorite />}>
              В избранное
            </Button>
          </Box>

          <DeliveryOptions />
          <InstallmentOptions price={price} />
        </Grid>

        <Grid item xs={12}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
            <Tab label="Характеристики" />
            <Tab label="Отзывы" />
            <Tab label="Описание" />
          </Tabs>

          {activeTab === 0 && <ProductAttributes attributes={attributes} />}
          {activeTab === 1 && <ProductReviews reviews={reviews} productId={product_id} />}
          {activeTab === 2 && (
            <Typography variant="body1" whiteSpace="pre-wrap">
              {description}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Product;

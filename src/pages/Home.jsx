import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { fetchCategories, fetchManufacturers, fetchProducts } from '../utils/api';
import { Box, Grid, Pagination, CircularProgress, Typography, Container, useMediaQuery, useTheme } from '@mui/material';
import CategoryGrid from '../components/CategoryGrid';
import FlyingStars from '../components/FlyingStars';
import { useAuth } from '../context/AuthContext'; // Импортируем контекст аутентификации

const CATEGORY_ICONS = {
  'Смартфоны': '📱',
  'Ноутбуки': '💻',
  'Телевизоры': '📺',
  'Наушники': '🎧',
  'Фотоаппараты': '📷',
  'Планшеты': '📋',
  'Игровые консоли': '🎮',
  'Умные часы': '⌚',
  'Аксессуары': '🔌'
};

const INITIAL_FILTERS = {
  search: '',
  category: '',
  manufacturer: '',
  min_price: '',
  max_price: '',
  sort: '',
  page: 1,
  limit: 12
};

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { addToCart } = useAuth(); // Получаем функцию для добавления в корзину
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const loadInitialData = useCallback(async () => {
    try {
      const [cats, mans] = await Promise.all([fetchCategories(), fetchManufacturers()]);
      const categoriesWithIcons = cats.map(category => ({
        ...category,
        icon: CATEGORY_ICONS[category.name] || '📦'
      }));

      setCategories(categoriesWithIcons);
      setManufacturers(mans);
    } catch (err) {
      console.error('Ошибка загрузки категорий и производителей:', err);
      setError('Ошибка загрузки данных. Пожалуйста, обновите страницу.');
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { products: fetchedProducts, totalPages } = await fetchProducts(filters);
      setProducts(fetchedProducts);
      setTotalPages(totalPages);
      setError(null);

      // Автоматически определяем минимальные и максимальные цены товаров
      if (!filters.min_price && !filters.max_price && fetchedProducts.length) {
        const prices = fetchedProducts.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
      }
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
      setError('Ошибка при загрузке товаров. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filters, loadProducts]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : prev.page
    }));
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    setPriceRange([0, 100000]);
  };

  const handlePageChange = (_, value) => {
    setFilters(prev => ({ ...prev, page: value }));
  };

  const handleCategorySelect = (categoryId) => {
    setFilters(prev => ({
      ...prev,
      category: categoryId,
      page: 1
    }));
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  // ✅ Отображение ошибки
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh" sx={{ backgroundColor: '#121212', color: '#ff4d4f', px: 3, zIndex: 2 }}>
        <Typography variant="h6" textAlign="center" sx={{ color: '#ff4d4f' }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#121212', color: '#fff', pt: isMobile ? 2 : 4, pb: 6 }}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        <FlyingStars />
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, flexGrow: 1 }}>
        {/* Категории */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: '#fff' }}>
            Популярные категории
          </Typography>
          <CategoryGrid categories={categories} selectedCategory={filters.category} onSelect={handleCategorySelect} />
        </Box>

        {/* Фильтры */}
        <ProductFilters
          categories={categories}
          manufacturers={manufacturers}
          filters={filters}
          priceRange={priceRange}
          onPriceChange={(newRange) => {
            setPriceRange(newRange);
            handleFilterChange('min_price', newRange[0]);
            handleFilterChange('max_price', newRange[1]);
          }}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Список товаров */}
        {loading ? (
          <Box display="flex" justifyContent="center" my={6}>
            <CircularProgress size={isMobile ? 50 : 70} color="inherit" />
          </Box>
        ) : products.length === 0 ? (
          <Box textAlign="center" my={6}>
            <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
              Товары не найдены
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Попробуйте изменить параметры фильтрации
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={isMobile ? 2 : 3}>
              {products.map((product) => (
                <Grid item key={product.product_id} xs={12} sm={6} md={3} lg={3}>
                  <ProductCard product={product} onAddToCart={() => handleAddToCart(product)} />
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={5} mb={3}>
                <Pagination
                  count={totalPages}
                  page={filters.page}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

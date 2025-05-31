import React, { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Slider,
  Chip,
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { FilterAlt, ExpandMore, ExpandLess } from '@mui/icons-material';

const ProductFilters = ({
  categories = [],
  manufacturers = [],
  filters = {},
  priceRange = [0, 100000],
  onFilterChange,
  onReset,
  onPriceChange
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  const handleReset = () => {
    onReset();
    setIsExpanded(false);
  };

  const removeFilter = (filterName) => {
    switch (filterName) {
      case 'search':
        onFilterChange('search', '');
        break;
      case 'category':
        onFilterChange('category', '');
        break;
      case 'manufacturer':
        onFilterChange('manufacturer', '');
        break;
      case 'price':
        onFilterChange('min_price', '');
        onFilterChange('max_price', '');
        break;
      case 'sort':
        onFilterChange('sort', '');
        break;
      default:
        break;
    }
  };

  const activeFilters = [
    ...(filters.search ? ['search'] : []),
    ...(filters.category ? ['category'] : []),
    ...(filters.manufacturer ? ['manufacturer'] : []),
    ...((filters.min_price || filters.max_price) ? ['price'] : []),
    ...(filters.sort ? ['sort'] : [])
  ];

  const formatPrice = (value) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <Box sx={{ mb: 4, backgroundColor: '#000', borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
      {/* Заголовок */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={2}
        sx={{
          backgroundColor: '#111',
          color: '#fff',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onClick={() => isMobile && setIsExpanded(!isExpanded)}
      >
        <Box display="flex" alignItems="center">
          <FilterAlt sx={{ mr: 1, color: '#fff' }} />
          <Typography variant="h6" sx={{ color: '#fff' }}>Фильтры товаров</Typography>
        </Box>
        {isMobile && (
          <IconButton sx={{ color: '#fff' }}>
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </Box>

      {/* Активные фильтры */}
      {activeFilters.length > 0 && (
        <Box p={2} borderBottom="1px solid #444" sx={{ backgroundColor: '#111' }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: '#fff' }}>
            Активные фильтры:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {activeFilters.map(filter => (
              <Chip
                key={filter}
                label={
                  filter === 'category' ? `Категория: ${categories.find(c => c.category_id === filters.category)?.name || ''}` :
                  filter === 'manufacturer' ? `Производитель: ${manufacturers.find(m => m.manufacturer_id === filters.manufacturer)?.name || ''}` :
                  filter === 'price' ? `Цена: ${formatPrice(filters.min_price || 0)} - ${formatPrice(filters.max_price || 100000)}` :
                  filter === 'sort' ? `Сортировка: ${getSortLabel(filters.sort)}` :
                  `Поиск: ${filters.search}`
                }
                onDelete={() => removeFilter(filter)}
                variant="outlined"
                sx={{
                  color: '#fff',
                  borderColor: '#fff',
                  '& .MuiChip-deleteIcon': {
                    color: '#fff',
                  }
                }}
              />
            ))}
            <Button size="small" onClick={handleReset} variant="outlined" sx={{ color: '#fff', borderColor: '#fff' }}>
              Сбросить все
            </Button>
          </Box>
        </Box>
      )}

      {/* Контент фильтрации */}
      <Collapse in={isExpanded || !isMobile}>
        <Box p={2}>
          <Grid container spacing={2}>
            {/* Поиск */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Поиск по названию"
                value={filters.search || ''}
                onChange={(e) => onFilterChange('search', e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  sx: { backgroundColor: '#222', color: '#fff' }
                }}
                InputLabelProps={{
                  sx: { color: '#ccc' }
                }}
              />
            </Grid>

            {/* Категория */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel sx={{ color: '#ccc' }}>Категория</InputLabel>
                <Select
                  value={filters.category || ''}
                  onChange={(e) => onFilterChange('category', e.target.value)}
                  label="Категория"
                  sx={{ backgroundColor: '#222', color: '#fff' }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: '#fff',
                        color: '#000',
                      }
                    }
                  }}
                >
                  <MenuItem value="">Все категории</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.category_id} value={category.category_id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Производитель */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel sx={{ color: '#ccc' }}>Производитель</InputLabel>
                <Select
                  value={filters.manufacturer || ''}
                  onChange={(e) => onFilterChange('manufacturer', e.target.value)}
                  label="Производитель"
                  sx={{ backgroundColor: '#222', color: '#fff' }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: '#fff',
                        color: '#000',
                      }
                    }
                  }}
                >
                  <MenuItem value="">Все производители</MenuItem>
                  {manufacturers.map(m => (
                    <MenuItem key={m.manufacturer_id} value={m.manufacturer_id}>
                      {m.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Цена */}
            <Grid item xs={12} md={3}>
              <Typography gutterBottom sx={{ color: '#fff' }}>
                Ценовой диапазон: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </Typography>
              <Slider
                value={priceRange}
                onChange={(_, newValue) => onPriceChange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={100000}
                step={1000}
                valueLabelFormat={formatPrice}
                sx={{
                  color: '#fff',
                  '& .MuiSlider-thumb': {
                    borderColor: '#fff',
                  },
                  '& .MuiSlider-rail': {
                    opacity: 0.3,
                    backgroundColor: '#fff',
                  }
                }}
              />
            </Grid>

            {/* Сортировка */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel sx={{ color: '#ccc' }}>Сортировка</InputLabel>
                <Select
                  value={filters.sort || ''}
                  onChange={(e) => onFilterChange('sort', e.target.value)}
                  label="Сортировка"
                  sx={{ backgroundColor: '#222', color: '#fff' }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: '#fff',
                        color: '#000',
                      }
                    }
                  }}
                >
                  <MenuItem value="">По умолчанию</MenuItem>
                  <MenuItem value="price_asc">Цена (↑)</MenuItem>
                  <MenuItem value="price_desc">Цена (↓)</MenuItem>
                  <MenuItem value="name_asc">Название (А-Я)</MenuItem>
                  <MenuItem value="name_desc">Название (Я-А)</MenuItem>
                  <MenuItem value="rating_desc">Рейтинг</MenuItem>
                  <MenuItem value="newest">Новинки</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
};

const getSortLabel = (sortValue) => {
  switch (sortValue) {
    case 'price_asc': return 'Цена ↑';
    case 'price_desc': return 'Цена ↓';
    case 'name_asc': return 'Название А-Я';
    case 'name_desc': return 'Название Я-А';
    case 'rating_desc': return 'Рейтинг';
    case 'newest': return 'Новинки';
    default: return '';
  }
};

export default ProductFilters;

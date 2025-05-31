import React from 'react';
import { Grid, Card, CardContent, CardActionArea, Typography } from '@mui/material';

const CategoryGrid = ({ categories = [], selectedCategory = '', onSelect }) => {
  return (
    <Grid container spacing={2} justifyContent="center">
      {categories.map((category) => (
        <Grid item key={category.category_id} xs={6} sm={4} md={3} lg={2}>
          <Card 
            sx={{ 
              height: '100%',
              border: selectedCategory === category.category_id ? '2px solid #1976d2' : '1px solid #e0e0e0',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}
          >
            <CardActionArea 
              onClick={() => onSelect(category.category_id)}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: 2
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h2" gutterBottom sx={{ fontSize: '3rem' }}>
                  {category.icon}
                </Typography>
                <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
                  {category.name}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryGrid;
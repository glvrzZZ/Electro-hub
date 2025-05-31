require('dotenv').config();

const express = require('express');
const cors = require('cors'); // <-- добавь импорт cors

const db = require('./config/db');
const productRoutes = require('./routes/api/productRoutes');
const categoryRoutes = require('./routes/api/categoryRoutes');
const manufacturerRoutes = require('./routes/api/manufacturerRoutes');

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000' // разрешить запросы с React
}));

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/manufacturers', manufacturerRoutes);

db.query('SELECT NOW()', (err, resDb) => {
  if (err) {
    console.error('❌ Ошибка подключения к базе данных:', err);
    process.exit(1);
  } else {
    console.log('✅ Успешное подключение к базе данных:', resDb.rows[0].now);

    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    });
  }
});

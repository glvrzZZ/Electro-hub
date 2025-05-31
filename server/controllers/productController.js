const db = require('../config/db');

exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      manufacturer,
      min_price,
      max_price,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const offset = (page - 1) * limit;

    let baseQuery = `
      SELECT p.*, c.name AS category_name, m.name AS manufacturer_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN manufacturers m ON p.manufacturer_id = m.manufacturer_id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (search) {
      baseQuery += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    if (category) {
      baseQuery += ` AND p.category_id = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    if (manufacturer) {
      baseQuery += ` AND p.manufacturer_id = $${paramIndex}`;
      params.push(manufacturer);
      paramIndex++;
    }
    if (min_price) {
      baseQuery += ` AND p.price >= $${paramIndex}`;
      params.push(min_price);
      paramIndex++;
    }
    if (max_price) {
      baseQuery += ` AND p.price <= $${paramIndex}`;
      params.push(max_price);
      paramIndex++;
    }

    if (sort === 'price_asc') {
      baseQuery += ' ORDER BY p.price ASC';
    } else if (sort === 'price_desc') {
      baseQuery += ' ORDER BY p.price DESC';
    } else if (sort === 'name_asc') {
      baseQuery += ' ORDER BY p.name ASC';
    } else if (sort === 'name_desc') {
      baseQuery += ' ORDER BY p.name DESC';
    } else {
      baseQuery += ' ORDER BY p.product_id DESC';
    }

    baseQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit);
    params.push(offset);

    const result = await db.query(baseQuery, params);

    res.json({
      page: Number(page),
      limit: Number(limit),
      products: result.rows,
    });
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Проверяем и преобразуем id в число
    const productId = Number(id);
    if (!id || isNaN(productId)) {
      return res.status(400).json({ error: 'Неверный или отсутствующий id продукта' });
    }

    const mainImageQuery = `
      SELECT pi.image_url 
      FROM product_images pi 
      WHERE pi.product_id = $1 AND pi.is_main = TRUE 
      LIMIT 1
    `;

    const attributesQuery = `
      SELECT pa.name, pa.unit, pav.value
      FROM product_attribute_values pav
      JOIN product_attributes pa ON pav.attribute_id = pa.attribute_id
      WHERE pav.product_id = $1
    `;

    const reviewsQuery = `
      SELECT pr.*, u.first_name, u.last_name
      FROM product_reviews pr
      JOIN users u ON pr.user_id = u.user_id
      WHERE pr.product_id = $1 AND pr.is_approved = TRUE
    `;

    const productQuery = `
      SELECT 
        p.*, 
        c.name AS category_name,
        m.name AS manufacturer_name,
        (${mainImageQuery}) AS main_image,
        (
          SELECT AVG(pr.rating)
          FROM product_reviews pr
          WHERE pr.product_id = p.product_id AND pr.is_approved = TRUE
        ) AS average_rating
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN manufacturers m ON p.manufacturer_id = m.manufacturer_id
      WHERE p.product_id = $1
    `;

    const [productResult, attributesResult, reviewsResult] = await Promise.all([
      db.query(productQuery, [productId]),
      db.query(attributesQuery, [productId]),
      db.query(reviewsQuery, [productId])
    ]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      product: productResult.rows[0],
      attributes: attributesResult.rows,
      reviews: reviewsResult.rows,
    });
  } catch (error) {
    console.error('Ошибка при получении товара:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

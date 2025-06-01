

-- Таблица пользователей
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Таблица адресов пользователей
CREATE TABLE user_addresses (
    address_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    street VARCHAR(255) NOT NULL,
    building VARCHAR(20) NOT NULL,
    apartment VARCHAR(20),
    postal_code VARCHAR(20),
    is_default BOOLEAN NOT NULL DEFAULT FALSE
);

-- Таблица категорий товаров
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    parent_id INTEGER REFERENCES categories(category_id),
    description TEXT,
    image_url VARCHAR(255)
);

-- Таблица производителей
CREATE TABLE manufacturers (
    manufacturer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    website VARCHAR(255),
    logo_url VARCHAR(255)
);

-- Таблица товаров
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    category_id INTEGER NOT NULL REFERENCES categories(category_id),
    manufacturer_id INTEGER NOT NULL REFERENCES manufacturers(manufacturer_id),
    sku VARCHAR(50) UNIQUE,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Таблица характеристик товаров
CREATE TABLE product_attributes (
    attribute_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    unit VARCHAR(20)
);

-- Таблица значений характеристик для товаров
CREATE TABLE product_attribute_values (
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    attribute_id INTEGER NOT NULL REFERENCES product_attributes(attribute_id),
    value VARCHAR(255) NOT NULL,
    PRIMARY KEY (product_id, attribute_id)
);

-- Таблица изображений товаров
CREATE TABLE product_images (
    image_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    image_url VARCHAR(255) NOT NULL,
    is_main BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- Таблица отзывов о товарах
CREATE TABLE product_reviews (
    review_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE
);

-- Таблица корзин пользователей
CREATE TABLE carts (
    cart_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Таблица элементов корзины
CREATE TABLE cart_items (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES carts(cart_id),
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Таблица статусов заказов
CREATE TABLE order_statuses (
    status_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Таблица заказов
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status_id INTEGER NOT NULL REFERENCES order_statuses(status_id),
    shipping_address_id INTEGER NOT NULL REFERENCES user_addresses(address_id),
    billing_address_id INTEGER NOT NULL REFERENCES user_addresses(address_id),
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    shipping_method VARCHAR(50) NOT NULL,
    tracking_number VARCHAR(100),
    notes TEXT
);


CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(order_id),
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL
);


CREATE TABLE order_history (
    history_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(order_id),
    status_id INTEGER NOT NULL REFERENCES order_statuses(status_id),
    change_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    comment TEXT
);


CREATE TABLE promo_codes (
    promo_id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(10) NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);


CREATE TABLE applied_promo_codes (
    applied_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(order_id),
    promo_id INTEGER NOT NULL REFERENCES promo_codes(promo_id),
    discount_amount DECIMAL(10, 2) NOT NULL
);


CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_manufacturer ON products(manufacturer_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status_id);
CREATE INDEX idx_cart_user ON carts(user_id);
CREATE INDEX idx_review_product ON product_reviews(product_id);
CREATE INDEX idx_review_user ON product_reviews(user_id);


INSERT INTO order_statuses (name, description) VALUES 
('Ожидает оплаты', 'Заказ создан, но еще не оплачен'),
('Оплачен', 'Заказ оплачен и готов к обработке'),
('В обработке', 'Заказ находится в процессе обработки'),
('Отправлен', 'Заказ отправлен покупателю'),
('Доставлен', 'Заказ успешно доставлен'),
('Отменен', 'Заказ был отменен');


INSERT INTO categories (name, slug, description) VALUES 
('Смартфоны', 'smartphones', 'Мобильные телефоны с сенсорным экраном и функциями компьютера'),
('Ноутбуки', 'laptops', 'Портативные компьютеры для работы и развлечений'),
('Телевизоры', 'tvs', 'Телевизоры с различными технологиями экранов'),
('Наушники', 'headphones', 'Беспроводные и проводные наушники'),
('Фотоаппараты', 'cameras', 'Зеркальные и беззеркальные фотоаппараты');


INSERT INTO manufacturers (name, slug, website) VALUES 
('Apple', 'apple', 'https://www.apple.com'),
('Samsung', 'samsung', 'https://www.samsung.com'),
('Xiaomi', 'xiaomi', 'https://www.mi.com'),
('Sony', 'sony', 'https://www.sony.com'),
('Canon', 'canon', 'https://www.canon.com'),
('LG', 'lg', 'https://www.lg.com'),
('Asus', 'asus', 'https://www.asus.com'),
('Lenovo', 'lenovo', 'https://www.lenovo.com'),
('HP', 'hp', 'https://www.hp.com'),
('Dell', 'dell', 'https://www.dell.com'),
('Acer', 'acer', 'https://www.acer.com'),
('MSI', 'msi', 'https://www.msi.com'),
('Microsoft', 'microsoft', 'https://www.microsoft.com'),
('Huawei', 'huawei', 'https://www.huawei.com'),
('Realme', 'realme', 'https://www.realme.com'),
('OnePlus', 'oneplus', 'https://www.oneplus.com'),
('Google', 'google', 'https://store.google.com'),
('Nothing', 'nothing', 'https://nothing.tech'),
('JBL', 'jbl', 'https://www.jbl.com'),
('Sennheiser', 'sennheiser', 'https://www.sennheiser.com'),
('Bose', 'bose', 'https://www.bose.com'),
('Beats', 'beats', 'https://www.beatsbydre.com'),
('Nikon', 'nikon', 'https://www.nikon.com'),
('Fujifilm', 'fujifilm', 'https://www.fujifilm.com'),
('Panasonic', 'panasonic', 'https://www.panasonic.com'),
('Olympus', 'olympus', 'https://www.olympus.com'),
('Leica', 'leica', 'https://www.leica.com'),
('Hasselblad', 'hasselblad', 'https://www.hasselblad.com'),
('Pentax', 'pentax', 'https://www.ricoh-imaging.co.jp'),
('Sigma', 'sigma', 'https://www.sigma-global.com'),
('Ricoh', 'ricoh', 'https://www.ricoh.com'),
('GoPro', 'gopro', 'https://gopro.com'),
('DJI', 'dji', 'https://www.dji.com'),
('Insta360', 'insta360', 'https://www.insta360.com'),
('TCL', 'tcl', 'https://www.tcl.com'),
('Philips', 'philips', 'https://www.philips.com'),
('Hisense', 'hisense', 'https://www.hisense.com'),
('Sharp', 'sharp', 'https://www.sharp.com'),
('JVC', 'jvc', 'https://www.jvc.com'),
('Yamaha', 'yamaha', 'https://www.yamaha.com'),
('Prestigio', 'prestigio', 'https://www.prestigio.com');

INSERT INTO users (email, password_hash, first_name, last_name, phone) VALUES 
('test@example.com', 'hashed_password_here', 'Иван', 'Иванов', '+79161234567');

INSERT INTO user_addresses (user_id, country, city, street, building, apartment, postal_code, is_default) VALUES 
(1, 'Россия', 'Москва', 'Ленина', '10', '25', '123456', TRUE);


INSERT INTO products (name, slug, description, price, old_price, category_id, manufacturer_id, sku, stock_quantity, is_active) VALUES

('iPhone 15 Pro', 'iphone-15-pro', 'Флагманский смартфон Apple с процессором A17 Pro и камерой 48 МП', 99990, 104990, 1, 1, 'APL-IP15P-256', 50, TRUE),
('iPhone 15', 'iphone-15', 'Смартфон Apple с процессором A16 Bionic и динамическим островом', 79990, 84990, 1, 1, 'APL-IP15-128', 75, TRUE),
('Samsung Galaxy S23 Ultra', 'samsung-galaxy-s23-ultra', 'Флагман Samsung с экраном 6.8" и S Pen', 89990, 94990, 1, 2, 'SMS-GS23U-256', 40, TRUE),
('Samsung Galaxy Z Fold5', 'samsung-galaxy-z-fold5', 'Складной смартфон с экраном 7.6"', 129990, 139990, 1, 2, 'SMS-GZF5-512', 25, TRUE),
('Xiaomi 13 Pro', 'xiaomi-13-pro', 'Флагман Xiaomi с камерой Leica', 69990, 74990, 1, 3, 'XIA-X13P-256', 60, TRUE),
('Xiaomi Redmi Note 12 Pro', 'xiaomi-redmi-note-12-pro', 'Смартфон с AMOLED экраном 120 Гц', 24990, 27990, 1, 3, 'XIA-RN12P-128', 120, TRUE),
('Sony Xperia 1 V', 'sony-xperia-1-v', 'Флагман Sony с 4K HDR экраном', 89990, 99990, 1, 4, 'SNY-XP1V-256', 30, TRUE),
('Sony Xperia 10 V', 'sony-xperia-10-v', 'Компактный смартфон с отличной камерой', 39990, 44990, 1, 4, 'SNY-XP10V-128', 45, TRUE),
('iPhone 14 Pro Max', 'iphone-14-pro-max', 'Прошлогодний флагман Apple', 89990, 99990, 1, 1, 'APL-IP14PM-256', 35, TRUE),
('iPhone SE (2022)', 'iphone-se-2022', 'Компактный iPhone с процессором A15', 42990, 47990, 1, 1, 'APL-IPSE3-64', 80, TRUE),
('Samsung Galaxy A54', 'samsung-galaxy-a54', 'Средний класс с защитой IP67', 34990, 39990, 1, 2, 'SMS-GA54-128', 90, TRUE),
('Samsung Galaxy S23+', 'samsung-galaxy-s23-plus', 'Большой флагман с аккумулятором 4700 мАч', 79990, 84990, 1, 2, 'SMS-GS23P-256', 50, TRUE),
('Xiaomi 13T Pro', 'xiaomi-13t-pro', 'Смартфон с процессором Dimensity 9200+', 54990, 59990, 1, 3, 'XIA-X13TP-256', 65, TRUE),
('Xiaomi Poco X5 Pro', 'xiaomi-poco-x5-pro', 'Игровой смартфон за разумные деньги', 27990, 31990, 1, 3, 'XIA-PX5P-128', 110, TRUE),
('Sony Xperia 5 V', 'sony-xperia-5-v', 'Компактный флагман с камерой 48 МП', 69990, 74990, 1, 4, 'SNY-XP5V-128', 40, TRUE),
('Realme GT Neo 3T', 'realme-gt-neo-3t', 'Игровой смартфон с экраном 120 Гц', 29990, 34990, 1, 15, 'RLM-GTN3T-128', 85, TRUE),
('OnePlus 11', 'oneplus-11', 'Флагман с Snapdragon 8 Gen 2', 59990, 64990, 1, 16, 'OPL-OP11-256', 55, TRUE),
('Google Pixel 7 Pro', 'google-pixel-7-pro', 'Смартфон с лучшей камерой', 69990, 74990, 1, 17, 'GGL-PX7P-128', 45, TRUE),
('Nothing Phone (2)', 'nothing-phone-2', 'Смартфон с уникальной подсветкой', 49990, 54990, 1, 18, 'NTH-NP2-256', 60, TRUE),
('Asus ROG Phone 7', 'asus-rog-phone-7', 'Игровой смартфон с охлаждением', 79990, 84990, 1, 7, 'ASU-RP7-512', 30, TRUE),

 
('MacBook Pro 16" M2 Max', 'macbook-pro-16-m2-max', 'Мощный ноутбук для профессионалов', 249990, 259990, 2, 1, 'APL-MBP16M2-1TB', 20, TRUE),
('MacBook Air 13" M2', 'macbook-air-13-m2', 'Ультратонкий и легкий ноутбук', 109990, 119990, 2, 1, 'APL-MBA13M2-256', 40, TRUE),
('Samsung Galaxy Book3 Ultra', 'samsung-galaxy-book3-ultra', 'Премиальный ноутбук с экраном AMOLED', 179990, 189990, 2, 2, 'SMS-GB3U-1TB', 25, TRUE),
('Samsung Galaxy Book2 Pro', 'samsung-galaxy-book2-pro', 'Легкий ноутбук с экраном AMOLED', 89990, 99990, 2, 2, 'SMS-GB2P-512', 35, TRUE),
('Xiaomi Notebook Pro 14', 'xiaomi-notebook-pro-14', 'Ноутбук с экраном 2.8K 120 Гц', 79990, 84990, 2, 3, 'XIA-NBP14-512', 50, TRUE),
('Xiaomi RedmiBook 15', 'xiaomi-redmibook-15', 'Бюджетный ноутбук с процессором Intel', 44990, 49990, 2, 3, 'XIA-RB15-256', 70, TRUE),
('Sony VAIO S14', 'sony-vaio-s14', 'Премиальный ноутбук от Sony', 129990, 139990, 2, 4, 'SNY-VS14-1TB', 15, TRUE),
('Asus ROG Zephyrus G14', 'asus-rog-zephyrus-g14', 'Игровой ноутбук с AMD Ryzen 9', 129990, 139990, 2, 7, 'ASU-RZG14-1TB', 30, TRUE),
('Asus TUF Gaming F15', 'asus-tuf-gaming-f15', 'Доступный игровой ноутбук', 79990, 84990, 2, 7, 'ASU-TG15-512', 45, TRUE),
('Lenovo IdeaPad 5 Pro', 'lenovo-ideapad-5-pro', 'Универсальный ноутбук с экраном 2.8K', 69990, 74990, 2, 8, 'LNV-ID5P-512', 60, TRUE),
('Lenovo Legion 5 Pro', 'lenovo-legion-5-pro', 'Игровой ноутбук с экраном 165 Гц', 109990, 119990, 2, 8, 'LNV-LG5P-1TB', 35, TRUE),
('HP Spectre x360 14', 'hp-spectre-x360-14', 'Премиальный трансформер', 119990, 129990, 2, 9, 'HP-SPX14-512', 25, TRUE),
('HP Pavilion 15', 'hp-pavilion-15', 'Бюджетный ноутбук для повседневных задач', 49990, 54990, 2, 9, 'HP-PAV15-256', 80, TRUE),
('Dell XPS 13 Plus', 'dell-xps-13-plus', 'Ультрабук с безрамочным экраном', 139990, 149990, 2, 10, 'DEL-X13P-512', 30, TRUE),
('Dell G15 Gaming', 'dell-g15-gaming', 'Игровой ноутбук с NVIDIA RTX 3060', 89990, 94990, 2, 10, 'DEL-G15-512', 40, TRUE),
('Acer Swift 3', 'acer-swift-3', 'Легкий и тонкий ультрабук', 54990, 59990, 2, 11, 'ACR-SW3-512', 65, TRUE),
('Acer Predator Helios 300', 'acer-predator-helios-300', 'Мощный игровой ноутбук', 109990, 119990, 2, 11, 'ACR-PH300-1TB', 30, TRUE),
('MSI Katana GF66', 'msi-katana-gf66', 'Игровой ноутбук с RTX 3070', 129990, 139990, 2, 12, 'MSI-KGF66-1TB', 25, TRUE),
('Microsoft Surface Laptop 5', 'microsoft-surface-laptop-5', 'Премиальный ноутбук от Microsoft', 119990, 129990, 2, 13, 'MSF-SL5-512', 20, TRUE),
('Huawei MateBook D16', 'huawei-matebook-d16', 'Ноутбук с экраном 16" и процессором Intel', 69990, 74990, 2, 14, 'HUA-MBD16-512', 35, TRUE),


('Samsung QN90B Neo QLED', 'samsung-qn90b-neo-qled', '4K телевизор с технологией Neo QLED', 129990, 139990, 3, 2, 'SMS-QN90B-55', 15, TRUE),
('Samsung The Frame', 'samsung-the-frame', 'Телевизор, который превращается в картину', 99990, 109990, 3, 2, 'SMS-TFRM-55', 20, TRUE),
('LG C2 OLED', 'lg-c2-oled', 'OLED телевизор с идеальным черным', 119990, 129990, 3, 6, 'LG-C2-55', 18, TRUE),
('LG G2 OLED', 'lg-g2-oled', 'Премиальный OLED с галерейным дизайном', 149990, 159990, 3, 6, 'LG-G2-55', 12, TRUE),
('Sony A95K QD-OLED', 'sony-a95k-qd-oled', 'Инновационный QD-OLED телевизор', 179990, 189990, 3, 4, 'SNY-A95K-55', 10, TRUE),
('Sony X95K Mini LED', 'sony-x95k-mini-led', '4K телевизор с подсветкой Mini LED', 139990, 149990, 3, 4, 'SNY-X95K-65', 14, TRUE),
('Xiaomi TV Q2', 'xiaomi-tv-q2', 'Доступный QLED телевизор', 49990, 54990, 3, 3, 'XIA-TVQ2-55', 30, TRUE),
('Xiaomi TV A2', 'xiaomi-tv-a2', 'Бюджетный 4K телевизор', 34990, 39990, 3, 3, 'XIA-TVA2-43', 40, TRUE),
('TCL C735', 'tcl-c735', 'QLED телевизор с Mini LED', 69990, 74990, 3, 34, 'TCL-C735-55', 25, TRUE),
('TCL P635', 'tcl-p635', 'Доступный телевизор с хорошим звуком', 39990, 44990, 3, 34, 'TCL-P635-50', 35, TRUE),
('Philips OLED807', 'philips-oled807', 'OLED с подсветкой Ambilight', 129990, 139990, 3, 35, 'PHP-OL807-55', 16, TRUE),
('Philips The One', 'philips-the-one', 'Телевизор с отличным качеством изображения', 59990, 64990, 3, 35, 'PHP-TONE-55', 28, TRUE),
('Hisense U8HQ', 'hisense-u8hq', 'QLED телевизор с высокой яркостью', 79990, 84990, 3, 36, 'HIS-U8HQ-55', 22, TRUE),
('Hisense A6H', 'hisense-a6h', 'Бюджетный 4K телевизор', 29990, 34990, 3, 36, 'HIS-A6H-43', 45, TRUE),
('Panasonic LZ2000', 'panasonic-lz2000', 'OLED телевизор с отличным звуком', 149990, 159990, 3, 24, 'PNS-LZ2K-55', 12, TRUE),
('Sharp 4T-C50DL1X', 'sharp-4t-c50dl1x', 'Телевизор с экраном 50" и Smart TV', 44990, 49990, 3, 37, 'SHP-4TC50-50', 30, TRUE),
('JVC LT-50MAW595', 'jvc-lt-50maw595', 'Бюджетный телевизор с HDR', 32990, 37990, 3, 38, 'JVC-LT50-50', 40, TRUE),
('Skyworth Q72', 'skyworth-q72', 'QLED телевизор с Android TV', 59990, 64990, 3, 39, 'SKY-Q72-55', 25, TRUE),
('Yamaha YLT-495', 'yamaha-ylt-495', 'Телевизор с качественным звуком', 54990, 59990, 3, 40, 'YMH-YLT495-50', 20, TRUE),
('Prestigio Smart TV', 'prestigio-smart-tv', 'Доступный Smart TV', 27990, 32990, 3, 41, 'PRS-PSTV-43', 50, TRUE),


('Apple AirPods Pro 2', 'apple-airpods-pro-2', 'Беспроводные наушники с шумоподавлением', 19990, 21990, 4, 1, 'APL-APP2', 100, TRUE),
('Apple AirPods 3', 'apple-airpods-3', 'Беспроводные наушники с пространственным звуком', 14990, 16990, 4, 1, 'APL-AP3', 120, TRUE),
('Samsung Galaxy Buds2 Pro', 'samsung-galaxy-buds2-pro', 'Наушники с активным шумоподавлением', 12990, 14990, 4, 2, 'SMS-GB2P', 90, TRUE),
('Samsung Galaxy Buds Live', 'samsung-galaxy-buds-live', 'Наушники с уникальным дизайном', 8990, 10990, 4, 2, 'SMS-GBL', 110, TRUE),
('Xiaomi Buds 4 Pro', 'xiaomi-buds-4-pro', 'Беспроводные наушники с ANC', 7990, 8990, 4, 3, 'XIA-B4P', 130, TRUE),
('Xiaomi Redmi Buds 4', 'xiaomi-redmi-buds-4', 'Доступные беспроводные наушники', 2990, 3990, 4, 3, 'XIA-RB4', 200, TRUE),
('Sony WH-1000XM5', 'sony-wh-1000xm5', 'Лучшие наушники с шумоподавлением', 27990, 29990, 4, 4, 'SNY-WHXM5', 60, TRUE),
('Sony WF-1000XM4', 'sony-wf-1000xm4', 'Флагманские TWS наушники', 17990, 19990, 4, 4, 'SNY-WFXM4', 80, TRUE),
('JBL Tune 710BT', 'jbl-tune-710bt', 'Беспроводные накладные наушники', 5990, 6990, 4, 19, 'JBL-T710BT', 150, TRUE),
('JBL Live Pro 2', 'jbl-live-pro-2', 'TWS наушники с шумоподавлением', 9990, 11990, 4, 19, 'JBL-LP2', 110, TRUE),
('Sennheiser Momentum 4', 'sennheiser-momentum-4', 'Премиальные беспроводные наушники', 24990, 26990, 4, 20, 'SNH-MOM4', 50, TRUE),
('Sennheiser CX Plus', 'sennheiser-cx-plus', 'TWS наушники с прозрачным режимом', 12990, 14990, 4, 20, 'SNH-CXP', 70, TRUE),
('Bose QuietComfort 45', 'bose-quietcomfort-45', 'Наушники с лучшим шумоподавлением', 25990, 27990, 4, 21, 'BOS-QC45', 55, TRUE),
('Bose QuietComfort Earbuds', 'bose-quietcomfort-earbuds', 'TWS с активным шумоподавлением', 21990, 23990, 4, 21, 'BOS-QCEB', 65, TRUE),
('Beats Fit Pro', 'beats-fit-pro', 'Спортивные наушники с ANC', 17990, 19990, 4, 22, 'BEA-FTP', 85, TRUE),
('Beats Studio Buds', 'beats-studio-buds', 'Наушники с активным шумоподавлением', 12990, 14990, 4, 22, 'BEA-SB', 95, TRUE),
('Huawei FreeBuds Pro 2', 'huawei-freebuds-pro-2', 'TWS наушники с двойным драйвером', 14990, 16990, 4, 14, 'HUA-FBP2', 75, TRUE),
('Huawei FreeBuds 5i', 'huawei-freebuds-5i', 'Доступные TWS с шумоподавлением', 6990, 7990, 4, 14, 'HUA-FB5I', 120, TRUE),
('OnePlus Buds Pro 2', 'oneplus-buds-pro-2', 'TWS наушники с ANC и LHDC', 12990, 14990, 4, 16, 'OPL-BP2', 80, TRUE),
('Nothing Ear (2)', 'nothing-ear-2', 'TWS наушники с прозрачным дизайном', 9990, 11990, 4, 18, 'NTH-EAR2', 90, TRUE),


('Canon EOS R5', 'canon-eos-r5', 'Флагманская беззеркальная камера 45 МП', 299990, 319990, 5, 5, 'CAN-EOSR5', 10, TRUE),
('Canon EOS R8', 'canon-eos-r8', 'Беззеркальная камера для энтузиастов', 109990, 119990, 5, 5, 'CAN-EOSR8', 25, TRUE),
('Sony A7 IV', 'sony-a7-iv', 'Полнокадровая беззеркальная камера 33 МП', 179990, 189990, 5, 4, 'SNY-A7IV', 15, TRUE),
('Sony A7C', 'sony-a7c', 'Компактная полнокадровая камера', 129990, 139990, 5, 4, 'SNY-A7C', 20, TRUE),
('Nikon Z9', 'nikon-z9', 'Флагманская беззеркальная камера Nikon', 349990, 369990, 5, 23, 'NIK-Z9', 8, TRUE),
('Nikon Z5', 'nikon-z5', 'Доступная полнокадровая камера', 89990, 99990, 5, 23, 'NIK-Z5', 30, TRUE),
('Fujifilm X-T5', 'fujifilm-x-t5', 'Камера APS-C с сенсором 40 МП', 129990, 139990, 5, 24, 'FUJ-XT5', 18, TRUE),
('Fujifilm X-S10', 'fujifilm-x-s10', 'Компактная камера с IBIS', 79990, 89990, 5, 24, 'FUJ-XS10', 35, TRUE),
('Panasonic Lumix S5 II', 'panasonic-lumix-s5-ii', 'Полнокадровая камера с PDAF', 149990, 159990, 5, 25, 'PNS-LS52', 12, TRUE),
('Panasonic Lumix G9', 'panasonic-lumix-g9', 'Флагманская камера Micro Four Thirds', 89990, 99990, 5, 25, 'PNS-LG9', 25, TRUE),
('Olympus OM-D E-M1 Mark III', 'olympus-om-d-e-m1-mark-iii', 'Профессиональная камера MFT', 109990, 119990, 5, 26, 'OLY-EM13', 20, TRUE),
('Leica Q3', 'leica-q3', 'Компактная камера с полным кадром', 399990, 419990, 5, 27, 'LEI-Q3', 5, TRUE),
('Leica M11', 'leica-m11', 'Рангefinder камера 60 МП', 599990, 619990, 5, 27, 'LEI-M11', 3, TRUE),
('Hasselblad X2D 100C', 'hasselblad-x2d-100c', 'Среднеформатная камера 100 МП', 799990, 819990, 5, 28, 'HAS-X2D', 2, TRUE),
('Pentax K-3 Mark III', 'pentax-k-3-mark-iii', 'Флагманская зеркальная камера APS-C', 109990, 119990, 5, 29, 'PTX-K33', 15, TRUE),
('Sigma fp L', 'sigma-fp-l', 'Компактная полнокадровая камера 61 МП', 129990, 139990, 5, 30, 'SIG-FPL', 10, TRUE),
('Ricoh GR IIIx', 'ricoh-gr-iiix', 'Компактная камера с фикс-объективом', 79990, 89990, 5, 31, 'RIC-GR3X', 30, TRUE),
('GoPro Hero 11 Black', 'gopro-hero-11-black', 'Экшн-камера с сенсором 1/1.9"', 44990, 49990, 5, 32, 'GOP-H11B', 50, TRUE),
('DJI Pocket 2', 'dji-pocket-2', 'Компактная камера с 3-осевым стабилизатором', 29990, 34990, 5, 33, 'DJI-PKT2', 40, TRUE),
('Insta360 X3', 'insta360-x3', 'Камера 360° с двумя линзами', 39990, 44990, 5, 34, 'INS-X3', 35, TRUE);


INSERT INTO product_attributes (name, unit) VALUES
('Диагональ экрана', 'дюйм'),
('Разрешение экрана', NULL),
('Тип матрицы', NULL),
('Частота обновления экрана', 'Гц'),
('Процессор', NULL),
('Оперативная память', 'ГБ'),
('Встроенная память', 'ГБ'),
('Основная камера', 'МП'),
('Фронтальная камера', 'МП'),
('Емкость аккумулятора', 'мАч'),
('Время работы от аккумулятора', 'ч'),
('Вес', 'г'),
('Размеры', 'мм'),
('Операционная система', NULL),
('Беспроводные интерфейсы', NULL),
('Разъемы', NULL),
('Поддержка карт памяти', NULL),
('Цвет', NULL),
('Гарантия', 'мес'),
('Страна производства', NULL),
('Диагональ телевизора', 'дюйм'),
('Технология экрана', NULL),
('HDR', NULL),
('Smart TV', NULL),
('Год выпуска', NULL),
('Чувствительность ISO', NULL),
('Стабилизация изображения', NULL),
('Тип объектива', NULL),
('Фокусное расстояние', 'мм'),
('Диафрагма', NULL),
('Скорость съемки', 'кадр/сек'),
('Формат видео', NULL),
('Микрофон', NULL),
('Шумоподавление', NULL),
('Время работы от батареи', 'ч'),
('Тип наушников', NULL),
('Импеданс', 'Ом'),
('Чувствительность', 'дБ'),
('Частотный диапазон', 'Гц'),
('Разрешение фото', 'МП');


INSERT INTO product_attribute_values (product_id, attribute_id, value) VALUES
-- iPhone 15 Pro
(1, 1, '6.1'), (1, 2, '2556x1179'), (1, 3, 'Super Retina XDR'), (1, 4, '120'), 
(1, 5, 'A17 Pro'), (1, 6, '8'), (1, 7, '256'), (1, 8, '48+12+12'), (1, 9, '12'), 
(1, 10, '3274'), (1, 12, '187'), (1, 14, 'iOS 17'), (1, 18, 'Титановый'), (1, 19, '12'),

-- iPhone 15
(2, 1, '6.1'), (2, 2, '2556x1179'), (2, 3, 'Super Retina XDR'), (2, 4, '60'), 
(2, 5, 'A16 Bionic'), (2, 6, '6'), (2, 7, '128'), (2, 8, '48+12'), (2, 9, '12'), 
(2, 10, '3349'), (2, 12, '171'), (2, 14, 'iOS 17'), (2, 18, 'Черный, Синий, Розовый, Желтый, Зеленый'), (2, 19, '12'),

-- Samsung Galaxy S23 Ultra
(3, 1, '6.8'), (3, 2, '3088x1440'), (3, 3, 'Dynamic AMOLED 2X'), (3, 4, '120'), 
(3, 5, 'Snapdragon 8 Gen 2'), (3, 6, '12'), (3, 7, '256'), (3, 8, '200+10+12+12'), (3, 9, '12'), 
(3, 10, '5000'), (3, 12, '234'), (3, 14, 'Android 13'), (3, 18, 'Черный, Кремовый, Зеленый, Лавандовый'), (3, 19, '24'),

-- Samsung Galaxy Z Fold5
(4, 1, '7.6 (внутренний)'), (4, 2, '2176x1812 (внутренний)'), (4, 3, 'Dynamic AMOLED 2X'), (4, 4, '120'), 
(4, 5, 'Snapdragon 8 Gen 2'), (4, 6, '12'), (4, 7, '512'), (4, 8, '50+12+10'), (4, 9, '10+4'), 
(4, 10, '4400'), (4, 12, '253'), (4, 14, 'Android 13'), (4, 18, 'Черный, Синий, Бежевый'), (4, 19, '24'),

-- Xiaomi 13 Pro
(5, 1, '6.73'), (5, 2, '3200x1440'), (5, 3, 'AMOLED'), (5, 4, '120'), 
(5, 5, 'Snapdragon 8 Gen 2'), (5, 6, '12'), (5, 7, '256'), (5, 8, '50+50+50'), (5, 9, '32'), 
(5, 10, '4820'), (5, 12, '229'), (5, 14, 'Android 13'), (5, 18, 'Черный, Белый, Зеленый'), (5, 19, '12');
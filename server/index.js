import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE,
      customer_name TEXT,
      phone TEXT,
      address TEXT,
      delivery_type TEXT,
      total_price INTEGER,
      design_image TEXT,
      status TEXT DEFAULT 'Оплачен',
      is_paid BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Создать заказ
app.post('/api/orders', (req, res) => {
  const { customer_name, phone, address, delivery_type, design_image, total_price } = req.body;
  
  if (!customer_name || !phone || !address) return res.status(400).json({ error: 'Заполните все поля' });

  const order_number = 'ZP-' + Math.floor(100000 + Math.random() * 900000);
  const query = `INSERT INTO orders (order_number, customer_name, phone, address, delivery_type, total_price, design_image) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [order_number, customer_name, phone, address, delivery_type, total_price, design_image], function(err) {
    if (err) return res.status(500).json({ error: 'Ошибка БД' });
    res.json({ success: true, order_number });
  });
});

// Получить заказ (по номеру ИЛИ по телефону)
app.get('/api/orders/search', (req, res) => {
  const { query } = req.query; // Тут будет либо ZP-123, либо телефон
  
  db.all(`SELECT * FROM orders WHERE order_number = ? OR phone = ? ORDER BY created_at DESC`, [query, query], (err, rows) => {
    if (err || rows.length === 0) return res.status(404).json({ error: 'Заказ не найден' });
    res.json(rows);
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на http://localhost:${PORT}`));
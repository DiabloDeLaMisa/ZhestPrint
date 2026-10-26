import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));


const projectRoot = path.join(__dirname, '..');
app.use(express.static(projectRoot));


let orders = []; 


app.post('/api/orders', (req, res) => {
  const { customer_name, phone, address, delivery_type, design_image, total_price } = req.body;
  
  if (!customer_name || !phone || !address) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }

  const order_number = 'ZP-' + Math.floor(100000 + Math.random() * 900000);
  
  const newOrder = {
    id: Date.now(),
    order_number,
    customer_name,
    phone,
    address,
    delivery_type,
    design_image,
    total_price,
    status: 'Оплачен',
    is_paid: true,
    created_at: new Date().toISOString()
  };

  orders.push(newOrder);
  console.log('✅ Новый заказ:', order_number);
  
  res.json({ success: true, order_number });
});


app.get('/api/orders/search', (req, res) => {
  const { query } = req.query;
  
  if (!query) return res.status(400).json({ error: 'Введите запрос' });

  const found = orders.filter(o => 
    o.order_number === query || 
    o.phone === query || 
    o.phone.replace(/\D/g, '') === query.replace(/\D/g, '')
  );

  if (found.length === 0) {
    return res.status(404).json({ error: 'Заказ не найден' });
  }

  found.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(found);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
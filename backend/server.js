require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// IMPORTANT: the Paystack webhook needs the RAW body to verify the signature,
// so it must be mounted BEFORE express.json() with express.raw().
app.use('/api/paystack/webhook', express.raw({ type: 'application/json' }));

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.use('/api', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/paystack', require('./routes/paystack'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/contact', require('./routes/contact'));

app.get('/', (req, res) => res.send('BuxTech API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`BuxTech API listening on port ${PORT}`));

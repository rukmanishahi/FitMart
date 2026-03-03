require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Import logger middleware
const logger = require('./middleware/logger');

// ensure DB connects (db.js runs connect on require)
require('./db');

app.use(cors());
app.use(express.json());

// Add logger middleware AFTER express.json() but BEFORE routes
// This ensures it logs all requests including those with JSON body parsing
app.use(logger);

const productsRoute = require('./routes/products');
app.use('/api/products', productsRoute);
const cartRoute = require('./routes/cart');
app.use('/api/cart', cartRoute);
const ordersRoute = require('./routes/orders');
app.use('/api/orders', ordersRoute);

app.get('/', (req, res) => res.send('FitMart server running'));

// JSON body parse errors (malformed JSON) -> return 400 with clear message
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON payload:', err.message);
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next(err);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
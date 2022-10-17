import * as dotenv from 'dotenv';
dotenv.config()

import Debug from 'debug';
const debugMain = Debug("app:server");
const debugError = Debug("app:error");
import config from 'config';
import express from 'express';
import { productRouter } from './routes/api/product.js';

// Create Application
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register Routes
app.use('/api/product', productRouter);
app.use('/', express.static('public', { index: 'index.html'}));

app.get('/', (req, res, next) => {
  debugMain('Home Page');
  res.type("text/plain").send('Home Page');
});

// register error handlers
app.use((req, res, next) => {
  debugError(`Sorry, we couldn't find ${req.originalUrl}`);
  res.status(404)
     .json({ error: `Sorry, we couldn't find ${req.originalUrl}`});
});

app.use((err, req, res, next) => {
  debugError(err);
  res.status(err.status || 500)
     .json({ error: err.message});
});

// Listen for Requests
const hostname = config.get('http.host');
const port = config.get('http.port');
app.listen(port, () => {
  debugMain(`Server running at http://${hostname}:${port}`);
});
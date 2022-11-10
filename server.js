import * as dotenv from 'dotenv';
dotenv.config()

import Debug from 'debug';
const debugMain = Debug("app:server");
const debugError = Debug("app:error");

import config from 'config';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { auth } from './middleware/auth.js';
import { productRouter } from './routes/api/product.js';
import { userRouter } from './routes/api/user.js';

// Create Application

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(), helmet(), cors(), morgan('tiny'));

// Register Routes - Call auth() Middleware immediately before and after
// each '/route' call. This way we check for an authToken before executing
// any request that goes through the system.

app.use(auth());

app.use('/api/product', productRouter, auth());
app.use('/api/user', userRouter, auth());
app.use('/', express.static('public', { index: 'index.html'}));

app.get('/', (req, res, next) => {
  debugMain('Home Page');
  res.type("text/plain").send('Home Page');
});

// Register Error Handlers

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

// Listen For Requests

const hostname = config.get('http.host');
const port = config.get('http.port');
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
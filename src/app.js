import 'babel-polyfill';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import data from './routes/data';

console.log('initializing express app');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
console.log('initializing routes, including', process.env.MEESHKAN_KEY);
app.use('/', data(false));
app.use(`/${process.env.MEESHKAN_KEY}`, data(true));

export default app;


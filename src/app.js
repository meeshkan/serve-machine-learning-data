import 'babel-polyfill';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import data from './routes/data';

const app = express();

app.use(bodyParser({limit: '5mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use('/o', data(false));
app.use(`/i/${process.env.MEESHKAN_KEY || "you-should-never-use-this-for-any-serious-deployment"}`, data(true));

export default app;


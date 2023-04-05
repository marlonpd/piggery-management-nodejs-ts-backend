import express, { Express, Request, Response } from 'express';
import { MainRouter } from './routes';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

app.use('/api', MainRouter);

export default app;
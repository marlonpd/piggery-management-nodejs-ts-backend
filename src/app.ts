import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import { MainRouter } from './routes';
import dotenv from 'dotenv';
import { connectDb } from './utilities/connection';

const app: Express = express();

app.use(express.json());

connectDb();

app.use('/api', MainRouter);


export default app;
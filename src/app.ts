import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { MainRouter } from './routes';
import dotenv from 'dotenv';
import { connectDb } from './utilities/connection';

const app: Express = express();

app.use(
	cors({
		origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	}),
);

app.use(express.json());

connectDb();

app.use('/api', MainRouter);


export default app;
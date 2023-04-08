import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import { MainRouter } from './routes';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

app.use('/api', MainRouter);

mongoose.connect('mongodb+srv://marlonpddev:ZLh9sdvMOFda6hTz@cluster0.yllmlyb.mongodb.net/?retryWrites=true&w=majority').then((res)=>{
  console.log('connection successufly');
}).catch((e) => {
  console.log(e);
});

export default app;
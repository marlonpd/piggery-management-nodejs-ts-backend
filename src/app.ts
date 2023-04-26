import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import { MainRouter } from './routes';
import dotenv from 'dotenv';
import { connectDb } from './utilities/connection';

dotenv.config();

const app: Express = express();

app.use(express.json());

connectDb();

app.use('/api', MainRouter);


// const db_url : string = process.env.DB_URL ?? '';
// console.log(db_url)

// mongoose.connect(db_url).then((res)=>{
//   //console.log(res)
//   console.log('connection successufly');
// }).catch((e) => {
//   console.log(e);
// });



export default app;
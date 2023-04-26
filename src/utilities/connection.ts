import mongoose from 'mongoose';

const db_url : string = process.env.DB_URL ?? '';

export const connectDb = async () => {
  await mongoose.connect(db_url).then((res)=>{
    console.log('connection successufly');
  }).catch((e) => {
    console.log(e);
  });
}

export const conn = mongoose.connection; 
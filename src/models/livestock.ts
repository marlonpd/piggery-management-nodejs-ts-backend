import mongoose, { Schema, Document } from 'mongoose';

export interface ILivestock extends Document {
  email: string;
  name: string;
  password: string;
}

const LivestockSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.model<ILivestock>('Livestock', LivestockSchema);
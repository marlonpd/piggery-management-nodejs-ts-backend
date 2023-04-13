import mongoose, { Schema, Document } from 'mongoose';
import { RaiseType } from './../utilities/constants';
import User from './users';

export interface ILivestock extends Document {
  raise_id: Number;
  name: string;
  weight: Number;
  birth_date: String;
}

const LivestockSchema: Schema = new Schema({
  raise_id: { type: String, required: true, },
  name: { type: String, required: true },
  weight: { type: Number, required: false },
  birth_date: { type: Date, required: true },
});

export default mongoose.model<ILivestock>('Livestock', LivestockSchema);
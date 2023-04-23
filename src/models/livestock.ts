import mongoose, { Schema, Document } from 'mongoose';
import { RaiseType } from './../utilities/constants';
import User from './user';

export interface ILivestock extends Document {
  raise_id: Number;
  name: string;
  weight: Number;
  birth_date: String;
}

const LivestockSchema: Schema = new Schema({
    raise_id: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true
    },
    name: { type: String, required: true },
    weight: { type: Number, required: false },
    birth_date: { type: Date, required: false },
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  });

export default mongoose.model<ILivestock>('Livestock', LivestockSchema);
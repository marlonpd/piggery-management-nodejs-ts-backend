import mongoose, { Schema, Document } from 'mongoose';
import { RaiseType } from './../utilities/constants';
import User from './users';
import { EntryType } from '../utilities/app';

export interface IAccounting extends Document {
  raise_id: Number;
  description: string;
  entry_type: EntryType;
  created_at: Date;
}

const AccountingSchema: Schema = new Schema({
  raise_id: { type: String, required: true, },
  description: { type: String, required: true },
  entry_type: { type: String, required: false },
  created_at: { type: Date, required: true },
});

export default mongoose.model<IAccounting>('Accounting', AccountingSchema);
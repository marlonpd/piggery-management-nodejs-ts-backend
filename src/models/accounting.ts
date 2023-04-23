import mongoose, { Schema, Document } from 'mongoose';
import { EntryType } from '../utilities/app';
export interface IAccounting extends Document {
  raise_id: Number;
  description: string;
  entry_type: EntryType;
  amount: Number;
  updated_at: Date;
  created_at: Date;
}

const AccountingSchema: Schema = new Schema({
    raise_id: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true
    },
    description: { type: String, required: true },
    entry_type: { type: String, required: false },
    amount: { type: Number, required: false },
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

export default mongoose.model<IAccounting>('Accounting', AccountingSchema);
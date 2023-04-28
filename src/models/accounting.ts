import mongoose, { Schema, Document } from 'mongoose';
import { TEntryType } from '../utilities/app';
export interface IAccounting extends Document {
  raise_id: Number;
  description: string;
  entry_type: TEntryType;
  amount: Number;
  updated_at: Date;
  created_at: Date;
}

const AccountingSchema: Schema = new Schema({
    raise_id: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true
    },
    description: { type: Schema.Types.String, required: true },
    entry_type: { type: Schema.Types.String, required: false },
    amount: { type: Schema.Types.String, required: false },
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

export default mongoose.model<IAccounting>('Accounting', AccountingSchema);
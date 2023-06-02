import mongoose, { Schema, Document } from 'mongoose';
export interface IRaiseExpense extends Document {
  raise_id:  Schema.Types.ObjectId;
  expense_id:  Schema.Types.ObjectId;
}

const RaiseExpenseSchema: Schema = new Schema({
  raise_id: { type:  Schema.Types.ObjectId, required: true},
  expense_id: { type:  Schema.Types.ObjectId, required: true},
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

export default mongoose.model<IRaiseExpense>('RaiseExpense', RaiseExpenseSchema);
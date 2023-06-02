import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  description: string;
  amount: Number;
  updated_at: Date;
  created_at: Date;
}

const ExpenseSchema: Schema = new Schema({
    description: { type: Schema.Types.String, required: true },
    amount: { type: Schema.Types.String, required: false },
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

export default mongoose.model<IExpense>('Expense', ExpenseSchema);

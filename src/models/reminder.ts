import mongoose, { Schema, Document } from 'mongoose';

export interface IReminder extends Document {
  user_id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  category: string;
  due_date: Date;
  status: 'pending' | 'done';
  updated_at: Date;
  created_at: Date;
}

const ReminderSchema: Schema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: { type: Schema.Types.String, required: true },
    description: { type: Schema.Types.String, required: false },
    category: { type: Schema.Types.String, required: true, default: 'general' },
    due_date: { type: Schema.Types.Date, required: true },
    status: { type: Schema.Types.String, required: true, default: 'pending' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

export default mongoose.model<IReminder>('Reminder', ReminderSchema);

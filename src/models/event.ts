import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  raise_id: Number;
  event_date: Date;
  title: string;
  updated_at: Date;
  created_at: Date;
}

const EventSchema: Schema = new Schema({
    raise_id: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true
    },
    title: { type: Schema.Types.String, required: false },
    event_date: { type: Schema.Types.Date, required: true },
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

export default mongoose.model<IEvent>('Event', EventSchema);
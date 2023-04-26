import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  raise_id: Number;
  title: string;
  description: string;
  updated_at: Date;
  created_at: Date;
}

const NoteSchema: Schema = new Schema({
    raise_id: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true
    },
    title: { type: Schema.Types.String, required: false },
    description: { type: Schema.Types.String, required: false },
    amount: { type: Number, required: false },
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

export default mongoose.model<INote>('Note', NoteSchema);
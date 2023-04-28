import mongoose, { Schema, Document } from 'mongoose';
export interface ILivestock extends Document {
  raise_id: Number;
  name: string;
  weight: Number | null;
  birth_date: String | null;
}

const LivestockSchema: Schema = new Schema({
    raise_id: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true
    },
    name: { type: Schema.Types.String, required: true },
    weight: { type: Number, required: false },
    birth_date: { type: Schema.Types.Date, required: false },
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  });

export default mongoose.model<ILivestock>('Livestock', LivestockSchema);
import mongoose, { Schema, Document } from 'mongoose';
import { TRaiseType } from '../utilities/app';
export interface IRaise extends Document {
  raise_type: TRaiseType;
  head_count: Number;
  name: string;
  user: Object;
}

const RaiseSchema: Schema = new Schema({
  raise_type: { type: String, required: true},
  head_count: { type: Schema.Types.Number, required: true },
  name: { type: Schema.Types.String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    required: true
  },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

export default mongoose.model<IRaise>('Raise', RaiseSchema);
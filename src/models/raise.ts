import mongoose, { Schema, Document } from 'mongoose';
import { RaiseType } from './../utilities/constants';
export interface IRaise extends Document {
  raise_type: RaiseType;
  name: string;
  user: Object;
}

const RaiseSchema: Schema = new Schema({
  raise_type: { type: String, required: true},
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
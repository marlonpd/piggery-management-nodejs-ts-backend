import mongoose, { Schema, Document } from 'mongoose';
import { RaiseType } from './../utilities/constants';

export interface IRaise extends Document {
  raise_type: RaiseType;
  name: string;
  user: Object;
}

const RaiseSchema: Schema = new Schema({
  raise_type: { type: String, required: true},
  name: { type: String, required: true },
  user: { type: Object, required: true },
});

export default mongoose.model<IRaise>('Raise', RaiseSchema);
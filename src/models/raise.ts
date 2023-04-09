import mongoose, { Schema, Document } from 'mongoose';
import { RaiseType } from './../utilities/constants';

export interface IRaise extends Document {
  raise_type: RaiseType;
  name: string;
  user: Object;
}

const RaiseSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.model<IRaise>('Raise', RaiseSchema);
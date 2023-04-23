import mongoose, { Schema, Document } from 'mongoose';
import { RaiseType } from './../utilities/constants';
import { UserSchema } from './users';
export interface IRaise extends Document {
  raise_type: RaiseType;
  name: string;
  user: Object;
}

const RaiseSchema: Schema = new Schema({
  raise_type: { type: String, required: true},
  name: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId, // here you set the author ID
    required: true
  }
});

export default mongoose.model<IRaise>('Raise', RaiseSchema);
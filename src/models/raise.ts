import mongoose, { Schema, Document } from 'mongoose';
import { TRaiseType } from '../utilities/app';
export interface IRaise extends Document {
  raise_type: TRaiseType;
  head_count: Number;
  name: string;
  breed: string;
  hog_pen: string;
  birth_date: Date;
  dam_no: Number;
  sire_no: Number;
  ave_size_of_litter_dam: Number;
  teats_count: Number;
  rev_to: string;
  user: Object;
}

const RaiseSchema: Schema = new Schema({
  raise_type: { type: String, required: true},
  head_count: { type: Schema.Types.Number, required: true },
  name: { type: Schema.Types.String, required: true },
  breed: { type: Schema.Types.String, required: true },
  hog_pen: { type: Schema.Types.String, required: false },
  birth_date: { type: Schema.Types.Date, required: true },
  dam_no: { type: Schema.Types.Number, required: true },
  sire_no: { type: Schema.Types.Number, required: true },
  ave_size_of_litter_dam: { type: Schema.Types.Number, required: true },
  teats_count: { type: Schema.Types.Number, required: true },
  rev_to: { type: Schema.Types.String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    required: true
  },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

export default mongoose.model<IRaise>('Raise', RaiseSchema);
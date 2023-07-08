import mongoose, { Schema, Document } from 'mongoose';
export interface ISowHistory extends Document {
  raise_id:  Schema.Types.ObjectId;
  boar_name:  Schema.Types.String;
  boar_breed:  Schema.Types.String;
  boar_owner:  Schema.Types.String;
  boar_no: Schema.Types.Number;
  breed_date: Schema.Types.Date;
  estimated_farrowed_date: Schema.Types.Date;
  actual_farrowed_date: Schema.Types.Date;
  litter_male_count: Schema.Types.Number;
  litter_female_count: Schema.Types.Number;
  litter_deceased_count: Schema.Types.Number;
  weaened_litter_male_count: Schema.Types.Number;
  weaened_litter_female_count: Schema.Types.Number;
  weaened_litter_deceased_count: Schema.Types.Number;
  remarks: Schema.Types.String;
}

const SowHistorySchema: Schema = new Schema({
  raise_id: { type:  Schema.Types.ObjectId, required: true},
  boar_name: { type: Schema.Types.String, required: false },
  boar_no: { type: Schema.Types.Number, required: false },
  boar_breed: { type: Schema.Types.String, required: false },
  boar_owner: { type: Schema.Types.String, required: false },
  breed_date: { type: Schema.Types.Date, required: false },
  estimated_farrowed_date:{ type: Schema.Types.Date, required: false },
  actual_farrowed_date: { type: Schema.Types.Date, required: false },
  litter_male_count: { type: Schema.Types.Number, required: false },
  litter_female_count: { type: Schema.Types.Number, required: false },
  litter_deceased_count: { type: Schema.Types.Number, required: false },
  weaened_litter_male_count: { type: Schema.Types.Number, required: false },
  weaened_litter_female_count:{ type: Schema.Types.Number, required: false },
  weaened_litter_deceased_count: { type: Schema.Types.Number, required: false },
  remarks: { type: Schema.Types.Date, required: false },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

export default mongoose.model<ISowHistory>('SowHistory', SowHistorySchema);
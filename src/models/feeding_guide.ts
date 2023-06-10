import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedingGuide extends Document {
  raise_id: Number;
  from_date: Schema.Types.Date;
  to_date: Schema.Types.Date;
  feeding_period:  Schema.Types.String,
  feed_type: String;
  feed_name: String;
  grams: Number;
  updated_at: Date;
  created_at: Date;
}

const FeedingGuideSchema: Schema = new Schema({
    raise_id: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true
    },
    feeding_period: { type: Schema.Types.String, required: true },
    from_date: { type: Schema.Types.Date, required: true },
    to_date: { type: Schema.Types.Date, required: true },
    feed_type: { type: Schema.Types.String, required: true },
    feed_name: { type: Schema.Types.String, required: true },
    grams: { type: Schema.Types.Number, required: false },
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

export default mongoose.model<IFeedingGuide>('FeedingGuide', FeedingGuideSchema);

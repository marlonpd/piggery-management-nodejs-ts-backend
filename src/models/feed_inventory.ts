import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedInventory extends Document {
  user_id: mongoose.Types.ObjectId;
  item_name: string;
  unit: string;
  quantity: number;
  reorder_level: number;
  cost_per_unit: number;
  supplier?: string;
  notes?: string;
  updated_at: Date;
  created_at: Date;
}

const FeedInventorySchema: Schema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    item_name: { type: Schema.Types.String, required: true },
    unit: { type: Schema.Types.String, required: true },
    quantity: { type: Schema.Types.Number, required: true, default: 0 },
    reorder_level: { type: Schema.Types.Number, required: true, default: 0 },
    cost_per_unit: { type: Schema.Types.Number, required: true, default: 0 },
    supplier: { type: Schema.Types.String, required: false },
    notes: { type: Schema.Types.String, required: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

export default mongoose.model<IFeedInventory>('FeedInventory', FeedInventorySchema);

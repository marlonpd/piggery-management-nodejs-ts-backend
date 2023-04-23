import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  _doc: Object
}

const UserSchema: Schema = new Schema({
  email: { 
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (value: any) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email address",
    },
  },
  name: { type: String, required: true },
  password: { type: String, required: true },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
}
);

UserSchema.pre('save', async function(next) {
  const now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

UserSchema.set('autoIndex', true)

export { UserSchema };

export default mongoose.model<IUser>('User', UserSchema);
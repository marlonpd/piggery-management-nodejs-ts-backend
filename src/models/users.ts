import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true, 
    type: String,
    validate: {
      
    }
  },
  password: {
    required: true, 
    type: String,
  },


});
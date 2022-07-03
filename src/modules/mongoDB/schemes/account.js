import { Schema, model } from 'mongoose'
import bcryptPlugin from 'mongoose-bcrypt'


const schema = new Schema({
    username: {type: String,required: true, index: { unique: true }},
    email: { type: String, required: true },
    password: { type: String, required: true },
    characters: [{type: Schema.Types.ObjectId, ref: 'Character'}],
    status: {
      type: String, 
      enum: ['Pending', 'Active'],
      default: 'Pending'
    },
    confirmationCode: { //automatically generated when creating 
      type: String, 
      unique: true 
    },
    createdAt:{
      type:Date,
      immutable: true,
      default: ()=> Date.now()
    }
  })
;

schema.plugin(bcryptPlugin) //Enables automatic en/decryption of password with bcrypt functions

var Account = model('Account', schema);
export default Account;

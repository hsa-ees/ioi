import { Schema, model } from 'mongoose'


const schema = new Schema({
	worlds: [{type: Schema.Types.String}], // Array of all existing Words
	avatar: Schema.Types.String, // String with all Char PNG Names
})


const Universe = model('Universe', schema)
export default Universe;
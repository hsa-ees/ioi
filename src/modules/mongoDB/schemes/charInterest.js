import { Schema, model } from 'mongoose'
import { mongoose } from 'mongoose';

const schema = new Schema({
	char_id: {type: Schema.Types.ObjectId, ref: 'Character'},
	building: Schema.Types.String, //Building = Interest
	text: Schema.Types.String, //= Island
	parent: Schema.Types.String,
	expertSymbol: Schema.Types.String,
	expertBool: Schema.Types.Boolean
})
schema.index({char_id:1, building:1, expertBool:1},{unique: true})
var CharacterInterest = mongoose.model('CharacterInterest', schema)
export default CharacterInterest

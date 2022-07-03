import { Schema, model } from 'mongoose'
const schema = new Schema({
    building: {type: Schema.Types.String, unique: true}, //=Interest
    island: Schema.Types.String,
    expertSymbol: Schema.Types.String,
    notes: Schema.Types.String,
	isIslandRequest: Schema.Types.Boolean
})
var RequestTheme = model('request', schema);
export default RequestTheme
import { Schema, model } from 'mongoose'

const schemaBuildings = new Schema({
    building: {type: Schema.Types.String},//= Interest
    text: Schema.Types.String,//=Island
    parent: Schema.Types.String,
    expertSymbol: Schema.Types.String,
    isDisabled: {type: Schema.Types.Boolean, default: false}
})
schemaBuildings.index({building:1, text:1},{unique: true})

const BuildingWhitelist = model('BuildingWhitelist', schemaBuildings);
export default BuildingWhitelist
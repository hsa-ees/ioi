import { Schema, model } from 'mongoose'

const schemaBuilding = new Schema({
	name: {type: Schema.Types.String, unique: true},
    buildingID: Schema.Types.String,
    world: {type: Schema.Types.String},
    visitors:[{type: Schema.Types.String}] // all characters currently in the building
})

const BuildingDB = model('Building', schemaBuilding);
export default BuildingDB


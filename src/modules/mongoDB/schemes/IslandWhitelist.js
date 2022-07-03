import { Schema, model } from 'mongoose'

const schemaIsland = new Schema({
    island: {type: Schema.Types.String, unique: true},
})

const IslandWhitelist = model('IslandWhitelist', schemaIsland);
export default IslandWhitelist
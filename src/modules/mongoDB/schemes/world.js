import { Schema, model } from 'mongoose'
import Building from './building';


const schema = new Schema({
	name: {type: Schema.Types.String, unique: true},
    maps: [Schema.Types.String],

    activeMap: Schema.Types.String,
    activeMapNumber: Schema.Types.Number,
    maxMapNumber: Schema.Types.Number, 

    MapCap1: Schema.Types.Number, 
    MapCap2: Schema.Types.Number, 
    MapCap3: Schema.Types.Number, 
    MapCapMax: Schema.Types.Number,
    
    parent: Schema.Types.String,//not in use, should be merged with interest tree
    children: [{type: Schema.Types.String}],//not in use, should be merged with interest tree
    buildings: [{type: Schema.Types.String, ref: 'Building' }],
    shops: [Schema.Types.String],
    games: [Schema.Types.String]
})


const WorldDB = model('World', schema)
export default WorldDB;
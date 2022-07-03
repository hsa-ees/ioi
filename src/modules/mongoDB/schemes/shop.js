import { Schema, model } from 'mongoose'

const schemaShop = new Schema({
	name: {type: Schema.Types.String, unique: true},
    shopID: Schema.Types.String,
    world: {type: Schema.Types.String},
    
})

const ShopDB = model('Shop', schemaShop);
export default ShopDB


import {World} from "./world";
import {Position} from "@rpgjs/server/lib/Player/Player";
import {RpgShape} from "@rpgjs/server";
import {getMapHandler} from "./mapHandler";
import ShopDB from "../../mongoDB/schemes/shop";
import WorldDB from "../../mongoDB/schemes/world";
import {BuildingsI} from "./buildingsI";

export class Shop implements BuildingsI{

    private _name: string
    private _id: string

    world: World
    position: Position

    constructor(shape: RpgShape, world: World) {
        this._name = shape.properties.name
        this._id = shape.properties.building
        this.world = world
    }


    async createNewBuilding(shape: RpgShape) {
        if (!(!! await ShopDB.findOne({name: this.name}))){
            await this.saveInDB()
        }
        this.world.addShop(this)
        getMapHandler().addToAllShops(this)
    }


    async saveInDB(){
        await new ShopDB({
            name: this._name,
            shopID: this._id,
            world: this.world.name
        }).save()
        let worldData = await WorldDB.findOne({name: this.world.name})
        worldData.shops.push(this.name)
        worldData.save()
    }


    // GETTER AND SETTER

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }


}
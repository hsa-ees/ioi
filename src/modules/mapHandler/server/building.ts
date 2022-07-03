import {EventData, RpgMap, RpgPlayer, RpgShape} from "@rpgjs/server";
import {World} from "./world";
import {Position} from "@rpgjs/server/lib/Player/Player";
import BuildingDB from "../../mongoDB/schemes/building";
import WorldDB from "../../mongoDB/schemes/world";
import {getMapHandler} from "./mapHandler";
import BuildingWhitelist from "../../mongoDB/schemes/buildingWhitelist";
import {nameEvent1} from "../../main/server/events/NameEvent";
import {BuildingsI} from "./buildingsI";

export class Building implements BuildingsI{

    private _name: string
    private _id: string          // How the building is called in Tiled (name)

    shape: RpgShape
    world: World
    position: Position

    private _visitors: Set<string> = new Set()

    constructor(shape: RpgShape, world: World) {
        this._name = shape.properties.name
        this._id = shape.properties.building
        this.world = world

        this.shape = shape
    }


    async createNewBuilding(shape: RpgShape) {
        // check if building is already in DB
        if (!(!! await BuildingDB.findOne({name: this.name}))){
            await this.saveInDB()
        }
        const mapH = getMapHandler()
        if (!mapH.doesBuildingExist(this.name)){
            mapH.addBuilding(this)
            this.world.addBuilding(this)
        }
    }


    async saveInDB(){
        let buildingDB = new BuildingDB({
            name: this._name,
            buildingID: this._id,
            world: this.world.name,
            visitors: Array.from(this._visitors)
        })
        await buildingDB.save()
        let worldDB = await WorldDB.findOne({name: this.world.name})
        worldDB.buildings.push(this.name)
        worldDB.save()
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

    get visitors(): Set<string> {
        return this._visitors;
    }

    async addVisitor(name){
        if (!this._visitors.has(name)){
            let buildingData = await BuildingDB.findOne({name: this._name})
            buildingData.visitors.push(name)
            buildingData.save()
        }
        this._visitors.add(name)
    }

    set visitors(value: Set<string>) {
        this._visitors = value;
    }

}

/**
 * This method creates a dynamic event to display a Name on top of a Building.
 * @param buildingName :the name to be shown on the Building
 * @param shape :the shape of the Building that is to be named
 * @param player
 * @param map
 */
export function displayNameOfBuilding(buildingName: string, shape: RpgShape, player?: RpgPlayer, map?: RpgMap ){
    @EventData({
        name: buildingName
    })
    class GenerateEvent extends nameEvent1{}
    let currentMap: RpgMap
    if (player != undefined){
        //@ts-ignore
        currentMap = player.getCurrentMap()
    } else {
        //@ts-ignore
        currentMap = map
    }
    // console.log("Current Map: "+currentMap.id)
    // console.log(shape)
    if(currentMap!=null){
        currentMap.createDynamicEvent({
            x: shape.x,
            y: shape.y +40,
            event: GenerateEvent
        })
    }
}

export function getRandomHouse(){
    let randomNumber = randomIntFromInterval(1, 4)
    return require('../../main/server/maps/tmx/house'+randomNumber+'ground.tmx')
}


function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export async function addBuildingChangeToWhitelist(building: string, newWorld: string){
    // console.log(newWorld)
    // console.log(building)
    const buildingWL = await BuildingWhitelist.updateOne({building: building},{$set:{building:  newWorld, text: newWorld}})
    // console.log("buildingwl")
    // console.log(buildingWL)
    // buildingWL.text = newWorld
    // buildingWL.save()
}

export async function addBuildingToBuildingWhitelist(building: string, world: string){
    const newBuilding = {
        building: building,
        text: world,
        parent: "",
        expertSymbol: "",
        $isDisabled:false
    }
    new BuildingWhitelist(newBuilding).save()
}


import Universe from "../../mongoDB/schemes/universe";
import {World} from "./world";
import {Building} from "./building";
import {Shop} from "./shop";


export class MapHandler {

    private _allWorlds: Map<string, World> = new Map();
    private _allBuildings: Map<string, Building> = new Map();
    private _allShops: Map<string, Shop> = new Map();
    // universe

    private static instance: MapHandler

    public static getInstance(): MapHandler {
        if (!MapHandler.instance) {
            MapHandler.instance = new MapHandler();
        }
        return MapHandler.instance
    }


    // Handling of Worlds

    get allWorlds(): Map<string, World> {
        return this._allWorlds;
    }

    get allBuildings(): Map<string, Building> {
        return this._allBuildings;
    }

    async addWorld(world: World){
        this._allWorlds.set(world.name, world)
        let universeDB = await Universe.findOne()
        if (!universeDB.worlds.includes(world.name)){
            universeDB.worlds.push(world.name)
            await universeDB.save()
        }
    }

    getWorld(name: string): World{
        // @ts-ignore
        return this._allWorlds.get(name)
    }

    hasWorld(name: string): Boolean{
        return this._allWorlds.has(name)
    }

    async createNewWorld(name: string, id: string, islandNumber: number){
        const newWorld = new World(name)
        newWorld.activeMap = id
        newWorld.activeMapNumber = islandNumber
        let universeDB = await Universe.findOne()
        if (!universeDB.worlds.includes(newWorld.name)){
            await newWorld.saveWorldInDb() // passt
        }
        await this.addWorld(newWorld)
        newWorld.addMap(id, islandNumber)
        return newWorld
    }

    // Handling of Buildings

    addBuilding(building: Building){
        this._allBuildings.set(building.name, building)
    }

    getBuilding(name: string): Building {
        // @ts-ignore
        return this._allBuildings.get(name)
    }

    getWorldOfBuilding(building: string): World{
        // @ts-ignore
        return this._allBuildings.get(building).world
    }

    doesBuildingExist(name: string): boolean {
        return this._allBuildings.has(name)
    }

    addToAllShops(shop: Shop){
        this._allShops.set(shop.name, shop)
    }

    getShop(shopName: string) {
        return this._allShops.get(shopName)
    }

}

// const mapHandler = new MapHandler()

export function getMapHandler(){
    return MapHandler.getInstance()
}

MapHandler.getInstance().addWorld(new World("noWorld"))



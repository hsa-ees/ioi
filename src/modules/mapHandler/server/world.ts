import WorldDB from "../../mongoDB/schemes/world";
import {RpgShape} from "@rpgjs/server";
import {Building} from "./building";
import IslandWhitelist from "../../mongoDB/schemes/IslandWhitelist";
import {Shop} from "./shop";


export class World{
    private readonly _name: string
    maps: Set<string> = new Set()
    playersOfWorld: number = 0
    newMap: boolean = false
    updateEvent: boolean = false
    buildingToChangeMap: string

    activeMap: string
    activeMapNumber: number = 1
    maxMapNumber: number = 3

    private _MapCap1: number = 5
    private _MapCap2: number = 10
    private _MapCap3: number = 15
    private _MapCapMax: number = 0

    private _MaxBuildings1: number = 7
    private _MaxBuildings2: number = 16
    private _MaxBuildings3: number = 23

    parent: string
    children: Set<string> = new Set()

    private _allBuildingsOfWorld: Map<string, Building> = new Map()
    private _shops: Map<string, Shop> = new Map()
    private _games: Array<string> = []
    // ['https://learningapps.org/watch?app=13765270', 'https://learningapps.org/watch?app=20517508', 'https://learningapps.org/watch?app=236936']

    whiteList: Set<string> = new Set() //TODO: wird die hier gebraucht?


    constructor(name: string) {
        this._name = name
    }


    addMap(map: string, number: number){
        this.maps.add(map)
        this.activeMap = map
        this.activeMapNumber = number
    }

    getActiveMap(){
        return this.activeMap
    }

    getMapCap(map: string){
        // @ts-ignore
        let id = parseInt(map.split('').pop(), 10)
        switch(id){
            case 1: return this._MapCap1
            case 2: return this._MapCap2
            case 3: return this._MapCap3
            default: return this._MapCapMax
        }
    }

    setMapCap(id: number, value: number){
        switch(id){
            case 1: this._MapCap1 = value; break;
            case 2: this._MapCap2 = value; break;
            case 3: this._MapCap3 = value; break;
            case 4: this._MapCapMax = value; break;
        }
    }

    getMapFile(mapNumber: number){
        switch (mapNumber) {
            case 1:
                return require('../../main/server/maps/tmx/IslandSmall.tmx')
            case 2:
                return require('../../main/server/maps/tmx/IslandMiddle.tmx')
            case 3:
                return require('../../main/server/maps/tmx/IslandBig.tmx')
            default:
                return require('../../main/server/maps/tmx/IslandSmall.tmx')
        }
    }


// DB

    async saveWorldInDb(){
        let worldData = new WorldDB({
            name: this.name,
            maps: Array.from(this.maps),
            activeMap: this.activeMap,
            activeMapNumber: this.activeMapNumber,
            maxMapNumber: this.maxMapNumber,
            MapCap1: this._MapCap1,
            MapCap2: this._MapCap2,
            MapCap3: this._MapCap3,
            MapCapMax: this._MapCapMax,
            parent: this.parent,
            children: Array.from(this.children),
            buildings: Array.from(this.allBuildingsOfWorld),
            shop: this.shops,
            games: this._games,
        })
        await worldData.save()
    }


    // Building Management

    async createBuilding(buildingName: string, shape: RpgShape) {
        shape.properties.name = buildingName
        shape.name = buildingName
        let newBuilding = new Building(shape, this)
        await newBuilding.createNewBuilding(shape)
        return newBuilding
    }

    getBuildingCap(map: string){
        // @ts-ignore
        let id = parseInt(map.split('').pop(), 10)
        switch(id){
            case 1: return this._MaxBuildings1
            case 2: return this._MaxBuildings2
            case 3: return this._MaxBuildings3
            default: return 1000
        }
    }



    // @ts-ignore
    getBuildingNameFromBuildingTyp(buildingType: string): string{
        let ret = ""
        this.allBuildingsOfWorld.forEach((value, key) => {
            if(value.id === buildingType){
                ret = key
                return ret;
            }else {
                throw "No such building"
            }
        })
        return ret;
    }

    addBuilding(building: Building){
        this.allBuildingsOfWorld.set(building.name, building)
    }

    getBuilding(name: string): Building{
        // @ts-ignore
        return this._allBuildingsOfWorld.get(name)
    }

    // getAllBuildingsOfWorld(){
    //     return this.allBuildingsOfWorld
    // }

    deleteBuilding(name: string) {
        this.allBuildingsOfWorld.delete(name)
    }

    getNumberOfBuildings(): number {
        return this.allBuildingsOfWorld.size
    }

    getMostWantedBuilding(): string{
        let mostWanted: string = ''
        let mostVisitors: number = 0
        if (this.allBuildingsOfWorld.size > 0){
            this.allBuildingsOfWorld.forEach((value: Building, key: string) => {
                if(value.visitors.size >= mostVisitors){
                    mostVisitors = value.visitors.size
                    mostWanted = key
                }
            });
        }
        return mostWanted
    }

    buildingIdExists(buildingId: string): boolean{
        let ret = false
        this.allBuildingsOfWorld.forEach(value => {
            if(value.id == buildingId){
                ret = true
            }
        })
        return ret
    }


    // Shop management

    async createShop(shopName: string, shape: RpgShape){
        shape.properties.name = shopName
        shape.name = shopName
        let newShop =  new Shop(shape, this)
        await newShop.createNewBuilding(shape)
        return newShop
    }

    addShop(shop: Shop){
        this._shops.set(shop.name, shop)
    }

    // Game Management

    getGames(){
        return this._games
    }

    async addGame(game: string){
        let worldData = await WorldDB.findOne({name: this.name})
        worldData.games.push(game)
        worldData.save()
        this._games.push(game)

    }

    async deleteGame(game: string){
        const worldData = await WorldDB.findOne({name: this._name})
        worldData.games.pull(game)
        worldData.save()
        this._games = this._games.filter(string => string != game)
    }


    // GETTER & SETTER


    get name(): string {
        return this._name;
    }

    get allBuildingsOfWorld(): Map<string, Building> {
        return this._allBuildingsOfWorld;
    }

    get shops(): Map<string, Shop> {
        return this._shops;
    }

    get games(): Array<string> {
        return this._games;
    }

    set games(value: Array<string>) {
        this._games = value;
    }


}

export async function addIslandToIslandWhitelist(island: string){
    new IslandWhitelist({island: island}).save()
}

import {RpgServer, RpgModule, RpgServerEngine, RpgClassMap, RpgMap, MapData,} from '@rpgjs/server'
import { player } from './player'
import {getMapHandler} from "../../mapHandler/server/mapHandler";
import {universeInit} from "../../mongoDB/functions/existenceChecks";
import WorldDB from "../../mongoDB/schemes/world";
import BuildingDB from "../../mongoDB/schemes/building";
import {Caroline, Veronika} from "../../main/server/events/biggerIslandEvent";
import {Island} from "../../main/server/maps/islands";
import {BuildingMap} from "../../main/server/maps/Building";
import {Building, displayNameOfBuilding, getRandomHouse} from "../../mapHandler/server/building";
import {World} from "../../mapHandler/server/world";
import ShopDB from "../../mongoDB/schemes/shop";
import {Shop} from "../../mapHandler/server/shop";
import {ShopBuilding} from "../../main/server/maps/Shop";
import {createStaticBuildings} from "../../main/server";

let engine: RpgServerEngine;

@RpgModule<RpgServer>({

    engine: {
        async onStart(_engine: RpgServerEngine) {
            engine = _engine
            await initWorlds()
        }
    }
})
export default class RpgServerModuleEngine {}


export async function initWorlds(){
    const mapHandler = getMapHandler()
    const universe = await universeInit();
    const worlds = universe.worlds
    for (let i = 0; i < worlds.length; i++) {
        if (worlds[i] != "noWorld"){
            let map = await initWorld(worlds[i])
            //@ts-ignore
            await initBuildings(worlds[i], map)
            //@ts-ignore
            await initShops(worlds[i], map)
            //@ts-ignore
            await createStaticBuildings(map, mapHandler.getWorld(worlds[i]))
        }
    }
}

export async function initWorld(name: string){
    const mapH = getMapHandler()
    let worldData = await WorldDB.findOne({name: name})
    let world = await mapH.createNewWorld(name, name+worldData.activeMapNumber, worldData.activeMapNumber)

    world.maxMapNumber = worldData.maxMapNumber
    world.setMapCap(1,worldData.MapCap1)
    world.setMapCap(2, worldData.MapCap2)
    world.setMapCap(3, worldData.MapCap3)
    world.setMapCap(4, worldData.MapCapMax)
    world.parent = worldData.parent
    world.children = new Set(worldData.children)
    for (let i = 0; i < worldData.shops.length; i++) {
        world.shops.set(worldData.shops[i].name, worldData.shops[i])
    }
    world.games = worldData.games
    world.maps = new Set(worldData.maps)

    let map = await createNewMapForInit('island', worldData.name+worldData.activeMapNumber, world.getMapFile(worldData.activeMapNumber), worldData.name)
    // @ts-ignore
    world.maps.add(map)
    if (world.activeMap == undefined){
        //@ts-ignore
        world.activeMap = map.id
        // @ts-ignore
        worldData.activeMap = map.id
        worldData.save()
    }
    return map
}

export async function initBuildings(world: string, map: RpgMap){
    const worldData = await WorldDB.findOne({name: world})
    const buildingsData = worldData.buildings
    if (buildingsData.length > 0){
        for (let i = 0; i < buildingsData.length; i++) {
            let buildingName = worldData.buildings[i]
            let building: Building
            let buildingData = await BuildingDB.findOne({name: buildingName})
            map.getShapes().forEach((async shape => {
                if(buildingData.buildingID == shape.properties.building){
                    let worldObj = getMapHandler().getWorld(world)
                    building = await worldObj.createBuilding(buildingName, shape)
                    building.visitors = new Set(buildingData.visitors)
                    displayNameOfBuilding(buildingName, shape, undefined, map)
                    getMapHandler().getWorld(world).addBuilding(building)
                    await createNewMapForInit('building', buildingName, getRandomHouse(), 'Building')
                }
            }))
        }
    }
}


export async function initShops(world: string, map: RpgMap){
    const worldData = await WorldDB.findOne({name: world})
    const shopsData = worldData.shops
    if (shopsData.length > 0){
        for (let i = 0; i < shopsData.length; i++) {
            let shopName: string = worldData.shops[i]
            let shop: Shop
            let shopData = await ShopDB.findOne({name: shopName})
            map.getShapes().forEach((async shape => {
                if(shopData.shopID == shape.properties.building){
                    let worldObj = getMapHandler().getWorld(world)
                    shop = await worldObj.createShop(shopName, shape)
                    // displayNameOfBuilding(shopName, shape, undefined, map)
                    await createNewMapForInit('shop', shopName, require('../../main/server/maps/tmx/shop.tmx'), 'Shop')
                }
            }))
        }
    }

}

export async function createNewMapForInit(type: string, mapId: string, mapFile, mapName){
    const sceneMap = engine.sceneMap
    let map: RpgClassMap<RpgMap>
    let newMap: RpgMap | undefined
    switch (type) {
        case 'island':
        @MapData({
            id: mapId,
            file: mapFile,
            name: mapName,  // the World of the Map
            events: [
                Veronika,
                Caroline,
            ],
            sounds: ['town_small'],
            syncSchema: {
                world: World
            }
        })
        class GenerateIsland extends Island{}
            map = sceneMap.createDynamicMap(GenerateIsland)
            break;
        case 'building':
        @MapData({
            id: mapId,
            file: mapFile,
            name: mapName,  // needs to be "Building"
            sounds: ['town_middle'],
        })
        class GenerateBuilding extends BuildingMap {}
            map = sceneMap.createDynamicMap(GenerateBuilding)
            break;
        case 'shop':
        @MapData({
            id: mapId,
            file: mapFile,
            name: mapName,  // I think it needs to be "Shop"
            sounds: ['town_big'],
        })
        class GenerateShop extends ShopBuilding {}
        map = sceneMap.createDynamicMap(GenerateShop)
        break;
    }
    await sceneMap.loadMap(mapId).then((value => {newMap = value}))
    return newMap
}

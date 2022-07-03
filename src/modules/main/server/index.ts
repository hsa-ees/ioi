import {
    RpgServer,
    RpgServerEngine,
    RpgModule,
    RpgPlayer,
    RpgWorld,
    Control,
    RpgShape,
} from '@rpgjs/server';
import {Island} from "./maps/islands";

import { RpgMap, MapData } from '@rpgjs/server'
import {House1ground, House1middle1, House1middle2, House1Top} from "./maps/house1";
import {House2ground, House2ground_extra_rooms, House2middle1, House2middle2, House2Top} from "./maps/house2";
import {House3ground, House3middle1, House3middle2, House3Top} from "./maps/house3";
import {House4ground, House4middle1, House4middle2, House4Top} from "./maps/house4";
import { getMapHandler} from "../../mapHandler/server/mapHandler";
import MeetingHandler from "../../roomMeeting/server/meetingAPI"
import {showLoginScreen} from '../../title-screen/server/mmorpg'
import WorldDB from '../../mongoDB/schemes/world';
import {BuildingMap} from "./maps/Building";
import {Veronika, Caroline} from "./events/biggerIslandEvent";
import BuildingDB from "../../mongoDB/schemes/building";
import {addIslandToIslandWhitelist, World} from "../../mapHandler/server/world";
import {
    addBuildingChangeToWhitelist,
    Building,
    displayNameOfBuilding,
    getRandomHouse
} from "../../mapHandler/server/building";
import {ShopBuilding} from "./maps/Shop";


let engine: RpgServerEngine;

@RpgModule<RpgServer>({

    engine: {
        async onStart(_engine: RpgServerEngine){
            engine = _engine
        },
        onStep(_engine:RpgServerEngine){

        }
    },

    player:{

        async onConnected(player: RpgPlayer) {

            player.setGraphic('teacherF1')
            player.setHitbox(32, 16)
            player.hp = 100
            player.setVariable('Experte', true)
            player.setVariable('shape', '')

            await showLoginScreen(player)
            await islandSelect(player, false)

        },

        async onInput(player: RpgPlayer, { input }) {
        },

        async onInShape(player: RpgPlayer, shape: RpgShape) {
            await checkShape(player, shape)
        },

        async onOutShape(player: RpgPlayer, shape: RpgShape) {
            if(shape.name == player.getVariable('shape')){
                const mapH = getMapHandler()
                // @ts-ignore
                await player.changeMap(mapH.getWorld(player.getCurrentMap().name).activeMap, player.position)
                player.setVariable('shape', '')
            }
        },

        async onJoinMap(player: RpgPlayer, rpgMap: RpgMap) {

            //@ts-ignore
            let mapName = rpgMap.name
            if (mapName != 'Building' && mapName != 'Shop'){

                // if this map is a newly created One, initialize all buildings on it
                //@ts-ignore
                if (getMapHandler().getWorld(rpgMap.name).newMap){
                    await initBuildingsOfMap(player, rpgMap)
                    // @ts-ignore
                    await createStaticBuildings(rpgMap, player, getMapHandler().getWorld(player.getCurrentMap().name))
                }
            }

            await checkMapSize(player, rpgMap)
            player.gui('overworld').close()     //hier ein close, weil sonst denkt das System beim erneuten Joinen der Map, das Gui bereits offen ist, und das führt zu problemen
            //@ts-ignore
            await player.gui('overworld').open({world: player.getCurrentMap()?.name, playerID: player.mongoId}) //Öffnen der ersten Gui

        },

    },

    maps: [
        Island,
        House1ground,
        House1middle1,
        House1middle2,
        House1Top,
        House2ground,
        House2ground_extra_rooms,
        House2middle1,
        House2middle2,
        House2Top,
        House3ground,
        House3middle1,
        House3middle2,
        House3Top,
        House4ground,
        House4middle1,
        House4middle2,
        House4Top,
        ShopBuilding,

    ],

})

export default class RpgServerModuleEngine {}

/**
 * This method checks what kind of shape the player has entered.
 * The distinction is made by the property shape.properties.type of the shape.
 * Possible types are: Building, Shop, Port, LeaveBuilding, LeaveShop, RoomMeeting, Player, PlayerMeeting, GameEvent, Quiz and AddQuiz.
 * It then can start the handling of the type.
 * @param player
 * @param shape
 */
export async function checkShape(player: RpgPlayer, shape: RpgShape){

    const mapH = getMapHandler()
    let world: World = mapH.getWorld('noWorld')
    // @ts-ignore
    const mapName: string = player.getCurrentMap().name
    if (mapName != 'Shop' && mapName != 'Building' ) {
         // @ts-ignore
        world = mapH.getWorld(mapName)
    }

    player.gui("MeetingCall").close()//closing any playerMeetings and resetting the variable
    player.setVariable('inMeeting','noMeeting')

    switch (shape.properties.type) {
        case 'Building':
            await handleBuilding(world, player, shape)
            break;

        case 'Shop':
            await handleShop(world, player, shape)
            break;

        case 'Port':
            await islandSelect(player, true, world.name)
            break;

        case 'LeaveBuilding':
            //@ts-ignore
            let building = mapH.allBuildings.get(player.getCurrentMap().id)
            // @ts-ignore
            await player.changeMap(building.world.activeMap, building.position)
            break;

        case 'LeaveShop':
            if (player.getCurrentMap() != null){
                // @ts-ignore
                let shop = mapH.getShop(player.getCurrentMap().id)
                // @ts-ignore
                await player.changeMap(shop.world.activeMap, shop.position)
            }
            break;

        case 'RoomMeeting':
            //gets handled in the Module roomMeeting
            break;

        case 'GameEvent':
            player.gui('rpg-chat').close()
            let randInt = Math.floor(Math.random() * world.getGames().length)
            let gameLink = world.getGames()[randInt]
            if (world.getGames().length <= 0){
                gameLink = "none"
            }
            await player.gui('gameWindow').open({game: gameLink }, {waitingAction: true, blockPlayerInput: true})
            await player.gui('rpg-chat').open()
            break;

        default: console.log("No handling for Shape: "+shape.name)
    }
}

/**
 * This method handles the Entering of a Building.
 * If the shape has no building, it creates a new One.
 * Otherwise, it just changes the map of the Player to the corresponding building.
 * @param world
 * @param player
 * @param shape
 */
async function handleBuilding(world: World, player: RpgPlayer, shape: RpgShape){
    const mapH = getMapHandler()

    // Check, if Building already exists
    if(shape.properties.name == 'none'){

        let pPosition = player.position
        // player.gui('overworld').close()
        const gui = player.gui('name-building')
        await gui.open({worldName: world.name})
        let buildingName: string
        gui.on('nameBuilding', async (data) => {
            buildingName = data.buildingName
            if (buildingName == undefined) {
                throw 'No Building chosen'
            }
            const building = await world.createBuilding(buildingName, shape)
            building.position = pPosition

            await createNewMap('building', buildingName, getRandomHouse(), 'Building')
            displayNameOfBuilding(buildingName, shape, player)

            await player.changeMap(shape.name)
            gui.close()
        })
    } else {
        let building = mapH.getBuilding(shape.name)
        building.position = player.position
        await player.changeMap(shape.name)
    }
}


/**
 * This method handles the Entering of a Shop.
 * If the shape has no Shop, it creates a new One.
 * Otherwise, it just changes the map of the Player to the corresponding Shop.
 * @param world
 * @param player
 * @param shape
 */
async function handleShop(world: World, player: RpgPlayer, shape: RpgShape){

    // Check, if Shop already exists
    if(shape.properties.name == 'none'){
        // Case: No Shop has been previously created

        let pPosition = player.position
        const shopName = world.name + shape.properties.building
        const shop = await world.createShop(shopName, shape)
        shop.position = pPosition
        await createNewMap('shop', shopName, require('./maps/tmx/shop.tmx'), 'Shop')
        await player.changeMap(shopName)
    } else {
        // Case: There already has been a Shop

        // @ts-ignore
        getMapHandler().getShop(shape.name).position = player.position
        await player.changeMap(shape.name)
    }
}

/**
 * This function is called everytime a player joins a Map.
 * It then has to check, whether the player can stay on this map or not. This depends on different factors:
 * Is the map a Building or an Island? -> Nothing to be done if it's a building.
 * Does the Island need to grow? -> Noting to be done if it's not full.
 * Has the Island already reached its max Size?
 *  yes ->  Create a new Island with the most wanted Building.
 *  no  ->  Change the Map to the next bigger One.
 *
 * @param player
 * @param rpgMap
 */
export async function checkMapSize(player: RpgPlayer, rpgMap: RpgMap){
    // @ts-ignore
    if (rpgMap.name == 'Building') {
        // Case: The Map is a Building -> The player can stay

        await showOwnNotification(player, "Willkommen im "+ rpgMap.id + " Gebäude")
        //@ts-ignore
    } else if (rpgMap.name == 'Shop') {
        // Case: The Map is a Shop -> The player can stay

        await showOwnNotification(player, "Willkommen im " + rpgMap.id.slice(0, rpgMap.id.length-5) + " Shop")
    }
    else {
        // Case: The Map is an Island -> is it the map currently used (the map with the right size)?
        const mapH = getMapHandler()
        let mapId: string = rpgMap.id
        // @ts-ignore
        let world: World = mapH.getWorld(rpgMap.name)

        if (world.getActiveMap() == mapId) {
            // Case: This is the Map currently used in this World -> does it need to grow? (full: to many people or no free houses)

            if (world.playersOfWorld >= world.getMapCap(mapId) || world.getNumberOfBuildings() >= world.getBuildingCap(mapId)) {
                // Case: This Map needs to grow -> does it already have max Size or can it still grow?

                if (world.activeMapNumber < world.maxMapNumber) {
                    // Case: This world can still grow -> Map grows

                    // Inform every Player on the map about the change
                    for (const rpgPlayer of RpgWorld.getPlayersOfMap(world.activeMap)) {
                        await showOwnNotification(rpgPlayer, "Hurra! Viele Leute interessieren sich für dieses Gebiet! Die Insel ist soeben gewachsen!")
                    }
                    setTimeout(function (){
                        mapGrowth(world, rpgMap, player)
                    }, 4000)

                } else {
                    // Case: This world already has his max Size -> Create a new World with the most wanted building

                    world.setMapCap(4, world.getMapCap("Map99") -1)
                    // console.log(world.getMapCap("Map99"))
                    if ( world.getMapCap("Map99") <= 0 || world.getNumberOfBuildings() >= world.getBuildingCap(mapId)){
                        await createWorldWithMostWantedBuilding(world, player, world.name)
                        world.setMapCap(4, 50)
                    }
                }
            }

        }
        else {
            // Case: This is not the map with the right Size currently used -> change to active Island (with the right size)
            await player.changeMap(world.activeMap)
        }

    }
}

/**
 * This Method lets an Island Grow.
 * It creates a new Map with the next higher Map Counter.
 *  For Example: The Map with the ID Math2 will be replaced by the map with the ID Math3.
 * It will also start porting the players to the new Map by placing shapes around the players.
 * @param world
 * @param rpgMap
 * @param player
 */
async function mapGrowth(world: World, rpgMap: RpgMap, player: RpgPlayer){

    // Creating the new Map
    let newNumber = world.activeMapNumber + 1
    let newIslandName = world.name + newNumber
    world.activeMapNumber = newNumber
    world.activeMap = newIslandName
    let worldData = await WorldDB.findOne({name: world.name})
    worldData.activeMapNumber = world.activeMapNumber
    worldData.activeMap = world.activeMap
    worldData.save()
    await createNewMap('island', newIslandName, world.getMapFile(newNumber), world.name)
    world.newMap = true

    // Placing the shapes around the players to port them to the new Map
    let shapeCount = 0
    for (const oneMap of world.maps) {
        try {
            for (const onePlayer of RpgWorld.getPlayersOfMap(oneMap)) {
                shapeCount++
                onePlayer.setVariable('shape', 'IslandGrow' + shapeCount)
                rpgMap.createShape({
                    name: 'IslandGrow' + shapeCount,
                    x: onePlayer.position.x,
                    y: onePlayer.position.y,
                    width: 30,
                    height: 30,
                })
            }
        } catch(TypeError){
        }
    }


}

/**
 * When an Island is full, this Method takes the most popular Building of the Island
 * and creates a separate Island with its name.
 * @param world
 * @param player
 * @param worldName
 */
async function createWorldWithMostWantedBuilding(world: World, player: RpgPlayer, worldName: string){
    const mapH = getMapHandler()
    let mostWantedBuilding = world.getMostWantedBuilding()
    let newIslandName = mostWantedBuilding +'1'
    let newWorldName = mostWantedBuilding

    // check if the to be created world already exists
    if (!mapH.hasWorld(newWorldName)) {
        world.children.add(newWorldName)
        let newWorld = await mapH.createNewWorld(newWorldName, newIslandName, 1)
        newWorld.parent = worldName
        await changeMapOfBuilding(mapH.getBuilding(mostWantedBuilding), world, newWorld, player)

        for (const rpgPlayer of RpgWorld.getPlayersOfMap(world.activeMap)) {
            await showOwnNotification(rpgPlayer, 'Die Insel ' + newWorldName + ' wurde erstellt.')
        }
    } else {
        throw "Island already exists!"
    }
}


/**
 * This method deletes a building from one world and places it in another one.
 * While doing this, it also creates a new Map for the building to place in.
 * @param building
 * @param oldWorld
 * @param newWorld
 * @param player
 */
async function changeMapOfBuilding(building: Building, oldWorld: World, newWorld: World, player: RpgPlayer){

    // clearing the building from old Map/World
    await deleteBuilding(player, building, oldWorld)
    oldWorld.updateEvent = true
    oldWorld.buildingToChangeMap = oldWorld.getMostWantedBuilding();

    // placing the building in the new World/Map
    await createNewMap('island', newWorld.name + '1', require('./maps/tmx/IslandSmall.tmx'), newWorld.name)
    building.world = newWorld
    building.visitors.clear()
    newWorld.addBuilding(building)
    newWorld.newMap = true
    let newWorldData = await WorldDB.findOne({name: newWorld.name})
    newWorldData.buildings.push(building.name)
    newWorldData.save()
    let newBuildingData = await BuildingDB.findOne({name: building.name})
    newBuildingData.world = newWorld.name
    newBuildingData.save()
    await addIslandToIslandWhitelist(newWorld.name)
    await addBuildingChangeToWhitelist(building.name, newWorld.name)
}

export async function deleteBuilding(player: RpgPlayer, building: Building, oldWorld: World){
    let mapShapes = player.getCurrentMap()?.getShapes()
    // @ts-ignore
    for (const shape of mapShapes) {
        if (shape.properties.building == building.id){
            shape.properties.name = 'none'
            shape.name = 'none'
        }
    }
    let oldWorldData = await WorldDB.findOne({name: oldWorld.name})
    oldWorldData.buildings.pull(building.name)
    oldWorldData.save()
}

/**
 * This Method opens the GUI to let the Player choose the island they want to join.
 * Depending on whether the island already exists or not, it also creates a new World and Map.
 * @param player
 * @param port :true, if it's not the login-menu but the fast travel menu.
 * @param worldName
 */
export async function islandSelect(player: RpgPlayer, port: Boolean, worldName?: String){

    var map: string = ""
    const gui = player.gui('chose-Island')
    gui.on('chose-island', async (data)=>{

        map = data.mapName
        player.setGraphic(data.charName)

        const mapH = getMapHandler()
        let world: World

        // check, if there already exists a world with this map
        if(!mapH.hasWorld(map)){
            await mapH.createNewWorld(map, map + '1', 1)
            world = mapH.getWorld(map)
            await createNewMap('island', map + '1', require('./maps/tmx/IslandSmall.tmx'), map)
            world.newMap = true
        } else {
            world = mapH.getWorld(map)
        }
        gui.close()
        await player.changeMap(world.activeMap)
    })
    await gui.open({
        playerID: player.mongoId,
        menuPort: port,
        worldName: worldName},{waitingAction:true, blockPlayerInput: true})
    return map
}

export async function showOwnNotification(player: RpgPlayer, msg: string){
    await player.gui('notification').open({msg}, {waitingAction: false, blockPlayerInput: false})

    setTimeout(function (){
        player.gui('notification').close()
    },3000)

}

/**
 * This Method displays the name of every Shop and Port of a Map.
 * @param map
 * @param world
 */
export function createStaticBuildings(map: RpgMap, world: World){
    map.getShapes().forEach((async shape => {
        if (shape.properties.type == 'Shop'){
            displayNameOfBuilding('Shop', shape, undefined, map)
        } else if (shape.properties.type == 'Port'){
            displayNameOfBuilding('Hafen', shape, undefined, map)
        }
    }))
}


/**
 * This Method creates a new dynamic rpgMap.
 * It differentiates between an Island, a building and a shop.
 * @param type :It needs to be either 'island', 'building', or 'shop'
 * @param mapId :the id of the map, which consists of the world-name and the size-number. E.g. Math1
 * @param mapFile :the required file of the map. E.g. require('../../main/server/maps/tmx/IslandSmall.tmx')
 * @param mapName :the name of the world it's in. e.g. 'Math'
 */
async function createNewMap(type: string, mapId: string, mapFile, mapName){
    const sceneMap = engine.sceneMap
    switch (type) {
        case 'island':
            @MapData({
                id: mapId,
                file: mapFile,
                name: mapName,
                sounds: ['town_small'],
                syncSchema: {
                    world: World
                }
            })
            class GenerateIsland extends Island{}
            sceneMap.createDynamicMap(GenerateIsland)
            break;
        case 'building':
            @MapData({
                id: mapId,
                file: mapFile,
                name: mapName,
                sounds: ['town_middle'],
            })
            class GenerateBuilding extends BuildingMap {}
            sceneMap.createDynamicMap(GenerateBuilding)
            break;
        case 'shop':
            @MapData({
                id: mapId,
                file: mapFile,
                name: mapName,
                sounds: ['town_big'],
            })
            class GenerateShop extends ShopBuilding {}
            sceneMap.createDynamicMap(GenerateShop)
            break;
    }
}

/**
 * This Method initializes every Building of a world on a new Map after the World has grown.
 * It sets the shapes name and displays the name of the building.
 * The buildings don't need to be created, as they already existed on a smaller Map.
 * @param player
 * @param map
 */
export async function initBuildingsOfMap(player: RpgPlayer, map: RpgMap){
    //@ts-ignore
    let worldName = map.name
    let world = getMapHandler().getWorld(worldName)
    world.allBuildingsOfWorld.forEach((value, key) => {
        player.getCurrentMap()?.getShapes().forEach((value1 => {
            if(value.id == value1.properties.building){
                value1.properties.name = key
                value1.name = key
                displayNameOfBuilding(key, value1, player, undefined)
            }
        }))
    })
    world.newMap = false
}


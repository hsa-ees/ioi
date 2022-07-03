import {RpgModule, RpgServer, RpgServerEngine, RpgWorld} from "@rpgjs/server";
import BuildingWhitelist from "../../mongoDB/schemes/buildingWhitelist";
import IslandWhitelist from "../../mongoDB/schemes/IslandWhitelist"
import BuildingDB from "../../mongoDB/schemes/building";
import WorldDB from "../../mongoDB/schemes/world";
import Character from "../../mongoDB/schemes/character";
import {getMapHandler} from "../../mapHandler/server/mapHandler";
import {universeInit} from "../../mongoDB/functions/existenceChecks";
import CharacterInterest from "../../mongoDB/schemes/charInterest";
import {showOwnNotification} from "../../main/server";
import RequestTheme from "../../mongoDB/schemes/requestTheme";

@RpgModule<RpgServer>({
    engine:{
        onStart(engine: RpgServerEngine){
            const app = engine.app

            app.post('/user/newRequest', async (req, res) =>{
                try{
                    const data = req.body
                    console.log(data)
                    await new RequestTheme({
                        building: data.building,
                        island: data.island,
                        expertSymbol: data.expertSymbol,
                        notes: data.notes,
                        isIslandRequest: data.isIslandRequest
                    }).save()
                    res.send("request in DB")
                } catch (err){
                    console.log(err)
                }
            })

            app.post('/admin/getRequests', async (req,res) =>{
                try{
                    const isIslandRequest = req.body.isIslandRequest
                    const islandRequests = await RequestTheme.find({isIslandRequest: isIslandRequest})
                    res.send(islandRequests)
                }catch (err){
                    console.log(err)
                }
            })

            app.delete('/admin/deleteRequest', async (req,res)=>{
                const request = req.body
                await RequestTheme.deleteOne({
                    building: request.building,
                    island: request.island,
                    isIslandRequest: request.isIslandRequest
                })
                res.send("request deleted")
            })


            app.post('/user/getExpertSymbols', async (req, res)=>{
                try{
                    const map = req.body.map
                    const nickname = req.body.name
                    let character = await Character.findOne({nickname: nickname})
                    if(character=== null){
                        res.send("showNot")
                    }else{
                        let char = await CharacterInterest.find({char_id: character._id, text: map, expertBool:true})
                        let str = ""
                        let counter = 0
                        for(let element of char){
                            str += element.expertSymbol + " "
                            counter++
                            if(counter >= 5){
                                break
                            }
                        }
                        if(str === ""){
                            res.send("showNot")
                        }else{
                            str = str.slice(0,-1)
                            res.send("(" + str + ")")
                        }
                    }
                }catch (err){
                    console.log(err)
                }
            })


            app.put('/admin/newBuildingWhitelist', async (req,res)=>{
                try{
                    const building = req.body.building
                    new BuildingWhitelist(building).save()
                    res.send("Neues Gebäude wurde erfolgreich in DB gespeichert")

                }catch (err){
                    console.log(err)
                }
            })
            app.put('/admin/newIslandWhitelist', async (req,res)=>{
                const island = req.body.island
                new IslandWhitelist(island).save()
                res.send("Neue Insel wurde erfolgreich in insel gespeichert")

            })
            app.post('/admin/getBuildingsOfIsland', async (req,res) =>{
                try{
                    const island = req.body.island
                    const noDisabledEntries = req.body.noDisabledEntries
                    let buildings
                    if(noDisabledEntries.valueOf() ===true){
                        buildings = await BuildingWhitelist.find({text: island, isDisabled: false})

                    }else{
                        buildings = await BuildingWhitelist.find({text: island})

                    }
                    res.send(buildings)
                }catch (err){
                    console.log(err)
                }

            })
            app.post('/admin/getGamesOfIsland', async (req,res) =>{
                try{
                    const island = req.body.island
                    const games = getMapHandler().getWorld(island).games
                    res.send(games)
                }catch (err){
                    console.log(err)
                }
            })


            app.delete('/admin/deleteBuilding',async (req, res)=>{
                try{
                    const building = req.body.building
                    const island = req.body.island
                    await BuildingWhitelist.deleteOne({building: building})
                    await BuildingDB.deleteOne({name: building})
                    let worldData = await WorldDB.findOne({name: island})
                    worldData.buildings.pull(building)
                    worldData.save()

                    const buildingInstance = getMapHandler().getBuilding(building)
                    if (buildingInstance !=undefined){
                        let players = RpgWorld.getPlayersOfMap(building)

                        //TODO rename the loading zones in time

                        //renaming the building to Lerngebäude
                        buildingInstance.world.buildingToChangeMap = building
                        buildingInstance.world.updateEvent = true

                        //setting the entrance shape back so a new building can be placed
                        buildingInstance.shape.properties.name = 'none'
                        buildingInstance.shape.name = 'none'



                        for(let player of players){
                            portPlayer(player,island)
                        }
                    }


                    res.send("deleted building")
                }catch (err){
                    console.log(err)
                }
            })

            app.delete('/admin/deleteIsland', async (req, res)=>{

                try {
                    const island = req.body.island
                    //delete from the whitelists of buildings and islands
                    await BuildingWhitelist.deleteMany({text: island})
                    await IslandWhitelist.deleteOne({island: island})
                    //delete initialized buildings and islands as well
                    await BuildingDB.deleteMany({world: island})
                    await WorldDB.deleteOne({name: island})
                    const universe = await universeInit()
                    await universe.worlds.pull(island)
                    await universe.save()



                    const world = getMapHandler().getWorld(island)
                    if(world !=undefined){
                        let players = RpgWorld.getPlayersOfMap(world.getActiveMap())
                        /*                    async function portPlayer(player,destination){
                                                await player.showText("Diese Insel wurde gelöscht. Rückkehr zur Allgemeinen Insel")
                                                await player.changeMap(destination)
                                            }*/
                        for(let player of players){
                            portPlayer(player,"Allgemein")
                        }
                        for(let building of world.allBuildingsOfWorld){
                            players = RpgWorld.getPlayersOfMap(building[0])
                            for(let player of players){
                                portPlayer(player,"Allgemein")
                            }
                        }
                    }

                    res.send("deleted island")
                }catch (err){
                    console.log(err)
                }
            })

            app.delete('/admin/deleteBuildingRequestsOfIsland', async (req, res)=>{
                try{
                    const island = req.body.island
                    await RequestTheme.deleteMany({island:island})
                    res.send("all requests of island deleted")

                }catch (err){
                    console.log(err)
                }

            })

            app.put('/admin/addGameRequest', async (req, res) => {
                const game = req.body.data.game
                const world = req.body.data.world
                await getMapHandler().getWorld(world).addGame(game)
                res.send("game added")
            })
            app.delete('/admin/deleteGameRequest', async (req, res) => {
                const game = req.body.game
                const world = req.body.world
                await getMapHandler().getWorld(world).deleteGame(game)
                res.send("game deleted")
            })
        }
    }
})


export default class RpgServerModule {

}

/**
 * This method teleports the player to the given Island(World)
 * shows them the destination
 * @param player:RpgPlayer
 */
async function portPlayer(player,destinationName){
    const destination = getMapHandler().getWorld(destinationName).activeMap

    await showOwnNotification(player,("Diese Instanz wurde gelöscht. Rückkehr zur Insel:  " + destinationName))
    // await player.showText("Diese Instanz wurde gelöscht. Rückkehr zur Insel:  " + destinationName)
    await player.changeMap(destination)
}
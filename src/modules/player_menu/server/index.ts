import {RpgModule, RpgServer, RpgServerEngine} from "@rpgjs/server";
import Character from "../../mongoDB/schemes/character";
import Universe from "../../mongoDB/schemes/universe";
import BuildingWhitelist from "../../mongoDB/schemes/buildingWhitelist"
import IslandWhitelist from "../../mongoDB/schemes/IslandWhitelist"
import CharacterInterest from "../../mongoDB/schemes/charInterest"


async function getAllIslands(){
    const islands = await IslandWhitelist.find()
    let arr = []
    islands.forEach(island => {
        // @ts-ignore
        arr.push({
            // @ts-ignore
            island: island.island,
        })
    })
    return arr
}

async function getTagTree(){
    const islands = await getAllIslands()
    let tagTree = []
    for (const island of islands) {
        //@ts-ignore
        let tmp = await BuildingWhitelist.find({text: island.island})
        let arr = []

        for(let element of tmp){
            arr.push({
                //@ts-ignore
                building: element.building,
                //@ts-ignore
                text: element.text,
                //@ts-ignore
                parent: element.parent,
                //@ts-ignore
                expertSymbol: element.expertSymbol
            })
        }
        tagTree.push({
            // @ts-ignore
            island: island.island,
            // @ts-ignore
            children: arr
        })
    }
    return tagTree
}

async function newCharInterest(data, char_id, expertBool: Boolean){
    for(let element of data){
        if(await CharacterInterest.findOne({char_id: char_id, building:element.building, expertBool: expertBool})){
            continue
        }
        await new CharacterInterest({
            char_id: char_id,
            building:element.building,
            text: element.text,
            parent: element.parent,
            expertSymbol: element.expertSymbol,
            expertBool: expertBool

        }).save()
    }
}

async function deleteCharInterest(data, char_id, expertBool: Boolean){
    let buildings = []
    data.forEach(element =>{
        // console.log(element.building)
        //@ts-ignore
        buildings.push(element.building)
    })
    await CharacterInterest.deleteMany({char_id: char_id, expertBool: expertBool, building: {$nin: buildings}})
}

@RpgModule<RpgServer>({
    engine:{
        onStart(engine: RpgServerEngine){
            const app = engine.app

            app.delete('/admin/deleteWorldFromCharinterest', async (req,res)=>{
                const data = req.body
                // console.log(data)
                await CharacterInterest.deleteMany({text: data.island})
                res.send("IslandInterests deleted")
            })
            app.delete('/admin/deleteBuildingFromCharinterest', async (req,res)=>{
                const data = req.body
                await CharacterInterest.deleteMany({building: data.building})
                res.send("IslandInterests deleted")
            })

            app.post('/user/getIslandSelectionData', async (req, res) =>{
                try{
                    const playerid = req.body.data
                    const character = await Character.findOne({_id: playerid})
                    const spriteName = character.spriteName
                    const islandSelection = await CharacterInterest.find({char_id: playerid}).distinct('text')
                    let choicesArr = []
                    for(let element of islandSelection){
                        //@ts-ignore
                        choicesArr.push({island: element})
                    }
                    if(islandSelection.length === 0){
                        choicesArr = await getAllIslands()
                    }

                    const islandSelectionData = {
                        spriteName: spriteName,
                        islandSelection: choicesArr
                    }

                    res.send({
                        islandSelectionData: islandSelectionData
                    })
                } catch (err){
                    console.log(err)
                }
            })
            app.post('/player/getUserType', async (req, res)=>{
                try {
                    const playerid = req.body.data
                    const character = await Character.findOne({_id: playerid})
                    res.send(character.userType)
                }catch (err){
                    console.log(err)
                }
            })
            app.patch('/user/disableBuilding',async (req, res)=>{
                try {
                    const building = req.body.building
                    await BuildingWhitelist.updateOne({building: building.building},{$set:{isDisabled: true}})
                    res.send("building disabled")
                }catch (err){
                    console.log(err)
                }
            })
            app.post('/user/getProfileData', async (req,res) =>{
                const playerid = req.body.data
                const character = await Character.findOne({_id: playerid})
                const interest = await CharacterInterest.find({char_id: playerid, expertBool: false})
                const expert = await CharacterInterest.find({char_id: playerid, expertBool: true})
                const imgPointer = character.imgPointer
                const profileData = {
                    imgPointer: imgPointer,
                    interest: interest,
                    expert: expert
                }


                res.send({
                    profileData: profileData
                })
            })
            app.put('/user/updateProfile', async (req, res) =>{
                const data = req.body
                await newCharInterest(data.interest, data.id , false)
                await deleteCharInterest(data.interest, data.id , false)
                await newCharInterest(data.expert, data.id , true)
                await deleteCharInterest(data.expert, data.id , true)

                const imgPointer = data.imgPointer
                const spriteName = data.spriteName

                await Character.updateOne({_id: data.id},
                    {$set: {
                            spriteName: spriteName,
                            imgPointer: imgPointer
                        }})
                res.send("updated profile")
            })

            app.get('/universe/tagTreeAndAvatar', async (req,res)=>{
                try{
                    const universe = await Universe.find()
                    const pngArray = await JSON.parse(universe[0].avatar)
                    const tagTree = await getTagTree()

                    res.send({
                        pngArray: pngArray,
                        tagTree: tagTree

                    })
                }catch (err) {
                    console.log(err)
                }
            })

            app.get('/universe/getTagTree', async (req,res)=>{
                    const tagTee = await getTagTree()
                    res.send({
                        tagTree: tagTee
                    })
                try{
                }catch (err){
                    console.log(err)
                }
            })


            app.get('/user/allIslands', async (req,res)=>{
                try{
                    const islandSelection = await getAllIslands()
                    res.send(islandSelection)
                }catch (e) {
                    console.log(e)
                }
            })
        }
    }
})

export default class RpgServerModule {}

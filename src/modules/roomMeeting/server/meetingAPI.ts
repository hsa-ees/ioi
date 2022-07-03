import axios from "axios"
import {RpgPlayer} from "@rpgjs/server";
import Meeting from './../../mongoDB/schemes/meeting';



export default class MeetingHandler
{
    /**
     * Create Meeting by making a GET-Request to our Classroom-API.
     * Save the Response in mongodb with the roomname as identifier.
     * The response are links for the meetings.
     * The edited_roomname parameter is to sugarcoat or roomname, so if we
     * lose the Links we get as response we still can use the same roomname only
     * by changing the Sugarcoatfactor.
     * @param roomname
     */
    static async createMeeting(roomname: string){
        const API = 'https://meetdev.meetzi.de/api/ioi.php?type=createroom&room='
        let edited_roomname = 'ioi'+roomname
        let responsedata
        let joinlinks

        await axios.get(API+edited_roomname)
            .then((response)=>{
                responsedata = response.data
                if(responsedata.result.status === 'error')
                    throw new Error(responsedata.result.errormsg)
            })
            .then(async () => {
                joinlinks = responsedata.result.joinlinks
                //MeetingHandler.roomlinksCollection.set(roomname, JSON.stringify(joinlinks))
                let links = new Meeting({meetingID: edited_roomname, joinLinks: JSON.stringify(joinlinks)})
                await links.save()
                return;

            })
    }
    /**
     * Joins a Meeting by using the roomname and the player.
     * If the roomname doesnt exist it creates a new meeting.
     * We need to replace the __USER__ with our player, so the meeting knows
     * who the user is.
     * @param player
     * @param roomname
     */
    static async joinMeeting(player: RpgPlayer, roomname: string){
        let edited_roomname = 'ioi'+roomname
        const gui = player.gui("meetingApi")

        gui.on('leave',()=>{
            gui.close()
        })

        let links = await Meeting.findOne({meetingID: edited_roomname})

        if(!!links){
            let playerlinks = links.joinLinks.replace(/__USER__/g, player.name)
            await gui.open({roomlinks: JSON.parse(playerlinks)},{waitingAction: true})
        }else {
            await this.createMeeting(roomname)
            links = await Meeting.findOne({meetingID: edited_roomname})
            let playerlinks = links.joinLinks.replace(/__USER__/g, player.name)
            // @ts-ignore
            await gui.open({roomlinks: JSON.parse(playerlinks)},{waitingAction: true})
        }

        // @ts-ignore
        //MeetingHandler.roomlinksCollection.set(roomname, MeetingHandler.roomlinksCollection.get(roomname).replace(/__USER__/g, player.name))
        //let links = await Meeting.findOne({meetingID: roomname})
        /*let playerlinks = links.joinLinks.replace(/__USER__/g, player.name)
        // @ts-ignore
        await gui.open({roomlinks: JSON.parse(playerlinks)},{waitingAction: true})*/
    }
    /**
     * Possibility to close gui by the server.
     * maybe needed.
     * @param player
     */
    static async leaveMeeting(player: RpgPlayer){
        player.emit("leaveMeeting","")
    }
}


import {RpgServer, RpgModule, RpgPlayer, RpgShape} from '@rpgjs/server'
import MeetingHandler from "./meetingAPI";

@RpgModule<RpgServer>({
    player:{
        async onInShape(player: RpgPlayer, shape: RpgShape) {
            if(shape.properties.type === "RoomMeeting")
                MeetingHandler.joinMeeting(player, shape.name + player.map)
            //Joining the RoomMeeting after entering the Shape

        },
        async onOutShape(player: RpgPlayer, shape: RpgShape){
            if(shape.properties.type === "RoomMeeting")
                    MeetingHandler.leaveMeeting(player)
            //Leaving the RoomMeeting after leaving the Shape
        },
    },
})
export default class RpgServerEngine {}

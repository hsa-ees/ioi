import {RpgServer, RpgModule, RpgPlayer, RpgWorld} from '@rpgjs/server'
import exp from "constants";

@RpgModule<RpgServer>({
    engine: {
        async onStart(_engine: RpgServerEngine){
            const interval = setInterval(function() { //starts a timer that calls the proximity check for all players every second
                    for (const player of RpgWorld.getPlayers()) {
                        //the check is only called if there is a player and if the player is on a map
                        if (player != undefined &&player.map !=="") proximityMeetingCheck(player)

                    }

            }, 1000);
        },
    },
    player:{
      onConnected(player){
          player.setVariable('inMeeting','noMeeting')
          //setting the variable that defines the status of the player regarding the playerMeetings to the default value
      }
    },
})
export default class RpgServerEngine {}

/**
 * This method handles the playerMeetings for the player on the map
 * @param player:RpgPlayer
 */
export async function proximityMeetingCheck(player:RpgPlayer){
    //logic for the calling of the PlayerMeetings
        for (const shape of player.getInShapes()) {
            if (shape.properties.type == 'RoomMeeting') {
                return //abort if the player is inside a chatroom
            }
        }


        let speakingRange = 80
        //detecting if the player themself is in a Meeting
        if (player.getVariable('inMeeting') == 'noMeeting') { //if the player isn't in a meeting he searches for players and makes a new one or joins an existing meeting
            let playerList = RpgWorld.getPlayersOfMap(player.map)

            for (const iplayer of playerList) {//the distance between the players is calculated for every other player
                let inRoom = false
                for (const shape of iplayer.getInShapes()) {
                    if (shape.properties.type == 'RoomMeeting') {
                        inRoom = true //abort if other player inside a chatroom
                    }
                }
                let distance = 0
                let xDifference = Math.abs(player.position.x - iplayer.position.x)
                let yDifference = Math.abs(player.position.y - iplayer.position.y)
                //console.log(xDifference + '   ' + yDifference)
                distance = distance + Math.sqrt(Math.pow(xDifference, 2) + Math.pow(yDifference, 2))
                //console.log(distance)
                if (distance < speakingRange && player.id != iplayer.id && !inRoom) {
                    if (iplayer.getVariable('inMeeting') == 'noMeeting') {

                        let meetingName = player.id + player.map

                        player.gui("MeetingCall").open({playername: player.name, roomname: meetingName}, {})
                        iplayer.gui("MeetingCall").open({playername: iplayer.name, roomname: meetingName}, {})

                        /*
                                                        MeetingHandler.joinMeeting(player,meetingName)
                                                        MeetingHandler.joinMeeting(iplayer,meetingName)*/
                        player.setVariable('inMeeting', meetingName)
                        iplayer.setVariable('inMeeting', meetingName)
                        return
                    } else {
                        player.setVariable('inMeeting', iplayer.getVariable('inMeeting'))
                        player.gui("MeetingCall").open({
                            playername: player.name,
                            roomname: iplayer.getVariable('inMeeting')
                        }, {})
                        //MeetingHandler.joinMeeting(player,iplayer.getVariable('inMeeting'))
                        // console.log(player.id + iplayer.getVariable('inMeeting'))
                    }
                }
            }
        } else {
            // console.log('playerinmeeting')
            let playerList = RpgWorld.getPlayersOfMap(player.map)
            //playerList.forEach(iplayer=> {
            for (const iplayer of playerList) {

                if (iplayer.getVariable('inMeeting') == player.getVariable('inMeeting') && player.id != iplayer.id) {
                    let distance = 0
                    let xDifference = Math.abs(player.position.x - iplayer.position.x)
                    let yDifference = Math.abs(player.position.y - iplayer.position.y)
                    //console.log(xDifference + '   ' + yDifference)
                    distance = distance + Math.sqrt(Math.pow(xDifference, 2) + Math.pow(yDifference, 2))
                    //console.log(distance)
                    if (distance < speakingRange + 40) {
                        //console.log('player in range')
                        return
                    }
                }

            }
            // console.log('playeroutofMeeting')
            player.gui("MeetingCall").close()
            //MeetingHandler.leaveMeeting(player)
            player.setVariable('inMeeting', 'noMeeting')
        }

}

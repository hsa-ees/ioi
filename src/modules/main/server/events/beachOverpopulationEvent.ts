import {RpgEvent, EventData, RpgPlayer, RpgWorld} from "@rpgjs/server";
import RpgServerEngine from "../../server"

@EventData({
    name: 'overpopulationEvent',
    hitbox: {
        width: 32,
        height: 16
    }
})

export class BeachOverpopulationEvent extends RpgEvent{
    onInit() {
        this.setGraphic('male012')
    }

    async onAction(player: RpgPlayer, rpgEngine: RpgServerEngine){
        const currentMap = player.map
        const players = RpgWorld.getPlayersOfMap(currentMap)
        const playerNumber = players.length
        await player.showText('so many people:' + playerNumber, {
            talkWith: this
        })
        if(playerNumber >= 2){
            await player.showText('too many people:', {
                talkWith: this
            })
            //verändern der Karten von allen
        }
    }
}

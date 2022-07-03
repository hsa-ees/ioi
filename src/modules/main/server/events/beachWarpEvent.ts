import {RpgEvent, EventData, RpgPlayer, RpgWorld} from "@rpgjs/server";

@EventData({
    name: 'warp1',
    hitbox: {
        width: 35,
        height: 35
    }
})

export class BeachWarpEvent extends RpgEvent{


    async onAction(player: RpgPlayer){
        await player.showText('Warp to the Wall!', {
            talkWith: this
        })
        await player.changeMap('wall')
    }
}

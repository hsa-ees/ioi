import {RpgEvent, EventData, RpgPlayer} from "@rpgjs/server";

@EventData({
    name: 'warp1',
    hitbox: {
        width: 35,
        height: 35
    }
})

export class WallWarpEvent extends RpgEvent{


    async onAction(player: RpgPlayer){
        await player.showText('Warp to the beach!', {
            talkWith: this
        })
        await player.changeMap('beach')
    }
}

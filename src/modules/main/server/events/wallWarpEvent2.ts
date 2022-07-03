import {RpgEvent, EventData, RpgPlayer} from "@rpgjs/server";

@EventData({
    name: 'warp2',
    hitbox: {
        width: 35,
        height: 35
    }
})

export class WallWarpEvent2 extends RpgEvent{


    async onAction(player: RpgPlayer){
        await player.showText('Warp to the shop!', {
            talkWith: this
        })
        await player.changeMap('shop')
    }
}

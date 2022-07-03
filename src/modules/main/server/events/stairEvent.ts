import {RpgEvent, EventData, RpgPlayer, RpgWorld} from "@rpgjs/server";

@EventData({
    name: 'stairEvent',
    hitbox: {
        width: 35,
        height: 35
    }
})

export class StairEvent extends RpgEvent{


    async onPlayerTouch(player: RpgPlayer){
        await player.teleport({x: player.position.x, y:player.position.y,z:1})
        console.log(player.position)
    }

}

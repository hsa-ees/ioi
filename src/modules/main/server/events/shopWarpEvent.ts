import {RpgEvent, EventData, RpgPlayer} from "@rpgjs/server";
import {inputs} from "../../../../config/client/inputs";

@EventData({
    name: 'shopWarpEvent',
    hitbox: {
        width: 64,
        height: 32

    }
})

export class ShopWarpEvent extends RpgEvent{


    async onPlayerTouch(player: RpgPlayer){
        await player.showText('Warp to the Wall!', {
            talkWith: this
        })

        await player.changeMap('wall')
    }
    //blockiert die Inputs des Spielers durch die Mitnahme des Inputs
}

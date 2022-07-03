import {RpgEvent, EventData, RpgPlayer} from "@rpgjs/server";

@EventData({
    name: 'healthlossNPC',
    hitbox: {
        width: 32,
        height: 16
    }
})

export class HealthlossEvent extends RpgEvent{
    onInit() {
        this.setGraphic('female132')
    }

    async onAction(player: RpgPlayer){
        player.showText('stab ...', {
            talkWith: this
        })
        player.hp = player.hp-10


    }
}

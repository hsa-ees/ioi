import {RpgEvent, EventData, RpgPlayer} from "@rpgjs/server";

@EventData({
    name: 'changeMale012',
    hitbox: {
        width: 32,
        height: 16
    }
})

export class CharacterChangeEventMale012 extends RpgEvent{
    onInit() {
        this.setGraphic('male012')
    }

    async onAction(player: RpgPlayer){
        await player.showText('changing Character ...', {
            talkWith: this
        })
        await player.setGraphic('male012')
    }
}

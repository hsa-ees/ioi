import {RpgEvent, EventData, RpgPlayer} from "@rpgjs/server";

@EventData({
    name: 'changeFemale132',
    hitbox: {
        width: 32,
        height: 16
    }
})

export class CharacterChangeEventFemale132 extends RpgEvent{
    onInit() {
        this.setGraphic('female132')
    }

    async onAction(player: RpgPlayer){
        await player.showText('changing Character ...', {
            talkWith: this
        })
        await player.setGraphic('female132')
    }
}

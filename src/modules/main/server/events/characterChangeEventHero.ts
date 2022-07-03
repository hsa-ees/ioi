import {RpgEvent, EventData, RpgPlayer} from "@rpgjs/server";

@EventData({
    name: 'changeHero',
    hitbox: {
        width: 32,
        height: 16
    }
})

export class CharacterChangeEventHero extends RpgEvent{
    onInit() {
        this.setGraphic('hero')
    }

    async onAction(player: RpgPlayer){
        await player.showText('changing Character ...', {
            talkWith: this
        })
        await player.setGraphic('hero')
    }
}

import {RpgEvent, EventData, RpgPlayer, RpgWorld, MapData, RpgMap} from "@rpgjs/server";
import {getMapHandler, MapHandler} from "../../../mapHandler/server/mapHandler";


@EventData({
    name: 'Veronika',
    hitbox: {
        width: 20,
        height: 20,
    }
})

export class Veronika extends RpgEvent{

    onInit() {
        this.setGraphic('female132')
    }

    async onAction(player: RpgPlayer){
        // @ts-ignore
        await player.showText('Noch kannst du hier nicht lang. Bringe mehr ' + player.getCurrentMap()?.name + "-Interessierte auf die Insel, sodass sie wächst!", {
            talkWith: this,
            fullWidth: false,
        })
    }
}

@EventData({
    name: 'Caroline',
    hitbox: {
        width: 20,
        height: 20,
    }
})

export class Caroline extends RpgEvent{

    onInit() {
        this.setGraphic('female132')
    }

    async onAction(player: RpgPlayer){
        // @ts-ignore
        await player.showText('Noch kannst du hier nicht lang. Bringe mehr ' + player.getCurrentMap()?.name + "-Interessierte auf die Insel, sodass sie wächst!", {
            talkWith: this,
            fullWidth: false,
        })
    }
}

@EventData({
    name: 'biggerIsland',
    hitbox: {
        width: 35,
        height: 35
    }
})

export class BiggerIslandEvent extends RpgEvent{

    onInit() {
        this.setGraphic('female132')
    }

    async onAction(player: RpgPlayer){
        await player.showText('Island too small? Wait no more!', {
            talkWith: this
        })
        await player.changeMap("Mathe1")
    }
}

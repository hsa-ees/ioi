import {RpgEvent, EventData, RpgPlayer, RpgWorld, MapData, RpgMap} from "@rpgjs/server";
import {getMapHandler, MapHandler, } from "../../../mapHandler/server/mapHandler";

@EventData({
    name: 'biggerIsland2',
    hitbox: {
        width: 50,
        height: 50,
    }
})
export class GrowEvent2 extends RpgEvent{

    async onInit() {
        this.setGraphic('female132')
    }

    async onPlayerTouch(player: RpgPlayer){

        const mapH = getMapHandler()

        var map = player.getCurrentMap()
        // @ts-ignore
        var world = mapH.getWorld(map.name)

        // @ts-ignore
        if (map.id == world.activeMap){
            await player.showText('Solch eine schöne Aussicht!', {
                talkWith: this
            })
        }
        else {
            player.changeMap(world.getActiveMap())
        }
        //player.changeMap("Mathe1")
    }

}



@EventData({
    name: 'biggerIsland',
    hitbox: {
        width: 50,
        height: 50,
    }
})
export class GrowEvent extends RpgEvent{

    async onInit() {
        this.setGraphic('female132')
    }

    async onPlayerTouch(player: RpgPlayer){

        const mapH = getMapHandler()

        var map = player.getCurrentMap()
        // @ts-ignore
        var world = mapH.getWorld(map.name)

        // @ts-ignore
        if (map.id == world.activeMap){
            await player.showText('Solch eine schöne Aussicht!', {
                talkWith: this
            })
        }
        else {
            player.changeMap(world.getActiveMap())
        }
        //player.changeMap("Mathe1")
    }

}

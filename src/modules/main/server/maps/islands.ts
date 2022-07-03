import {RpgMap, MapData, RpgPlayer} from '@rpgjs/server'
// import {Caroline, Veronika} from "../events/biggerIslandEvent";
import {getMapHandler} from "../../../mapHandler/server/mapHandler";
import {World} from "../../../mapHandler/server/world";



@MapData({
    id:'island',
    file: require('./tmx/IslandSmall.tmx'),
    name: 'island',
    sounds: ['town_small'],
    // events: [
    //     Veronika,
    //     Caroline,
    // ],
    syncSchema: {
        world: World
    }
})
export class Island extends RpgMap{
    world: World
    name: string

    async onInit() {
        super.onLoad();
        const mapH = getMapHandler()
        // @ts-ignore
        let islandNumber = parseInt(this.id.split('').pop(), 10)

        if (!mapH.hasWorld(this.name)){
            await mapH.createNewWorld(this.name, this.id, islandNumber)
            this.world = mapH.getWorld(this.name)
        }
        else {
            this.world = mapH.getWorld(this.name)
            this.world.addMap(this.id, islandNumber)
        }
    }

    onJoin(player: RpgPlayer) {
        super.onJoin(player);
        this.world.playersOfWorld++
    }

    onLeave(player: RpgPlayer) {
        super.onLeave(player);
        this.world.playersOfWorld--
    }
}

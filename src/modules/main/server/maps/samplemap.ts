import {RpgMap, MapData, RpgPlayer, RpgWorld} from '@rpgjs/server'
import { VillagerEvent } from '../events/villager'


@MapData({
    id: 'mymap',
    file: require('./tmx/simplemap.tmx'),
    name: 'Forest',
    events: [
        VillagerEvent
    ],
    syncSchema: {
        count: Number,
        maxUser: Number
    }
})

export class SampleMap extends RpgMap {
    count: number = 0
    maxUser: number = 3

    onJoin(player: RpgPlayer) {
        super.onJoin(player);
        this.count++
        console.log(this.count)
        if(this.count > this.maxUser){
            let players = RpgWorld.getPlayersOfMap(this.data.id)
            players.forEach((value) => {
                value.changeMap("newMap")
            })
        }
    }

    onLeave(player: RpgPlayer) {
        super.onLeave(player);
        this.count--
    }

}
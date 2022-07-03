import { RpgMap, MapData } from '@rpgjs/server'
import {WallWarpEvent} from "../events/wallWarpEvent";
import {WallWarpEvent2} from "../events/wallWarpEvent2";
@MapData({
    id: 'wall',
    file: require('./tmx/wall.tmx'),
    name: 'Town',
    events: [
        WallWarpEvent,
        WallWarpEvent2,

    ],
    //sounds: ['town']
    //auskommentiert da noch keine town Music
})
export class WallMap extends RpgMap {}


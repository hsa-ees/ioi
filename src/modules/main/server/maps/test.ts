import { RpgMap, MapData } from '@rpgjs/server'
import { VillagerEvent } from '../events/villager'
import {BeachWarpEvent} from "../events/beachWarpEvent";

@MapData({
    id: 'test',
    file: require('./tmx/Test.tmx'),
    name: 'Town',
    events: [

    ],
    sounds: ['town']
})
export class TestMap extends RpgMap {}

import { RpgMap, MapData } from '@rpgjs/server'
import {BeachWarpEvent} from "../events/beachWarpEvent";
import {HealthlossEvent} from "../events/damageEvent";

@MapData({

    id: 'bigBeach',
    file: require('./tmx/beach.tmx'),
    name: 'Town',


})
export class BigBeachMap extends RpgMap {}

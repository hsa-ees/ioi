import { RpgMap, MapData } from '@rpgjs/server'
import {BeachWarpEvent} from "../events/beachWarpEvent";
import {HealthlossEvent} from "../events/damageEvent";
import {BeachOverpopulationEvent} from "../events/beachOverpopulationEvent";

@MapData({
    id: 'beach',
    file: require('./tmx/beach.tmx'),
    name: 'Town',
    events: [
        BeachWarpEvent,
        HealthlossEvent,
        BeachOverpopulationEvent


    ],
})
export class BeachMap extends RpgMap {}

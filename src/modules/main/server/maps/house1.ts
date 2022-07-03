import {RpgMap, MapData, RpgPlayer} from '@rpgjs/server'
import {StairEvent} from "../events/stairEvent";


@MapData({
    id:'house1ground',
    file: require('./tmx/house1ground.tmx'),
    name: 'House',
})
export class House1ground extends RpgMap{}

@MapData({
    id:'house1middle1',
    file: require('./tmx/house1middle1.tmx'),
    name: 'House'

})
export class House1middle1 extends RpgMap{}


@MapData({
    id:'house1middle2',
    file: require('./tmx/house1middel2.tmx'),
    name: 'House'
})
export class House1middle2 extends RpgMap{}


@MapData({
    id:'house1Top',
    file: require('./tmx/house1top.tmx'),
    name: 'House'
})
export class House1Top extends RpgMap{}

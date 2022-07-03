import {RpgMap, MapData, RpgPlayer} from '@rpgjs/server'
import {StairEvent} from "../events/stairEvent";


@MapData({
    id:'house3ground',
    file: require('./tmx/house3ground.tmx'),
    name: 'House',
})
export class House3ground extends RpgMap{}

@MapData({
    id:'house3middle1',
    file: require('./tmx/house3middle1.tmx'),
    name: 'House'
})
export class House3middle1 extends RpgMap{}


@MapData({
    id:'house3middle2',
    file: require('./tmx/house3middle2.tmx'),
    name: 'House'
})
export class House3middle2 extends RpgMap{}


@MapData({
    id:'house3Top',
    file: require('./tmx/house3top.tmx'),
    name: 'House'
})
export class House3Top extends RpgMap{}

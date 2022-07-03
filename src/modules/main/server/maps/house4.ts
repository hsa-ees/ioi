import {RpgMap, MapData, RpgPlayer} from '@rpgjs/server'
import {StairEvent} from "../events/stairEvent";


@MapData({
    id:'house4ground',
    file: require('./tmx/house4ground.tmx'),
    name: 'House',
})
export class House4ground extends RpgMap{}

@MapData({
    id:'house4middle1',
    file: require('./tmx/house4middle1.tmx'),
    name: 'House'
})
export class House4middle1 extends RpgMap{}


@MapData({
    id:'house4middle2',
    file: require('./tmx/house4middle2.tmx'),
    name: 'House'
})
export class House4middle2 extends RpgMap{}


@MapData({
    id:'house4Top',
    file: require('./tmx/house4top.tmx'),
    name: 'House'
})
export class House4Top extends RpgMap{}

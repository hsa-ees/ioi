import {RpgMap, MapData, RpgPlayer} from '@rpgjs/server'
import {StairEvent} from "../events/stairEvent";


@MapData({
    id:'house2ground',
    file: require('./tmx/house2ground.tmx'),
    name: 'House',
})
export class House2ground extends RpgMap{}

@MapData({
    id:'house2ground_extra_rooms',
    file: require('./tmx/house2ground_extra_rooms.tmx'),
    name: 'House',
})
export class House2ground_extra_rooms extends RpgMap{}


@MapData({
    id:'house2middle1',
    file: require('./tmx/house2middle1.tmx'),
    name: 'House',

})
export class House2middle1 extends RpgMap{}


@MapData({
    id:'house2middle2',
    file: require('./tmx/house2middle2.tmx'),
    name: 'House'
})
export class House2middle2 extends RpgMap{}


@MapData({
    id:'house2Top',
    file: require('./tmx/house2top.tmx'),
    name: 'House'
})
export class House2Top extends RpgMap{}

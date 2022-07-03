import {RpgMap, MapData, RpgPlayer} from '@rpgjs/server'


@MapData({
    id:'island1Small',
    file: require('./tmx/IslandSmall.tmx'),
    name: 'Island',
    sounds: ['town_small'],
})
export class Island1Small extends RpgMap{
}

@MapData({
    id:'island1Middle',
    file: require('./tmx/IslandMiddle.tmx'),
    name: 'Island',
    sounds: ['town_middle'],
})
export class Island1Middle extends RpgMap{}


@MapData({
    id:'island1Big',
    file: require('./tmx/IslandBig.tmx'),
    name: 'Island',
    sounds: ['town_big'],
})
export class Island1Big extends RpgMap{}

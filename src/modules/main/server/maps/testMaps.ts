import {RpgMap, MapData} from '@rpgjs/server'
import {CharacterChangeEventMale012} from "../events/characterChangeEventMale012";
import {CharacterChangeEventFemale132} from "../events/characterChangeEventFemale132";
import {CharacterChangeEventHero} from "../events/characterChangeEventHero";
import {ShopWarpEvent} from "../events/shopWarpEvent";

@MapData({
    id:'testIsland',
    file: require('./tmx/testIsland.tmx'),
    name: 'Town'
})
export class TestIsland extends RpgMap{}


@MapData({
    id:'shop',
    file: require('./tmx/shop.tmx'),
    name: 'Town',
    events:[
        CharacterChangeEventMale012,
        CharacterChangeEventFemale132,
        CharacterChangeEventHero,
        ShopWarpEvent,

    ],
})
export class ShopMap extends RpgMap{}

import {MapData, RpgMap} from "@rpgjs/server";


@MapData({
    id:'Shop',
    file: require('./tmx/shop.tmx'),
    name: 'Building',
})
export class ShopBuilding extends RpgMap{}
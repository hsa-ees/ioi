import {MapData, RpgMap, RpgPlayer} from "@rpgjs/server";
import { getMapHandler} from "../../../mapHandler/server/mapHandler";


@MapData({
    id:'Building',
    file: require('./tmx/shop.tmx'),
    name: 'Building',
})
export class BuildingMap extends RpgMap{

    async onJoin(player: RpgPlayer){
        const mapH = getMapHandler()
        // @ts-ignore
        let building = mapH.allBuildings.get(this.id)
        // @ts-ignore
        await building.addVisitor(player.name)

    }

}
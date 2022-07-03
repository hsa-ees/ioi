import {RpgEvent, EventData, RpgPlayer, RpgWorld, MapData, RpgMap} from "@rpgjs/server";
import {getMapHandler, MapHandler} from "../../../mapHandler/server/mapHandler";
import {RpgSprite} from "@rpgjs/client";

declare module '@rpgjs/client' {
    export interface RpgSprite {
        textGraphic: PIXI.Text
    }
}

@EventData({
    name: 'nameEvent1',
    hitbox: {
        width: 1,   // 200
        height: 1,  // 200
    }
})
export class nameEvent1 extends RpgEvent{
    onChanges(){
        // console.log("In onChange in Event")
        //@ts-ignore
        const world = getMapHandler().getWorld(this.getCurrentMap()?.name)
        // console.log("Map Name: "+this.getCurrentMap()?.name)

        // console.log(world.updateEvent)

        if (world.updateEvent){
            // console.log("UpdateEvent TRUE-------------------------")

            // console.log("Event Name: "+this.name)
            // console.log("Most Wanted: "+ world.buildingToChangeMap)

            if(this.name == world.buildingToChangeMap){
                // console.log("UPDATE EVENT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                this.name = 'Lerngebäude'
                world.deleteBuilding(world.buildingToChangeMap)
                world.updateEvent = false
                world.buildingToChangeMap = ''
            }
        }
    }


}
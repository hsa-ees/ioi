import {World} from "./world";
import {Position} from "@rpgjs/server/lib/Player/Player";
import {RpgShape} from "@rpgjs/server";

export interface BuildingsI {

    name: string
    id: string

    world: World
    position: Position
    shape?: RpgShape

    createNewBuilding(shape: RpgShape)
    saveInDB()

}
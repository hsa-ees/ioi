import { RpgClient, RpgModule } from '@rpgjs/client'
import { HeroCharacter } from './characters/hero';
import { Tilesets } from './maps/map';
import { Musics } from './sounds'
import {Characters} from "./characters/characters";
import hud from './gui/hud.vue'
import buildingName from '../../player_menu'

@RpgModule<RpgClient>({ 
    spritesheets: [
        Tilesets,
        HeroCharacter,
        Characters,
    ],
    gui:[
        hud,
        buildingName
    ],
    sounds: [
        Musics
    ]

})
export default class RpgClientEngine {}

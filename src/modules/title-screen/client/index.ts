import { RpgClient, RpgModule } from '@rpgjs/client'
import titleGui from './gui/title.vue'
import loginGui from './gui/connect.vue'
import islandSelectGui from '../../player_menu/client/gui/chose-Island.vue'
import { sprite } from './sprite'

@RpgModule<RpgClient>({ 
    sprite,
    gui: [
        titleGui,
        loginGui,
        islandSelectGui,
    ],
})
export default class RpgClientEngine {}
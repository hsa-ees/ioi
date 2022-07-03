import { RpgClient, RpgModule } from '@rpgjs/client'
import NameBuilding from './gui/name-building.vue'
import ChoseIsland from './gui/chose-Island.vue'
import Profile from './gui/profile.vue'
import Profile2 from './gui/profile2.vue'
import GameWindow from "../../player_menu/client/gui/gameWindow.vue"
import buildingName from '../../player_menu/client/gui/name-building.vue'
import overWorld from '../../player_menu/client/gui/overworld.vue'
import chat from '@rpgjs/chat'
import notification from './gui/notification.vue'



@RpgModule<RpgClient>({
    gui: [
        NameBuilding,
        ChoseIsland,
        Profile,
        GameWindow,
        overWorld,
        chat,
        buildingName,
        Profile2,
        notification,


    ],
})
export default class RpgClientEngine {}
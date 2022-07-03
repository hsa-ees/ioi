import { RpgModule, RpgClient } from '@rpgjs/client'
import DialogUi from './window/dialog.vue'
import ChoiceUi from './window/choice.vue'
import MenuUi from './menu/main.vue'
import ShopUi from './shop/main.vue'
import WindowUi from './window/window.vue'
import DisconnectUi from './notifications/disconnected.vue'
import NotificationUi from './notifications/alert.vue'
import { GuiSounds } from './assets/sounds'
import TrueMenu from './menu/layouts/main.vue'

@RpgModule<RpgClient>({
    gui: [
        DialogUi,
        MenuUi,
        WindowUi,
        ChoiceUi,
        DisconnectUi,
        ShopUi,
        NotificationUi,
        TrueMenu
    ],
    sounds: [
        GuiSounds
    ]
})
export default class RpgClientEngine {}
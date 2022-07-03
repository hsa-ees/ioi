import { RpgClient, RpgModule } from '@rpgjs/client'
import meetingApi from './gui/meetingApi.vue'

@RpgModule<RpgClient>({
    gui: [
        meetingApi
    ]
})
export default class RpgClientEngine {}
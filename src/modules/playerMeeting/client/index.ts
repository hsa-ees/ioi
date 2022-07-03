import { RpgClient, RpgModule } from '@rpgjs/client'
import MeetingCall from './gui/MeetingCall.vue'
import loadingMeeting from './gui/jitsiUtils/loadingMeeting.vue'
import chatGui from './gui/chat.vue'

@RpgModule<RpgClient>({ 
    gui: [
        MeetingCall,
        loadingMeeting,
        chatGui
    ]
})
export default class RpgClientEngine {}
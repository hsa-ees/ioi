<template>
  <div style="position: absolute; top: 10px ; right: 10px; ">
    <vue-jitsi-meet
        ref="jitsiRef"
        domain="meet.jit.si"
        :options="jitsiOptions"
    ></vue-jitsi-meet>
  </div>
</template>

<script>
// rpg-window true, middle, 100%
//20%
import {JitsiMeet} from "./jitsiUtils"

export default {
  name: 'MeetingCall',
  inject:['rpgGuiClose','rpgEngine','rpgCurrentPlayer','rpgSound'],
  props: {
    /**
     * Here we need to get the player and roomname, which are sent by the data from gui.open()
     */
    playername: {
      type: String,
      default: 'Guest'
    },
    roomname:{
      type: String,
      default: 'some-room-name'
    }
  },
  data() {

    return {
      alreadyMuted: false,
    }
  },
  components: {
    VueJitsiMeet: JitsiMeet,
  },
  computed: {
    /**
     * Here you can use your own options to give the playermeetings your personal design.
     * Options can be looked up on jitsi github
     * https://github.com/jitsi/jitsi-meet/blob/master/react/features/base/config/interfaceConfigWhitelist.js
     * @returns {{userInfo: {displayName: string, email: string}, configOverwrite: {enableNoisyMicDetection: boolean, startAudioOnly: boolean, startWithAudioMuted: boolean, doNotStoreRoom: boolean, prejoinPageEnabled: boolean, toolbarButtons: string[], disableInviteFunctions: boolean}, width: number, noSSL: boolean, interfaceConfigOverwrite: {SHOW_JITSI_WATERMARK: boolean, SHOW_WATERMARK_FOR_GUESTS: boolean, SHOW_CHROME_EXTENSION_BANNER: boolean}, roomName: string, height: number, onload: default.methods.onIFrameLoad}}
     */
    jitsiOptions () {
      return {
        roomName: this.roomname,
        width: 350, //770 //150
        height: 250, //580
        noSSL: false,
        userInfo: {
          email: 'user@email.com',
          displayName: this.playername,
        },
        configOverwrite: {
          enableNoisyMicDetection: false,
          prejoinPageEnabled: false,
          startAudioOnly: false,//enabling the video of everyone on join
          startWithAudioMuted: false, //enabling the audio of everyone on join
          disableInviteFunctions: true, //disabling the ability to invite others into the room
          doNotStoreRoom: true,
          toolbarButtons: [ //disabling every button that is not needed or harmful to the Meeting
            'camera',
            'chat',
            //'closedcaptions',
            'desktop',
            //'download',
            //'embedmeeting',
            'etherpad',
            //'feedback',
            'filmstrip',
            'fullscreen',
            'hangup',
            //'help',
            'highlight',
            //'invite',
            //'linktosalesforce',
            //'livestreaming',
            'microphone',
            //'mute-everyone',
            //'mute-video-everyone',
            'participants-pane',
            //'profile',
            //'raisehand',
            //'recording',
            //'security',
            'select-background',
            'settings',
            //'shareaudio',
            //'sharedvideo',
            'shortcuts',
            //'stats',
            'tileview',
            'toggle-camera',
            'videoquality',
            '__end'
          ],
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_CHROME_EXTENSION_BANNER: false,
          //HIDE_INVITE_MORE_HEADER: true,
        },
        onload: this.onIFrameLoad
      };
    },
  },
  mounted(){
    //if the audio was not already muted mutes the audio and unmutes it upon leaving the meeting
    //if the audio is already muted, the audio won't be unmuted upon leaving the meeting
    this.alreadyMuted = this.rpgSound.global._muted
    if(this.alreadyMuted.valueOf() === true){
    }else{
      this.rpgSound.global.mute(true)
    }
  },
  /** Lets Music play when Meeting is closed
   *
   */
  unmounted(){
    if(this.alreadyMuted.valueOf() === true){
    }else{
      this.rpgSound.global.mute(false)
    }
  },
  methods: {
    /** Creates EvenListener for when User leaves Meeting,
     * so we can destroy the Jitsi Widget
     */
    onIFrameLoad () {

      this.$refs.jitsiRef.addEventListener('videoConferenceLeft', this.onVideoConferenceLeft);
    },
    /**
     * Removes JitsiWidget for resource-management reasons
     * e is an event
     * @param e
     */
    onVideoConferenceLeft(e){
      JitsiMeet.removeJitsiWidget
      this.rpgGuiClose()
    },
  },
};
</script>

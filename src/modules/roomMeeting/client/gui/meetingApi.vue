<template>
    <iframe id="video" :src="roomlinks.video_moderator" :style="cssVars" allow="camera;microphone;display-capture"></iframe>
    <iframe v-if="!hideWhiteBoard" id="whiteboard" :src="roomlinks.whiteboard_moderator"></iframe>
    <iframe v-if="!hideEditor" id="editor"  :src="roomlinks.editor_moderator"></iframe>
  <rpg-window>
    <ul>
      <li>
        <VueCustomTooltip label="Vergrößert/Verkleinert das Meeting-Fenster" size="is-small" multiline="true">
          <button class="btn-meeting" @click="fullscreen">
            <img src="../assets/fullscreen.png" alt="Fullscreen">
          </button>
        </VueCustomTooltip>
        </li>
      <li>
        <VueCustomTooltip label="Öffnet/Schließt das Whiteboard" size="is-small" multiline="true">
          <button class="btn-meeting" @click="whiteboard">
            <img src="../assets/board.png" alt="Whiteboard">
          </button>
        </VueCustomTooltip>
      </li>
      <li>
        <VueCustomTooltip label="Öffnet/Schließt den Editor" size="is-small" multiline="true">
          <button class="btn-meeting"  @click="editor">
            <img src="../assets/contract.png" alt="Editor">
          </button>
        </VueCustomTooltip>
      </li>
      <li>
        <VueCustomTooltip label="Beendet das Meeting" size="is-small" multiline="true">
          <button class="btn-meeting" id="leave" @click="leave">
            <img src="../assets/phone.png" alt="Auflegen">
          </button>
        </VueCustomTooltip>
      </li>
    </ul>
  </rpg-window>
</template>

<script>
// use this Import for Tooltips
import VueCustomTooltip from "@adamdehaven/vue-custom-tooltip";


export default {

  name: "meetingApi",
  // we need rpg GuiInteraction to close this GUI, rpgSocket for data communication and rpgSound for muting or
  // unmuting game Sound
  inject:['rpgGuiInteraction','rpgSocket','rpgSound'],
  props: {
      roomlinks: JSON,
  },
  // Using for creating Tooltips
  components: {
    VueCustomTooltip
  },
  // Different Data
  data(){
    return{
      hideWhiteBoard: true,
      hideEditor: true,
      height: 400,
      width: 500,
      state: 0,
      isFull: true,
      alreadyMuted: false,
    }
  },
  /* Create Socket for Leaving-Communication with Server and
     mute Music
   */
  mounted() {
    const socket = this.rpgSocket()
    socket.on('leaveMeeting', () => {
      this.leave()
    })
    //if the audio was not already muted mutes the audio and unmutes it upon leaving the meeting
    //if the audio is already muted, the audio won't be unmuted upon leaving the meeting
    this.alreadyMuted = this.rpgSound.global._muted
    if(this.alreadyMuted.valueOf() === true){
    }else{
      this.rpgSound.global.mute(true)
    }

  },
  // let music play, when meeting closed
  unmounted(){
    if(this.alreadyMuted.valueOf() === true){
    }else{
      this.rpgSound.global.mute(false)
    }
  },
  methods:{
    // Switch between fullscreen or mini window
    fullscreen(){
      this.isFull = !this.isFull;
    },
    // For making the whiteboard visible or invisible
    whiteboard(){
      if(this.hideEditor === false){
        this.hideEditor = true
        this.hideWhiteBoard = false
      }else this.hideWhiteBoard = !this.hideWhiteBoard;
    },
    // For making the editor visible or invisible
    editor(){
      if(this.hideWhiteBoard === false){
          this.hideEditor = false
          this.hideWhiteBoard = true
      }else this.hideEditor = !this.hideEditor;


    },
    // Method to let the GUI get closed by Server
    leave(){
      this.rpgGuiInteraction('meetingApi','leave')
    }
  },
  computed: {
    // Using css-Variable for Iframe-Size to switch between Fullscreen or Mini Window
    cssVars() {
      return {
        '--cam-width': this.isFull ? '52%' : '300px',
        '--cam-height': this.isFull ? '70%' : '200px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

#video{
  width: var(--cam-width);
  height: var(--cam-height);
  background-color: black;
  left: 10px;
  top: 100px;
  position: absolute;
  border-style: none;
  overflow: auto;
}

#whiteboard{
  background-color: white;
  right: 50px;
  top: 10px;
  width: 45%;
  height: 90%;
  position: absolute;
  border-style: none;
  overflow: auto;
}

#editor{
  right: 50px;
  top: 10px;
  width: 45%;
  height: 90%;
  position: absolute;
  border-style: none;
  overflow: auto;
}

ul {
  border-radius: 25px;
  background-color: #606096B2;
  right: 40%;
  position: absolute;
  bottom: 10px;
  list-style-type: none;
  margin: 0;
  padding: 12px 10px 9px;
  border-style: solid;
  border-color: #D3D3D3B2;
  border-width: 3px;
}

#leave{
  background: #861c1c;
}

#leave:hover{
  background: #ce2d2d;
  box-shadow: 0 3px #4c0d0d;
  top: 1px;
}

#leave:active{
  background: #ce2d2d;
  box-shadow: 0 0 #4c0d0d;
  top: 5px;
}

.btn-meeting {
  min-width: 10px;
  height: 43px;
  color: #fff;
  padding: 5px 10px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  outline: none;
  border-radius: 5px;
  border: none;
  background: #1C8634FF;
}
.btn-meeting:hover {
  background: #2fce55;
  box-shadow: 0 3px #0D4C30FF;
  top: 1px;
}
.btn-meeting:active {
  background: #2fce55;
  box-shadow: 0 0 #0D4C30FF;
  top: 5px;
}

li{
  display: inline;
  margin: 10px;
}

img{
  width: 34px;
  height: 34px;
}



</style>
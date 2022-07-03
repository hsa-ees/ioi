<template>
  <div class="chat" v-show="showChat">
      <ul ref="chat-list">
          <li v-for="(msg, i) in messages" :key="i" :class="`type-${msg.type}`">{{ msg.message }}</li>
      </ul>
      <input
          style="float: left"
        type="text" 
        placeholder='Nachricht schicken...'
        @focus="stopMove" 
        @blur="startMove"
          @keydown.enter="send()"
        v-model="text">
      <!-- @keypress.enter="send">-->
    <button @click="send" style="float: right">
      <div class="svg-wrapper-1">
        <div class="svg-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
          </svg>
        </div>
      </div>
      <span>Send</span>
    </button>
  </div>
  <button id="button2" v-show="showChat" class="button2" @click="displayChat" type="button">
    <span>Hide Chat</span>
  </button>
  <button id="button3" v-show="!showChat" class="button3" @click="displayChat" type="button">
    <span>Show Chat</span>
  </button>
</template>

<script>
const GUI_CONTROLS = 'rpg-controls'

export default {
    name: 'rpg-chat',
    inject: ['rpgEngine', 'rpgGui', 'rpgSocket','rpgKeypress'],
    data() {
        return {
            text: '',
            messages: [],
            showChat: true
        }
    },
    mounted() {
        const socket = this.rpgSocket()
        socket.on('chat-message', ({ message, type }) => {
            this.messages.push({
                message,
                type
            })
          if (this.$refs['chat-list'] != null){
            const el = this.$refs['chat-list']
            el.scrollTop = el.scrollHeight + 100
          }
        })
      this.obsKeyPress = this.rpgKeypress.subscribe(({ control }) => {
        if (!this.active || !control) return
        if (control.actionName === 'enter') {
        }
      })
    },
    methods: {
        stopMove() {
            if (this.rpgGui.exists(GUI_CONTROLS)) this.rpgGui.hide(GUI_CONTROLS)
            this.rpgEngine.controls.stop = true
        },
        startMove() {
             if (this.rpgGui.exists(GUI_CONTROLS)) this.rpgGui.display(GUI_CONTROLS)
            this.rpgEngine.controls.stop = false
        },
        send() {
            if (!this.text || this.text.endsWith(' ')) return
            const socket = this.rpgSocket()
            // console.log(this.text)
            socket.emit('chat-message', this.text)
            // console.log(this.text)
            this.text = ''
        },
        displayChat(){
          this.showChat =!this.showChat

        },
    }
}
</script>

<style scoped lang="scss">
.chat {
  position: absolute;
  //z-index: 101;
  bottom: 0;
  background: rgba(96, 96, 150, 0.7);
  z-index: 70;
  //width: 320px;
  width: 30%;
  border-style: solid;
  border-color: rgba(211, 211, 211, 0.7);
  border-width: 3px;
  border-radius: 5px;

}

.chat input {
    padding: 10px;
    width: 40%;
    bottom: 0;
    margin: 5px 0px 5px 5px;
    left: 0;
}

.chat ul {
    list-style: none;
    color: white;
    font-family: $window-font-family;
    font-size: 12px;
    padding: 0;
    margin-left: 10px;
    max-height: 150px;
    overflow: auto;
}

.chat li.type-info {
    color: #59da25;
}
button {
  font-family: $window-font-family;
  font-size: 12px;
  background: #44b034;
  color: white;
  padding: 8px;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.2s;
  margin: 5px 10px 5px 5px;
}

button span {
  display: block;
  margin-left: 0.3em;
  transition: all 0.3s ease-in-out;
}

button svg {
  display: block;
  transform-origin: center center;
  transition: transform 0.3s ease-in-out;
}

button:hover .svg-wrapper {
  animation: fly-1 0.6s ease-in-out infinite alternate;
}

button:hover svg {
  transform: translateX(1.2em) rotate(45deg) scale(1.1);
}

button:hover span {
  transform: translateX(5em);
}

button:active {
  transform: scale(0.95);
}

@keyframes fly-1 {
  from {
    transform: translateY(0.1em);
  }

  to {
    transform: translateY(-0.1em);
  }
}

@keyframes fly-1 {
  from {
    transform: translateY(0.1em);
  }

  to {
    transform: translateY(-0.1em);
  }
}
.button2{
  bottom:0;
  left: 30%;
  position: absolute;
}
.button3{
  bottom: 0;
  left:0;
  position: absolute;
}

</style>
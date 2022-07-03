<template>
  <div v-if="callMenu===false">
  <button class="button-success" @click="callMenu=!callMenu">Menü</button>
  <button class="info-box" type="button">{{islandName}}</button>
  </div>
  <div v-if="callMenu===true">
    <MainMenu @hook:mounted="callMenu=true" @close="callMenu=false" :world="world" :playerID="playerID"></MainMenu>
  </div>
  <chat class="chat2"></chat>
</template>

<script>
import chat from '../../../our_chat/client/gui/chat.vue'
import MainMenu from'../../../own_default-gui/src/menu/layouts/main.vue'
export default {
  name: "overworld",
  inject: ['rpgCurrentPlayer','rpgStage','rpgGui','rpgGuiInteraction'],
  props: {
    world: String,
    playerID: {type: String}
  },
  components: {chat,MainMenu},   //fixed
  data(){
    return{
      player:{},
      islandName: '',
      callMenu: false
    }
  },
  methods:{
    callMainMenu(){
    }
  },
  updated(){

  },


  mounted() {
    // console.log(this.playerID)
    // console.log(this.world)
    this.obsCurrentPlayer = this.rpgCurrentPlayer.subscribe((object)=>{
      if(!object){
        return
      }
      this.player=object.object
      if(!this.player){
        return
      }

      if(this.player.map.includes(this.world)){
        this.islandName = this.world
      } else this.islandName=this.player.map
    })
  },
  unmounted() {
    this.obsCurrentPlayer.unsubscribe()
  }
}
</script>

<style scoped lang="scss">
$window-button-success-color: #1c8634 !default;
$window-button-success-shadow: #0d4c30 !default;
$window-button-color: rgba(128, 130, 162, 0.7) !default;
$window-button-shadow: rgb(128, 130, 162) !default;
/*button{
  position: relative;
  font-size: 20px;
  color: white;
  //z-index: 101;
  top: 0;
  left:0;
  background: rgba(96, 96, 150, 0.7);
  z-index: 70;
  border-style: solid;
  border-color: rgba(211, 211, 211, 0.7);
  border-width: 3px;
  border-radius: 5px;
  padding: 5px;
}*/

//.button1{
//  min-width: 130px;
//  height: 40px;
//  color: #fff;
//  padding: 5px 10px;
//  font-weight: bold;
//  cursor: pointer;
//  transition: all 0.3s ease;
//  position: relative;
//  display: inline-block;
//  outline: none;
//  border-radius: 5px;
//  border: none;
//  &:not(.disable):hover{}
//
//  background: $window-button-color;
//}
.button-success {
  min-width: 130px;
  height: 40px;
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

  background: $window-button-success-color;
}
.button-success:hover {
  box-shadow: 0 3px $window-button-success-shadow;
  top: 1px;
}
.button-success:active {
  box-shadow: 0 0 $window-button-shadow;
  top: 5px;
}
.info-box {
  min-width: 130px;
  height: 40px;
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
  &:not(.disable):hover{}

  background: $window-button-color;
  pointer-events: none;
}
.background{
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  background-size: cover;
}

.chat2{
  position: relative;
}


</style>
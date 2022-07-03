<template>
  <div>
    <rpg-window class="optionsmenu">
      <div>
        <p>Musik Optionen</p>
      </div>
      <div>
        <button type="button" class="css-button-3d--grey mute" @click="muteMusic">{{this.muteText}}</button>

      </div>
      <div>
        <button type="button" class="css-button-3d--grey back" @click="goBack">Zurück</button>
      </div>
    </rpg-window>
  </div>

</template>

<script>
export default {
  name: "options",
  inject: ['rpgSound'],
  emit:['close'],
  data(){
    return{
      mute: false,
      muteText: 'Aus'
    }
  },
  methods:{
    muteMusic(){

      this.rpgSound.global.mute(!this.mute)
      this.mute = !this.mute
      if(this.mute===true){
        this.muteText='An'
      }
      else{
        this.muteText='Aus'
      }

    },
    goBack(){
      this.$emit('close')
    }


  }
}
</script>

<style scoped>
.optionsmenu{
  position: absolute;
  width: 400px;
  height: 400px;
  align-items: center;
  text-align: center;
  flex-direction: row;
  display: inline;
  left: 43%;
  top: 25%;
}
.mute{
  display: inline;
  margin-top: 10px
}
.back{
  display: inline;
  margin-top: 10px
}

</style>
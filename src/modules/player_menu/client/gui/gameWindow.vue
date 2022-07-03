<template>
  <div class="background">
    <rpg-window width="800px" style="margin: auto">

      <div v-if="hasGame">
        <iframe :src="gameLink" style="border:0px;width:100%;height:500px" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>
      </div>
      <div v-else>
        <p style="text-align: center">Diese Insel hat noch keine Spiele.</p>
      </div>
      <button class="btn-success login" style="float: right; margin-top: 20px" @click="close">Zurück</button>
    </rpg-window>
  </div>
</template>
<script>


export default {
  name: 'gameWindow',
  inject: ['rpgGuiInteraction', 'rpgGuiClose'],
  props: {
    game: String
  },
  data() {

    return{
      gameLink: this.game,
      hasGame: false,
    }
  },
  methods: {
    close() {
      this.rpgGuiClose("gameWindow")
      this.rpgEngine.controls.listenInputs()
    },
  },
  mounted() {
    this.hasGame = this.game !== "none";
  }
}
</script>

<style scoped lang="scss">
$title-screen-font-size: 40px !default;
$title-screen-font-color: white !default;
$title-screen-font-border-color: black !default;
$title-screen-background: url('assets/default.png') !default;

.background {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  background-size: cover;
}
</style>
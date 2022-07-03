<template>
  <div class="menu-main">
    <rpg-window>
      <input :value="buildingName" @input="buildingName" placeholder="Gebäudenamen eingeben">
    </rpg-window>
  </div>
</template>

<script>
export default {
  name: "playermenu",
  inject: ['rpgGuiClose', 'rpgGuiInteraction'],
  data(){
    return{
      buildingName:''
    }
  },
  methods:{
    buildingName(){
      this.rpgGuiInteraction('playermenu','playerMenu',{
        buildName: this.buildingName,
      })
      // console.log(this.buildingName)
    }
  },

}
</script>

<style scoped>
.menu-main {
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 100;
}

</style>
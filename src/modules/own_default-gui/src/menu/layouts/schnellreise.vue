<template>
  <div class="menu-left">
      <QuickTravel
      :menuPort="true"/>
  </div>
</template>

<script>
import QuickTravel from "../../../../player_menu/client/gui/chose-Island.vue"
export default {
  name: "schnellreise",
  inject: ['rpgGuiInteraction','rpgCurrentPlayer','rpgKeypress','rpgGui','rpgEngine','rpgGuiClose','rpgStage'],
  components:{
    QuickTravel
  },
  data(){
    return{
      options: ["baum", "fasdfsas"],
      player:{},
      worldName: ""
    }
  },
  mounted() {
    // this.obsCurrentPlayer = this.rpgCurrentPlayer.subscribe(( object ) => {
    //   this.player=object.object
    // })
    //
    // this.obsKeyPress = this.rpgKeypress.subscribe(({ control }) => {
    //   if (!control) return
    //   if (control.actionName === 'back') {
    //     this.$emit('changeLayout', 'MainLayout')
    //   }
    // })
  },
  methods:{
    selectMap(index){
      // console.log(index.value)
      // this.rpgStage.filters = []
      // this.rpgGuiClose('rpg-main-menu')
      // this.rpgGuiInteraction('schnellreise','schnellReise',{
      //   mapName: this.mapmenu[index].value
      // })
      // console.log(index.value)
       }
    }
}
</script>

<style scoped>
.menu-choice {
  align-items: flex-start;
  width: 100%;
}
.menu-left {
  width: 320px;
  display: flex;
  flex-direction: column;
  flex-flow: row wrap;
}
</style>
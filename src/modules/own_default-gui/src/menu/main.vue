<!--
<template>
    <div class="menu-main">
       <component v-bind="layout" :is="layout.is" @changeLayout="change" ref="layout"></component>
       <BackButton />
    </div>
</template>

<script>
import MainLayout from './layouts/main.vue'
import BackButton from '../components/back.vue'
import ProfileLayout from '../../../player_menu/client/gui/profile2.vue'
import ZurueckLayout from '../../../player_menu/client/gui/overworld.vue'
import IslandsLayout from '../../../player_menu/client/gui/chose-Island.vue'
import Confirmationwindow from "./layouts/confirmationwindow.vue"
import TitleLayout from '../../../title-screen/client/gui/title.vue'
import OptionsLayout from "./layouts/options.vue";
import SchnellreiseLayout from "../../../player_menu/client/gui/chose-Island.vue"


export default {
    name: 'rpg-main-menu',
    inject: ['rpgEngine', 'rpgStage', 'rpgGui','rpgGuiClose','rpgGuiInteraction'],
    props: ['playerID', 'world'],
    data() {
        return {
            layout: {
              is:'MainLayout'
            }
        }
    },
    mounted() {
      console.log("playerid stuf main menu")
      console.log(this.playerID, this.world)
        if (this.rpgGui.exists('rpg-controls')) this.rpgGui.hide('rpg-controls')
        this.rpgEngine.controls.stopInputs()
        const blur = new PIXI.filters.BlurFilter()
        this.rpgStage.filters = [blur]
    },
    methods: {
        async change(layout) {

          if(layout === "SchnellreiseLayout"){
            // islandSelect(this.player, true, this.world)
            console.log("schnellreise")

            await this.rpgGuiInteraction('rpg-main-menu', 'quickTravel')
            this.rpgEngine.controls.listenInputs()

            await this.rpgGuiClose()

          }
          else if(layout === 'ProfileLayout'){

          }

          else if(typeof layout === "string" ){
            console.log("if")
            // this.layout= {is:layout}
            this.layout.is = layout


          }
          else{
            console.log("else")
            this.layout = layout
          }
          console.log(this.layout)

        }
    },
    components: {
        MainLayout,
        BackButton,
        SchnellreiseLayout,
        ProfileLayout,
        ZurueckLayout,
        IslandsLayout,
        Confirmationwindow,
        TitleLayout,
        OptionsLayout,
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
</style>-->

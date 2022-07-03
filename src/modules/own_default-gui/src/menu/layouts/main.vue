<template>
 <div class="menu" v-if="layout==='MainLayout'">
        <rpg-window :fullWidth="true" class="menu-choice">
            <rpg-choice :choices="menu" @selected="selectMenu" ref="menu" />
            <button type="button" class="css-button-3d--grey" @click="selectButton1">Logout</button>
        </rpg-window>
 </div>
  <div v-if="layout==='ProfileLayout'">
    <ProfileLayout @close="layout='MainLayout'" :playerID="playerID" :world="world"></ProfileLayout>
  </div>
  <div v-if="layout === 'SchnellreiseLayout'">
    <SchnellreiseLayout  @close="layout='MainLayout' " :menuPort="true" :worldName="world" :playerID="playerID"></SchnellreiseLayout>
  </div>
  <div v-if="layout==='GebäudeerstellenLayout'">
    <RequestBuilding :buildingFormPage="1" :worldName="this.world" @close="layout='MainLayout'"></RequestBuilding>
  </div>
  <div v-if="layout==='OptionsLayout'">
    <OptionsLayout @close="layout='MainLayout'"></OptionsLayout>
  </div>
  <div v-if="layout ==='Confirmationwindow'">
    <Confirmationwindow  @close="layout='MainLayout'" :confText="'Möchtest du dich ausloggen?'"></Confirmationwindow>
  </div>

</template>

<script>
import Hero from '../../components/hero.vue'
import BackButton from '../../components/back.vue'
import ProfileLayout from '../../../../player_menu/client/gui/profile2.vue'
import ZurueckLayout from '../../../../player_menu/client/gui/overworld.vue'
import IslandsLayout from '../../../../player_menu/client/gui/chose-Island.vue'
import Confirmationwindow from '../layouts/confirmationwindow.vue'
import TitleLayout from '../../../../title-screen/client/gui/title.vue'
import OptionsLayout from "../layouts/options.vue";
import SchnellreiseLayout from "../../../../player_menu/client/gui/chose-Island.vue"


export default {
    name: 'true-rpg-main-menu',
    props: {
      world: String,
      playerID: String
    },
    emit:['close'],
    inject: ['rpgCurrentPlayer', 'rpgKeypress', 'rpgEngine', 'rpgStage', 'rpgGuiClose', 'rpgGui'],
    components: {
      Hero,
      BackButton,
      SchnellreiseLayout,
      ProfileLayout,
      ZurueckLayout,
      IslandsLayout,
      Confirmationwindow,
      TitleLayout,
      OptionsLayout,
    },
    data() {
        const menu = [
          {
            text: 'Profil',
            value:'profile',
            layout: 'ProfileLayout'
          },
        //    {
        //     text: 'Schnellreise',
        //     value: 'schnellreise',
        //     layout: 'SchnellreiseLayout'
        // },
        // {
        //     text: 'Gebäude anfragen',
        //     value: 'createbuilding',
        //     layout: 'GebäudeerstellenLayout'
        // },
          {
            text: 'Einstellungen',
            value: 'einstellungen',
            layout:'OptionsLayout'
          },{
            text: 'Zurück',
            layout: 'ZurueckLayout'
          } ]
        if (!__RPGJS_MMORPG__ && this.rpgGui.exists('rpg-save')) {
            menu.push({
                text: 'Save',
                value: 'save',
                layout: 'SaveLayout'
            })
        }
        return {
            player: {},
            active: true,
            confText: '',
            confTextCheck: 0,
            menu,
            layout: 'MainLayout',

        }
    },
    mounted() {
        this.obsCurrentPlayer = this.rpgCurrentPlayer.subscribe(({ object }) => {
           this.rpgEngine.controls.listenInputs()
          // const warpEvent = new BeachWarpEvent() //import von WarpEvent,,, funktioniert nicht da auserhalb des Gefüges erzeugt
          // warpEvent.onAction(object)
          //new RpgServerModuleEngine().uiWarp(object)
          //this.rpgEngine.uiWarp(object) // verwenden der injected Engine
          // Aufruf mit object
        })
        if (this.rpgGui.exists('rpg-controls')) this.rpgGui.hide('rpg-controls')
        this.rpgEngine.controls.stopInputs()
        const blur = new PIXI.filters.BlurFilter()
        this.rpgStage.filters = [blur]
        this.obsKeyPress = this.rpgKeypress.subscribe(({ control }) => {
            if (!this.active || !control) return
            if (control.actionName == 'back') {
                this.rpgStage.filters = []
                if (this.rpgGui.exists('rpg-controls')) this.rpgGui.display('rpg-controls')
                this.$emit('close')
                this.rpgGuiClose('true-rpg-main-menu')
                this.rpgEngine.controls.listenInputs()
            }
        })
    },
    unmounted() {
        this.obsKeyPress.unsubscribe()
        this.obsCurrentPlayer.unsubscribe()
    },
    methods: {
        selectMenu(index) {
            if(this.menu[index].layout==='ZurueckLayout') {
              this.rpgStage.filters = []
          //    this.rpgGuiClose('true-rpg-main-menu')
              this.$emit('close')
              this.rpgEngine.controls.listenInputs()
            }
          // if(this.menu[index].layout==='SchnellreiseLayout') {
          //   this.$emit('changeLayout', {is:'SchnellreiseLayout', menuPort: true} )
          //
          // }
          //   if(this.menu[index].layout==='ProfileLayout'){
          //     this.$emit('changeLayout',{is:'ProfileLayout'})
          //   }
          //
          // this.$emit('changeLayout', this.menu[index].layout)
          this.layout= this.menu[index].layout
        },
        // selectButton(){
        //   this.$emit('changeLayout',{is:'Confirmationwindow',confText:'Willst du die Insel verlassen?',confTextCheck:1})
        // },
        selectButton1(){
          this.layout= 'Confirmationwindow'
        }
    },
}
</script>

<style lang="scss">
$hero-face: none !default;

.hero-face .face-column > div {
    background-image: $hero-face;
}
</style>

<style scoped lang="scss">

.menu{
  position: absolute;
  width: 400px;
  height: 400px;
  align-items: center;
  text-align: center;
  left: 37%;
  top: 25%;
}

.menu-choice {
    align-items: center;
    width: 100%;
}

/*button {
  padding: 1.3em 3em;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  color: #000;
  background-color: green;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  right: 50%;
  bottom: 10%;
}

button:hover {
  background-color: #23c483;
  box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
  color: #fff;
  transform: translateY(-7px);
}

button:active {
  transform: translateY(-1px);
}*/
</style>
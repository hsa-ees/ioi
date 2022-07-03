<template>
  <div class="background" :style="backgroundImg">
    <rpg-window width="500px"   style="margin:auto;" arrow:up  v-if="page === 0" >
      <form>
        <p>Wähle Insel</p>
        <rpg-choice :choices="shownIsland" @selected="selected" ref="data" >
          <template v-slot:default="{ choice }">
            <p>
              <span>{{ choice.island }}</span>
            </p>
          </template>
        </rpg-choice>
        <div v-if="menuPort === false">
          <button class="btn-success login" type="button" @click="page = 1">Profil</button>
          <button v-if="userType==='Admin'" class="btn-success login" type="button" @click="page = 2">Admin-Menu</button>
          <button v-if="userType==='User'" class="btn-success login" type="button" @click="page = 3">Insel anfragen</button>
        </div>
        <div v-if="menuPort === true">
          <button class="btn-success login" type="button" @click="close">zurück</button>
        </div>
        <div v-if="allSelectedIslands.length > 5">
          <button class="btn-success login" type="button" @click="getLastIslands">letze Inseln</button>
          <button class="btn-success login" type="button" @click="getMoreIslands">nächste Inseln</button>
        </div>
      </form>
    </rpg-window>
    <div v-if="page === 1">
      <Profile :playerid="this.playerID"
                 @save="getIslandSelection"
                 @close="page = 0"/>
    </div>
    <div v-if="page ===2">
      <AdminMenu
      @close="getIslandSelection"/>
    </div>
    <div v-if="page === 3">
      <RequestIsland
      @close="page=0"
      :formPage="1"
      :isIslandCreation="true"/>
    </div>
  </div>
</template>
<script>

import AdminMenu from "../../../admin-menu/client/admin-menu.vue"
import Profile from './profile.vue'
import RequestIsland from "../../../admin-menu/client/components/creation-new-Island-or-Building.vue"
import axios from "axios";

export default {
  name: 'chose-Island',
  inject: ['rpgGuiInteraction', 'rpgGuiClose', 'rpgStage'],
  emits: ['close'],
  props: {playerID: {type: String},
    menuPort: {type: Boolean},
    worldName: {type: String},
    },
  components:{
    AdminMenu,
    Profile,
    RequestIsland

  },
  data() {
    return {
      page: 0,
      userType: 'User', //User, Admin
      allSelectedIslands: [],
      shownIsland: [],
      charName:'',
      backgroundImg: {backgroundImage: ""},
      pageCounter: 0,
      maxShownIslands: 5
    }
  },

  methods: {

    close(){
      this.rpgStage.filters = []
      this.rpgGuiClose()
      this.$emit('close')
    },

    selected(index) {
      const map = this.shownIsland[index].island
      if(map === this.worldName){
        this.rpgGuiClose()
      }

      this.rpgGuiInteraction('chose-Island', 'chose-island',  {
        charName: this.charName,
        mapName: map
      })
      this.rpgStage.filters = []
    },

    async getIslandSelection(){
      this.page = 0
      const id = this.playerID
      const res = await axios.post('/user/getIslandSelectionData'  ,{
        data: id
      })
      let data = res.data.islandSelectionData
      this.allSelectedIslands = data.islandSelection
      if(this.allSelectedIslands.length > this.maxShownIslands){
        this.shownIsland = this.allSelectedIslands.slice(this.pageCounter, this.pageCounter+this.maxShownIslands)
      }else{
        this.shownIsland = data.islandSelection
      }
      this.charName = data.spriteName
    },

    getMoreIslands(){
      this.pageCounter+=this.maxShownIslands
      if(this.pageCounter >= this.allSelectedIslands.length){
        this.pageCounter = 0
      }
      this.shownIsland = this.allSelectedIslands.slice(this.pageCounter, this.pageCounter+this.maxShownIslands)
    },

    getLastIslands(){
      this.pageCounter-=this.maxShownIslands
      if(this.pageCounter < 0 ){
        this.pageCounter = this.allSelectedIslands.length - this.allSelectedIslands.length % this.maxShownIslands
      }
      this.shownIsland = this.allSelectedIslands.slice(this.pageCounter, this.pageCounter+this.maxShownIslands)
    },

    async savedFromProfile(charName){
      await this.getIslandSelection()
      this.charName = charName
    }

  },
   async mounted() {
    if(!this.menuPort){
      this.backgroundImg.backgroundImage = `url(${require('./assets/default.png')})`
    }else{
      this.backgroundImg.backgroundImage = ""
    }
     const id = this.playerID
     const user = await axios.post('/player/getUserType',{
       data: id
     })
     this.userType = user.data
     await this.getIslandSelection()
  },

}
</script>

<style scoped lang="scss">

.background {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  background-size: cover;
}
button{
  margin: 5px 5px 5px 5px
}
</style>
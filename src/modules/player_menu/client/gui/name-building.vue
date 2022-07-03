-<template>
  <div class="background">
  <rpg-window width="400px" height="400px" style="margin: auto" v-if="NameBuildingPage === 0">
    <p v-if="this.options.length !== 0" >Bitte wähle ein Thema für ein Gebäude aus: </p>
    <p v-if="this.options.length === 0" >Keine Themen mehr übrig, schlage doch ein neues vor!</p>
    <rpg-choice :choices="options" @selected="selected" ref="data">
      <template v-slot:default="{ choice }">
        <p>
          <span>{{ choice.building }}</span>
        </p>
      </template>

    </rpg-choice>
    <button class="btn-success login" @click="close">zurück</button>
    <button class="btn-success login" @click="NameBuildingPage = 1">Gebäude anfragen</button>

    <div v-if="allOptions.length > this.maxShownBuildings">
      <button class="btn-success login" type="button" @click="getLastBuildings">letze Gebäude</button>
      <button class="btn-success login" type="button" @click="getMoreBuildings">nächste Gebäude</button>
    </div>

  </rpg-window>

    <div v-if="NameBuildingPage === 1">
      <BuildingRequest
          :island="worldName"
          :formPage="1"
          :isIslandCreation="false"
          @close="NameBuildingPage =  0"/>
    </div>


  </div>
</template>

<script>
import BuildingRequest from '../../../admin-menu/client/components/creation-new-Island-or-Building.vue'
import axios from "axios";

export default {
  name: "name-building",
  inject: ['rpgGuiInteraction', 'rpgEngine', 'rpgGuiClose'],
  props:['worldName'],
  components: {
    BuildingRequest
  },
  data(){
    return{
      NameBuildingPage: 0,
      buildingName: null,
      options: [],
      allOptions: [],
      pageCounter: 0,
      maxShownBuildings: 5,
    }
  },
  methods:{
    selected(index) {

      this.buildingName = this.options[index]
      this.returnName()
    },

    async returnName(){
      await axios.patch('/user/disableBuilding',{
        building: this.buildingName
      })
      this.rpgGuiInteraction('name-building', 'nameBuilding',{
        buildingName: this.buildingName.building
      })
    },
    close(){
      this.rpgEngine.controls.listenInputs()
      this.rpgGuiClose()
    },

    async getMoreBuildings(){
      this.pageCounter+=this.maxShownBuildings
      if(this.pageCounter >= this.allOptions.length){
        this.pageCounter = 0
      }
      this.options = this.allOptions.slice(this.pageCounter, this.pageCounter+this.maxShownBuildings)
    },

    async getLastBuildings(){
      this.pageCounter-=this.maxShownBuildings
      if(this.pageCounter < 0 ){
        this.pageCounter = this.allOptions.length - this.allOptions.length % this.maxShownBuildings
      }
      this.options = this.allOptions.slice(this.pageCounter, this.pageCounter+this.maxShownBuildings)
    },
  },
  async mounted(){
    this.rpgEngine.controls.stopInputs()
    let res = await axios.post('/admin/getBuildingsOfIsland', {
      island: this.worldName,
      noDisabledEntries: true,

    })
    this.allOptions = res.data

    if(this.allOptions.length > this.maxShownBuildings){
      this.options = this.allOptions.slice(this.pageCounter, this.pageCounter+this.maxShownBuildings)
    }else{
      this.options = res.data
    }
  },
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

p {
  font-size: medium;
}

input {
  display: flex;
}

button {
  display: flex;
  margin: 5px 5px 5px 5px
}

</style>
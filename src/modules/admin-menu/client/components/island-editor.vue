<template>

  <div class="background">
    <rpg-window  style="margin:auto" v-if="this.editorpage === 0"> <!-- width="500px" -->
      <form>
        <p>{{this.editedIsland}}</p>
        <p>Liste der Gebäude:</p>
        <rpg-choice :choices="shownBuildings" @selected="selected" ref="data">
          <template v-slot:default= "{choice}">
            <p>
              <span>{{choice}}</span>
            </p>
          </template>
        </rpg-choice>
        <button class="css-button-3d--grey" type="button" @click="editorpage=2" v-if="editedIsland !=='Allgemein'">Insel löschen</button>
        <button class="css-button-3d--grey" type="button" @click="editorpage=1">neues Gebäude</button>
        <button class="css-button-3d--grey" type="button" @click="initGames(editedIsland)">Spiele bearbeiten</button>
        <button class="css-button-3d--grey" type="button" @click="goBack">zurück zur Inselwahl</button>
      </form>
    </rpg-window>
    <div v-if="editorpage===1">
      <CreateBuilding
      :formPage="0"
      :isIslandCreation="false"
      :island="editedIsland"
      @close="afterNewBuilding"/>

    </div>

    <rpg-window v-if="editorpage===2" style="margin: auto">
      <p>
        Wollen sie {{editedIsland}} wirklich löschen?
      </p>
      <button class="css-button-3d--grey" type="button" @click="deleteIsland(editedIsland)">Ja</button>
      <button class="css-button-3d--grey" type="button" @click="editorpage=0">Nein</button>
    </rpg-window>
    <rpg-window v-if="editorpage===3" style="margin: auto">
      <p>
        Wollen sie das Gebäude({{editedBuilding}}) wirklich löschen?
      </p>
      <button class="css-button-3d--grey" type="button" @click="deleteBuilding(editedBuilding)">Ja</button>
      <button class="css-button-3d--grey" type="button" @click="editorpage=0">Nein</button>
    </rpg-window>
    <rpg-window v-if="editorpage===5" style="margin: auto">
      <p style="font-size: large; padding-bottom: 20px">
        Wollen sie das Spiel ({{editedGame}}) wirklich löschen?
      </p>
      <div style="width: 100%; text-align: center">
        <button class="css-button-3d--grey" style="margin-right: 20px" type="button" @click="deleteGame(editedGame)">Ja</button>
        <button class="css-button-3d--grey" type="button" @click="editorpage=4">Nein</button>
      </div>

    </rpg-window>
    <rpg-window v-if="editorpage ===4" style="margin: auto">
      <p>Die Spiele der Insel:</p>
      <p v-if="gameList.length <= 0" style="font-size: medium; padding-bottom: 20px">Es gibt noch keine Spiele auf dieser Insel</p>
      <div v-else>
        <div  style="overflow-y: scroll; max-height: 500px; margin-bottom: 20px">
          <ul v-for="game in gameList">
            <li style="float: left; display: inline-block">{{game}}</li>
            <button style="margin-left: 50px " @click="editedGame=game; editorpage=5">Spiel löschen</button>
          </ul>
        </div>
      </div>
      <p style="font-size: large">Zum Hinzufügen eines Spieles geben Sie bitte den src-Url des iframes des Spieles ein: </p>
      <form>
        <input style="margin-bottom: 20px; width: 95%" type="text" v-model="gameInput" @keyup.enter="addGame()" placeholder="Beispiel: https://learningapps.org/watch?app=13765270">
      </form>
      <button class="css-button-3d--grey" type="button" @click="addGame()">Hinzufügen</button>
      <button class="css-button-3d--grey" type="button" @click="editorpage=0">Zurück</button>
    </rpg-window>

  </div>


</template>


<script>
import axios from "axios";
import CreateBuilding from "./creation-new-Island-or-Building.vue"
export default {
  name: "island-editor",
  emit:['close'],
  props:['editedIsland'],
  components:{
    CreateBuilding
  },

  data() {
    return{
      shownBuildings: [],
      editorpage: 0,
      editedBuilding: "",
      gameInput: '',
      gameList: [],
      editedGame: '',
    }
  },
  methods:{
    async initializeListOfBuildings(island){
      this.shownBuildings = []

      let res = await axios.post('/admin/getBuildingsOfIsland', {
        island: island,
        noDisabledEntries: false,
      })

      for(let building of res.data){
        this.shownBuildings.push(building.building)
      }

    },
    goBack(){
      this.$emit('close')
    },
    selected(index) {
      this.editedBuilding = this.shownBuildings[index]
      this.editorpage = 3
    },

    async deleteIsland(islandName){
      await axios.delete('/admin/deleteIsland',{data: {island: islandName}})
      await axios.delete('/admin/deleteWorldFromCharinterest', {data:{island: islandName}})
      await axios.delete('/admin/deleteBuildingRequestsOfIsland', {data:{island: islandName}})
      this.goBack()

    },
    async deleteBuilding(buildingname){
      await axios.delete('/admin/deleteBuilding', {data: {building: buildingname, island:this.editedIsland}})
      await axios.delete('/admin/deleteBuildingFromCharinterest', {data:{building: buildingname}})
      await this.initializeListOfBuildings(this.editedIsland)
      this.editorpage = 0

    },

    async afterNewBuilding(){
      this.editorpage = 0
      await this.initializeListOfBuildings(this.editedIsland)
    },

    async initGames(island){
      let res = await axios.post('/admin/getGamesOfIsland', {
        island: island
      })
      this.gameList = res.data
      this.editorpage=4
    },

    async addGame(){
      await axios.put('/admin/addGameRequest', {data: {game: this.gameInput, world: this.editedIsland}})
      await this.initGames(this.editedIsland)
      this.gameInput = ""
    },

    async deleteGame(game){
      await axios.delete('/admin/deleteGameRequest', {data: {game: game, world: this.editedIsland}})
      await this.initGames(this.editedIsland)
      this.editedGame = ''
    },

  },
  async mounted(){
    await this.initializeListOfBuildings(this.editedIsland)

  }
}
</script>

<style scoped>

li {
  font-size: 16px;
  font-style: inherit;
  color: white;
}

</style>
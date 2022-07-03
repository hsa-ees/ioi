<template>
  <rpg-window class="admin-menu" style="margin: 0 auto;" v-if="adminpage === 0">
    <p class="p">Admin Menü</p>
    <div>
      <button class="css-button-3d--grey" type="button" @click="adminpage = 1">Insel bearbeiten</button>
    </div>
    <div>
      <button class="css-button-3d--grey" type="button" @click="this.adminpage = 2; this.formPage = 0">Insel erstellen</button>
    </div>
    <div>
      <button class="css-button-3d--grey" type="button" @click="adminpage=3">Inselanfragen</button>
    </div>
    <div>
      <button class="css-button-3d--grey" type="button" @click="adminpage=4">Gebäudeanfragen</button>
    </div>
    <div>
      <button class="css-button-3d--grey" type="button" @click="this.$emit('close')">zurück zur Inselwahl</button>
    </div>
  </rpg-window>
  <div v-if="adminpage===1">
    <EditIsland @close="adminpage =0"/>
  </div>
  <div v-if="adminpage===2">
    <CreateWhitelist @close="adminpage = 0"
                     :formPage="formPage"
                     :isIslandCreation="true" >
    </CreateWhitelist>
  </div>

  <div v-if="adminpage===3">
    <Requests
        @close="adminpage = 0"
        :isIslandRequest="true"/>
  </div>

  <div v-if="adminpage===4">
    <Requests
        @close="adminpage = 0"
        :isIslandRequest="false"/>
  </div>
</template>

<script>
import EditIsland from './components/edit-Island.vue'
import CreateWhitelist from "./components/creation-new-Island-or-Building.vue"
import Requests from "./components/requests.vue"


export default {
  name: "admin-menu",
  emit: ['close'],
  components: {
    EditIsland,
    CreateWhitelist,
    Requests
  },
  data(){
        return{
          adminpage: 0,
          formPage:0
    }
  },
}
</script>

<style scoped>

button{
  margin-bottom: 10px;
}

.admin-menu{
  position: absolute;
  width: 400px;
  height: 400px;
  align-items: center;
  text-align: center;
  left: 40%;
  top: 25%;
}
.p{
  margin-bottom: 10px;
}

</style>
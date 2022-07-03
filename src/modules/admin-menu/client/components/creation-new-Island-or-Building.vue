<template>
  <div class="background">
    <rpg-window width="500px" height="500px" class="create-island"  style="margin:auto" >
      <form>
        <p>Inselname</p>
        <input id="island" type="text" placeholder="Mathe" v-model="newCreation.island" :readonly="!isIslandCreation">
        <p v-if="isIslandCreation">erlaubte Gebäude(durch , getrennt)</p>
        <p v-if="!isIslandCreation">Gebäudename</p>
        <input id="buildings" type="text" placeholder="Statistik, Algebra" v-model="newCreation.building">
        <p v-if="isIslandCreation">Symbole (durch , getrennt)</p>
        <p v-if="!isIslandCreation">Symbol</p>
        <input id="symbols" type="text" placeholder="S, A" v-model="newCreation.expertSymbol">
        <p v-if="isIslandCreation">Anzahl an Symbole müssen gleich der Anzahl Gebäude sein</p>
        <div v-if="formPage === 1 || formPage === 2">
          <p>Notizen</p>
          <input id="notes" type="text" placeholder="Notizen" v-model="notes">
        </div>
      </form>
      <button v-if="formPage === 0" class="btn-success login" type="button" @click="create">erstellen</button>
      <div v-if="formPage === 2">
        <button class="btn-success login" type="button" @click="acceptRequest">Anfrage annehmen</button>
        <button class="btn-success login" type="button" @click="declineRequest">Anfrage ablehnen</button>
      </div>
      <button v-if="formPage === 1"  class="btn-success login" type="button" @click="sendRequest">anfrage Senden</button>
      <button class="css-button-3d--grey" type="button" @click="goBack">zurück</button>
    </rpg-window>
  </div>
</template>

<script>
import axios from "axios";
import {addBuildingToWhitelist, addNewIslandToTagTree} from "../index";
export default {
  name: "creation-new-Island-or-Building",
  emit:['close'],
  props:['formPage','request', 'isIslandCreation', 'island'],
  data(){
    return{
      newCreation:{
        island:this.island,
        building: "",
        expertSymbol: ""
      },
      notes: ""
    }
  },
  methods:{
    goBack(){
    this.$emit('close')
    },

    async sendRequest(){
      await axios.post('/user/newRequest',{
        island: this.newCreation.island,
        building: this.newCreation.building,
        expertSymbol: this.newCreation.expertSymbol,
        notes: this.notes,
        isIslandRequest: this.isIslandCreation
      })
      this.goBack()
    },


    async create(){
      let res = await axios.get('/universe/getTagTree')
      let tagTree = res.data.tagTree
      if(this.isIslandCreation){
        await addNewIslandToTagTree(this.newCreation, tagTree)
      }else{
        await addBuildingToWhitelist(this.newCreation, tagTree)
      }this.goBack()
    },

    async acceptRequest(){
      await this.create()
      await this.deleteRequest()
      this.goBack()
    },

    async declineRequest(){
      await this.deleteRequest()
      this.goBack()
    },
    async deleteRequest(){
      await axios.delete('/admin/deleteRequest', {data:this.request})
    }
  },
  async mounted(){
    if(this.formPage===2){
      this.newCreation.island = this.request.island
      this.newCreation.building = this.request.building
      this.newCreation.expertSymbol = this.request.expertSymbol
      this.notes = this.request.notes
    }
  }
}
</script>

<style scoped lang="scss">
$window-button-success-color: #1c8634 !default;
$window-button-success-shadow: #0d4c30 !default;
$window-button-color: rgba(128, 130, 162, 0.7) !default;
$window-button-shadow: rgb(128, 130, 162) !default;
.button1 {
  min-width: 130px;
  height: 40px;
  color: #fff;
  padding: 5px 10px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  outline: none;
  border-radius: 5px;
  border: none;
  margin-left: 60px;
  margin-top: 50px;
  background: $window-button-color;
}
.button1:hover {
  box-shadow: 0 3px $window-button-shadow;
  top: 1px;
}
.button1:active {
  box-shadow: 0 0 $window-button-shadow;
  top: 5px;
}
.create-island{
  position: absolute;
  width: 400px;
  height: 400px;
  left: 37%;
  top:25%;
}

input{
  width: 85%;
  left: -10px;
}
p{
  left:30px
}
</style>
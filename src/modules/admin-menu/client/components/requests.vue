<template>
  <div class="background">
    <rpg-window width="500px" height="800px" style="margin:auto" v-if="RequestPage === 0">
      <p>Insel Anfragen</p>
      <rpg-choice :choices="requests" @selected="selected" ref="data">
        <template v-slot:default="{choice}">
          <p v-if="isIslandRequest">
            <span>{{choice.island}}</span>
          </p>
          <p v-if="!isIslandRequest">
            <span>{{"(" + choice.island + ") "}}</span>
            <span>{{choice.building}}</span>
          </p>
        </template>
      </rpg-choice>
      <div class="button">
        <button class="css-button-3d--grey" type="button" @click="goBack">zurück</button>
      </div>
    </rpg-window>
    <div v-if="RequestPage === 1">
      <Request
          :formPage="2"
          :request="request"
          :isIslandCreation="isIslandRequest"
          @close="getRequests"
      />
    </div>
  </div>
</template>

<script>
import Request from "./creation-new-Island-or-Building.vue"
import axios from "axios";
export default {
  name: "requests",
  components:{Request},
  props:['isIslandRequest'],

  data(){
    return{
      RequestPage: 0,
      request: "",
      requests: [],
      }
    },

  methods:{
    goBack(){
      this.$emit('close')
    },
    async getRequests(){
      this.RequestPage = 0
      let res = await axios.post('/admin/getRequests', {isIslandRequest: this.isIslandRequest})
      this.requests = res.data
    },
    async selected(index) {
      const request = this.requests[index]
      this.RequestPage = 1
      this.request = request
    },
  },
  async mounted(){
    await this.getRequests()
  }
}
</script>

<style scoped>

</style>
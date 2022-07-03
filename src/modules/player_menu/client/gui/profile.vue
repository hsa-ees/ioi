
<template>
  <div class="background">
    <rpg-window class="rpg" width="800px" height="60%" style="margin: auto;" > <!-- width="770px" height="100%" -->
        <div class="pChar">
          <p>Avatar</p>
        </div>
        <div class="charPng">
          <img :src="img">
        </div>
        <div class="vue">
          <div class="pInteresst">
            <p>Interessen</p>
          </div>
          <VueMultiselect
              v-model="selectedData"
              :options="options"
              :multiple="true"
              group-values="children"
              group-label="island"
              :group-select="false"
              placeholder="Pick some"
              label="building"
              track-by="building"
              :close-on-select="false">
          </VueMultiselect>

          <div class="pExpert">
            <p>Experte in</p>
          </div>
          <VueMultiselect
              v-model="expertData"
              :options="expertOption"
              :multiple="true"
              group-values="children"
              group-label="island"
              :group-select="false"
              placeholder="Pick some"
              label="building"
              track-by="building"
              :close-on-select="false">
          </VueMultiselect>
        </div>
          <div class="bLast">
            <button class="btn-success login" type="button" @click="lastPng"> letzer Avatar </button>
          </div>
          <div class="bNext">
            <button class="btn-success login" type="button" @click="nextPng"> nächster Avatar </button>
          </div>
          <div class="bSave">
            <button class="btn-success login" type="button" @click="saveInterest">speichern</button>
          </div>
          <div class="bBack">
            <button class="css-button-3d--grey" type="button" @click="goBack">zurück</button>
          </div>
    </rpg-window>
  </div>
</template>
<script>
import VueMultiselect from 'vue-multiselect'
import axios from "axios";

export default {
  name: "Interest",
  props: ['playerid'],
  emit: ['close', 'save'],
  inject: ['rpgResource'],
  components: {
    VueMultiselect
  },

  data () {
    return {
      options: [],
      expertOption: [],
      selectedData: [],
      expertData: [],
      charName:'female1',
      img: "",
      pointer: 0,
      pngArray:[],
    }
  },
  methods:{
    async lastPng(){
      this.pointer--
      if(this.pointer<0){
        this.pointer = this.pngArray.length-1
      }
      await this.setImg()
    },

    async nextPng(){
      this.pointer++
      if(this.pointer >= this.pngArray.length){
        this.pointer = 0
      }
      await this.setImg()
    },

    goBack(){
      this.$emit('close')
    },

    async saveInterest(){
      const id = this.playerid
      await axios.put('/user/updateProfile',{
        id: id,
        interest: this.selectedData,
        expert: this.expertData,
        spriteName: this.charName,
        imgPointer: this.pointer
      })
      this.$emit('save', this.charName)
    },

    async setImg(){
      let key = this.pngArray[this.pointer]
      this.img = await this.rpgResource.spritesheets.get(key).image
      this.charName = key.slice(0, -1)
    },
  },

  async mounted() {

    const id =  this.playerid
    const universe = await axios.get('/universe/tagTreeAndAvatar')
    this.options = universe.data.tagTree
    this.expertOption = universe.data.tagTree
    this.pngArray = universe.data.pngArray

    const res =  await axios.post('/user/getProfileData',{
      data: id
    })
    let data = res.data.profileData
    this.expertData = data.expert
    this.selectedData = data.interest
    this.pointer = await data.imgPointer

    await this.setImg()
  },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style>

.bLast{
  position: sticky;
  top: 800px;
  margin-left: 2%;
}
.bNext{
  position: sticky;
  top: 800px;
  margin-left: 22%;
}
.bSave{
  position: sticky;
  top: 800px;
  margin-left: 62%;
}
.bBack{
  position: sticky;
  top: 800px;
  margin-left: 82%;
}

.pInteresst{
  position: relative;
  margin-bottom: 10px;
}
.pExpert{
  position: relative;
  margin-top: 20px;
  margin-bottom: 10px;
}
.pChar{
  position: relative;
  margin-bottom: 30px;
  margin-left: 14%;
}

.vue{
  position: relative;
  margin-right: 1%;
  margin-left: 40%;
  bottom: 60px;
}

.charPng{
  position: relative;
}

</style>




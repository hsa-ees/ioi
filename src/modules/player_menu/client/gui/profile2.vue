
<template>
  <div>
    <rpg-window class="rpg" width="800px" height="400px"> <!-- width="770px" height="100%" -->
      <div class="pChar">
        <p>Avatar</p>
      </div>
      <div class="charPng">
        <img :src="img">
      </div>
      <div class="vue">
        <div class="pInteresst">
          <p>Interressen</p>
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
<!--      <div class="bLast">-->
<!--        <button class="btn-success login" type="button" @click="lastPng"> letzer Avatar </button>-->
<!--      </div>-->
<!--      <div class="bNext">-->
<!--        <button class="btn-success login" type="button" @click="nextPng"> nächster Avatar </button>-->
<!--      </div>-->
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
  props: {
    world: String,
    playerID: String
  },
  emit: ['close', 'save'],
  inject: ['rpgGuiInteraction', 'rpgEngine', 'rpgGuiClose', 'rpgResource'],
  components: {
    VueMultiselect
  },

  data () {

    // const universe = require('../../server/data/whitelist_building.json')
    return {
      options: [],
      expertOption: [],
      selectedData: [],
      expertData: [],
      combinationData: [],
      charName:'female1',
      img: '',
      pointer: 0,
      pngArray:[],


    }
  },
  methods:{

    async allIslands(){
      let arr = []

    },

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
      const id = this.playerID
      this.combinationData = await this.createIslandSelection(this.selectedData, this.expertData)
      this.$emit('save', this.combinationData, this.charName)
      await axios.put('/user/updateProfile',{
        id: id,
        interest: this.selectedData,
        expert: this.expertData,
        combination: this.combinationData,
        spriteName: this.charName,
        imgPointer: this.pointer
      })
      // console.log("profile saved")
    },


    async createIslandSelection(interest, expert){
      let islandSelection = []
      let combinationSet =  new Set()

      if(interest.length === 0 && expert.length === 0){
        const res = await axios.get('/user/allIslands')
        islandSelection = res.data
        return islandSelection
      }

      combinationSet = await this.getIslandSet(interest ,combinationSet)
      combinationSet = await this.getIslandSet(expert, combinationSet)

      await combinationSet.forEach(element => {
        islandSelection.push({
          island: element,
          text: element
        })
      })
      return islandSelection
    },
    async getIslandSet(data, singleSet){

      for(const element  of data) {
        if (!await this.checkForUndefined(element)) {
          break
        }
        await singleSet.add(element.parent)
      }
      return singleSet
    },

    async checkForUndefined(element){
      if(typeof element.parent === "undefined"){
        return false
      }
      if(typeof element.text === "undefined"){
        // console.log("no text")
        return false
      }
      return true
    },
    async setImg(){
      let key = this.pngArray[this.pointer]
      this.img = await this.rpgResource.spritesheets.get(key).image
      this.charName = key.slice(0, -1)
    },
  },

  async mounted() {
    // console.log(this.playerID)
    // console.log(this.world)


    const id =  this.playerID
    // console.log("idddddddddd")
    // console.log(id)

    const universe = await axios.get('/universe/tagTreeAndAvatar')
    this.options = universe.data.tagTree
    this.expertOption = universe.data.tagTree
    this.pngArray = universe.data.pngArray

    // console.log("profileee")
    // console.log(this.pngArray)

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
  position: absolute;
}
.rpg{
  position: absolute;
  top:25%;
  left: 23%;

}

</style>




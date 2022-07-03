<template>
  <div class="background">
    <rpg-window width="500px"  style="margin:auto" v-if="islandpage === 0">
      <form>
        <p>Insel bearbeiten</p>
        <rpg-choice :choices="shownIsland" @selected="selected" ref="data">
          <template v-slot:default="{ choice }">
            <p>
              <span>{{ choice.island }}</span>
            </p>
          </template>
        </rpg-choice>
        <button class="css-button-3d--grey" type="button" @click="goBack">zurück zur Inselwahl</button>
      </form>
    </rpg-window>
  </div>
  <div v-if="islandpage===1">
    <island-editor
        :editedIsland="this.editedIsland"
        @close="fromEditedIsland"
    />
  </div>
</template>

<script>
import axios from "axios";
import IslandEditor from "./island-editor.vue";

export default {
  name: "edit-Island",
  components: {IslandEditor},
  emit:['close'],
  data() {
    return{
      shownIsland: [],
      islandpage: 0,
      editedIsland:String,
    }
  },

  methods:{
    async initializeListOfIslands() {
      let islandSelection = await axios.get('/user/allIslands')
      this.shownIsland = islandSelection.data

    },
    async fromEditedIsland(){
      this.islandpage = 0
      await this.initializeListOfIslands()

    },
    goBack(){
      this.$emit('close')
    },
    selected(index) {
      this.editedIsland = this.shownIsland[index].island
      this.islandpage = 1
    },
  },

  async mounted(){
    await this.initializeListOfIslands()
  }
}
</script>

<style scoped>

</style>
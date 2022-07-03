<template>
  <div class="background">
    <rpg-window position="bottom-middle" style="margin-bottom: 100px" >
      <p>{{ msg }}</p>
    </rpg-window>

    </div>

</template>
<script>

export default {
  name: 'notification',
  inject: ['rpgGuiInteraction', 'rpgGuiClose'],
  props: {
    msg: {type: String}
  },

  data() {

    return {
      msg: this.msg
    }
  },

  methods: {
    close(){
      this.rpgGuiClose()
    }
  },
  async mounted() {

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

</style>
<template>
  <rpg-window class="confwindow">
    <p>{{confText}}</p>
    <button class="btn-success yes" @click="pressYes">Ja</button>
    <button class="css-button-3d--grey no" @click="pressNo">Nein</button>
  </rpg-window>


</template>

<script>
export default {
  props: {
    confText:{
      type: String,
      required: true
    }
  },
  name: "confirmationwindow",
  inject: ['rpgKeypress','rpgGuiClose','rpgEngine'],
  emit: ['close'],
  mounted() {
    this.obsKeyPress = this.rpgKeypress.subscribe(({ control }) => {
      if (!this.active || !control) return
      if (control.actionName=='back') {
        console.log(control.actionName)
        this.$emit('changeLayout','MainLayout')
      }
  })
  },
  unmounted() {
    this.obsKeyPress.unsubscribe()
  },
  methods:{
    pressNo(){
      this.$emit('close')
    },
    pressYes(){
      if(this.confText==='Willst du die Insel verlassen?'){
        this.rpgGuiClose('true-rpg-main-menu')
        this.$emit('changeLayout','IslandsLayout')

      }
      else{
        window.location.reload()
        // this.rpgGuiClose('confirmationwindow')
        // this.$emit('changeLayout','TitleLayout')
      }

    }
  }
}
</script>

<style scoped>
.confwindow{
  width: 400px;
  height: 250px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 60vh;
  top: 18%;
  left: 38%
}
button{
  position: relative;
}
.yes{
  left: -5px;
  display: inline-block;
  bottom: -10px;
}
.no{
  right: -5px;
  display: inline-block;
  bottom: -10px;
}

</style>
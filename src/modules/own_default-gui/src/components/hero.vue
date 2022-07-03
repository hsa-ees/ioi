<template>
    <div class="hero">
        <div class="face-column">
            <div></div>
        </div>
        <div class="name-column">
            <ul>
                <li class="space-between"><span class="param-name">Name</span><span>{{player.name}}</span></li>
                <li class="space-between"><span class="param-name">Level</span> <span>{{ player.level }}</span></li>
                <li class="space-between"><span class="param-name">Insel</span> <span>{{ player.map }}</span></li>

            </ul>
        </div>
      <div class="name-column">
        <ul>
          <li class="space-between"><span class="param-name">Titel</span><span>Hier Titel angeben</span></li>
          <li class="space-between"><span class="param-name">XP</span> <span>{{ player.exp }}</span></li>
          <li class="space-between"><span class="param-name">Punkte</span> <span>Hier Punkte angeben</span></li>

        </ul>
      </div>

    </div>
</template>

<script>
import Bar from './bar.vue'

export default {
    props: ['face'],
    inject: ['rpgCurrentPlayer'],
    data() {
        return {
            player: {}
        }
    },
    mounted() {
        this.obsCurrentPlayer = this.rpgCurrentPlayer.subscribe(( object ) => {
           this.player = object.object
        })
    },
    computed: {
        image() {
            return {
                backgroundImage: `url(${this.face})`
            }
        },
        _class() {
            if (!this.player._class) return {}
            return this.player._class
        }
    },
    unmounted() {
        this.obsCurrentPlayer.unsubscribe()
    },
    components: {
        Bar
    }
}
</script>

<style scoped>
.hero {
    display: flex;
}

.space-between {
    justify-content: space-between;
    display: flex;
}

.face-column {
    width: 33%;
}

.face-column  > div {
    background-position: center;
    background-size: cover;
    width: 150px;
    height: 150px;
}

.name-column {
     width: 33%;
}

.bars-column {
     width: 33%;
}

ul {
    list-style: none;
    margin: 0;
}

ul li {
    margin: 10px;
    font-family: "lato";
    font-size: 18px;
    color: white;
}

.param-name {
    color: #71acff;
}
</style>
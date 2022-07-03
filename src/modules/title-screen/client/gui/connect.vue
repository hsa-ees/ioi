<template>

   <rpg-window width="300px" height="300px" style="margin: auto;" v-if="page === 'login'">
         <p>Login</p>
         <form @submit.prevent="login">
             <input type="text" placeholder="Accountname" v-model="user.nickname">
             <input type="password" placeholder="Passwort" @keydown.enter="login" v-model="user.password">
             <button class="btn-success login">Login</button>
             <button class="css-button-3d--grey" type="button" @click="page = 'create'">Accounterstellung</button>
        </form>
  </rpg-window>
  <CreateAccount v-else @back="page = 'login'" />

</template>

<script>
import CreateAccount from './create-account.vue'

export default {
    name: 'rpg-login',
    inject: ['rpgGui', 'rpgGuiInteraction', 'rpgSocket','rpgGuiClose'],
    components: {
        CreateAccount
    },
    data() {
        return {
           page: 'login',
           user: {}
        }
    },
    mounted() {
        const socket = this.rpgSocket()
        socket.on('login-fail', ({ message }) => {
            let msg = ''
            switch (message) {
                case 'NOT_VERIFIED':
                    msg = 'Dieser Account wurde noch nicht verifiziert'
                    break;
                case 'LOGIN_FAIL':
                    msg = 'Die angegebenen Logindetails sind nicht korrekt!'
                    break;
                 case 'PLAYER_IN_GAME':
                    msg = 'Der Account befindet sich bereits im Spiel'
                    break;
                default:
                    // console.log(message)
                    msg = 'Ein fehler ist aufgetreten'
            }
            this.notificationError(msg)
        })
    },
    methods: {
        login() {
            if (!this.user.nickname) {
                return this.notificationError('Bitte gib deinen Accountnamen ein')
            }
            if (!this.user.password) {
                return this.notificationError('Bitte gib dein Passwort ein')
            }
            this.rpgGuiInteraction('rpg-title-screen', 'login', this.user)
        },
        notificationError(msg) {
            this.rpgGui.display('rpg-notification', {
                message: msg,
                time: 5000,
                position: 'top',
                type: 'error'
            })
        }
    }
}
</script>

<style scoped lang="scss">
form {
    text-align: center;
}

p {
    margin-bottom: 25px;
}

button {
    margin-top: 20px;
}

input {
    width: 85%;
}

.login {
    margin-right: 10px;
}
</style>

<template>
   <rpg-window width="300px" style="margin: auto">
         <p>Accounterstellung</p>
         <form @submit.prevent="createAccount">
            <input type="text" placeholder="Accountname" required v-model="user.accname" @blur="checkExistAcc">
             <input type="text" placeholder="Charaktername" required v-model="user.nickname" @blur="checkExistChar">
             <input type="email" placeholder="Email" required v-model="user.email" @blur="checkExistMail">
             <input type="password" placeholder="Passwort (mind. 6 Stellen)" required minlength="6" v-model="user.password">
             <input type="password" placeholder="Passwort bestätigen" @keydown.enter="createAccount" required v-model="confirmPassword">
             <button class="btn-success login">Erstellen</button>
             <button class="css-button-3d--grey" type="button" @click="$emit('back')">Zurück</button>
        </form>
  </rpg-window>
</template>

<script>
import axios from 'axios'
const NICKNAME_EXISTS_MSG = 'Dieser Charactertname ist bereits in Benutzung. Bitte wähle einen anderen'
const ACCNAME_EXSISTS_MSG = 'Dieser Accountname ist bereits in Benutzung. Bitte wähle einen anderen'
const EMAIL_EXSISTS_MSG = 'Diese eMail ist bereits in Benutzung.'

export default {
    name: 'rpg-login',
    inject: ['rpgGui'],
    data() {
        return {
           user: {},
           confirmPassword: '',
           nicknameExists: false,
           accnameExists: false,
           emailExists: false
        }
    },
    methods: {
        async createAccount() {
            try {
                if(this.emailExists){
                    throw EMAIL_EXSISTS_MSG
                }
                if (this.accnameExists){
                  throw ACCNAME_EXSISTS_MSG
                }
                if (this.nicknameExists) {
                    throw NICKNAME_EXISTS_MSG
                }
                if (!this.user.nickname) {
                    throw 'Bitte gib einen Charakternamen an '
                }
                if (!this.user.password) {
                    throw 'Bitte gib ein Passwort an'
                }
                if (!this.user.email) {
                    throw 'Bitte gib eine eMail an'
                }
                if (this.user.password > 6) {
                    throw 'Das Passwort muss mindestens 6 Zeichen haben'
                }
                if (this.user.password != this.confirmPassword) {
                    throw 'Die angegebenen Passwörter stimmen nicht überein'
                }
                await axios.post('/user/create', this.user)
                this.rpgGui.display('rpg-notification', {
                    message: 'Dein Account wurde erstellt. Logge dich jetzt ein um zu lernen',
                    time: 5000,
                    position: 'top',
                    type: 'success'
                })
                this.$emit('back')
            }
            catch (err) {
                if (typeof err == 'string') {
                    this.notificationError(err)
                }
            }
        },
        notificationError(msg) {
            this.rpgGui.display('rpg-notification', {
                message: msg,
                time: 5000,
                position: 'top',
                type: 'error'
            })
        },
        //Maybe dry this up and turn this into one single function
        async checkExistAcc() {
            const { data } = await axios.post('/user/existsAcc', {
                accname: this.user.accname
            }) 
            this.nicknameExists = data.exists
            if (this.nicknameExists) {
                this.notificationError(ACCNAME_EXSISTS_MSG)
            }
        },
        async checkExistChar() {
            const { data } = await axios.post('/user/existsChar', {
                nickname: this.user.nickname
            }) 
            this.nicknameExists = data.exists
            if (this.nicknameExists) {
                this.notificationError(NICKNAME_EXISTS_MSG)
            }

        },
        async checkExistMail() {
            // console.log('checking email')
            const { data } = await axios.post('/user/existsEmail', {
                email: this.user.email
            }) 
            this.emailExists = data.exists
            if (this.emailExists) {
                this.notificationError(EMAIL_EXSISTS_MSG)
            }

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

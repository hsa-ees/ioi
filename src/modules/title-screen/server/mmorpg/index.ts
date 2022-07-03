import mongoose from "mongoose"
import { RpgServer, RpgModule, RpgServerEngine, RpgPlayer, RpgWorld } from '@rpgjs/server'
import Account from './../../../mongoDB/schemes/account';
import Character from './../../../mongoDB/schemes/character'
import CharacterInterest from './../../../mongoDB/schemes/charInterest'
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
import transport from '../../../mailing/backend/transport';

declare module '@rpgjs/server' {
    export interface RpgPlayer {
        mongoId: string
        loadWithoutMapChange: (json) => void
    }
}
function mongoLog(msg, ...more) {
    console.log(`RPGJS MongoDB => ${msg}`, ...more)
}

function Error401() {
    const error = new Error()
    error['status'] = 401
    return error
}

async function login(body) {
    const { nickname, password } = body
    const account = await Account.findOne({
        username: nickname
    }) as any

    if (!account) {
        throw Error401()
        }

    //FIXME: Just uncomment if the email verification is properly set up
    // if(account.status !='Active'){
    //     throw new Error('NOT_VERIFIED')
    // }    

    const valid = await account.verifyPassword(password)
    if (!valid) {
        throw Error401()
    }
    
    const character = await Character.findOne({account_id: account._id})

    return {
        nickname: character.nickname,
        _id: character._id,
        data: character.data
    }
}
/* save methode not in use
const originalSaveMethod = RpgPlayer.prototype.save
RpgPlayer.prototype.save = function(): string {
    const json = originalSaveMethod.apply(this)
    Character.findByIdAndUpdate(this.mongoId.toString(), { data: json }).catch(err => {
        console.log(err)
    })
    return json
}
*/

 
export function showLoginScreen(player: RpgPlayer): Promise<any>{
    const { startMap } = player.server.globalConfig
    const gui = player.gui('rpg-title-screen')

    gui.on('login', async (body) => {
        try {
            const user = await login(body)
            //readID is the mongoID we use, not the rpgjs id
            var realID =  user._id
            
            //Check if ingame 
            var playerIsAlreadyInGame = false;
            RpgWorld.getPlayers().forEach(element => {
                if(realID.equals(element.mongoId)){
                    playerIsAlreadyInGame = true
                }
            });
      
            if (playerIsAlreadyInGame) {
                throw new Error('PLAYER_IN_GAME')
            }

            player.mongoId = user._id
            player.name = user.nickname

            gui.close()
        }

        catch (err) {
            let error = {}
            if (err.status == 401) {
                error = {
                    message: 'LOGIN_FAIL'
                }
            }
            else {
                error = {
                    message: err.message
                }
            }
            player.emit('login-fail', error)
        }
    })
    return gui.open({},{waitingAction:true,blockPlayerInput: true})
}


@RpgModule<RpgServer>({
    engine: {
        onStart(engine: RpgServerEngine) {
            const app = engine.app
            const {mongodb} = engine.globalConfig
            if (!mongodb) {
                mongoLog('Please note that you have not specified the link to mongodb. The connection, uploading and saving will not work')
            } else {
                mongoLog('Waiting for connection to MongoDB...')
                mongoose.connect(mongodb).then(() => {
                    mongoLog('Super, your Game is connected with MongoDB')
                }).catch(err => {
                    mongoLog('A problem occurred when connecting to MongoDB', err)
                })
            }
            
            app.post('/login', async (req, res, next) => {
                try {
                    const user = await login(req.body)
                    res.json(user)
                } catch (err) {
                    res.status(err.status || 500).json(err)
                }
            })

            app.post('/user/existsChar', async (req, res, next) => {
                try {
                    const {nickname} = req.body

                    const char = await Character.findOne({
                        nickname: nickname
                    }) as any

                    res.json({
                        exists: !!char
                    })

                } catch (err) {
                    res.status(500).json(err)
                }
            })
            app.post('/user/existsEmail', async (req, res, next) => {
                try {
                    const {email} = req.body
                    const account = await Account.findOne({
                        email: email
                    }) as any
                    res.json({
                        exists: !!account
                    })
                } catch (err) {
                    res.status(500).json(err)
                }
            })
            app.post('/user/existsAcc', async (req, res, next) => {
                try {
                    const {accname} = req.body

                    const account = await Account.findOne({
                        username: accname
                    }) as any

                    res.json({
                        exists: !!account
                    })
                } catch (err) {
                    res.status(500).json(err)
                }
            })
            app.post('/user/create', async (req, res, next) => {
                try {
                    const {nickname, email, password, accname} = req.body;

                    //'wubalubadubdub' can be replaced by whatever sign you prefer
                    const token = jwt.sign({email: req.body.email}, 'wubalubadubdub')

                    const account = new Account({
                        username: accname,
                        email: email,
                        password: password,
                        confirmationCode: token
                    })
                 
                    const character = new Character({
                        nickname: nickname,
                        account_id: account._id,
                        spriteName:"female1",
                        imgPointer: 0
                    })
                    await character.save()

                    account.characters[0] = character._id
                    await account.save()


                    // FIXME: Uncomment if email verification is properly set up

                    // transport.sendMail({
                    //     from: 'dummy@email.com',
                    //     to: email,
                    //     subject: "Bitte bestätigen Sie Ihren Account",
                    //     html: `<h1>Email bestätigung</h1>
                    //         <h2>Hallo ${accname}</h2>
                    //         <p>Um endlich die Islands of Interests besuchen zu könne, bestätige deinen Account über den folgenden Link:</p>
                    //         <a href=http://localhost:3000/confirm/${token}> Hier klicken</a>
                    //         </div>`,
                    //     }).catch(err => console.log(err));
                    

                    res.status(204).send()
                } catch (err) {
                    res.status(500).json(err)
                }
            })
        }
    }
})
export default class RpgServerModule {}
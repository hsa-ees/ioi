import { Spritesheet, Presets } from '@rpgjs/client'

const { RMSpritesheet } = Presets

@Spritesheet({
    images: {
        female1: require('./assets/Female 01-1.png'),
        female2: require('./assets/Female 03-2.png'),
        female132: require('./assets/Female 13-2.png'),

        male1: require('./assets/Male 01-2.png'),
        male2: require('./assets/Male 02-4.png'),
        male3: require('./assets/Male 04-2.png'),

        studentM1:require('./assets/su3 Student male 08.png'),
        studentF1:require('./assets/su3 Student fmale 04.png'),
        teacherM1:require('./assets/Teacher male 02.png'),
        teacherF1:require('./assets/Teacher fmale 03.png'),

        //Profile Avatare
        female1P:require('./assets/profilePicture/Female 01-1.png'),
        female2P:require('./assets/profilePicture/Female 03-2.png'),
        female132P:require('./assets/profilePicture/Female 13-2.png'),

        male1P:require('./assets/profilePicture/Male 01-2.png'),
        male2P:require('./assets/profilePicture/Male 02-4.png'),
        male3P:require('./assets/profilePicture/Male 04-2.png'),

        studentM1P:require('./assets/profilePicture/su3 Student male 08.png'),
        studentF1P:require('./assets/profilePicture/su3 Student fmale 04.png'),
        teacherM1P:require('./assets/profilePicture/Teacher male 02.png'),
        teacherF1P:require('./assets/profilePicture/Teacher fmale 03.png'),


        // a:
        //     ['female1P','female2P','female132P','male1P','male2P','male3P',
        //     'studentM1P','studentF1P','teacherM1P','teacherF1P']




    },

    width: 96,
    height: 128,
    ...RMSpritesheet(3, 4)
})
export class Characters { }

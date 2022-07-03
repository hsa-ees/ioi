import { Sound } from '@rpgjs/client'

@Sound({
    sounds: {
        town_small: require('./assets/Town_Village_Theme_3.ogg'),
        town_middle: require('./assets/Town_Village_Theme_2.ogg'),
        town_big: require('./assets/Town_Village_Theme_1.ogg'),
    },
    loop: true,
    volume: 0.10//volume that is not distracting: 0.10

})
export class Musics {}

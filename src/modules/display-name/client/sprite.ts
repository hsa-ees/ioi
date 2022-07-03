import { RpgSprite, RpgSpriteHooks } from '@rpgjs/client'
import {inspect} from "util";
import axios from "axios";

declare module '@rpgjs/client' {
    export interface RpgSprite {
        textGraphic: PIXI.Text
        levelGraphic: PIXI.Text
        titelGraphic: PIXI.Text
        cage:PIXI.Container
        txtBackGround: PIXI.Sprite
    }
}

export const sprite: RpgSpriteHooks = {
    onInit(sprite: RpgSprite) {
        const style = new PIXI.TextStyle({
            fontSize: 16,
            fontWeight: 'bold',
            fill: 'white',//black
            stroke: 'black',//grey
            strokeThickness: 2,
        })
        const style1= new PIXI.TextStyle({
            fontSize: 10,
            fontWeight:"bold"
        })
        const textGraphic = new PIXI.Text('', style)
        const levelGraphic = new PIXI.Text('',style)
        const titelGraphic = new PIXI.Text('',style)
      //  const txtBackGround = new PIXI.Sprite(PIXI.Texture.WHITE)
       // const cage = new PIXI.Container()

 //       txtBackGround.addChild(textGraphic)
  //      txtBackGround.y= -25
        textGraphic.y = -20
        levelGraphic.y=-25
        titelGraphic.y= -20
        // titelGraphic.x= -25
        textGraphic.anchor.set(1.0)
      //  txtBackGround.anchor.set(1.0)
        levelGraphic.anchor.set(1.0)
        titelGraphic.anchor.set(0.2, 1)
     //   sprite.cage=cage
    //    sprite.txtBackGround=txtBackGround
        sprite.textGraphic=textGraphic
        sprite.levelGraphic=levelGraphic
        sprite.titelGraphic=titelGraphic

        sprite.addChild(textGraphic,levelGraphic,titelGraphic)
    },
    async onChanges(sprite: RpgSprite, data: any) {

        try {
            const map = data.map.slice(0,-1)
            const name = data.name
            const experts = await axios.post('/user/getExpertSymbols', {map: map, name: name})

            if (data && data.name) {
                const name = data.name
                // To center the text...
                // sprite.cage.x=name.length + 30
                sprite.textGraphic.x = name.length + 30   // 70
                if(experts.data==="showNot") {
                    sprite.textGraphic.text = name
                }else{
                    sprite.textGraphic.text = name + "\n"
                    sprite.titelGraphic.text = experts.data
                }
                // sprite.textGraphic.text= name + '\n' + "Mathe-Held"
                //        sprite.txtBackGround.x=name.length+30
            }
        }catch (err){}

        // console.log(experts)



        /*if(data && data.level){
            const level = data.level
            sprite.levelGraphic.x = -20
            sprite.levelGraphic.text=level.toString()

        }*/
        /*if(data){
            const titel = data.title
            sprite.titelGraphic.x = titel.length + 30
            sprite.titelGraphic.text = 'Titel hier einfügen'

        }*/
    }
}
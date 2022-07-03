import {RpgEvent, EventData, RpgPlayer} from "@rpgjs/server";


@EventData({
    name: 'Game1',
    hitbox: {
        width: 16,
        height: 16
    }
})

export class GameEvent1 extends RpgEvent{
    onInit() {
    }

    async onAction(player: RpgPlayer){
        console.log("In Event Game")
        player.gui('rpg-main-menu').close()
        player.gui("MeetingCall").close()
        const gui = player.gui('gameWindow')
        await gui.open({waitingAction:true})

    }
}

@EventData({
    name: 'Game2',
    hitbox: {
        width: 16,
        height: 16
    }
})

export class GameEvent2 extends RpgEvent{
    onInit() {
    }

    async onAction(player: RpgPlayer){
        console.log("In Event Game")
        const gui = player.gui('gameWindow')
        await gui.open( {waitingAction:true})

    }
}

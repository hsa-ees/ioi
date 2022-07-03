import { Input, Control } from '@rpgjs/client'

export const inputs = {
    //input to move the player up
    [Control.Up]: {
        repeat: true,
        bind: Input.Up
    },
    //input to move the player down
    [Control.Down]: {
        repeat: true,
        bind: Input.Down
    },
    //input to move the player right
    [Control.Right]: {
        repeat: true,
        bind: Input.Right
    },
    //input to move the player left
    [Control.Left]: {
        repeat: true,
        bind: Input.Left
    },
    //input to perform an action
    [Control.Action]: {
        bind: [Input.Enter]
    },
    //input that could be bound to a menu, currently not in use
    [Control.Back]: {
        bind: Input.Escape
    },
}



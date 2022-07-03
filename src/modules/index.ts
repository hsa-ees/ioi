import main from './main'
import defaultGui from './own_default-gui'
import playerMeeting from "./playerMeeting";
import titleScreen from "./title-screen";
import mapHandler from "./mapHandler"
import roomMeetings from "./roomMeeting";
import playerMenu from "./player_menu";
import adminMenu from "./admin-menu";
import chat from './our_chat'


//import defaultGui from '@rpgjs/default-gui'
import mobileGui from '@rpgjs/mobile-gui'
import gamepad from '@rpgjs/gamepad'
import displayName from "./display-name";
import initUniverse from "./initUniverse";


export default [
    main,
    playerMeeting,
    roomMeetings,
    titleScreen,
    defaultGui,
    //mobileGui,
    //gamepad,
    chat,
    mapHandler,
    displayName,
    playerMenu,
    adminMenu,
    initUniverse,

]


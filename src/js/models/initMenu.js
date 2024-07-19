import * as mainView from '../views/mainView';
import * as gameData from './data';
import * as statView from '../views/statView';
import * as miscView from '../views/miscView';
// -- inventory
import { equipMenu } from './equipMode';

// -- rooms
import { zoneExplorer, zones } from './rooms';

// - misc
import { tutorialMessages } from '../views/baseView';
import { tutorialMessage } from '../models/baseModel';


export const initEquip = (returnFunction) => {
    equipMenu.returnFunction = returnFunction;

    // -- TUTORIAL -- \\
    const tutorials = gameData.data.tutorials;
    if (tutorials.includes('inventory_1') == false && gameData.data.special.doingTutorial == true) {
        gameData.data.tutorials.push('inventory_1');
        mainView.displayWaitForInput(tutorialMessages.inventory_1, equipMenu.menuLoop);
    }
    else {
        equipMenu.menuLoop();
    }

    
};

export const zoneSetUp = (zone, room = 'start', additionalArgs = {}) => {
    zoneExplorer.currentZone = zones[zone];
    const zoneDetails = zones[zone].zone;
    if (room == 'start') {
       //console.log("(zonesetup) room equals start");
        for (var y = 0; y < zoneDetails.length; y++) {
            for (var x = 0; x < zoneDetails[y].length; x++) {
                if (zoneDetails[y][x] == "s") {
                   //console.log(zoneDetails[y][x])
                    zoneExplorer.coordinates = [y, x];
                    break;
                }
            }
        }
    // get coordinates. If room != "start", check if string, if not, then it is coordinates
    } else if (typeof(room) == "string") {
        // TBA
    } else {
        zoneExplorer.coordinates = [room[0], room[1]];
    }

    // -- TUTORIAL -- \\
    gameData.data.player.exploreCache.zone = zone;
    zoneExplorer.roomLoop(additionalArgs);

}

export const getExploreDetails = () => {
    return {
        currentZone: zoneExplorer.currentZone,
        currentRoom: zoneExplorer.currentRoom,
        coordinates: zoneExplorer.coordinates,
        justEnteredRoom: zoneExplorer.justEnteredRoom,
        ambushed: zoneExplorer.ambushed
    }
}
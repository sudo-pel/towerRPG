import * as miscView from '../views//miscView';
import * as mainView from '../views/mainView';
import * as statView from '../views/statView';
import{ Combat } from './combat';
import { items, getQuantity } from './items';
import * as gameData from './data';
import { skills } from './skills';
import * as initMenu from './initMenu';
import { modeDirectory } from '../../directories/enemies/enemies';


export function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  };

export function capitalise(string) {
    const upperCaseLetter = string[0].toUpperCase();
    const newString = upperCaseLetter + string.slice(1);
    return newString;
}

export const updateDisplayMode = {
    mode: "normal"
}
export const updateDisplay = (player, modeCoercion = "none") => {
   //console.log(`mode of updatedisplaymode is ${updateDisplayMode.mode}.... coercion is ${modeCoercion}`)
    if (updateDisplayMode.mode == "normal" && modeCoercion == "none" ) {
        miscView.updatePlayerStats(player); 
    }
    
    else if (modeCoercion == "normal" || initMenu.getExploreDetails().currentZone == undefined) {
        miscView.updatePlayerStats(player);
    }

    else {
        const zoneExplorer = initMenu.getExploreDetails();
        // getting the right area for the minimap: 4 rooms north, south, east and west of player position
        const playerCoordinates = zoneExplorer.coordinates;
        const baseMiniMap =  [...Array(17)].map(e => Array(17).fill(undefined));
        const playerMap = gameData.data.player.maps[zoneExplorer.currentZone.name];
        for (var y = 0; y < baseMiniMap.length; y++) {
            for (var x = 0; x < baseMiniMap[y].length; x++) {
                if (playerMap[ y + playerCoordinates[0] - 8 ] != undefined && y + playerCoordinates[0] - 8 > -1 && x + playerCoordinates[1] - 8 > -1) { // otherwise when accessing playerMap[y][x] we're trying to index undefined
                    baseMiniMap[y][x] = playerMap[ y + playerCoordinates[0] - 8 ][x + playerCoordinates[1] - 8 ] 
                } else {
                    baseMiniMap[y][x] = undefined
                }
            }
        }
       //console.log("LOGGING BASE MAP");
       //console.log(baseMiniMap);
        miscView.updateMiniMap(baseMiniMap, zoneExplorer.currentZone, zoneExplorer.coordinates);
    } 
    const plr = JSON.parse(JSON.stringify(player));
    plr.stats = Combat.getPlayerAdd(plr.stats);
    statView.updateStats(plr);
}

export const findAmount = (itemName, inventory) => {
    if (items[itemName].type == "reagent") {
        const index = inventory.findIndex(cur => {
            return (cur[0] == itemName)
        }) // just incase we try and search for an item that isnt in the inventory
        if (index == -1) { return 0 } else {
            return inventory[index][1];
        }
    } else {
        var count = 0;
        inventory.forEach(cur => {
            if (cur == itemName) {
                count++;
            }
        })
        return count;
    }
}

export const findProperty = (o, id) => {
    //Early return
    var p, result; 
    //console.log(o);

    if( o.hasOwnProperty(id) ) {
        return o[id];
    }

    for (p in o) {
        if (p == id) { // this is my base case?
            return o[p];
        } else if( typeof o[p] === 'object' && o[p].length == undefined) {
            return findProperty(o[p], id);
        }
    }
    return result;
}

export const clean = (array) => { // DOES NOT WORK
    array.forEach( (cur, index) => {
        if (!cur) { array.splice(index, 1) };
    })

    return array;
}

export const isObject = (object) => {
    return object === Object(object);
}

export const copy = (aObject) => { // thanks stackoverflow 
    if (!aObject) {
      return aObject;
    }
  
    let v;
    let bObject = Array.isArray(aObject) ? [] : {};
    for (const k in aObject) {
      v = aObject[k];
      bObject[k] = (typeof v === "object") ? copy(v) : v;
    }
  
    return bObject;
}

export const checkConditions = (conditionsArr) => {
    const player = gameData.data.player;
    var allMet = true;
    conditionsArr.forEach(condition => {
        const conditionSplit = condition.split(' ');
        //#region
            //console.log("CHECKING THE FOLLOWING CONDITION");
            //console.log(conditionSplit);
            switch (conditionSplit[0]) {

                case "gold:":{
                    const goldAmount = conditionSplit[1];
                    if (player.gold >= goldAmount) {
                        // pass
                    } else { allMet = false };
                    break;
                } 

                case "item:": {
                    const itemName = conditionSplit[2];
                    const itemQuantity = conditionSplit[1];
                    const ownedQuantity = getQuantity(itemName, player.inventory);
                    if (ownedQuantity >= itemQuantity) {
                        // pass
                    } else { allMet = false };
                    break;
                }

                case "level:": {
                    const levelNeeded = conditionSplit[1];
                    if (player.level >= levelNeeded) {
                        // pass
                    } else { allMet = false };
                    break;
                }

                case "flag:": {

                    //console.log(`CHECKING FLAG conditionSplit ${conditionSplit[1]}`);

                    // check if we are checking for false or true

                    var conditionTemp = conditionSplit[1] // we don't want to change the actual one
                    var flagCheck = "t" // t = true, f = false
                    if (conditionSplit[1][0] == '-') {
                        flagCheck = "f";
                        conditionTemp = conditionTemp.slice(1);
                    }
                    const flagToCheck = gameData.flags[conditionTemp];

                    //console.log("LOGGING FLAG IN DATA");
                    //console.log(flagToCheck);

                    if (flagCheck == "f" && flagToCheck.complete == false) {
                        // pass
                    } else if (flagCheck == "t" && flagToCheck.complete == true) {
                        // pass
                    } else { allMet = false };
                }
            }
        //#endregion
    
    });
    //console.log(allMet);
    return allMet;
}

export const getSkillsList = skillCodeArray => { // returns an array of skill names corresponding to skill codes
    var skillsList = skillCodeArray.map(skillCode => {
        if (skillCode != "guard" && skillCode != "attack") {
            var skillCodeParsed = skillCode.split('-') // splits into an array of the discipline and index
            var discipline = skillCodeParsed[0];
            var index = skillCodeParsed[1];
            return gameData.disciplines[discipline].skills[index].name;
        } else {
            return skillCode;
        }
    });
    return skillsList;
};
 
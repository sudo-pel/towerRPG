import * as mainView from '../views/mainView';
import { settings } from './data'; // need messageDelay
import { Combat } from './combat'; // only need endturn and getequips
import * as gameData from './data';
import { enemies } from './enemies';
import { addItem } from './items';
import { mainLoop } from '../index';
import { initNpc } from './npc';
import { updateDisplay, checkConditions, updateDisplayMode } from './baseModel';
import { initStats } from './learnSkills';
import { initSettings } from './settings';
import { initCrafting } from './crafting';
import { separator, tutorialMessages } from '../views/baseView';
import { initEquip } from './initMenu';

// ZONE IMPORTS
import { floor0 } from '../../directories/zones/floor0';
import { floor1 } from '../../directories/zones/floor1';
import { musicHandler } from './music';
//

export const floorToZone = {
    0: 'floor0',
    1: 'floor1'
}

export const getCurrentZone = () => {
    return zoneExplorer.currentZone;
}

export const teleport = coords => {
    var trueCoords;

    if (zoneExplorer.currentZone != undefined) {
        if (typeof(coords) == "string") { // this means its a roomcode, find the roomcode
            const zoneDetails = zoneExplorer.currentZone.zone;
            for (var y = 0; y < zoneDetails.length; y++) {
                for (var x = 0; x < zoneDetails[y].length; x++) {
                    if (zoneDetails[y][x] == coords) {
                        trueCoords = [y, x]
                        break;
                    }
                }
            }
        } else { trueCoords = coords }
        const zone = zoneExplorer.currentZone.zone
        mainView.displayMessage(`Teleporting to ${[trueCoords[1], zone.length - trueCoords[0]]}`)
        zoneExplorer.ambushed = true; // so no ambushing when teleporting
        zoneExplorer.coordinates = trueCoords
        
        zoneExplorer.ambushed = true;
        zoneExplorer.justEnteredRoom = true;
    } else {
        return false;
    }
}


export const zoneExplorer = {
    currentZone: undefined,
    currentRoom: undefined,
    coordinates: undefined,
    justEnteredRoom: true,
    ambushed: false,

    roomLoop: (additionalArgs = {} ) => {

        //console.log(zoneExplorer.coordinates);

        const zone = zoneExplorer.currentZone;
        const coordinates = zoneExplorer.coordinates;
        const roomCode = zone.zone[coordinates[0]][coordinates[1]];
        //console.log(`roomcode is ${roomCode}`);

        // update the player's exploreCache
        gameData.data.player.exploreCache.coordinates = [coordinates[0], coordinates[1]];
        // -----------------

        // getting any additional args
        var noAmbush = false;
        if (additionalArgs.noAmbush == true) {zoneExplorer.ambushed = true};
        // ------------------

        // create custom room
        const baseRoom = JSON.parse(JSON.stringify(zone[roomCode[0]]));
        if (roomCode.length > 1) {
            // if this is the case then we need to get the additional room data
            const additionalData = baseRoom.specialRooms[roomCode.slice(1)]; // get the additional data
            Object.keys(additionalData).forEach(data => {
                baseRoom[data] = additionalData[data]; // overwrite base room data w/ additional data where applicable
            });
        };
        // remove specialRooms from baseRoom
        delete baseRoom.specialRooms;
        zoneExplorer.currentRoom = baseRoom;
        // -----
        const currentRoom = zoneExplorer.currentRoom;
        
        const playerMap = gameData.data.player.maps[zone.name];

        var discoveredPrior = playerMap[coordinates[1]][coordinates[0]] == "discovered" ? true : false;

        // add the zone to the player's map
        if (playerMap[coordinates[1]][coordinates[0]] != "discovered") {
            playerMap[coordinates[1]][coordinates[0]] = "discovered";
            // add "seen" to all cardinal directions
            if (playerMap[coordinates[1] + 1][coordinates[0]] != "discovered") {
                playerMap[coordinates[1] + 1][coordinates[0]] = "seen"
            };
            if (playerMap[coordinates[1] - 1][coordinates[0]] != "discovered") {
                playerMap[coordinates[1] - 1][coordinates[0]] = "seen"
            };
            if (playerMap[coordinates[1]][coordinates[0] + 1] != "discovered") {
                playerMap[coordinates[1]][coordinates[0] + 1] = "seen"
            };
            if (playerMap[coordinates[1]][coordinates[0] - 1] != "discovered") {
                playerMap[coordinates[1]][coordinates[0] - 1] = "seen"
            };
        };


        updateDisplay(gameData.data.player); // important for minimap (must be after we update player map)

        var procAmbush = false;
        if (zoneExplorer.ambushed == false && noAmbush == false) { // we want to call this after they're ambushed and dont want it to happen again
           //console.log("ammmmbushed")
            zoneExplorer.ambushed = true;
            const ambushes = currentRoom.ambushes;
            //console.log(ambushes);
            const random = Math.floor(Math.random() * 100) + 1; // generate a number between 1 and 100
            var index = 0;
            var cumulativeChance = 0;
            for (index in ambushes) {
               //console.log(`random is ${random}, prevchance is ${cumulativeChance}, ambush chance is ${ambushes[index][1]}`)
               //console.log(`currently rolling for ${random[index]}`)
               var baseChance = ambushes[index][1];
               if (discoveredPrior) { baseChance = baseChance / 10 };
                if (random > cumulativeChance && random <= baseChance + cumulativeChance) {
                    // this means that this ambush was found
                    procAmbush = true;
                    mainView.displayMessage(`${separator}AMBUSH!!`);
                    const enemy = enemies[ambushes[index][0]];
                    const battleDetails = ambushes[index][2];
                    Combat.battleProcessing(gameData.data.player, enemy, zoneExplorer.roomLoop, battleDetails);
                    break;
                } else {
                    cumulativeChance += baseChance;
                }
            }
        };

        var procEvent = false;
        if (zoneExplorer.justEnteredRoom && !procAmbush) { // if the player has just entered the room
            var eventsToRun = []; // create an empty array to fill w/ events (onEnter)
            const enterEvents = zoneExplorer.currentRoom.onEnter;
            if (enterEvents.length > 0) {
                enterEvents.forEach(event => {
                    if (checkConditions(event[1]) == true) { // add all onEnters whose requirements are met to the array
                        eventsToRun.push(event[0]);
                    };
                });
                const eventRunner = (eventList) => { // create a function that runs all queued events before running room loop
                    var events = eventList;
                    initNpc(events[0], () => { // run event (npc) at the front of the queue
                        events.shift(); // then remove it from the queue
                        if (events.length > 0) { // if there are more, run the next
                            eventRunner(events);
                        } else {
                            zoneExplorer.justEnteredRoom = false; // otherwise proceed to room loop
                            zoneExplorer.roomLoop();
                        }
                        
                    })
                };
                if (eventsToRun.length > 0) { procEvent = true; eventRunner(eventsToRun) };
            }
        }


        // we dont want this to happen at the same time as an ambush
        if (!procAmbush && !procEvent) {
            zoneExplorer.roomLoop2(zoneExplorer.justEnteredRoom);
            mainView.setInputResponse(zoneExplorer.roomResponse);
        }
    },

    roomLoop2: (descroom = false) => {
        updateDisplay(gameData.data.player);

        const coordinates = zoneExplorer.coordinates;
        const zone = zoneExplorer.currentZone.zone;
        const roomCode = zone[coordinates[0]][coordinates[1]];
        const currentRoom = zoneExplorer.currentRoom;
        
        musicHandler.playMusic(currentRoom.music);

        if (descroom) {
            mainView.displayMessage(`${separator}${currentRoom.entrance}`);
        };
    
        // calculate displacement from center;
        const trueCoordinates = [coordinates[1], zone.length - coordinates[0]];
        mainView.displayMessage(`<b>Coordinates: [${trueCoordinates}]</b>`)
        //console.log("DISPLAYING BASE OPTIONS");
        getBaseOptions().forEach(option => {
            mainView.displayMessage(option)
        });

        var counter = 1; // number of options displayed
        currentRoom.extraOptions.forEach(option => {
            // evaluate whether or not it should be shown
            var showOption = true;
            if (option.length > 1) {

                showOption = checkConditions(option[1]);

            }

            if (showOption) {
                mainView.displayMessage(` - ${counter}: ${option[0]}`);
                counter += 1;
            }
        });

        zoneExplorer.justEnteredRoom = false;

        mainView.setInputResponse(zoneExplorer.roomResponse);
    },

    roomResponse: () => {
        mainView.removeInputResponse(zoneExplorer.roomResponse);

        const input = mainView.getInput().toLowerCase();

        const currentZone = zoneExplorer.currentZone;
        const coordinates = zoneExplorer.coordinates;
        const roomCode =  zoneExplorer.currentZone.zone[coordinates[0]][coordinates[1]];
        const currentRoom = zoneExplorer.currentRoom;

        updateDisplay(gameData.data.player);

        const unlocked = gameData.data.unlocked;

        //console.log(`search returns ${currentRoom.interacts[parseInt(input - 1)]} parseint is ${parseInt(input - 1)}`)

        switch (true) {
            
            case (input == "ex"):
            case (input == "explore"): { // if the player wants to explores
                const explores = currentRoom.explores;
                if (explores.length > 0) {
                    const random = Math.floor(Math.random() * 100) + 1; // generate a number between 1 and 100
                    //console.log(`Random is ${random}`)
                     var index = 0;
                     /* for randomisation, we check if the number rolled is between the chance of the previous item and the current item
                     plus the previous item. So in example array [["foo", 10], ["do", 50]], we first check if random is less than or equal
                     to 10 (10% chance). If not, we check if it is greater than prev. chance (10), less than/equal to and the current
                     chance (10 + 50 = ) 60. The range is 50, so there is a 50% chance of the second item. So the chance of one of the two
                     things happening is 60%. This is untrue if the items were to overlap. */
                     for (index in explores) { 
                         const prevChance = index == 0 ? 0 : explores[index - 1][1];
                        //console.log(`index is ${index}`);
                         if (random > prevChance && random <= explores[index][1] + prevChance) { // see above
                             if (explores[index][0] == "encounter") { // if encounter was rolled...
                                 //console.log("Rolled encounter");
                                 var index = 0;
                                 const encounters = currentRoom.encounters;
                                 const random = Math.floor(Math.random() * 100) + 1; // generate a number between 1 and 100
                                 var cumulativeChance = 0;
                                //console.log(`Encounter random is ${random}`)
                                 for (index in encounters) { 
                                    //console.log(`index is ${index}`);
                                     const prevChance = index == 0 ? 0 : encounters[index - 1][1];
                                     cumulativeChance += prevChance;
                                     if (random > cumulativeChance && random <= encounters[index][1] + cumulativeChance) {
                                         mainView.displayMessage("<br>You survey the area....");
                                         mainView.displayMessage("<br>An enemy approaches!");
                                         const enemy = enemies[encounters[index][0]];
                                         const battleDetails = encounters[index][2];
                                         Combat.battleProcessing(gameData.data.player, enemy, zoneExplorer.roomLoop, battleDetails);
     
                                         break;
                                     }
                                 }
                             } else if (explores[index][0] == "find") {
                                 //console.log("Rolled find");
                                 var index = 0;
                                 const finds = currentRoom.finds;
                                 const random = Math.floor(Math.random() * 100) + 1; // generate a number between 1 and 100
                                 var cumulativeChance = 0;
                                 //console.log(`Find random is ${random}`)
                                 for (index in finds) { 
                                     const prevChance = index == 0 ? 0 : finds[index - 1][1];
                                     //console.log(`prev chance is ${prevChance}`)
                                     cumulativeChance += prevChance;
                                     //console.log(`cum chance is ${cumulativeChance}`)
                                     if (random > cumulativeChance && random <= finds[index][1] + cumulativeChance) {
                                         musicHandler.playFX("find");
                                         mainView.displayMessage("<br>You survey the area....");
                                         mainView.displayMessage("<br>You find something while looking around!")
                                         if (finds[index][3] != undefined) {
                                             addItem(finds[index][0], finds[index][2], finds[index][3]);
                                         } else { addItem(finds[index][0]); }
                                         break;
                                     }
                                 }
                                 mainView.setInputResponse(zoneExplorer.roomResponse);
                             }
                         }
                     }
                } else {
                    mainView.displayMessage("<br><b>There is nothing to be found.</b>");
                    updateDisplay(gameData.data.player);
                    zoneExplorer.roomLoop();
                }
                break;
            }

            case (input == "i" && unlocked.inventory):
            case (input == "inventory" && unlocked.inventory): {
                initEquip(zoneExplorer.roomLoop);
                break;
            }

            case (input == "st" && unlocked.stats):
            case (input == "stats" && unlocked.stats): {
                initStats(zoneExplorer.roomLoop);
                break;
            }

            case (input == "set"):
            case (input == "settings"): {
                initSettings(zoneExplorer.roomLoop);
                break;
            }

            case (input == "c" && unlocked.crafting):
            case (input == "crafting" && unlocked.crafting): {
                initCrafting(zoneExplorer.roomLoop);
                break;
            }

            case (currentRoom.interacts[parseInt(input - 1)] != undefined): { // if they try to interact with someone
                //console.log(`passed check`);

                // create an array of available options
                var availableOptions = [];
                for (var x = 0; x < currentRoom.interacts.length; x++) {
                    var canDo = true;
                    if (currentRoom.interacts[x].length > 1) {
                        canDo = checkConditions(currentRoom.interacts[x][1])
                    };
                    if (canDo) {
                        availableOptions.push(currentRoom.interacts[x]);
                    }
                }

                // creating another array and checking it allows us to exclude options that the player does not have access to..
                // ..since they don't meet the conditions.

                //console.log("logging available options");
                //console.log(availableOptions);
                if (availableOptions[parseInt(input - 1)] != undefined) {
                    initNpc(availableOptions[parseInt(input - 1)][0], zoneExplorer.roomLoop);
                } else {
                    mainView.displayMessage("Invalid input");
                    mainView.setInputResponse(zoneExplorer.roomResponse);
                }

                break;
            }
            
            case (input == "leave"): {
                mainView.displayMessage("<br>Leaving area...");

                // gotta reset room explorer
                zoneExplorer.currentZone = undefined;
                zoneExplorer.coordinates = undefined;
                zoneExplorer.justEnteredRoom = true;
                gameData.data.player.exploreCache.zone = undefined;
                gameData.data.player.exploreCache.coordinates = [];
                mainLoop();
                break;
            
            }
                
            case (input == "s"):
            case (input == "south"): {
                // if there is explicit ref. to a room then goto it
                // otherwise if the natural movement of the player leads to a room, goto it
                // otherwise inform player they cannot go in that direction (sorry player :[)
                var newCoordinates = undefined;
                const naturalNewRoom = [coordinates[0] + 1, coordinates[1]]
                if (currentRoom.south != undefined) {
                    newCoordinates= zoneExplorer.currentZone.zone.south;
                } else if (naturalNewRoom != undefined && currentZone.zone[naturalNewRoom[0]][naturalNewRoom[1]] != "n") {
                    newCoordinates= naturalNewRoom;
                }

                if (newCoordinates != undefined) {
                    mainView.displayMessagesDelayed([["<br>You travel to the south...", 0.4, true, {}, "flatsec"]], "outside", () => {
                        zoneExplorer.coordinates = newCoordinates;
                        zoneExplorer.justEnteredRoom = true;
                        zoneExplorer.ambushed = false;
                        zoneExplorer.roomLoop();
                    } )
                } else {
                    mainView.displayMessage("<b>You can't travel in that direction!</b>");
                    zoneExplorer.roomLoop();
                }
                break;
            }

            case (input == "n"):
            case (input == "north"): {
                var newCoordinates = undefined;
                const naturalNewRoom = [coordinates[0] - 1, coordinates[1]]
                if (currentRoom.south != undefined) {
                    newCoordinates= zoneExplorer.currentZone.zone.south;
                } else if (naturalNewRoom != undefined && currentZone.zone[naturalNewRoom[0]][naturalNewRoom[1]] != "n") {
                    newCoordinates= naturalNewRoom;
                }

                if (newCoordinates != undefined) {
                    mainView.displayMessagesDelayed([["<br>You travel to the north...", 0.4, true, {}, "flatsec"]], "outside", () => {
                        zoneExplorer.coordinates = newCoordinates;
                        zoneExplorer.justEnteredRoom = true;
                        zoneExplorer.ambushed = false;
                        zoneExplorer.roomLoop();
                    } )
                } else {
                    mainView.displayMessage("<b>You can't travel in that direction!</b>");
                    zoneExplorer.roomLoop();
                }
                break;
            }

            case (input == "w"):
            case (input == "west"): {
                var newCoordinates = undefined;
                const naturalNewRoom = [coordinates[0], coordinates[1] - 1]
                if (currentRoom.south != undefined) {
                    newCoordinates= zoneExplorer.currentZone.zone.south;
                } else if (naturalNewRoom != undefined && currentZone.zone[naturalNewRoom[0]][naturalNewRoom[1]] != "n") {
                    newCoordinates= naturalNewRoom;
                }

                if (newCoordinates != undefined) {
                    mainView.displayMessagesDelayed([["<br>You travel to the west...", 0.4, true, {}, "flatsec"]], "outside", () => {
                        zoneExplorer.coordinates = newCoordinates;
                        zoneExplorer.justEnteredRoom = true;
                        zoneExplorer.ambushed = false;
                        zoneExplorer.roomLoop();
                    } )
                } else {
                    mainView.displayMessage("<b>You can't travel in that direction!</b>");
                    zoneExplorer.roomLoop();
                }
                break;
            }

            case (input == "e"):
            case (input == "east"): {
                var newCoordinates = undefined;
                const naturalNewRoom = [coordinates[0], coordinates[1] + 1]
                if (currentRoom.south != undefined) {
                    newCoordinates= zoneExplorer.currentZone.zone.south;
                } else if (naturalNewRoom != undefined && currentZone.zone[naturalNewRoom[0]][naturalNewRoom[1]] != "n") {
                    newCoordinates= naturalNewRoom;
                }

                if (newCoordinates != undefined) {
                    mainView.displayMessagesDelayed([["<br>You travel to the east...", 0.4, true, {}, "flatsec"]], "outside", () => {
                        zoneExplorer.coordinates = newCoordinates;
                        zoneExplorer.justEnteredRoom = true;
                        zoneExplorer.ambushed = false;
                        zoneExplorer.roomLoop();
                    } )
                } else {
                    mainView.displayMessage("<b>You can't travel in that direction!</b>");
                    zoneExplorer.roomLoop();
                }
                break;
            }
            
            case (input == "m"):
            case (input == "map"): {
                const mapBase = currentZone.zone;

                const mapString = generateMap(mapBase, currentZone, coordinates);

                mainView.displayMessage(mapString);
                zoneExplorer.roomLoop();
                break;
            }

            case (input == "sm"):
            case (input == "show minimap"): {
                if (updateDisplayMode.mode == "minimap") {
                    updateDisplayMode.mode = "normal";
                } else {
                    updateDisplayMode.mode = "minimap";
                }
                
                updateDisplay(gameData.data.player);
                zoneExplorer.roomLoop();
                break;
            }

            case (input == "rep"):
            case (input == "reprint"): {

                
                mainView.displayMessage("Reprinting options..");

                updateDisplay(gameData.data.player);
                zoneExplorer.roomLoop();
                break;
            }
                

            default: {
                mainView.displayMessage("Invalid input");
                mainView.setInputResponse(zoneExplorer.roomResponse);
            }

    

        
    }

}
}

export const zones = {

    floor0,
    floor1

}

export const getBaseOptions = function() {
    const unlocked = gameData.data.unlocked;
    const options = [`${separator} - ex/Explore`, " - w/west", " - e/east", " - n/north",
                    " - s/south"];
    if (unlocked.inventory) {
        options.push(" - i/inventory");
    }
    if (unlocked.stats) {
        options.push(" - st/stats");
    }
    if (unlocked.crafting) {
        options.push(" - c/crafting")
    }

    options.push(" - m/map", " - sm/show minimap", " - set/settings", " - Leave");

    return options;
}

export const generateMap = (mapBase, zoneToMap, playerCoordinates) => {
    //const mapBase = currentZone.zone;
    const playerMap = gameData.data.player.maps[zoneToMap.name];

    // initialise map string
    var mapString = "";
    // for each column...
    // -- for each row....
    //console.log("plr map");
    //console.log(playerMap);
    for (var y = 0; y < mapBase.length; y++) {
        //console.log("running on column");
        for (var x = 0; x < mapBase[y].length; x++) {
            //console.log("running on row");
            /*if (mapBase[y][x] == "n") {
                mapString += "  ▩";
            } else {*/
                if (playerCoordinates[0] == y && playerCoordinates[1] == x) {
                    mapString += " 	<span style='color:#00ff99'>▣</span>";
                } else if (playerMap[x][y] == "discovered") {
                    // need to get the roomcode of the room we are looking at
                    const roomCodeTemp = zoneToMap.zone[y][x];
                    const colour = zoneToMap[roomCodeTemp[0]].colour;
                    mapString += `<span style="color:${colour}">  ▣</span>`
                } else if (playerMap[x][y] == "seen") {
                    if (mapBase[y][x] == "n") {
                        mapString += "  ▩";
                    } else {
                       mapString += "	▢"; 
                    }
                } else {
                    mapString += "	▥";
                }
        }
        mapString += '<br>'
    };

    // if column, row is "n", insert a █
    // if column, row is not, check what the player's map says and display that. If..
    // ..undefined, display a "X" instead
    // then print map and return to roomLoop

    return mapString;
}

export const generateMiniMap = (mapBase, zoneToMap, playerCoordinates) => {
    //const mapBase = currentZone.zone;
    const playerMap = gameData.data.player.maps[zoneToMap.name];

    // initialise map string
    var mapString = "";
    // for each column...
    // -- for each row....
   //console.log("plr map");
   //console.log(playerMap);
    for (var y = 0; y < mapBase.length; y++) {
       //console.log("running on column");
        for (var x = 0; x < mapBase[y].length; x++) {
           //console.log("running on row");
            /*if (mapBase[y][x] == "n") {
                mapString += "  ▩";
            } else {*/
                const transX = x + playerCoordinates[1] - 8;
                const transY = y + playerCoordinates[0] - 8;
                if (transY < playerMap.length) {
                    if (playerCoordinates[0] == transY && playerCoordinates[1] == transX) {
                        mapString += " 	<span style='color:#00ff99'>▣</span>";
                    }
                    else if (transX < 0 || transY < 0 || transX > 64 || transY > 64) {
                        mapString += "	▥";
                    } 
                    else if (playerMap[transX][transY] == "discovered") {
                        // need to get the roomcode of the room we are looking at
                        const roomCodeTemp = zoneToMap.zone[transY][transX];
                        const colour = zoneToMap[roomCodeTemp[0]].colour;
                        mapString += `<span style="color:${colour}">  ▣</span>`
                    } else if (playerMap[transX][transY] == "seen") {
                        if (zoneToMap.zone[transY][transX] == "n") {
                            mapString += "  ▩";
                        } else {
                           mapString += "	▢"; 
                        }
                    } else {
                        mapString += "	▥";
                    }
                } else {
                    mapString += "	▥";
                }
        }
        mapString += '<br>'
    };

    // if column, row is "n", insert a █
    // if column, row is not, check what the player's map says and display that. If..
    // ..undefined, display a "X" instead
    // then print map and return to roomLoop

    return mapString;
}
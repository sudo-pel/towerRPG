// imports go here
import * as mainView from '../views/mainView';
import * as statView from '../views/statView';
import { skills } from './skills';
import * as gameData from './data';
import { settings } from './data';
import { updateDisplay, findAmount, findProperty, clean, checkConditions, copy, displayWaitForInput } from './baseModel';
import { basename } from 'path';
import { mainLoop } from '../index';
import { getEnemy } from './enemies';
import { addItem, items, displayDetails, removeItem, isReagent, getName, getQuantity } from './items';
import { parse } from 'querystring';
import { initShop } from './shops';
import { Combat, checkLevel } from './combat';
import { unlockRecipes, initCrafting } from './crafting';
import { musicHandler } from './music';
import { saveGame } from './settings';
import { teleport } from './rooms';
//

// -- NPC IMPORTS -- \\
import { floor0 } from '../../directories/npc/floor0';
import { floor1 } from '../../directories/npc/floor1';
//

const npcs = Object.assign(floor1, floor0)


// NPC HANDLER
const npcHandler = {
    currentNpc: undefined,
    currentBranch: undefined,
    returnFunction: undefined,

    music: undefined,

    initNpc(npc, return_function) {
        //console.log(npc);
        //console.log(npcs);
        this.currentNpc = copy(npcs[npc]); // making a deep copy b/c nested objects
        //console.log("logging current npc");
        //console.log(this.currentNpc);
        this.currentBranch = this.currentNpc;
        this.returnFunction = return_function;
        this.runBranch(Object.keys(this.currentBranch));
    },

    runBranch(responseArr) { // rerun makes it so that on a rerun, options will run but nothing else will
        const cBranch = this.currentBranch;
        //console.log("CURRENTLY RUNNING ON THE FOLLOWING BRANCH");
        //console.log(cBranch);
        //console.log("RESPONSE ARRAY IS AS FOLLOWS");
        //console.log(responseArr);

        var stop = false;

        // removing undefined and empty values
        responseArr.forEach( (item, index) => {
            if (item == undefined) { responseArr.splice(index, 1) };
        })
        //console.log("responsearr");
        //console.log(responseArr);

        for (var i = 0; i < Object.keys(cBranch).length; i++) {
            const item = responseArr[i];
            //console.log(` item is ${item}`);
            //console.log(npcHandler.currentNpc)
            //console.log(`logging cbranch[item]`);
            //console.log(cBranch[item]);
            switch (item) {

                // -- NOTES REGRADING NPC PROGRAMMING -- \\
                /*
                 
                 - 'runbranch' iterates over a branch like a property of an options object
                 - 'item' is equal to the key currently being ran; Ex. 'action'
                
                */

                case "say3":
                case "say2":
                case "say": {
                    if (!stop) {
                        stop = true; // this stops the code from looping and stuff
                        //console.log("loggin cbranch");
                        //console.log(cBranch);
                        const dialogue = npcHandler.parseDialogue(copy(cBranch[item])); // get whatever must be said
                        const finishFunction = () => {
                            var responseArrTemp = responseArr;
                            delete responseArrTemp[responseArrTemp.indexOf(item)];
                            this.runBranch(responseArrTemp); // remove "say" and then rerun the method. This ensures that other things in..
                            // ..the branch are only done after the NPC has said whatever it is that they must say
                        };
                        if (settings.scrollStyle == "auto") {
                            mainView.displayMessagesDelayed(dialogue, "outside", finishFunction);
                        } else {
                            mainView.displayWaitForInput(dialogue, finishFunction, true);
                        }
                        break;
                    }

                };

                case "action8":
                case "action7":
                case "action6":
                case "action5":
                case "action4":
                case "action3":
                case "action2":
                case "action": {
                    //(`logging item followed by cBranch.action`);
                    //console.log(cBranch[item]);
                    //console.log(cBranch.action);
                    if (!stop) {
                        const cBranch = npcHandler.currentBranch;
                        const cNpc = npcHandler.currentNpc; // for easy access
                        //console.log("STOP IS FALSE. LOGGING ITEM..")
                        //console.log(item);
                        const action = cBranch[item][0]; // testing instead of cBranch.action[0]
                        switch (action) {

                            case "save": {
                                saveGame();
                                break;
                            }

                            case "end": {
                                npcHandler.runBranch(["end"]);
                                break;
                            }

                            case "waypoint": {
                                const location = cBranch[item][1] // testing instead of cBranch.action[1];
                                const newBranch = findProperty(npcHandler.currentNpc, location);
                                //("NEW BRANCH");
                                //console.log(newBranch);
                                npcHandler.currentBranch = newBranch;
                                npcHandler.runBranch(Object.keys(newBranch));
                                break;
                            }

                            case "shop": {
                                const shopName = cBranch[item][1] // testing instead of cBranch.action[1];
                                var returnFunction = cBranch[item][2] // testing instead of cBranch.action[2];
                                // we now need to translate the return function
                                switch (returnFunction[0]) {

                                    case "end": {
                                        returnFunction = () => {
                                            const newBranch = {
                                                action: ["end"]
                                            };
                                            npcHandler.currentBranch = newBranch;
                                            npcHandler.runBranch(Object.keys(newBranch));
                                        }
                                        break;
                                    }

                                    case "waypoint": {
                                        returnFunction = () => {
                                            // we'll create an artifical branch and link it to NPC handler
                                            const newBranch = {
                                                action: cBranch[item][2] // testing instead of cBranch.action[2]
                                            };
                                            npcHandler.currentBranch = newBranch;
                                            npcHandler.runBranch(Object.keys(newBranch));
                                        }
                                    }
                                };

                                initShop(shopName, returnFunction);
                                break;

                            }

                            case "battle": {
                                const enemyDetails = cBranch[item][1][0];
                               //console.log(enemyDetails);
                                // index 0: enemy name
                                // index 1: custom battle arguments

                                const temp = cBranch[item][1][1]; // this won't exist when ffunc is called
                                Combat.battleProcessing(gameData.data.player, getEnemy(cBranch[item][1][0][0]), () => {  //cBranch.action[1][0]
                                    // we'll create an artifical branch and link it to NPC handler (for finish function)
                                    const newBranch = {
                                        action: temp // testing instead of cBranch.action[1][1]
                                    };
                                    npcHandler.currentBranch = newBranch;
                                    npcHandler.runBranch(Object.keys(newBranch));
                                }, enemyDetails[1])
                                break;
                            }

                            case "gold": {
                                stop = true;
                                const goldAmount = cBranch[item][1];
                                //console.log(copy(cBranch));
                                const func = () => {
                                    gameData.data.player.gold += goldAmount;
                                    updateDisplay(gameData.data.player);
                                    //
                                    var responseArrTemp = [...responseArr];
                                    delete responseArrTemp[responseArrTemp.indexOf(item)];
                                    //console.log(responseArrTemp);
                                    this.runBranch(responseArrTemp); 
                                };
                                const msg = [[`<br>${goldAmount > 0 ? 'Obtained' : 'Lost'} ${Math.abs(goldAmount)} gold!`, 1]];
                                if (settings.scrollStyle == "auto") {
                                    mainView.displayMessagesDelayed(msg, "oustide", func);
                                } else {
                                    mainView.displayWaitForInput(msg, func, true)
                                }
                                break;
                            }

                            case "exp": {
                                stop = true;
                                //console.log(copy(cBranch));
                                const expAmount = cBranch[item][1];
                                const msg = [[`<br>Obtained ${expAmount} EXP!`, 1]];
                                const func =  () => {
                                    gameData.data.player.exp += expAmount;
                                    updateDisplay(gameData.data.player);
                                    checkLevel();
                                    //
                                    var responseArrTemp = [...responseArr];
                                    delete responseArrTemp[responseArrTemp.indexOf(item)];
                                    //console.log(responseArrTemp);
                                    this.runBranch(responseArrTemp); 
                                };

                                if (settings.scrollStyle == "auto") {
                                    mainView.displayMessagesDelayed(msg, "oustide", func);
                                } else {
                                    mainView.displayWaitForInput(msg, func, true);
                                }

                                break;
                            }

                            case "items": {
                                stop = true;
                                const itemName = cBranch[item][1];
                                const itemAmount = cBranch[item][2];
                                if (itemAmount > 0) {
                                    addItem(itemName, itemAmount, itemAmount);
                                } else {
                                    removeItem(itemName, itemAmount * -1);
                                };
                                updateDisplay(gameData.data.player);
                                const func = () => {
                                    var responseArrTemp = [...responseArr];
                                    delete responseArrTemp[responseArrTemp.indexOf(item)];
                                    this.runBranch(responseArrTemp);
                                };
                                if (settings.scrollStyle == "auto") {
                                    setTimeout(func, 1000 * settings.messageDelay);
                                } else {
                                    mainView.displayWaitForInput([""], func, false);
                                }

                                break;
                            }

                            case "flag": {
                                const flagName = cBranch[item][1];
                                const shift = cBranch[item][2];
                                // set the flag
                                if (shift == "true") {
                                    gameData.flags[flagName].complete = true;
                                } else {
                                    gameData.flags[flagName].complete = false;
                                }

                                break;
                            }

                            case "recipe": {
                                const recipeName = cBranch[item][1];
                                unlockRecipes(recipeName); // this can take arrays of recipes

                                break;
                            }

                            case "music": {
                                if (cBranch[item][1] != "stop") {
                                    //console.log("branch: play music")
                                    const musicName = cBranch[item][1];
                                    npcHandler.music = musicName;
                                    musicHandler.playMusic(musicName);
                                } else {
                                    musicHandler.music = undefined;
                                    musicHandler.stopMusic();
                                };
                                break;``
                            }

                            case "crafting": {
                                // action: ["crafter", [.. arr of recipes], finishFunction]
                                // Note that finishFunction needs to be in the form of a branch; e.g ["end"], or..
                                // .. ["waypoint", ...], etc. NOT just "end"
                                const details = cBranch[item];
                                const temp = cBranch[item][2] // wont exist when we call ffunc
                                initCrafting(() => {
                                    const newBranch = {
                                        action: temp
                                    };
                                    npcHandler.currentBranch = newBranch;
                                    npcHandler.runBranch(Object.keys(newBranch));
                                }, cBranch[item][1])

                                break;
                            }

                            case "heal": {
                                Combat.heal(gameData.data.player.stats);
                                updateDisplay(gameData.data.player);
                                break;
                            }

                            case "custom": {
                                //console.log(`CUSTOM. ITEM IS ${item}`);
                                const func = cBranch[item][1];
                                func();
                                break;
                            }

                            case "teleport": {
                                const coords = cBranch[item][1];
                                teleport(coords);
                                break;
                            }

                        }

                        //console.log("deleting...2);")
                        //console.log(cBranch[item]);
                        delete cBranch[item];
                        responseArr.splice(responseArr.indexOf(item), 1);
                        i--; // i beseech the divine

                    }

                    break;
                };

                case "end": {
                    //console.log(`stop is ${stop}`);
                    //console.log("end");

                    //console.log(responseArr);
                    if (!stop && responseArr[0] == "end") {
                        const cBranch = npcHandler.currentBranch;
                        const cNpc = npcHandler.currentNpc; // for easy access
                        const returnFunction = npcHandler.returnFunction;
                        //console.log('printing return function');
                        //console.log(npcHandler.returnFunction);

                        const dialogue = npcHandler.parseDialogue(copy(cNpc.end));
                        const finishFunction = () => {
                            npcHandler.music = undefined;
                            returnFunction();
                        }
                        if (settings.scrollStyle == "auto") {
                            if (dialogue[0][0] == "<br>") {
                                mainView.displayMessage(""); // linebreak
                                finishFunction();
                            } else { mainView.displayMessagesDelayed(dialogue, "outside", finishFunction); };
                        } else {
                            if (dialogue[0][0] == "<br>") {
                                mainView.displayMessage(""); // linebreak
                                finishFunction();
                            } else {
                                mainView.displayWaitForInput(dialogue, finishFunction, true);
                            }
                        }
                        // say whatever is in "end", then exit
                    }
                    break;
                };

                case "options": {
                    if (!stop) {
                        mainView.displayMessage(""); // acts as a linebreak
                        Object.keys(cBranch.options).forEach((opt, index) => {
                            mainView.displayMessage(`${index + 1} - ${opt}`)
                        })
                        mainView.setInputResponse(this.branchResponse);
                    }
                    break;
                };

                case "conditional": {
                    if (!stop) {
                        const cBranch = npcHandler.currentBranch;
                        const conditional = cBranch.conditional;
                        var newBranch = undefined;
                        var branchFound = false;
                        const player = gameData.data.player;
                        // run forEach over the conditional object

                        //console.log("SEARCHING CONDITIONS");

                        Object.keys(conditional).forEach(key => {
                            if (!branchFound) {
                                if (checkConditions([key]) == true) { // take multiple conditions at once functionality needed
                                    branchFound = true;
                                    newBranch = conditional[key];
                                }
                            }

                        })

                        //console.log("BRANCH FOUND");
                        //console.log(newBranch);

                       //console.log(`RESULT: ${branchFound}`);

                        if (branchFound) {
                            npcHandler.currentBranch = newBranch;
                            npcHandler.runBranch(Object.keys(newBranch));
                        }

                        // If the value found is false
                        // Turn each key in the conditional object into an array
                        // If it is an item, use checkQuantity or w/e
                        // If it is flag, check the value of the flag in data.js
                        // If it is level, check player level in data.js
                        // If the condition is met then set branchToRun to that branch and set found to true
                        // Then run the branch
                    }

                    break;
                }

                case "interesting_item": {
                        const customBranch = {
                            say: [["<br>You notice something interesting on the floor. You decide to pick" +
                            " it up and take it with you.", 0]],
                            action: ["items", cBranch[item][1][0], cBranch[item][1][1]],
                            action3: ["flag", cBranch[item][0], "true"],
                            action2: ["end"]
                        };
                        npcHandler.currentBranch = customBranch
                        npcHandler.runBranch(Object.keys(customBranch));
                }

                default:
                //console.log("Not an action");
            }
        }
    },

    branchResponse() {
        mainView.removeInputResponse(npcHandler.branchResponse);

        const input = mainView.getInput().toLowerCase();


        const currentBranch = npcHandler.currentBranch; // get the branch currently being used
        const options = Object.keys(currentBranch.options) // get the option responses. Options will be an array

        if (parseInt(input).toString() != "Nan" && input != "") { // blank inputs dont become "NaN"
            if (options[input - 1] != undefined) {
                const selection = options[input - 1]; // save the selection to a variable, makes code clean
                npcHandler.currentBranch = currentBranch.options[selection]; // change current branch 
                npcHandler.runBranch(Object.keys(npcHandler.currentBranch)); // run code on current branch
            } else {
                mainView.displayMessage("<br>Input out of range");
                mainView.setInputResponse(npcHandler.branchResponse);
            }
        } else {
            mainView.displayMessage("<br>Invalid input.");
            mainView.setInputResponse(npcHandler.branchResponse);
        }
    },

    parseDialogue(dialogue) { // messages are in format [["message", waitmod]] so when parsing the image we need to...
        //console.log("logging dialogue");
        //console.log(dialogue);

        dialogue.forEach(sentence => {
           //console.log(`sentence 0 is ${sentence[0]} sentence is ${sentence}`)
            sentence[0] = sentence[0].replace(/\[name\]/gi, `${npcHandler.currentNpc.name}`);
            sentence[0] = sentence[0].replace(/\[player\]/gi, `${gameData.data.player.name}`);
            sentence[0] = "<br>" + sentence[0];
        })

        return dialogue;
    },

    end() { // if we need to add it as a return function
        npcHandler.runBranch(["end"]);
    }

}

export const initNpc = (npc, return_function) => {
    npcHandler.initNpc(npc, return_function);
}

export const getNpcDetails = () => {
    return {
        currentNpc: npcHandler.currentNpc,
        currentBranch: npcHandler.currentBranch,
        returnFunction: npcHandler.returnFunction,
    
        music: npcHandler.music,
    }
}
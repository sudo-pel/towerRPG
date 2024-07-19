import { elements, inputSeparator } from '../views/baseView';
import * as mainView from '../views/mainView';
import * as gameData from './data';
import * as statView from '../views/statView';
import * as miscView from '../views/miscView';
import { enemies } from './enemies';
import { Combat } from './combat';
import { skills } from './skills';
import { mainLoop } from '../index';
import { presetMenuOptions, separator, clean, tutorialMessages } from '../views/baseView';
import { capitalise, updateDisplay, getSkillsList, copy } from './baseModel';

// STAT MODE // 
export const initStats = returnFunction => {
    statMenu.returnFunction = returnFunction;

    // -- TUROIAL -- \\
    if (gameData.data.tutorials.includes('stats_1') == false && gameData.data.special.doingTutorial == true) {
        gameData.data.tutorials.push('stats_1');
        mainView.displayWaitForInput(tutorialMessages.stats_1, statMenu.statLoop)
    } else {
        statMenu.statLoop();
    }
}

export const statMenu = {

    returnFunction: undefined,

    reset() {
        this.returnFunction = undefined
    },

    statLoop: () => {
        mainView.displayMessage("<br>Entering the stats menu.<br> Say 'sk'/'skills' to enter the skill menu, or 'sp' to enter the sp menu.")
        mainView.displayMessage("<br>Input <b>'b'/'back'</b> to return.")
        mainView.initInputShortcuts(presetMenuOptions.statMenu);
        mainView.setInputResponse(statMenu.statLoopResponse);
        updateDisplay(gameData.data.player, "normal");
    },

    statLoopResponse: () => {
        mainView.removeInputResponse(statMenu.statLoopResponse); // so they can't press multiple times real fast and cause several triggers
        const player = gameData.data.player;
        const input = mainView.getInput();
        // going through menus
        switch (input.toLowerCase()) {
            case "sk":
            case "skills": {
                mainView.displayMessage(`${separator}Entering skills menu. To change skills equipped, say 'e'/equipped', or say 'l'/'learn' to learn new skills.`);
                
                mainView.initInputShortcuts(["equipped", "learn", "back"])
                mainView.setInputResponse(skillsMenu)
            }
            break;

            case "sp": {
                mainView.displayMessage(`${separator}Entering SP menu. Say 'a'/'allocate' to allocate SP, or 'r'/'reset' to reset allocation.`);
                mainView.displayMessage("<br>Current SP investments:")
                displaySP();

                mainView.initInputShortcuts(["allocate", "reset", "back"])
                mainView.setInputResponse(spMenu);
            }
            break;

            case "b":
            case "back": {
                mainView.displayMessage(`${separator}Returning to main menu...`);
                statMenu.returnFunction();
            }
            break;

            default: {
                mainView.displayMessage("<br>Invalid input");

                mainView.initInputShortcuts(presetMenuOptions.statMenu);
                mainView.setInputResponse(statMenu.statLoopResponse);
            }
        }
    }


}

const spMenu = () => {
    mainView.removeInputResponse(spMenu);
    const input = mainView.getInput();
    const player = gameData.data.player;

    switch (input.toLowerCase()) {
        case "a":
        case "allocate": {
            mainView.displayMessage(`${separator}Entering allocate mode. Say the name of a stat, for example 'atk' to allocate SP to that stat. Only atk, def, matk, mdef, speed and hp can be allocated to.`);
            mainView.displayMessage(`You have ${gameData.data.player.sp} SP.`);
            mainView.displayMessage(`At level ${player.level}, the maximum SP that can be allocated to one stat is ${gameData.sp_investment_caps[player.level]}.`);
            mainView.initInputShortcuts(presetMenuOptions.allocateSP);
            mainView.setInputResponse(allocateMode)
        }
        break;

        case "r":
        case "reset": {
            var total = 0;
            Object.keys(player.sp_investment).forEach(cur => {
                total += player.sp_investment[cur];
            }) // calculating sp reset cost
            mainView.displayMessage(`${separator}Are you sure you want to reset your SP? It will cost ${total * 20} gold. Type 'y' or 'yes' to confirm. To go back, enter anything else.`); // NEED TO MAKE
            mainView.setInputResponse(resetMode);
        }
        break;

        case "b":
        case "back": {
            mainView.displayMessage(`${separator}Returning to status menu..`);
            
            statMenu.statLoop(); //
        }
        break;

        default: {
            mainView.displayMessage("<br>Invalid input");
            mainView.displayMessage(`${separator}Current SP investments:`)
            displaySP();
            mainView.setInputResponse(spMenu);
            mainView.initInputShortcuts(["allocate", "reset", "back"])
        }
    }

}

const displaySP = () => {
    const player = gameData.data.player;

    const msgArr = Object.keys(player.sp_investment).map(cur => {
        return (`${cur}: ${player.sp_investment[cur]}`);
    })

    msgArr.forEach(cur => mainView.displayMessage(cur));

}

const resetMode = () => {
    mainView.removeInputResponse(resetMode);
    const input = mainView.getInput().toLowerCase();
    const player = gameData.data.player;

    var total = 0;
    Object.keys(player.sp_investment).forEach(cur => { total += player.sp_investment[cur] });
    const cost = total * 20;

    if (input == "yes" || input == "y") {
        if (player.gold >= cost) {
            mainView.displayMessage(`${separator}SP has been reset.`);

            Object.keys(player.sp_investment).forEach(cur => {
                player.sp += player.sp_investment[cur];
                player.sp_investment[cur] = 0;
            })
            player.gold -= cost;
            
            const playerHP = Combat.getMaxHealth(player.stats);
            if (player.stats.current_health > playerHP) { player.stats.current_health = playerHP};
        } else {
            mainView.displayMessage(`${separator}You don't have enough gold!`)
        }

        mainView.displayMessage(`${separator}You now have ${player.sp} SP.`);

    }

    mainView.displayMessage(`${separator}Returning to SP menu..`);
    mainView.displayMessage(`${separator}Entering SP menu. Say 'a'/'allocate' to allocate SP, or 'r'/'reset' to reset allocation.`);
    
    mainView.displayMessage("<br>Current SP investments:")
    displaySP();
    mainView.setInputResponse(spMenu);
    
    mainView.initInputShortcuts(["allocate", "reset", "back"])
    updateDisplay(gameData.data.player, "normal");

}

const allocateMode = () => {
    mainView.removeInputResponse(allocateMode)
    const input = mainView.getInput().toLowerCase();
    const player = gameData.data.player;
    var goback = true;

    if (player.sp_investment.hasOwnProperty(input)) {
        if (player.sp > 0) {
            mainView.displayMessage(`How many SP points would you like to allocate to ${input}?`)
            mainView.setInputResponse( allocateSPInvoke(input)  ); // otherwise it will be called immediately
            goback = false;
            
        } else {
            mainView.displayMessage("You don't have any SP!");
        }
    } else if (input == "back" || input == "b") {
        goback = false;
        mainView.displayMessage(`Returning to SP menu...`);
        mainView.displayMessage(`Entering SP menu. Say 'a/allocate' to allocate SP, 'r/reset' to reset allocation.`);
        mainView.displayMessage("Current SP investments:")
        displaySP();

        mainView.initInputShortcuts(["allocate", "reset", "back"])
        mainView.setInputResponse(spMenu);
    } else {
        mainView.displayMessage("Invalid input.");
    }

    
    if (goback) {
        mainView.displayMessage(`<br>You currently have ${player.sp} SP.`)
        mainView.setInputResponse(allocateMode); // if input is not back, then go back to allocate mode
    };
    

    updateDisplay(gameData.data.player, "normal");

}

const allocateSPInvoke = (stat) => {
   //console.log("ALLOCATE SP INVOKE CALLED");
    mainView.removeInputResponse( allocateSPInvoke );
    const allocateSP = () => {
        mainView.removeInputResponse(allocateSP, false);

        const input = mainView.getInput();
        if (parseInt(input).toString() != "NaN") {
            const player = gameData.data.player;
            if (parseInt(input) <= player.sp) {
                if (parseInt(input) + player.sp_investment[stat] <= gameData.sp_investment_caps[player.level]) {
                    player.sp -= parseInt(input);
                    player.sp_investment[stat] += parseInt(input);
                    if (stat == "health") { player.stats.current_health += parseInt(input) * 20 } // increase their hp based on sp alloc.
                    mainView.displayMessage(`${input} SP allocated to ${stat}. Returning to allocate mode..<br>`);
                    mainView.displayMessage(`Entering allocate mode. Say the name of a stat, for example 'atk' to allocate SP to that stat. Only atk, def, matk, mdef, speed and hp can be allocated to.`);
                    mainView.displayMessage(`At level ${player.level}, the maximum SP that can be allocated to one stat is ${gameData.sp_investment_caps[player.level]}.`);
                    mainView.displayMessage(`You have ${gameData.data.player.sp} SP.`);
                    mainView.initInputShortcuts(presetMenuOptions.allocateSP);
                    mainView.setInputResponse(allocateMode);
                    updateDisplay(player, "normal");
                } else {
                    mainView.displayMessage(`This amount of SP would exceed your single stat allocation limit! Returning to allocate mode..<br>`);
                    mainView.displayMessage(`Entering allocate mode. Say the name of a stat, for example 'atk' to allocate SP to that stat. Only atk, def, matk, mdef, speed and hp can be allocated to.`);
                    mainView.displayMessage(`At level ${player.level}, the maximum SP that can be allocated to one stat is ${gameData.sp_investment_caps[player.level]}.`);
                    mainView.displayMessage(`You have ${gameData.data.player.sp} SP.`);
                    mainView.initInputShortcuts(presetMenuOptions.allocateSP);
                    mainView.setInputResponse(allocateMode);
                }
            } else {
                mainView.displayMessage(`You don't have enough SP! Returning to allocate mode..<br>`);
                mainView.displayMessage(`Entering allocate mode. Say the name of a stat, for example 'atk' to allocate SP to that stat. Only atk, def, matk, mdef, speed and hp can be allocated to.`);
                mainView.displayMessage(`At level ${player.level}, the maximum SP that can be allocated to one stat is ${gameData.sp_investment_caps[player.level]}.`);
                mainView.displayMessage(`You have ${gameData.data.player.sp} SP.`);
                mainView.initInputShortcuts(presetMenuOptions.allocateSP);
                mainView.setInputResponse(allocateMode);
            }
        } else {
            mainView.displayMessage(`Invalid input.`);
            mainView.setInputResponse( allocateSPInvoke(stat) );
        }
    }
    return allocateSP;
}

const skillsMenu = () => {
    mainView.removeInputResponse(skillsMenu);
    const input = mainView.getInput().toLowerCase();
    const player = gameData.data.player;

    switch (input) {

        case "e":
        case "equipped": {
            equipSkills.disciplinesMenuLoop();
        }
        break;

        case "l":
        case "learn": {
            learnSkills.disciplinesMenuLoop();
            
        }
        break;

        case "b":
        case "back": {
            mainView.displayMessage(`${separator}Returning...`);
            statMenu.statLoop();
        };
        break;

        default: {
            mainView.displayMessage("<br>Invalid input.");
            mainView.initInputShortcuts(["equipped", "learn", "back"])
            mainView.setInputResponse(skillsMenu);
        }
    }
};

const learnSkills = {
    currentDiscipline: null,

    currentSkill: null,

    disciplinesMenuLoop() {
        mainView.displayMessage(`${separator}Showing all available disciplines. Say the name of a discipline to view the skills it contains if it is unlocked, or to unlock it if it is not unlocked.`)
        const disciplines = gameData.disciplines; // i need to do this here because learnSkills() only reacts to inputs..
        
        
        // making disciplines visisble -- NEED REWORK
        //console.log(`e ${gameData.data.special.doingTutorial}`);
        if (gameData.data.special.doingTutorial != true) {
            Object.keys(disciplines).forEach(discipline => {
                if (disciplines[discipline].requirements.level <= gameData.data.player.level) {
                    disciplines[discipline].visible = true;
                }
            });
        }
        
        

        const disciplinesForDisplay = Object.keys(disciplines); // show unlocked disciplines first bc it looks better
        const sortLocked = (a, b) => {
            if (disciplines[a].unlocked == true && disciplines[b].unlocked == true) {
                if (a > b) { return 1 } else { return -1 };
            } else if (disciplines[a].unlocked == false && disciplines[b].unlocked == false) {
                if (a > b) { return 1 } else { return -1 };
            } else if (disciplines[a].unlocked == true) {
                return -1;
            } else {
                return 1;
            }
        }
        disciplinesForDisplay.sort(sortLocked);
        
        disciplinesForDisplay.forEach(cur => { // and will not display this on time
            const disc = disciplines[cur];
            if (disc.unlocked == true) {
                mainView.displayMessage(` - ${capitalise(disc.name)} -- UNLOCKED`);
            } else if (disc.visible == true) {
                mainView.displayMessage(` - ${capitalise(disc.name)} -- LOCKED (LV ${disc.requirements.level})`);
            }
        })

        // making the array for initinputshortcut

        inputShortcuts.showAllDisciplines(disciplines);
        mainView.setInputResponse(learnSkills.disciplinesMenu);
    },

    disciplineMenuLoop(showskills) {
        const discipline = learnSkills.currentDiscipline;
        const player = gameData.data.player;

        //console.log(discipline);

        if (showskills == true) {
            mainView.displayMessage(`${separator}Showing all skills in the ${discipline.name.toUpperCase()} discipline. Say the name of a skill to view its description and unlock it if you haven't done so already.`);
            var count = 0;
            var max = 0;
            discipline.skills.forEach(skill => {
                if (skill.unlocked == true) {
                    count += 1;
                }
                max += 1;
            });
            mainView.displayMessage(`Skills known in this discipline: ${count}/${max}<br>`);
    
            // now, we need to display all the skills in the discipline and whether or not they are known
            discipline.skills.forEach(skill => {
                const name = skill.name;
                const known = (skill.unlocked == true ? 'X' : ' ');
                mainView.displayMessage(`${skills[name].name} - [${known}] ${known == ' ' ? '(LV' + skill.requirements.level + ', ' + skill.cost.ap + ' AP)' : ''}`); // fireball - [X];
            });
    
        }

        // now process any input made by the player

        
        inputShortcuts.skillsInDiscipline(discipline);
        mainView.setInputResponse(learnSkills.disciplineMenu);
    },

    disciplineMenu() { // this is called when the player is selecting a skill in a discipline
        mainView.removeInputResponse(learnSkills.disciplineMenu);

        const input = mainView.getInput().toLowerCase();
        //console.log("running discipline menu")
        //console.log(`input: ${input}`);
        const player = gameData.data.player;
        const discipline = learnSkills.currentDiscipline;
        const skillInDiscipline = discipline.skills.findIndex(cur => {
            //console.log(cur);
            return skills[cur.name].name == input;
        });

        if (skillInDiscipline != -1) { // if the player's input was a skill in the discipline..
            const desc = skills[discipline.skills[skillInDiscipline].name].description;
            const skill = discipline.skills[skillInDiscipline];
            mainView.displayMessage(`${separator}${capitalise(input)} - ${desc}`);
            if (skill.unlocked == true) { // if the player has the skill..
                mainView.displayMessage(`${separator}This skill is already unlocked.`);

                
                inputShortcuts.skillsInDiscipline(discipline);
                learnSkills.disciplineMenuLoop(false);
            } else { // if the player doesn't have the skill..
                mainView.displayMessage(`${separator}This skill is not learned. In order to unlock it, the following requirements must be met:`)
                const allMet = learnSkills.checkRequirements(skill);
                if (allMet == false) {
                    mainView.displayMessagesDelayed([["<br>You do not meet the requirements to unlock this skill!", 2]], "outside", () => {
                        learnSkills.disciplineMenuLoop(true);
                    })
                } else {
                    var allOwned = learnSkills.checkCost(skill);
                    mainView.displayMessage(`Unlocking this skill requires ${skill.cost.ap} AP.`)
                    if (player.ap < skill.cost.ap) { allOwned = false }; // ensure they have enough ap. checkRequirements() does not do this
                    if (allOwned == false) {
                        mainView.displayMessagesDelayed([["<br>You do not have enough items/gold/ap to unlock this skill!", 2]], "outside", () => {
                            learnSkills.disciplineMenuLoop(true);
                        })

                    } else {
                        mainView.displayMessage("Would you like to learn this skill? Say 'y' or 'yes' to learn it, otherwise enter anything else.");
                        learnSkills.currentSkill = skill;
                        mainView.setInputResponse(learnSkills.unlockSkill);
                    }
                }
            }
        } else if (input == 'back' || input == 'b') {
            learnSkills.disciplinesMenuLoop();
        } else {
            mainView.displayMessage("<br>Invalid input");

            inputShortcuts.skillsInDiscipline(discipline);
            learnSkills.disciplineMenuLoop(false);
        }
    },


    unlockSkill() {
        mainView.removeInputResponse(learnSkills.unlockSkill);
        const input = mainView.getInput().toLowerCase();
        const player = gameData.data.player;
        const skill = learnSkills.currentSkill;

        if (input == 'y' || input == 'yes') { // if they want to learn the skill...

            skill.unlocked = true; // all we have to do is say the skill is unlocked

            skill.cost.items.forEach(cur => {
                    const index = player.inventory.findIndex(item => { // try to find the item in inventory. We know we will because..
                        try { // they have all the required items
                            return item.name == cur[0]; 
                        } catch {
                            //console.log("item not a reagent");
                        }
                    })
                    const reagent = player.inventory[index];
                    reagent[1] -= cur[1];
                    //console.log(`reagent count: ${reagent[1]}`)
                    if (reagent[1] == 0) {
                        delete player.inventory[index];
                    };
        
                });
        
                player.gold -= skill.cost.gold;
                player.ap -= skill.cost.ap;

                mainView.displayMessage("Skill unlocked!");
                mainView.displayMessage("If you would like to use this skill in battle, remember to <u>equip</u> it first.")

                inputShortcuts.unlockedDisciplines();
                learnSkills.disciplineMenuLoop(true);
        } else {
            mainView.displayMessage(`${separator}Returning to discipline menu...`);

            inputShortcuts.unlockedDisciplines();
            learnSkills.disciplineMenuLoop(true);
        }

        updateDisplay(player, "normal");
        
    },


    disciplinesMenu() {
        mainView.removeInputResponse(learnSkills.disciplinesMenu);
        const input = mainView.getInput().toLowerCase();
        const player = gameData.data.player;
        const disciplines = gameData.disciplines;
    
        if (disciplines.hasOwnProperty(input)) {
            if (disciplines[input].unlocked == true) {
                //console.log(input);
                learnSkills.currentDiscipline = disciplines[input];
                //console.log(this.currentDiscipline);

                //inputShortcuts.unlockedDisciplines();
                learnSkills.disciplineMenuLoop(true);
            } else if (disciplines[input].unlocked == false || disciplines[input].visible == true) {
                // this disciplines is unlockable but not unlocked.
                this.currentDiscipline = disciplines[input];
                const discipline = this.currentDiscipline;

                mainView.displayMessage(`<b>${capitalise(discipline.name)}</b> - ${discipline.desc}`)

                mainView.displayMessage(`${separator}This discipline is not unlocked. To unlock it, the following requirements must be met:`);
                
                const player = gameData.data.player;

                const allMet = learnSkills.checkRequirements(discipline);

                // DISCIPLINE UNLOCK
                if (allMet == false ) {
                    mainView.displayMessagesDelayed([["You do not meet the requirements to unlock this discipline!", 2]], "outside", learnSkills.disciplinesMenuLoop);
                } else {
                    const allOwned = learnSkills.checkCost(discipline);
                    if (allOwned == false) {
                        mainView.displayMessagesDelayed([["You do not have enough items/gold to unlock this discipline!", 2]], "outside", learnSkills.disciplinesMenuLoop);
                    } else {
                        mainView.displayMessage("<br>Would you like to unlock this discipline? If so, type 'y' or 'yes'. This action cannot be undone.");
                        mainView.setInputResponse(learnSkills.unlockDiscipline);
                    }
                }
                
            }


        } else if (input == 'back' || input == 'b') {
            mainView.displayMessage(`${separator}Returning...`);
            mainView.displayMessage(`${separator}Entering skills menu. To change skills equipped, say 'e'/'equipped', or say 'l'/'learn' to learn new skills.`);
            
            mainView.initInputShortcuts(["equipped", "learn", "back"])
            mainView.setInputResponse(skillsMenu);
        } else {
            mainView.displayMessage("<br>Invalid input<br>");
            mainView.setInputResponse(learnSkills.disciplinesMenu);
        }
        
        updateDisplay(gameData.data.player, "normal");

    },

    unlockDiscipline() {
        mainView.removeInputResponse(learnSkills.unlockDiscipline);
        const player = gameData.data.player;
        const input = mainView.getInput().toLowerCase();

        if (input == "y" || input == "yes") {
            this.currentDiscipline.unlocked = true;
            this.currentDiscipline.cost.items.forEach(cur => {
                const index = player.inventory.findIndex(item => { // try to find the item in inventory. We know we will because..
                    try { // they have all the required items
                        return item[0] == cur[0]; 
                    } catch {
                        //console.log("item not a reagent");
                    }
                })
                const reagent = player.inventory[index];
                reagent[1] -= cur[1];
                //console.log(`reagent count: ${reagent[1]}`)
                if (reagent[1] == 0) {
                    delete player.inventory[index];
                };
    
            });
    
            player.gold -= this.currentDiscipline.cost.gold;
    
            mainView.displayMessage(`${separator}Discipline unlocked!`);
            this.currentDiscipline = null;
            learnSkills.disciplinesMenuLoop();
        } else {
            mainView.displayMessage(`${separator}Returning to disciplines menu..`)
            learnSkills.disciplinesMenuLoop();
        }

        updateDisplay(gameData.data.player, "normal");

    },

    checkRequirements(object, displayMessages = true) {
        const player = gameData.data.player;

        var allMet = true; // if any conditions are not met, this will be set to false and the player will be..
        // unable to unlock the discipline

        // LEVEL REQUIREMENT
        var met = false;
        if (player.level >= object.requirements.level) { met = true } else { allMet = false}; 
        if (displayMessages) {
            mainView.displayMessage(`Be at level ${object.requirements.level} or higher - [${met == true ? 'X' : ' '}]`);
        };

        // SKILLS REQUIREMENT
        object.requirements.skills.forEach(cur => { // for each skill..
            if (player.library.indexOf(cur) != -1) { // if it is in the player's library
                met = true; // then the player has the skill
            } else { met = false; allMet = false };
            if (displayMessages) {
                mainView.displayMessage(`Unlock skill ${cur} - [${met == true ? 'X' : ' '}]`);
            }
        });

        // FLAG REQUIREMENT
        object.requirements.flags.forEach(cur => { // for each flag..
            if (gameData.flags[cur].complete == true) { // if it is flagged as complete
                met = true; // then the flag has been met
            } else { met = false; allMet = false };
            if (displayMessages) {
                mainView.displayMessage(`${gameData.flags[cur].desc} - [${met == true ? 'X' : ' '}]`);
            }
        });

        return allMet;
    },

    checkCost(object) {
        const player = gameData.data.player;

        var allOwned = true; // we will set this to false if the player misses any of the needed items
        mainView.displayMessage(`<br>You will need to pay: ${object.cost.gold} gold.`);
        if (object.cost.items.length > 0) {
            mainView.displayMessage(`You will also need the following items:`);
            object.cost.items.forEach(cur => { // for each item that is required
                const indexOfReagent = player.inventory.findIndex(item => { // try to find the item in inventory
                    try { // not all items are in the 'reagent' format, and if they aren't, trying to access their..
                        return item[0] == cur[0];  // indexes will throw an error. so this is needed
                    } catch {
                        //console.log("item not a reagent");
                    }
                } )
                var count = 0;
                if (indexOfReagent == -1) {
                    //console.log("item not found")
                    count = 0; // if the item isnt in inventory, then they have none of it
                } else {
                    //console.log("item found")
                    count = player.inventory[indexOfReagent][1]; // otherwise find out how many they have
                }
                //console.log(count);
                mainView.displayMessage(`${cur[1]} ${cur[0]} (${count}/${cur[1]})`); // 50 Slimes (30/50), etc.

                if (cur[1] > count) { // if this is true then the player doesn't have enough of the reagent
                    allOwned = false;
                }
            });
        }
        if (object.cost.gold > player.gold) {
            allOwned = false;
        }
        return allOwned;
    }

}

const equipSkills = {

    currentDiscipline: null,

    currentSkill: null,

    disciplinesMenuLoop() {
        mainView.displayMessage(`${separator}Showing all available disciplines. Say the name of a discipline to` +
        ` view the skills it contains. <b>Or, say 'e' or 'equipped' to view your currently equipped skills.</b>`)
        const disciplines = gameData.disciplines; // i need to do this here because learnSkills() only reacts to inputs..

        
        // making disciplines visisble -- NEED REWORK
        //console.log(`e ${gameData.data.special.doingTutorial}`);
        if (gameData.data.special.doingTutorial != true) {
            Object.keys(disciplines).forEach(discipline => {
                if (disciplines[discipline].requirements.level <= gameData.data.player.level) {
                    disciplines[discipline].visible = true;
                }
            });
        }
        

        Object.keys(disciplines).forEach(cur => { // and will not display this on time
            const disc = disciplines[cur];
            if (disc.unlocked == true) {
                mainView.displayMessage(` - ${capitalise(disc.name)}`);
            }
        })

        // making the array for initinputshortcut
        var array = ["equipped"];
        Object.keys(disciplines).forEach(cur => {
            const disc = disciplines[cur];
            if (disc.unlocked == true) { array.push(disc.name) }
        })
        array.push("back");
        mainView.initInputShortcuts(array);

        mainView.setInputResponse(equipSkills.disciplinesMenu);
    },

    disciplinesMenu() {
        mainView.removeInputResponse(equipSkills.disciplinesMenu);
        const input = mainView.getInput().toLowerCase();
        const player = gameData.data.player;
        const disciplines = gameData.disciplines;
    
        if (disciplines.hasOwnProperty(input)) {
            if (disciplines[input].unlocked == true) {
                //console.log(input);
                equipSkills.currentDiscipline = disciplines[input];
                //console.log(this.currentDiscipline);

                var array = ["equipped"];
                Object.keys(disciplines).forEach(cur => {
                    const disc = disciplines[cur];
                    if (disc.unlocked == true) { array.push(disc.name) }
                })
                array.push("back");
                mainView.initInputShortcuts(array);

                equipSkills.disciplineMenuLoop(true);
            }
        } else if (input == 'back' || input == 'b') {
            mainView.displayMessage(`${separator}Returning...`);
            mainView.displayMessage(`${separator}Entering skills menu. To change skills equipped, say 'e'/'equipped',`
            + ` or say 'l'/'learn' to learn new skills.`);

            mainView.initInputShortcuts(["equipped", "learn", "back"])
            mainView.setInputResponse(skillsMenu);
        } else if (input == 'e' || input == 'equipped') {
            mainView.displayMessagesDelayed([[`${separator}Showing equipped skills. Say the name of an equipped skill to unequip it.`, 0.3, true, {}, "flatsec"]], "outside", () => {
                //console.log("logging skills");
                //console.log(player.stats.skills);
                getSkillsList(player.stats.skills).forEach(cur => {
                   //console.log(`current skills is ${cur}`);
                    const desc = skills[cur].description;
                    mainView.displayMessage(`<br>${skills[cur].name} - ${desc}`);
                });
                equipSkills.initShortcuts();
    
                // respond to player input
                mainView.setInputResponse(equipSkills.unequipSkill);
            })
        } 
        else {
            mainView.displayMessage("<br>Invalid input<br>");
            mainView.setInputResponse(equipSkills.disciplinesMenu);
                // making the array for initinputshortcut
                var array = ["equipped"];
                Object.keys(disciplines).forEach(cur => {
                    const disc = disciplines[cur];
                    if (disc.unlocked == true) { array.push(disc.name) }
                })
                array.push("back");
                mainView.initInputShortcuts(array);
        }
        
        updateDisplay(gameData.data.player, "normal");

    },

    unequipSkill() {
        const input = mainView.getInput().toLowerCase();
        const player = gameData.data.player;
        mainView.removeInputResponse(equipSkills.unequipSkill);

        // create skillslist w/ corresponding index so the names of equipped skills can be seen
        var skillsList = getSkillsList(player.stats.skills);

        if (skillsList.indexOf(input.replace(/\s/g, "_")) != -1) { // input.replace... changes input to skill notation
            if (player.stats.skills.length > 1) {
                if (input != "attack" && input != "guard") {
                    player.stats.skills.splice([skillsList.indexOf(input.replace(/\s/g, "_"))], 1);

                    // ensuring no "empty" spaces in skills
                    //console.log(player.stats.skills);

                    mainView.displayMessage(`${input} unequipped.`);
                } else {
                    mainView.displayMessage("<br>That skill can't be unequipped!");
                }
                equipSkills.initShortcuts();
                mainView.setInputResponse(equipSkills.unequipSkill);
            } else {
                mainView.displayMessage("You can't have 0 skills!");
                equipSkills.initShortcuts();
                mainView.setInputResponse(equipSkills.unequipSkill);
            }
        } else if (input == 'back' || input == 'b') {
            mainView.displayMessage(`${separator}Returning to disciplines menu...`);
            equipSkills.disciplinesMenuLoop();
        } else {
            mainView.displayMessage("<br>Invalid input.");
            equipSkills.initShortcuts();
            mainView.setInputResponse(equipSkills.unequipSkill);
        }
    },

    disciplineMenuLoop(showskills = false) {
        const discipline = equipSkills.currentDiscipline;
        const player = gameData.data.player;

        //console.log(discipline);

        if (showskills == true) {
            mainView.displayMessage(`${separator}Showing all known skills in the ${discipline.name.toUpperCase()} discipline. Say the name of a skill to view its description.`);
    
            // now, we need to display all the skills in the discipline and whether or not they are known
            discipline.skills.forEach(skill => {
                const name = skill.name;
                const known = (skill.unlocked == true ? 'X' : ' ');
                if (known == 'X') {
                    mainView.displayMessage(` - ${skills[name].name}`);
                }
            });
    
        }

        // now process any input made by the player

        // need custom loop in this case
        var skillsArr = [];
        discipline.skills.forEach(skill => {
            if (skill.hasOwnProperty("name") && skill.unlocked == true) {
                skillsArr.push(skills[skill.name].name);
            }
        })
        skillsArr.push("back");
        mainView.initInputShortcuts(skillsArr);


        mainView.setInputResponse(equipSkills.disciplineMenu);
    },

    disciplineMenu() { // this is called when the player is selecting a skill in a discipline
        mainView.removeInputResponse(equipSkills.disciplineMenu);

        const input = mainView.getInput().toLowerCase();
        //console.log(`input: ${input}`);
        const player = gameData.data.player;
        const discipline = equipSkills.currentDiscipline;
        //console.log("logging current discipline");
        //console.log(discipline);

        // iterate over discipline being looked at
        // if is unlocked, append to mock library the name of the skill
        const mockLibrary = discipline.skills.map(skill => {
            if (skill.unlocked == true) {
                return skills[skill.name].name; // gets the version of the name w/o the spaces and stuff
            }
        });

        if (mockLibrary.indexOf(input) != -1) { // if the player has the skill...
            const desc = skills[input.replace(/\s/g, "_")].description;
           //console.log(`INPUT EDITED FOR getSkillByName = ${input.replace(/\s/g, "_")}`)
            const skill = getSkillByName(discipline, input.replace(/\s/g, "_")) // we want the obj ver. of the skill
            equipSkills.currentSkill = skill;
            mainView.displayMessage(`<br>${capitalise(input)} - ${desc}`);
            //console.log(`SKILL BY CODE NAME ${getSkillCodeByName(input.replace(/\s/g, "_"), discipline)}`)
            if (player.stats.skills.indexOf(getSkillCodeByName(input.replace(/\s/g, "_"), discipline)) != -1) { // if the player has the skill equipped..
                mainView.displayMessage("This skill is already equipped.");
                mainView.displayMessage("<br>You are still in the skills menu. Input b/back to return");

                equipSkills.disciplineMenuLoop(false);
            } else {
                mainView.displayMessage(("<br>This skill is not equipped. Say 'e' or 'equip' to equip this skill.") +
                (" You can also say 'f' or 'forget' to unlearn this skill. Input anything else to return."))
                mainView.setInputResponse(equipSkills.skillMenu);
            }
        } else if (input == 'back' || input == 'b') {
            equipSkills.disciplinesMenuLoop();
        } else {
            //console.log("skill not found");
            mainView.displayMessage("<br>Invalid input");

            inputShortcuts.skillsInDiscipline(discipline);
            mainView.setInputResponse(equipSkills.disciplineMenu);
        }
    },

    skillMenu() {
        const input = mainView.getInput().toLowerCase();
        const player = gameData.data.player;
        mainView.removeInputResponse(equipSkills.skillMenu);

        const currentSkill = equipSkills.currentSkill;
        const currentDiscipline = equipSkills.currentDiscipline;

        if (input == 'e' || input == 'equip') {
            if (player.stats.skills.length < 12) {
                if (player.stats.skills.indexOf(currentSkill.code) == -1 ) {
                   //console.log("logging current skill");
                   //console.log(equipSkills.currentSkill);
                    player.stats.skills.push(equipSkills.currentSkill.code); // ez pz
                    mainView.displayMessage(`${separator}Skill equipped.`);
    
                    equipSkills.disciplineMenuLoop(true);
                } else {
                    mainView.displayMessage(`${separator}You already have this skill equipped!`);

                    equipSkills.disciplineMenuLoop(true);
                }
            } else {
                mainView.displayMessage(`${separator}You have too many skills equipped!`);

                equipSkills.disciplineMenuLoop(true);
            }
        } else if (input == 'f' || input == 'forget') {
            mainView.displayMessage(`${separator}Would you like to unlearn this skill? You will get the AP back, but you the reagents and gold will be lost.`)
            mainView.displayMessage(`<br>Input 'y'/'yes' to forget the skill, otherwise input 'b'/'back' to return to the discipline menu.`)

            mainView.initInputShortcuts(["yes", "back"]);

            mainView.setInputResponse(equipSkills.unlearnSkillResponse);
        } else {
            mainView.displayMessage(`${separator}Returning to discipline menu...`);

            equipSkills.disciplineMenuLoop(true);
        }
    },

    unlearnSkillResponse() {
        mainView.removeInputResponse(equipSkills.unlearnSkillResponse);
        
        const input = mainView.getInput().toLowerCase();

        switch (input) {
            
            case "y":
            case "yes": {
                const currentSkill = equipSkills.currentSkill;
                const currentDiscipline = equipSkills.currentDiscipline;
                //console.log("logging current skill");
                //console.log(currentSkill);
                // ensure the skill is not equipped before allowing unlearning
                if (gameData.data.player.stats.skills.indexOf(currentSkill.code) == -1) {
                    if (currentSkill.unlearnable == true) {
                        equipSkills.unlearnSkill();
                    } else {
                        mainView.displayMessage("<br>This skill cannot be unlearned!");
                        equipSkills.disciplineMenuLoop(true);
                    }
                } else {
                    mainView.displayMessage("<br>You cannot unlearn an equipped skill!");
                    equipSkills.disciplineMenuLoop(true);
                }
                break;
            }

            case "b":
            case "back": {
                mainView.displayMessage(`${separator}Returning...`);
                equipSkills.disciplineMenuLoop(true);
                break;
            }

            default: {
                mainView.displayMessage("Invalid input.");
                mainView.setInputResponse(equipSkills.unlearnSkillResponse);
            }
        }
    },

    unlearnSkill() {
        const currentSkill = equipSkills.currentSkill;
        const currentDiscipline = equipSkills.currentDiscipline;

        currentSkill.unlocked = false;
        //const library = gameData.data.player.library;
        //const index = library.indexOf(getSkillCodeByName(currentSkill.name, currentDiscipline));
        //library.splice(index, 1);
        
        gameData.data.player.ap += currentSkill.cost.ap;

        mainView.displayMessage(`${separator}Skill unlearned! Gained ${currentSkill.cost.ap} AP.`);

        updateDisplay(gameData.data.player, "normal");

        mainView.displayMessage(`${separator}Returning...`);

        equipSkills.disciplineMenuLoop(true);
    },

    getSkills() { // returns an array of all the skills a player has but by name
        var skillsA = gameData.data.player.stats.skills.map(skillCode => {
            if (skillCode != "guard" && skillCode != "attack") {
                var skillCodeParsed = skillCode.split('-') // splits into an array of the discipline and index
                var discipline = skillCodeParsed[0];
                var index = skillCodeParsed[1];
                return gameData.disciplines[discipline].skills[index].name;
            } else {
                return skillCode;
            }
        });

        return skillsA;
    },

    initShortcuts() {
        const array = equipSkills.getSkills();
        array.push("back");

        mainView.initInputShortcuts(array);
    }

}

const inputShortcuts = {
    unlockedDisciplines: () => {
        // get the disciplines object
        const disciplines = gameData.disciplines;

        // making the array for input shortcut
        var array = ["equipped"];
        Object.keys(disciplines).forEach(cur => {
            const disc = disciplines[cur];
            if (disc.unlocked == true) { array.push(disc.name) }
        })
            array.push("back");
            mainView.initInputShortcuts(array);
    },

    skillsInDiscipline: discipline => {

        var skillsArr = [];
        discipline.skills.forEach(skill => {
            if (skill.hasOwnProperty("name")) {
                skillsArr.push(skills[skill.name].name);
            }
        })
        skillsArr.push("back");
        //console.log(skillsArr);
        mainView.initInputShortcuts(skillsArr);
    },

    showAllDisciplines: disciplines => {
        var array = [];
        Object.keys(disciplines).forEach(cur => {
            const disc = disciplines[cur];
            if (disc.visible == true) { array.push(disc.name) }
        })
        array.push("back");
        mainView.initInputShortcuts(array);
    }
}

const getSkillByName = (discipline, name) => {
    // pass in disciplines obj and name

    // iterate over disciplines until the skill with the desired name is found. Return that skill object

    var skillFound = -1;

    discipline.skills.forEach(skill => {

        //console.log("logging skill followed by name");
        //console.log(skill);
        //console.log(name);

        //console.log(skill.name == name);

        if (skill.name == name) {
            //console.log("found skill by name");
            skillFound = skill;
        }
    });


    //console.log("logging skillfound");
    //console.log(skillFound);
    return skillFound;

    //return -1; // return -1 if the skill is not found
};

const getSkillCodeByName = (name, discipline) => {
    const disciplineSkills = discipline.skills;
    for (var i = 0; i < disciplineSkills.length; i++) {
        if (disciplineSkills[i].name == name) {
            return disciplineSkills[i].code;
        }
    }
    return -1;
}
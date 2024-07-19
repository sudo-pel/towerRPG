import * as mainView from './views/mainView';
import * as gameData from './models/data';
import * as statView from './views/statView';
import * as miscView from './views/miscView';
import { enemies } from './models/enemies';
import { Combat, checkLevel } from './models/combat';
import * as base from './views/baseView';
import { presetMenuOptions, tutorialMessages, resizeText } from './views/baseView';
import { statMenu, initStats } from './models/learnSkills';
import { floorToZone } from './models/rooms';
import { floorToShop, initShop } from './models/shops';
import { initCrafting } from './models/crafting';
import { initSettings, loadDisciplines, loadFlags, loadSettings, loadPlayer,
        overwritePropertiesPlayer, overwriteDisciplines, saveGame } from './models/settings';
import { updateDisplay, clean, updateDisplayMode, tutorialMessage, capitalise, tutorialCharacter,
        copy, tutorialDiscipline, displayWaitForInput } from './models/baseModel';
import { unlockRecipes } from './models/crafting';
import { items, addItem, cleanInventory } from './models/items';
import { initEquip, zoneSetUp } from './models/initMenu';
import { musicHandler } from './models/music';
import { prepareHelpModule } from './models/helpModule'; // so that the stuff works

const defaultModels = { // I am really unhappy with this solution so I might change it later
    data: undefined,
    disciplines: undefined,
    flags: undefined,
    settings: undefined
}

const gameSanitation = (afterSanitation) => {
    const player = gameData.data;
    //console.log("logging default models");
    //console.log(defaultModels);
    //console.log(player);
    //console.log(gameData.data.version);

    if (player.version < 0.17) {
        localStorage.clear();
        location.reload();
    };
    
    if (player.version < 0.18) {
        const playerMaps = player.player.maps;
        const newMaps = copy(defaultModels.data.player.maps);
        Object.keys(playerMaps).forEach(map => {
            const plrmap = playerMaps[map];
            const newmap = newMaps[map];
            for (var i=0; i<plrmap.length; i++) {
                for (var j=0; j<plrmap.length; j++) {
                    newmap[i][j] = plrmap[i][j];
                }
            }
            //console.log("map changed");
            //console.log(plrmap);
            //console.log(newmap);
        });
        player.player.maps = newMaps;
    }

    if (player.version < defaultModels.data.version) {
        mainView.displayMessage(`<br><b>The game has updated since you last played. Please check the discord server for the update logs.</b> (Input 'sc-discord' for an invite link)`);
        mainView.displayMessage(`<br>You last played on V<b>${player.version}</b>`);
        player.version = defaultModels.data.version;
        saveGame();
    };

    if (player.special.doingTutorial == true) {
        gameData.settings.autoSave = false;

        // ENDING THE TUTORIAL
        if (player.special.clearedTutorial == true) {
            player.special.doingTutorial = false;
            const temp = copy(gameData.data.special);
            loadPlayer(defaultModels.data, "object");
            loadDisciplines(defaultModels.disciplines, "object");
            loadFlags(defaultModels.flags, "object");
            //loadSettings(defaultModels.settings, "object");
            gameData.data.special = temp;
            gameData.data.presents.push(["gold", 300]);
            if (gameData.data.special.clearedTutorialTrue == true) {
                gameData.data.presents.push(["item", "lores_legacy", 1]);
            };
            gameData.data.player.name = temp.dataCache.name;
            mainLoop();
        } else {
            afterSanitation();
        }
    } else {
        afterSanitation();
    }


}

export const mainLoop = () => { // this has to be exported so that combat can use it when the player loses
    musicHandler.playMusic("lobby");
    Combat.heal(gameData.data.player.stats);
    updateDisplayMode.mode = "normal";
    mainView.displayMessage(`${base.separator}You are currently on floor ${gameData.data.current_floor}`);

    var plr = {...gameData.data.player};
    plr.stats = Combat.getPlayerAdd(plr.stats);
    statView.updateStats(plr);
    miscView.updatePlayerStats(gameData.data.player);

    // resetting player's position cache
    const exploreCache = gameData.data.player.exploreCache;
    exploreCache.zone = undefined;
    exploreCache.coordinates = [];

    // unloading presents box
    const presents = gameData.data.presents;
    //console.log(presents);
    if (presents.length > 0) {
        mainView.displayMessage("<br>You have some presents!");
        //console.log(presents.length);
        //console.log(presents.length > 0);
        while (presents.length > 0) {
            const currentPresent = presents[0];
            //console.log("logging current present");
            //console.log(currentPresent);
            
            switch (currentPresent[0]) {
                case "gold": {
                    mainView.displayMessage(`<br>Received ${currentPresent[1]} gold!`);
                    gameData.data.player.gold += currentPresent[1];
                    break;
                };
                case "item": {
                    addItem(currentPresent[1], currentPresent[2], currentPresent[2]);
                    break;
                };
                default: {
                    //console.log("Present invalid");
                }

            };
            presents.splice(0, 1);
        }
    };

    plr = {...gameData.data.player};
    plr.stats = Combat.getPlayerAdd(plr.stats);
    statView.updateStats(plr);
    miscView.updatePlayerStats(gameData.data.player); // replace with updateDisplay?


    initMainLoopShortcuts();
    mainView.setInputResponse(towerCommands);
}

const beginGame = () => {

    defaultModels.data = copy(gameData.data);
    defaultModels.disciplines = copy(gameData.disciplines);
    defaultModels.flags = copy(gameData.flags);
    defaultModels.settings = copy(gameData.settings);

    mainView.initInputHandler();

    mainView.displayMessage(" ---- TOWER RPG -----");
    if (localStorage.getItem('save1Player') == undefined) {
        gameData.settings.autoSave = false;
        setName();
    } else {
        loadPlayer('save1');
        loadSettings('save1');
        loadFlags('save1');
        loadDisciplines('save1');

        function afterSanitation() {
            const settings = JSON.parse(localStorage.getItem('save1Settings'));
            //console.log(settings);
            resizeText("main", settings.mainTextSize);
            resizeText("stat", settings.statsTextSize);
            resizeText("misc", settings.miscTextSize);
    
            cleanInventory(); // replace with a proper sanitation function
            
            // if the player was last exploring, teleport them; otherwise, put them in mainloop
            const exploreCache = gameData.data.player.exploreCache;
            //console.log(exploreCache);
            if (gameData.data.player.exploreCache.zone != undefined) {
                zoneSetUp(exploreCache.zone, [exploreCache.coordinates[0], exploreCache.coordinates[1]], { noAmbush: true })
            } else {
                mainLoop();
            }
        }

        gameSanitation(afterSanitation);
    }
}

const setName = () => {
    mainView.displayMessage("<br>Welcome to Tower RPG. Please input a name.");
    mainView.setInputResponse(setNameResponse);
}

const setNameResponse = () => {
    mainView.removeInputResponse(setName);
    if ( mainView.getInput(false).replace(/\s/gi, "") == "")  {
        mainView.displayMessage("<br><b>Please input a name!</b>");
        //mainView.getInput(true); // just to clear
        mainView.setInputResponse(setNameResponse);
    } else {
        const name = mainView.getInput();
        //console.log(`NAME IS ${name}`)
        gameData.data.player.name = name;
        mainView.displayMessage(`${name}? That's a nice name!`);
        introPartOne();
    }
}

function introPartOne() {
    mainView.displayWaitForInput(tutorialMessages.gameIntroPartOne, () => {
        setInputShortcut();
    });
};

const introPartTwo = () => {

    tutorialMessages.gameIntroPartTwo.forEach(text => {
        mainView.displayMessage(text);
    })
    mainView.setInputResponse(introPartTwoResponse);
    mainView.initInputShortcuts(['yes', 'no']);
    
};

function introPartTwoResponse() {
    mainView.removeInputResponse(introPartTwoResponse);

    const input = mainView.getInput().toLowerCase();
    switch (input) {
        
        case "yes":
            mainView.displayWaitForInput(["<br>Great! As a side note, this tutorial has a good bit of story text.", 
            "<br>If you aren't interested, you can input 'skip' to skip dialogue. This will skip a few lines or until you reach an"+
            " important unskippable line (these are ususally in bold).",
            "<br>Once the demo starts, use <b>input shortcut</b> to see your options. I hope you enjoy Tower RPG!"], () => {


                const data = gameData.data;

                data.special.dataCache.name = data.player.name;

                data.player.name = "Lore";
                data.max_floor = 0;
                data.current_floor = 0;
                data.player.maps = {
                    floor0: [...Array(46)].map(e => Array(41).fill(undefined))
                };
                data.player.gold = 0;
                data.player.stats.equips = {
                    weapon: undefined,
                    head: undefined,
                    body: "silver_armour",
                    legs: "silver_legwear",
                    misc1: "tear_of_lucia",
                    misc2: undefined
                };
                data.unlocked = {
                    explore: true,
                    shop: false,
                    inventory: false,
                    stats: false,
                    crafting: false,
                    settings: false,
                    ascend: false
                };

                /*
                for (var variableKey in gameData.disciplines) {
                    if (gameData.disciplines.hasOwnProperty(variableKey)){
                        delete gameData.disciplines[variableKey];
                    };
                };
                */

                const disciplines = gameData.disciplines;
                Object.keys(disciplines).forEach(disc => {
                    //console.log(disc);
                    disciplines[disc].visible = false;
                    disciplines[disc].unlocked = false;
                });
                disciplines.adventurer.skills.forEach(skill => {
                    if (skill.name == 'boost' || skill.name == 'check') {
                        skill.unlocked = false;
                    }
                    
                });

                const plrSkills = data.player.stats.skills;
                plrSkills.splice(plrSkills.indexOf('adventurer-0'), 1);
                plrSkills.splice(plrSkills.indexOf('adventurer-1'), 1);

                //console.log(gameData.disciplines);

                gameData.disciplines.lore.visible = true;
                gameData.disciplines.lore.unlocked = true;

                gameData.data.special.doingTutorial = true;
                gameData.data.special.canToggleAutosave = false;

            
                saveGame();
                mainLoop();
            })
            break;

        case "no":
            mainView.displayMessage("<br>Understood. Proceeding to main game...");
            saveGame();
            mainLoop();
            break;

        default:
            mainView.displayMessage("<br>Invalid input.");
            mainView.setInputResponse(introPartTwoResponse);
            break;
    }
}

const towerCommands = () => {

    musicHandler.playMusic("lobby");

    mainView.removeInputResponse(towerCommands);
    const input = mainView.getInput().toLowerCase();

    const unlocked = gameData.data.unlocked;

    if ((input.toLowerCase() == 'ascend') && unlocked.ascend) {
        /*
        const enemy = enemies[gameData.floors[gameData.data.current_floor].boss];
        //console.log(enemy.name);
        Combat.battleProcessing(gameData.data.player, enemy, next_floor);
        */
        if (gameData.data.current_floor == 0) {
            // ending the tutorial if they are on F1
            mainView.displayMessage("<br>This will end the tutorial. You will not be able to return to the tutorial once you leave. Are you sure you would like to exit?");
            mainView.displayMessage("<br>If so, then input 'END TUTORIAL' in all caps. Otherwise, input anything else to return.");
            const endTutorialResponse = () => {
                mainView.removeInputResponse(endTutorialResponse);
                const input = mainView.getInput();
                if (input == "END TUTORIAL") {
                    endTutorial();
                } else {
                    mainView.displayMessage("<br>Returning...");
                    mainLoop();
                }
            };
            mainView.setInputResponse(endTutorialResponse);
        } else {
            mainView.displayMessage("<br><b>Floor boss currently unavailable.</b>");
            mainLoop();
        }


    } else if ((input == 'inventory' || input == 'i') && unlocked.inventory) {
        initEquip(mainLoop);

    } else if ((input == 'stats' || input == 'st') && unlocked.stats) {
        initStats(mainLoop);

    } else if ((input == 'explore' || input == 'e') && unlocked.explore) {
        const zone = floorToZone[gameData.data.current_floor];
        zoneSetUp(zone);

    } else if ((input == 'shop' || input == 'sh') && unlocked.shop) {
        const shop = floorToShop[gameData.data.current_floor];
        initShop(shop, mainLoop);

    } else if ((input == "crafting" || input == "c") && unlocked.crafting) {
        initCrafting(mainLoop);

    } else if ((input == "settings" || input == "set")) {
        initSettings(mainLoop);

    } else if (input == "gold") {
        initMainLoopShortcuts();
        mainView.setInputResponse(towerCommands)
        addItem('f0_end_teleportation_stone', 1, 1);
        addItem('health_potion', 5, 5);
        gameData.data.unlocked.inventory = true;
        gameData.data.unlocked.stats = true;
        updateDisplay(gameData.data.player);

    } else if (input == "lv") {
        addItem('health_potion', 100, 100);
        addItem('mana_potion', 100, 100);
        gameData.flags.f0_fought_young_wolf.complete = true;
        initMainLoopShortcuts();
        mainView.setInputResponse(towerCommands)

    } else if (input == "battle") {
        Combat.battleProcessing(gameData.data.player, enemies.ora, mainLoop)
    }

    else { 
        mainView.displayMessage("<br>Invalid input");
        initMainLoopShortcuts();
        mainView.setInputResponse(towerCommands)
    }
}

function initMainLoopShortcuts() {
    const shortcuts = [];
    const unlocked = gameData.data.unlocked;

    const unlockables = ['explore', 'shop', 'inventory', 'stats', 'crafting', 'ascend'];
    unlockables.forEach(cur => {
        if (unlocked[cur] == true) {
            shortcuts.push(cur);
        }
    });
    shortcuts.push("settings");
    mainView.initInputShortcuts(shortcuts);
}

// UNLOCKING SUBSEQUENT FLOORS //
const next_floor = () => {
    const data = gameData.data;
    if (data.current_floor == data.max_floor) {
        mainView.displayMessage(`<h2><b><span style="color:green">FLOOR ${data.current_floor} COMPLETED!!</span></b></h2>`);
        data.max_floor += 1;
        if (data.current_floor > gameData.floors.max) {
            mainView.displayMessage("You have now completed the highest possible floor. You will be able to access the" +
            " next floor once it is released!");
        }
    }
    mainLoop();
}
// ----------------------------

function setInputShortcut() {
    mainView.displayMessage(`${base.separator}<b>Now you will set your input shortcut key.</b>`);
    mainView.displayMessage(`<br>Input Shortcut is a <b>VERY IMPORTANT</b> mechanic that will make menu navigation and` +
    ` combat much easier. By pressing the designated key, you can bring up a list of your options in a particular menu,` +
    ` and also select an option by inputting a number rather than a line of text. Input shortcut won't work in some menus` +
    `, however.`);
    mainView.displayMessage(`<br>Once you enter the main menu, use Input Shortcut to see your options.`);
    mainView.displayMessage(`<br>You can check your input shortcut key at any time by inputting <b>sc-inputshortcut</b>.`)
    mainView.displayMessage(`<br>Please input (on your keyboard) one of the following to set input shortcut to that key:`);
    setTimeout(() => {
        Object.keys(base.keysToCode).forEach(key => {
            mainView.displayMessage(` - ${key}`)
        });
        //mainView.setInputResponse(setInputShortcutResponse);
        window.addEventListener('keyup', setInputShortcutResponse)
    }, 250);
}

function setInputShortcutResponse(event) {
    //console.log(event);
    window.removeEventListener('keyup', setInputShortcutResponse)

    const foo = mainView.getInput(); // just so that the other code w/ getInput runs

    const correctInputs = ["ShiftRight", "ShiftLeft", "ControlLeft", "ControlRight", "Backquote", "AltLeft", "AltRight"];
    const corresponding = ["Rshift", "Lshift", "Rctrl", "Lctrl", "¬", "Altleft", "Altright"];

    if (correctInputs.includes(event.code)) {
        mainView.displayMessage(`${base.separator}Input shortcut toggle changed to <b>${event.code}</b>. (You can change this in settings later if you need to)`);
        mainView.displayMessage(`<br>If you think you will use input shortcut a lot, it is recommend you enable "sticky input shortcut" in settings.`); 
        gameData.settings.toggleShortcut = corresponding[correctInputs.indexOf(event.code)];

        introPartTwo();
    } else {
        mainView.displayMessage("<br>Invalid input");

        window.addEventListener('keyup', setInputShortcutResponse)
    }
};

export function endTutorial() {
    mainView.displayWaitForInput(tutorialMessages.tutorial_end, () => {
        gameData.data.special.clearedTutorial = true;
        saveGame();
        location.reload();
    }, false)
}

prepareHelpModule();
beginGame();


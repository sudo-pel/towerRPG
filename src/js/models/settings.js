// imports
import * as mainView from '../views/mainView';
import { separator, presetMessageDelays, keysToCode, tutorialMessages, presetMenuOptions, musicCredits } from '../views/baseView';
import { capitalise, isObject, updateDisplay } from './baseModel';
import { settings, disciplines, data, flags, level_cap } from './data';
import { mainLoop } from '..';

// init. function
export const initSettings = returnFunction => {
    settingsHandler.returnFunction = returnFunction;

    // -- SETTINGS -- \\

    settingsHandler.mainLoop();
}

// object
const settingsHandler = {
    returnFunction: undefined,

    // main loop
    mainLoop: () => {
        mainView.displayMessage(`${separator}Currently in settings. You can do the following things:`);
        mainView.displayMessage(`<br> - Change the message delay for battle and outside of battle (input 'md')`);
        mainView.displayMessage(`<br> - Change the input shortcut key ('ci')`);
        mainView.displayMessage(`<br> - Toggle Sticky input shortcut. ('tsi', currently ${settings.stickyInputShortcut.on == true ? 'enabled' : 'disabled'})`);
        mainView.displayMessage(`<br> - Test your current message delay settings ('tc')`);
        mainView.displayMessage(`<br> - Toggle between "wait for input" and "auto" text scrolling ('tsc', currently ${settings.scrollStyle == 'input' ? 'wait for input' : 'auto'})`);
        mainView.displayMessage(`<br> - Save or reset your data ('save')`);
        mainView.displayMessage(`<br> - Toggle auto save ('tas', currently auto save is ${settings.autoSave == true ? 'enabled' : 'disabled'})`);
        mainView.displayMessage(`<br> - Change the scroll limit ('sl')`);
        mainView.displayMessage(`<br> - See the music credits ('smc')`);
        mainView.displayMessage(`<br>Input <b>'b'/'back'</b> to return.`)

        mainView.initInputShortcuts(presetMenuOptions.settingsMain);
        mainView.setInputResponse(settingsHandler.mainLoopResponse);
    },

    mainLoopResponse: () => {
        mainView.removeInputResponse(settingsHandler.mainLoopResponse);

        const input = mainView.getInput().toLowerCase();

        switch (input) {

            case "message delay":
            case "md": {
                settingsHandler.messageDelayLoop();
                break;
            }

            case "change shortcut":
            case "ci": {
                settingsHandler.changeShortcutLoop();
                break;
            }

            case "toggle sticky shortcuts":
            case "tsi": {
                if (settings.stickyInputShortcut.on == true) {
                    settings.stickyInputShortcut.on = false;
                } else { settings.stickyInputShortcut.on = true };
                mainView.displayMessage(`<br><b>Sticky input shortcut ${settings.stickyInputShortcut.on == true ? 'enabled' : 'disabled'}.`);
                settings.stickyInputShortcut.active = false;
                settingsHandler.mainLoop();
                break;
            }

            case "test message":
            case "tc": {
                settingsHandler.testMessageLoop();
                break;
            }

            case "sa":
            case "save": {
                settingsHandler.saveLoop();
                break;
            }

            case "tsc":
            case "toggle scroll": {
                if (settings.scrollStyle == "auto") {
                    settings.scrollStyle = "input";
                } else { settings.scrollStyle = "auto" };
                mainView.displayMessage(`<br><b>Scrolling style changed to ${settings.scrollStyle}.`);
                settingsHandler.mainLoop();
                break;
            }

            case "tas":
            case "toggle auto save": {
                if (data.special.canToggleAutosave == true) {
                    if (settings.autoSave == false) {
                        settings.autoSave = true;
                    } else { settings.autoSave = false };
                    mainView.displayMessage(`<br><b>Autosave ${settings.autoSave == true ? 'enabled' : 'disabled'}`);
                }
                else {
                    mainView.displayMessage(`<b>You can't do this right now.</b>`);
                }
                settingsHandler.mainLoop();
                break;
            }
            
            case "smc":
            case "see music credits": {
                mainView.displayMessage("<br><b>Displaying music credits...</b>");
                musicCredits.forEach(credit => {
                    mainView.displayMessage(credit);
                });
                settingsHandler.mainLoop();
                break;
            }

            case "sl":
            case "scroll limit": {
                settingsHandler.scrollLimitLoop();
                break;
            }

            case "b":
            case "back": {
                mainView.displayMessage(`${separator}Returning...`);
                settingsHandler.returnFunction();
                break;
            }

            default: {
                mainView.displayMessage(`${separator}Invalid input.`);
                mainView.initInputShortcuts(presetMenuOptions.settingsMain);
                mainView.setInputResponse(settingsHandler.mainLoopResponse);
            }
        }
    },

    scrollLimitLoop: () => {
        mainView.displayMessage(`${separator}Currently in the scroll limit menu. Type any integer between 50 and 500 to change` +
        ` the scroll limit to that number. Scroll limit refers to the number of lines that can be stored in the main box` +
        ` before the oldest ones are deleted. <b>Scroll limit is currently ${settings.scrollLimit}</b>`);
        mainView.setInputResponse(settingsHandler.scrollLimitResponse);
    },

    scrollLimitResponse: () => {
        mainView.removeInputResponse(settingsHandler.scrollLimitResponse);

        const input = mainView.getInput().toLowerCase();
        var shouldReturn = false;

        if (parseInt(input).toString() != 'NaN') {
            if (parseInt(input) >= 50 && parseInt(input) <= 500) {
                settings.scrollLimit = parseInt(input);
                mainView.displayMessage(`Scroll limit changed to ${parseInt(input)}`);
                mainView.displayMessage(`You are still in the scroll limit menu. Input 'b'/'back' to return.`)
            } else {
                mainView.displayMessage(`<br>Input out of range.`);
            }
        }
        
        else if (input == 'b' || input == 'back') {
            mainView.displayMessage('<br>Returning...');
            shouldReturn = true;
        }

        else {
            mainView.displayMessage('<br>Invalid input.');
        }

        if (shouldReturn) {
            settingsHandler.mainLoop();
        } else {
            mainView.setInputResponse(settingsHandler.scrollLimitResponse);
        }

    },

    saveLoop: () => {
        mainView.displayMessage(`${separator}Entering the save menu. Data saved can be loaded if you refresh the page. Saving will overwrite previously saved data. Type 's'/'save' to save, and` +
        ` 'r'/'reset' to reset your data.`);

        mainView.initInputShortcuts(["save", "reset", "back"]);
        mainView.setInputResponse(settingsHandler.saveLoopResponse);
    },

    saveLoopResponse: () => {
        mainView.removeInputResponse(settingsHandler.saveLoopResponse);

        const input = mainView.getInput().toLowerCase();

        switch (input) {

            case "s":
            case "save": {
                mainView.displayMessage(`${separator}Saved data. Returning...`)
                savePlayer('save1', data);
                saveSettings('save1', settings);
                saveFlags('save1', flags);
                saveDisciplines('save1', disciplines);
                settingsHandler.mainLoop();
                break;
            }

            case "r":
            case "reset": {
                mainView.displayMessage(`${separator}Data reset. Refresh the page to restart.`);
                localStorage.clear();


                settingsHandler.mainLoop();
                break;
            }

            case "b":
            case "back": {
                mainView.displayMessage(`${separator}Returning...`);
                settingsHandler.mainLoop();
                break;
            }

            default: {
                mainView.displayMessage(`<br>Invalid input.`);
                mainView.setInputResponse(settingsHandler.saveLoopResponse);
            }

            case true: {
                updateDisplay(data.player);
            }


        }
    },

    testMessageLoop: () => {
        mainView.displayMessage(`${separator}Four messages of different length will play in order to show you approximately
        the speed of the text in the settings you have selected. Please choose whether you would like to test your battle
        display speed or your display speed outside of battle.`);
        mainView.displayMessage(`<br>Please type 'ba'/'battle' to see text speed in battle and 'ou'/'outside' to see text` +
        ` speed outside of battle.`);
        mainView.displayMessage(`<br>Your battle message delay is currently ${settings.battleMessageDelay} seconds.`);
        mainView.displayMessage(`<br>Your general message delay is currently ${settings.messageDelay} seconds.`);

        mainView.initInputShortcuts(["battle", "outside", "back"]);
        mainView.setInputResponse(settingsHandler.testMessage);
    },

    testMessage: () => {
        mainView.removeInputResponse(settingsHandler.testMessage);

        const input = mainView.getInput().toLowerCase();

        var wantToSee = false;
        var typeToSee = "outside";

        switch (input) {
            
            case "ba":
            case "battle": {
                wantToSee = true;
                typeToSee = "battle";
                break;
            }

            case "ou":
            case "outside": {
                wantToSee = true;
                typeToSee = "outside"; // technically don't have to do this but doing so for readability
                break;
            }

            case "b":
            case "back": {
                wantToSee = false;
                mainView.displayMessage(`${separator}Returning...`);
                settingsHandler.mainLoop();
                break;
            }

            default: {
                mainView.displayMessage(`<br>Invalid input.`);
                mainView.setInputResponse(settingsHandler.testMessage);
            }

        }

        if (wantToSee) {
            const array = [["This is a short message. Hi!", 0],
                            ["This message is a little bit longer... Hello there. Lovely weather today.", 0],
                            ["This message is pretty long. Longer than the previous, and the one before it. Lorem ipsum dolor sit amet, consectetur", 0],
                            ["This is the longest message in this test. I hope you enjoy reading this one. Um. Have you seen Vinland Saga? It's a pretty good anime. I'd watch it if I were you. Or don't, I don't really care.", 0]]

            mainView.displayMessagesDelayed(array, typeToSee, settingsHandler.postTestMessage);
        
        }
    },

    postTestMessage: () => {
        mainView.displayMessage(`${separator}Message testing has concluded. Returning...`);
        settingsHandler.mainLoop();
    },

    changeShortcutLoop: () => {
        mainView.displayMessage(`${separator}Currently changing the input shortcut toggle key. Because most of the keyboard is` + 
        ` required for gameplay, there are a limited number of keys that can be used. Input a key (on your keyboard) to change` + 
        ` input shortcut to that key:`);
        mainView.displayMessage(`<br>Your current key is ${keysToCode[settings.toggleShortcut]}`);
        mainView.displayMessage(""); // line break

        setTimeout(() => {
            Object.keys(keysToCode).forEach(key => {
                mainView.displayMessage(` - ${key}`)
            });
            //mainView.setInputResponse(setInputShortcutResponse);
            window.addEventListener('keyup', settingsHandler.changeShortcutResponse)
        }, 250);
    },

    changeShortcutResponse: () => {
        window.removeEventListener('keyup', settingsHandler.changeShortcutResponse)

        const foo = mainView.getInput(); // just so that the other code w/ getInput runs
    
        const correctInputs = ["ShiftRight", "ShiftLeft", "ControlLeft", "ControlRight", "Backquote", "AltLeft", "AltRight"];
        const corresponding = ["Rshift", "Lshift", "Rctrl", "Lctrl", "¬", "Altleft", "Altright"];
    
        if (correctInputs.includes(event.code)) {
            mainView.displayMessage(`${separator}Input shortcut toggle changed to <b>${event.code}</b>.`);
            settings.toggleShortcut = corresponding[correctInputs.indexOf(event.code)];
    
            settingsHandler.mainLoop();
        } else {
            mainView.displayMessage("<br>Invalid input");
    
            window.addEventListener('keyup', settingsHandler.changeShortcutResponse)
        }
    },

    messageDelayLoop: () => {
        mainView.displayMessage(`${separator}There are two types of message delay you can change. Would you like to change` + 
        ` the message delay in battle or outside of battle?`);
        mainView.displayMessage(`<br>Type 'ba'/'battle' to change the message delay in battle and 'ou'/'outside'` + 
        ` to change the message delay outside of battle.`);

        mainView.displayMessage(`<br>Your battle message delay is currently ${settings.battleMessageDelay} seconds.`);
        mainView.displayMessage(`<br>Your general message delay is currently ${settings.messageDelay} seconds.`);

        mainView.initInputShortcuts(["battle", "outside", "back"])
        mainView.setInputResponse(settingsHandler.messageDelayResponse);
    },

    messageDelayResponse: () => {
        mainView.removeInputResponse(settingsHandler.messageDelayResponse);

        const input = mainView.getInput().toLowerCase();

        switch (input) {
            
            case "ba":
            case "battle": {
                settingsHandler.battleMessageDelayLoop();
                break;
            }

            case "ou":
            case "outside": {
                settingsHandler.outsideMessageDelayLoop();
                break;
            }

            case "b":
            case "back": {
                mainView.displayMessage(`${separator}Returning...`);
                settingsHandler.mainLoop();
                break;
            }

            default: {
                mainView.displayMessage(`<br>Invalid input.`);
                mainView.initInputShortcuts(["battle", "outside", "back"])
                mainView.setInputResponse(settingsHandler.messageDelayResponse);
            }
            
        }
    },

    battleMessageDelayLoop: () => {

        const preset = presetMessageDelays.battle;
    
        mainView.displayMessage(`${separator}Currently changing battle message delay loop. You can type any number from 0-3, including` +
        ` 0 (to make it instant) to change the battle message delay to that value. However, we would recomment you use one of` +
        ` the premade settings: 's'/'slow' (${preset.slow}s), 'm'/'medium' (${preset.medium}s) or 'f'/'fast' (${preset.fast}s).`);

        mainView.setInputResponse(settingsHandler.battleMessageDelayResponse);
    },

    battleMessageDelayResponse: () => {
        mainView.removeInputResponse(settingsHandler.battleMessageDelayResponse);

        const input = mainView.getInput().toLowerCase();
        
        const presets = presetMessageDelays.battle;

        switch (true) {

            case (input == 's' || input == 'slow'): {
                const number = presets.slow;
                settings.battleMessageDelay = number;
                mainView.displayMessage(`${separator}Changed battle message delay to ${number} seconds.`);
                mainView.displayMessage(`You are still in the menu for changing battle message delay. Input 'b'/'back' to return.`);
                mainView.setInputResponse(settingsHandler.battleMessageDelayResponse);
                break;
            }

            case (input == 'm' || input == 'medium'): {
                const number = presets.medium;
                settings.battleMessageDelay = number;
                mainView.displayMessage(`${separator}Changed battle message delay to ${number} seconds.`);
                mainView.displayMessage(`You are still in the menu for changing battle message delay. Input 'b'/'back' to return.`);
                mainView.setInputResponse(settingsHandler.battleMessageDelayResponse);
                break;
            }

            case (input == 'f' || input == 'fast'): {
                const number = presets.fast;
                settings.battleMessageDelay = number;
                mainView.displayMessage(`${separator}Changed battle message delay to ${number} seconds.`);
                mainView.displayMessage(`You are still in the menu for changing battle message delay. Input 'b'/'back' to return.`);
                mainView.setInputResponse(settingsHandler.battleMessageDelayResponse);
                break;
            }

            case (parseFloat(input).toString() != 'NaN'): {
                const number = parseFloat(input);
                if (number <= 3 && number >= 0) {
                    settings.battleMessageDelay = number.toFixed(2);
                    mainView.displayMessage(`${separator}Changed battle message delay to ${number.toFixed(2)} seconds.`);
                } else {
                    mainView.displayMessage(`<br>That number is out of range!`);
                };
                mainView.displayMessage(`You are still in the menu for changing battle message delay. Input 'b'/'back' to return.`);
                mainView.setInputResponse(settingsHandler.battleMessageDelayResponse);
                break;
            }

            case (input == 'b' || input == 'back'): {
                mainView.displayMessage(`${separator}Returning...`);
                settingsHandler.messageDelayLoop();
                break;
            }

            default: {
                mainView.displayMessage(`<br>Invalid input.`);
                mainView.setInputResponse(settingsHandler.battleMessageDelayResponse);
                break;
            }
        }
    },

    outsideMessageDelayLoop: () => {

        const preset = presetMessageDelays.outside;
    
        mainView.displayMessage(`${separator}Currently changing outside message delay. You can type any number from 0-3, including` +
        ` 0 (to make it instant) to change the battle message delay to that value. However, we would recomment you use one of` +
        ` the premade settings: 's'/'slow' (${preset.slow}s}), 'm'/'medium' (${preset.medium}s) or 'f'/'fast' (${preset.fast}s).`);

        mainView.setInputResponse(settingsHandler.outsideMessageDelayResponse);
    },

    outsideMessageDelayResponse: () => {
        mainView.removeInputResponse(settingsHandler.outsideMessageDelayResponse);

        const input = mainView.getInput().toLowerCase();
        
        const presets = presetMessageDelays.outside;

        switch (true) {

            case (input == 's' || input == 'slow'): {
                const number = presets.slow;
                settings.messageDelay = number;
                mainView.displayMessage(`${separator}Changed message delay to ${number} seconds.`);
                mainView.displayMessage(`You are still in the menu for changing general message delay. Input 'b'/'back' to return.`);
                mainView.setInputResponse(settingsHandler.outsideMessageDelayResponse);
                break;
            }

            case (input == 'm' || input == 'medium'): {
                const number = presets.medium;
                settings.messageDelay = number;
                mainView.displayMessage(`${separator}Changed message delay to ${number} seconds.`);
                mainView.displayMessage(`You are still in the menu for changing general message delay. Input 'b'/'back' to return.`);
                mainView.setInputResponse(settingsHandler.outsideMessageDelayResponse);
                break;
            }

            case (input == 'f' || input == 'fast'): {
                const number = presets.fast;
                settings.messageDelay = number;
                mainView.displayMessage(`${separator}Changed message delay to ${number} seconds.`);
                mainView.displayMessage(`You are still in the menu for changing general message delay. Input 'b'/'back' to return.`);
                mainView.setInputResponse(settingsHandler.outsideMessageDelayResponse);
                break;
            }

            case (parseFloat(input).toString() != 'NaN'): {
                const number = parseFloat(input);
                if (number <= 3 && number >= 0) {
                    settings.messageDelay = number.toFixed(2);
                    mainView.displayMessage(`${separator}Changed message delay to ${number.toFixed(2)} seconds.`);
                } else {
                    mainView.displayMessage(`<br>That number is out of range!`);
                };
                mainView.displayMessage(`You are still in the menu for changing general message delay. Input 'b'/'back' to return.`);
                mainView.setInputResponse(settingsHandler.outsideMessageDelayResponse);
                break;
            }

            case (input == 'b' || input == 'back'): {
                mainView.displayMessage(`${separator}Returning...`);
                settingsHandler.messageDelayLoop();
                break;
            }

            default: {
                mainView.displayMessage(`<br>Invalid input.`);
                mainView.setInputResponse(settingsHandler.outsideMessageDelayResponse);
                break;
            }
        }
    }
}

// -- SAVE DATA -- \\

// saves the data object in data
const savePlayer = (key, player) => {
    localStorage.setItem(key + 'Player', JSON.stringify(player));
}

// save the settings object in data
const saveSettings = (key, settings) => {
    localStorage.setItem(key + 'Settings', JSON.stringify(settings));
}

// save the disciplines object in data
const saveDisciplines = (key, disciplines) => {
    localStorage.setItem(key + 'Disciplines', JSON.stringify(disciplines));
}

// save the flags object in data
const saveFlags = (key, flags) => {
    localStorage.setItem(key + 'Flags', JSON.stringify(flags))
}



// -- LOAD DATA -- \\

// load the data object in data
export const loadPlayer = (key, type = "localStorage") => {
    const currentModel = data; // getting the current model of player data to compare to saved model
    var savedModel
    if (type == "localStorage") {
        savedModel = JSON.parse(localStorage.getItem(key + 'Player')); // getting the saved model
    }
    else {
        savedModel = key;
    }

    //console.log("logging savedmodel followed by currentmodel");
    //console.log(savedModel);
    //console.log(currentModel);

    // we need to iterate over every property in currentModel and see if there is a savedModel equivalent
    // if there is, we need to change the value in currentModel
    // for this i will use a recursive function (see below)
    //console.log(savedModel)
    //console.log(savedModel);
    overwritePropertiesPlayer(currentModel, savedModel);
    //updateDisplay(data.player); // INVENTORY DOES NOT LOAD
}


// load the settings object in data
export const loadSettings = (key, type = "localStorage") => {
    const currentModel = settings;
    var savedModel
    if (type == "localStorage") {
        savedModel = JSON.parse(localStorage.getItem(key + 'Settings'));
    }
    else {
        savedModel = key;
    }


    overwriteProperties(currentModel, savedModel);
    //updateDisplay(data.player);
};

// load the disciplines object in data
export const loadDisciplines = (key, type = "localStorage") => {
    const currentModel = disciplines;
    var savedModel
    if (type == "localStorage") {
        savedModel = JSON.parse(localStorage.getItem(key + 'Disciplines'));
    }
    else {
        savedModel = key;
    }

    overwriteDisciplines(currentModel, savedModel);
    //updateDisplay(data.player);
};

// load the flags object in data
export const loadFlags = (key, type = "localStorage") => {
    const currentModel = flags;
    var savedModel;
    if (type == "localStorage") {
        savedModel = JSON.parse(localStorage.getItem(key + 'Flags'));
    }
    else {
        savedModel = key;
    }
    
    overwriteProperties(currentModel, savedModel);
    //updateDisplay(data.player);
}



// -- NEEDED SUBROUTINE -- \\
export const overwritePropertiesPlayer = (currentModel, savedModel, stuffToIgnore = []) => {
    Object.keys(currentModel).forEach(key => {
        if (savedModel[key] != undefined || ["weapon", "head", "body", "legs", "misc1", "misc2"].includes(key) == true) { // we want to overwrite equips too but they will be...
            // ...undefined in the saved model
            //console.log(`comparing following current and saved`);
            //console.log(currentModel[key]);
            //console.log(savedModel[key]);
            // if both things have key and its a nonobject, switch
            if (!isObject(currentModel[key]) || Array.isArray(currentModel[key])) {
                //console.log('overwriting property')
                
                //console.log(`${key}`)
                //console.log(`${stuffToIgnore.includes(key)}`)
                if (stuffToIgnore.includes(key) == false) {
                    currentModel[key] = savedModel[key];
                    //console.log(key);
                };
            } else {
                // if both things have key and its an object, run overwriteProperties on that uhh. yeah
                //console.log('rerunning recursive');
                var futureStuff;
                if (key == "stats") {
                    futureStuff = ["atk", "def", "health", "max_sp", "max_mana", "max_stamina",
                     "mdef", "matk", "speed", "crit_chance", "crit_damage", "effectiveness",
                    "resistance", "evasion",];
                }
                if (key != "dataCache") {
                    overwritePropertiesPlayer(currentModel[key], savedModel[key], futureStuff);
                } else {
                    currentModel[key] = savedModel[key]; // upload the cache object to the current model but don't modify its properties
                }

                
            }

        }

        
    })
}

const overwriteProperties = (currentModel, savedModel, stuffToIgnore = []) => {
    Object.keys(currentModel).forEach(key => {
        
        if (savedModel[key] != undefined) {
            //console.log(`comparing following current and saved`);
            //console.log(currentModel[key]);
            //console.log(savedModel[key]);
            // if both things have key and its a nonobject, switch
            if (!isObject(currentModel[key]) || Array.isArray(currentModel[key])) {
                //console.log('overwriting property')
                
                //console.log(`${key}`)
                //console.log(`${stuffToIgnore.includes(key)}`)
                if (stuffToIgnore.includes(key) == false) {
                    currentModel[key] = savedModel[key];
                    //console.log(key);
                };
            } else {
                // if both things have key and its an object, run overwriteProperties on that uhh. yeah
                //console.log('rerunning recursive');
                overwriteProperties(currentModel[key], savedModel[key])
                
            }

        }

        
    })
}

// we only want to overwrite certain values for disciplines so im using a different subroutine
export const overwriteDisciplines = (currentModel, savedModel) => {
    //console.log("running overwriteDisciplines")
    Object.keys(currentModel).forEach(key => {
        //console.log(`key is ${key}`)
        
        if (savedModel[key] != undefined) {
            //console.log("key is not undefined")
            //console.log(`comparing following current and saved`);
            //console.log(currentModel[key]);
            //console.log(savedModel[key]);
            // if the property is unlocked, visible or complete change 
            if (key == "unlocked" || key == "visible" || key == "complete") {
                //console.log(`overwriting property ${key} -- ${savedModel[key]}`)
                currentModel[key] = savedModel[key];
            } else if (isObject(currentModel[key])) {
                // otherwise if its another object run over it
                //console.log('rerunning recursive');
                overwriteDisciplines(currentModel[key], savedModel[key])
                
            }

        }

        
    });
    //console.log(currentModel);
}

// autosave game every 30 seconds

const saveLoop = () => {
    setInterval(() => {
        if (settings.autoSave) {

            savePlayer('save1', data);
            saveSettings('save1', settings);
            saveFlags('save1', flags);
            saveDisciplines('save1', disciplines);
            mainView.displayMessage(`<span style="color: gold">Data saved</span>`, false);

        }
    
    }, 30000);
}

export const saveGame = () => {
    savePlayer('save1', data);
    saveSettings('save1', settings);
    saveFlags('save1', flags);
    saveDisciplines('save1', disciplines);
    mainView.displayMessage(`<span style="color: gold">Data saved</span>`, false);
}

saveLoop();
import { elements, keysToCode, inputSeparator, presetMessageDelays } from './baseView';
import { settings } from '../models/data';
import { updateDisplayMode, updateDisplay, copy } from '../models/baseModel';
import { musicHandler } from '../models/music';
import * as gameData from '../models/data';
import { addHelp, centerHelp } from '../models/helpModule';
import { getCurrentZone } from '../models/rooms';
import { equipMenu } from '../models/equipMode';
import { getShopDetails } from '../models/shops';
import { statMenu } from '../models/learnSkills';
import { getCraftingDetails, resetCrafting } from '../models/crafting';


export const initInputHandler = () => {
    elements.form.addEventListener('submit', inputHandler.response);
};

export const displayMessage = (msg, forceScroll = true, additionalArgs = {}) => {
    const forQueue = [msg, 0, forceScroll];
    if (additionalArgs.unshift == true) {
        messageQueue.queue.unshift(forQueue)
    } else {
        messageQueue.queue.push(forQueue)
    }
    messageQueue.runQueue();
};

function instantMessage(msg) { // displays a message without the use of messagequeue
    elements.main.insertAdjacentHTML('beforeend', `${msg}<br>`);
    scrollMain();
}

export const displayWaitForInput = (message, finishFunction, formattedForDMDelayed = false) => {
    for (var i = 0; i < message.length; i++) {
        const msg = message[i];
        //console.log("logging msg");
        //console.log(msg);
        var additionalArgs;
        if (msg[3] == undefined) {
            additionalArgs = {};
        } else { additionalArgs = msg[3] };
        if (!formattedForDMDelayed) {
            messageQueue.queue.push([msg + ' <b>⇨</b>', "input", true, additionalArgs]);
        } else {
            messageQueue.queue.push([msg[0] + ' <b>⇨</b>', "input", true, additionalArgs]);
        }
    };
    messageQueue.queue.push(["finishFunction", finishFunction]);
    messageQueue.runQueue();

    /*
    var i = 0;
    const recursive = () => {
       //console.log(message[i]);
        var msg = message[i];
        if (formattedForDMDelayed) { msg = message[i][0] };
        mainView.displayMessage(msg + " <i>(Press enter to continue...)</i>");
        i++;
        if (message[i] != undefined) {
            mainView.setInputResponse(recursive);
        } else {
            mainView.setInputResponse(finishFunction);
        };
    };
    recursive();
    */
}

export const displayMessagesDelayed = (msgArr, msgType, finishFunction) => {
    var i = 0;
    // MSG LAYOUT
    // [text, delay, scrollMain, additionalArgs, flatsec/flat/calc]
    const baseWait = (msgType == "battle" ? settings.battleMessageDelay : settings.messageDelay);
    msgArr.forEach(msg => {
        if (msg[4] == "flatsec") {
            // just leave msg as it is
        }
        else if (msg[4] == "flat") {
            msg[1] = msg[1] * baseWait;
        }
        else {
            const words = msg[0].split(' ').length;
            //console.log(words);
            const time = (words / 4);
            msg[1] = time * baseWait;
        }
        if (msg[4] != undefined) { msg.splice(4, 1) } // don't want that element in queue
        if (msg[3] == undefined) { msg[3] = {} } // setting add. args
        if (msg[2] == undefined) { msg[2] = true }; // setting scrollMain
        messageQueue.queue.push(msg);
    });
    messageQueue.queue.push(["finishFunction", finishFunction]);
    messageQueue.runQueue();
    //console.log(`BASE WAIT IS ${baseWait}`)
    /*
    const loop = () => {
        if (i < msgArr.length) {
            displayMessage(msgArr[i][0]);
            scrollMain();
            i++;
            if (i < msgArr.length) {
                setTimeout(loop, baseWait * 1000 * msgArr[i-1][1]); // we increase i by 1 so not doing i-1 would get the delay..
                // ..of the next thing
            } else { setTimeout(finishFunction, baseWait * 1000 * msgArr[i-1][1]) } // DOESNT WORK W/ LEN 1 ARRAYS
        } else {
            finishFunction.call();
        }
    };
    loop();
    */
}

const messageQueue = {
    queue: [],
    playing: false,
    runQueue() {
        if (!this.playing) {
            this.playing = true;
            // create a loop that:
            const queueLoop = () => {

                if (this.playing) {
                    //console.log(copy(this.queue));

                    const currentMsg = copy(this.queue[0]);
                    //console.log(`currentmsg`);
                    //console.log(currentMsg);
                    if (currentMsg[0] == "finishFunction") {
                        currentMsg[1].call();
                        this.queue.shift();
                        if (this.queue.length > 0) {
                            queueLoop();
                        } else {
                            this.playing = false;
                        }
                    } else if (currentMsg != undefined) {
                        // -- HANDLING THE MESSAGE -- \\
                        elements.main.insertAdjacentHTML('beforeend', `${currentMsg[0]}<br>`); // displays the first message of the queue
                        if (currentMsg[2] == true) { scrollMain() }; // if force scroll is enabled for the message
        
                        //
                        this.queue.shift(); // removes the first message of the queue
                        //console.log(this.queue.length);
                        if (this.queue.length > 0) {
    
                            if (currentMsg[1] == 0) {
                                queueLoop(); // if not, run the loop again after waiting the allotted time
                            }
                            else if (currentMsg[1] == "input") {
                                const invokeLoop = () => {
                                    removeInputResponse(invokeLoop, false);
                                    queueLoop();
                                };
                                setInputResponse(invokeLoop);
                                this.playing = true;
                            }
                            else {
                                setTimeout( queueLoop , currentMsg[1] * 1000);
                            }
                        } else {
                            this.playing = false; // if the queue is empty, stops it
                        }
                    } else {
                        this.playing = false;
                    }
                }

            };
            queueLoop();
        }
    }

};

export const getInput = (clear = true) => {
    const temp = elements.input.value; // getting what they put into the box
   //console.log(`TEMP IS ${temp}`)
    const tempShortcuts = inputShortcut.inputShortcuts
    if (clear) {
        elements.input.value = "";
    }

   //console.log(`input is ${temp}`);

    if (inputShortcut.on) {
        //console.log(`input shortcut is on`);
        if (parseInt(temp).toString() != "Nan") { // if they inputted a number
            if (inputShortcut.inputShortcuts[parseInt(temp)] != undefined) { // if the number corresponds to something in shortcuts 
                inputShortcut.inputShortcuts = {}; // need to reset regardless
                inputShortcut.on = false;
                return tempShortcuts[parseInt(temp)];
            }
        }

    }

    //console.log(`temp is`);

    inputShortcut.inputShortcuts = {};
    inputShortcut.special = {};
    inputShortcut.on = false;

    return temp; // if any of that is false, just return temp
};

export const setInputResponse = callback => {
    inputHandler.callback = callback;
    
    //elements.form.addEventListener('submit', in);
}

export const removeInputResponse = (callback = "nothing", displaySeparator = true) => { // 'callback' arg. no longer needed
    inputHandler.callback = undefined;
    if (displaySeparator) {
        displayMessage(inputSeparator); // if removeinputresponse is called it means that the input is changing, sowe can add this..
        // there are very few cases where we need to do otherwise
    }
};

const inputHandler = {
    callback: undefined,
    response: () => {
        const input = elements.input.value; // can't use getInput() as that would clear the form
        if (!/[~`!#$%\^&*+=\\[\]\\;,/{}|\\":<>\?]/g.test(input)) {
            const scCheck = input.toLowerCase().split('-');
            if (scCheck[0] == "sc") {
                var validCommand = false;
                if (scCheck.length == 3) {
                    if (scCheck[2].slice(-2) == "px" && isNaN(scCheck[2].slice(0, -2)) == false) {
                        const styleToChange = "fontSize";
                        const newStyle = scCheck[2];
                        if (scCheck[1] == "main") {
                            elements.main.style[styleToChange] = newStyle;
                            settings.mainTextSize = scCheck[2];
                            scrollMain();
                            validCommand = true;
                        }  
                        else if (scCheck[1] == "stat") {
                            elements.mainStats.style[styleToChange] = newStyle
                            elements.elementalStats.style[styleToChange] = newStyle;
                            settings.statsTextSize = scCheck[2];
                            scrollMain();
                            validCommand = true;
                        }
                        else if (scCheck[1] == "misc") {
                            elements.miscView.style[styleToChange] = newStyle;
                            settings.miscTextSize = scCheck[2];
                            scrollMain();
                            validCommand = true;
                        }
                    } else if (isNaN(scCheck[2]) == false && parseFloat(scCheck[2]) <= 1 && parseFloat(scCheck[2]) >= 0) {
                        if (scCheck[1] == "volume") {
                            musicHandler.changeVolume(scCheck[2], "volume");
                            musicHandler.changeVolume(scCheck[2], "volumeFX");
                            instantMessage(`<br><span style="color:#33cccc">Volume changed</span>`);
                            validCommand = true;
                        }
                        else if (scCheck[1] == "music") {
                            musicHandler.changeVolume(scCheck[2], "volume");
                            instantMessage(`<br><span style="color:#33cccc">Music volume changed</span>`);
                            validCommand = true;
                        }
                        else if (scCheck[1] == "fx") {
                            musicHandler.changeVolume(scCheck[2], "volumeFX");
                            instantMessage(`<br><span style="color:#33cccc">FX volume changed</span>`);
                            validCommand = true;
                        }
                    }
                    elements.input.value = "";
                } else if (scCheck.length == 2) {
                    if (scCheck[1] == "reset") {
                        elements.main.style.fontSize = "17px";
                        elements.mainStats.style.fontSize = "17px";
                        elements.elementalStats.style.fontSize = "17px";
                        elements.playerStats.style.fontSize = "17px";
                        elements.inventory.style.fontSize = "17px";
                        scrollMain();
                        validCommand = true;
                    }
                    else if (scCheck[1] == "inputshortcut") {
                        instantMessage(`<br><span style="color:#33cccc">Input shortcut is currently set to
                         <b>${settings.toggleShortcut}</b>. Don't like this key? You can change the key input shortcut
                         is assigned to in settings.</span>`);
                         validCommand = true;
                    }
                    else if (scCheck[1] == "help") {
                        addHelp();
                        instantMessage(`<br><span style="color:#33cccc">Showing help module. Is it offscreen?
                         If so, input 'sc-helpreset' to reset its position.</span>`);
                        validCommand = true;
                    }
                    else if (scCheck[1] == "helpreset") {
                        centerHelp();
                        validCommand = true;
                    }
                    else if (scCheck[1] == "minimap") {
                        if (getCurrentZone() != undefined) {
                            if (updateDisplayMode.mode == "minimap") {
                                updateDisplayMode.mode = "normal";
                            } else {
                                updateDisplayMode.mode = "minimap";
                            };
                        } else {
                            instantMessage(`<br><span style="color:#33cccc">You aren't currently exploring!</span>`)
                        }
                        validCommand = true;
                        updateDisplay(gameData.data.player);
                    }
                    else if (scCheck[1] == "clear") {
                        elements.main.textContent = "";
                        validCommand = true;
                    }
                    else if (scCheck[1] == "discord") {
                        instantMessage(`<br><span style="color:#33cccc">Discord invite link: https://discord.com/invite/w73Z44z</span>`);
                        validCommand = true;
                    }
                    else if (scCheck[1] == "return") {
                        console.log(getCraftingDetails.returnFunction);
                        console.log(equipMenu.returnFunction);
                        console.log(getShopDetails.returnFunction);
                        console.log(statMenu.returnFunction);
                        if (getCraftingDetails().returnFunction != undefined) {
                            instantMessage(`<br><span style="color:#33cccc">Returning...</span>`);
                            getCraftingDetails().returnFunction();
                            resetCrafting();
                        }
                        else if (equipMenu.returnFunction != undefined) {
                            instantMessage(`<br><span style="color:#33cccc">Returning...</span>`);
                            equipMenu.returnFunction();
                            equipMenu.reset();
                        }
                        else if (getShopDetails().returnFunction != undefined) {
                            instantMessage(`<br><span style="color:#33cccc">Returning...</span>`);
                            getShopDetails().returnFunction();
                            shopHandler.reset();
                        }
                        else if (statMenu.returnFunction != undefined) {
                            instantMessage(`<br><span style="color:#33cccc">Returning...</span>`);
                            statMenu.returnFunction();
                            statMenu.reset();
                        }
                        else {
                            instantMessage(`<br><span style="color:#33cccc">This super command can't be used right now.</span>`);
                        }
                        validCommand = true;
                    }
                    elements.input.value = "";
                }
                if (!validCommand) {
                    instantMessage(`<br><span style="color:#33cccc">Did you try and input a super command? Input 'sc-help' for assistance.</span>`)
                    elements.input.value = "";
                }
            }

            else if (input == "help") {
                addHelp();
                instantMessage(`<br><span style="color:#33cccc">Showing help module. Is it offscreen?
                 If so, input 'sc-helpreset' to reset its position.</span>`);
                elements.input.value = "";
            }

            else if (input == "skip") {
                if (messageQueue.playing) {
                    elements.input.value = "";

                    messageQueue.playing = false;

                    // RESEARCH WHY THIS WORKS
                    var id = window.setTimeout(function() {}, 0);

                    while (id--) {
                        window.clearTimeout(id); // will do nothing if no timeout with id is present
                    }

                    //console.log(messageQueue.queue);
                    for ( var i = messageQueue.queue.length - 1; i != -1; i-- ) {

                        //console.log("logging messagequeue");
                        //console.log(messageQueue.queue[i][0]);
                        //console.log(copy(messageQueue.queue));
                        if (messageQueue.queue[i][0] != "finishFunction") {
                            //console.log(messageQueue[i])
                            if (!messageQueue.queue[i][3].hasOwnProperty("unskippable")) {
                            //console.log("removed");
                            messageQueue.queue.splice(i, 1);
                           }
                        }
                    }
                    displayMessage('<span style="color:#2DFF34"><br>Skipped.</span>', true, { unshift: true });
                    //messageQueue.runQueue();
                }
            }
    
            else if (inputHandler.callback != undefined) {
                inputHandler.callback();
            }
        } else {
            displayMessage("<br>Please don't include any special characters in your inputs!");
            elements.input.value = "";
        }
    }
};

const scrollMain = () => {
    elements.mainBox.scrollTop = elements.mainBox.scrollHeight;

    // ensuring the main box is cleared if it's getting too big
    const text = elements.main.innerHTML;
    var textArray = text.split('<br>');
    if (textArray.length > settings.scrollLimit) {
        //console.log(textArray);
        textArray = textArray.filter(el => {
            const returnValue = el.includes("form");
            return !returnValue;
        });
        //console.log("fitlererd");
        //console.log(textArray);
        textArray.splice(1, textArray.length - settings.scrollLimit);
        elements.main.innerHTML = textArray.join('<br>');

    }

}

// creating toggle input shortcut
window.addEventListener("keyup", function(keyPressed) {
    if (this.event.code == keysToCode[settings.toggleShortcut]) {
        inputShortcut.toggleInputShortcut();
    }
})

const inputShortcut = {
    
    on: false,
    
    inputShortcuts: { // this will be changed dynamically when we are using inputShortcut
    },

    special: { // this will be changed dynamically when we are using input shortcut
        combat: false
    },

    toggleInputShortcut: (coercion = "none") => {
        if (settings.stickyInputShortcut.on == false) { elements.input.value = "" };
        if (inputShortcut.on && coercion != "on") {
            inputShortcut.on = false
            settings.stickyInputShortcut.active = false;
            displayMessage("<br>Input shortcut turned off.");
        } else {
            if (Object.keys(inputShortcut.inputShortcuts).length > 0) {
                inputShortcut.on = true;
                settings.stickyInputShortcut.active = true;
                displayMessage("<br>Input shortcut turned on.")
                //console.log(inputShortcut);
                if (inputShortcut.special.combat == true) { // special display for combat
                    const actions = {...inputShortcut.inputShortcuts};
                    const skills = {...inputShortcut.inputShortcuts};
                    for (var item in actions) {
                        if (!['skills', 'status', 'enemy', 'pouch', 'flee'].includes(actions[item])) { delete actions[item] };
                    };
                    for (var item in skills) {
                        if (['skills', 'status', 'enemy', 'pouch', 'flee'].includes(skills[item])) { delete skills[item] };
                    };

                    displayMessage(`<b>Skills`);
                    Object.keys(skills).forEach(index => {
                        displayMessage(`${index} - ${inputShortcut.inputShortcuts[index]}`)
                    })
                    displayMessage(`<b>Special Actions`);
                    Object.keys(actions).forEach(index => {
                        displayMessage(`${index} - ${inputShortcut.inputShortcuts[index]}`)
                    })
                } else {
                    Object.keys(inputShortcut.inputShortcuts).forEach(index => {
                        displayMessage(`${index} - ${inputShortcut.inputShortcuts[index]}`)
                    })
                }

            } else {
                displayMessage("<br>Input shortcut cannot be used here.");
            }

        }
    }

    

}

export const initInputShortcuts = (array, additionalArgs = {}) => {
    const temp = {};
    array.forEach((item, index) => {
        temp[index + 1] = item;
    })
    //console.log(`created input shortcuts`);
    //console.log(temp);

    inputShortcut.inputShortcuts = temp;
    inputShortcut.special = additionalArgs;

    if (settings.stickyInputShortcut.on && settings.stickyInputShortcut.active) {
        inputShortcut.toggleInputShortcut("on");
    }

    return temp;
}
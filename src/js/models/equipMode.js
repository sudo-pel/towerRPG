import * as mainView from '../views/mainView';
import * as gameData from './data';
import * as statView from '../views/statView';
import * as miscView from '../views/miscView';
import { mainLoop } from '../index';
import { items, displayDetails, isReagent, removeItem, getItemIdentfierByName, addItem, getQuantity } from './items';
import { separator, tutorialMessages, elements } from '../views/baseView';
import { updateDisplay, tutorialMessage } from './baseModel';
import { Combat } from './combat';
import { getCurrentZone, teleport } from './rooms';

export const equipMenu = {

    currentItem: null, // saved as whatever the string is in the inventory; the identifier corresponding to the item in items
    currentIndex: -1, // the index of the currently selected item, used mainly for making the selected item bold in display
    returnFunction: null, // self-explanatory

    reset() {
        this.currentItem = null,
        this.currentIndex = -1,
        this.returnFunction = null
    },

    menuLoop() {
        equipMenu.currentIndex = -1;
        updateDisplay(gameData.data.player, "normal");

        mainView.displayMessage(`${separator}Entering inventory. Say the name of an item to view its details and equip it.` +
        ` Say the name of a slot to unequip the item in that slot. Say 'p'/'pouch' to enter the pouch menu, which will allow` +
        ' you to remove items from your pouch (to add items, first navigate to the item in your inventory)');
        mainView.displayMessage("<br>Input <b>'b'/'back'</b> to return.")
        mainView.setInputResponse(equipMenu.inventoryMenu);
    },

    inventoryMenu() {
        mainView.removeInputResponse(equipMenu.inventoryMenu);
        const player = gameData.data.player;
        const input = mainView.getInput().toLowerCase(); // set to lower case here so don't have to keep doing for this function
        const item_index = player.inventory.length > 0 ? player.inventory.findIndex(cur => {
            //console.log(cur);
            if (cur[1].length == 1) {
                return items[cur].name.toLowerCase() == input.toLowerCase();
            } else { return items[cur[0]].name.toLowerCase() == input.toLowerCase() };
        }) : -1; // try to find index of item in inventory with input as the name of the item.

        if (player.stats.equips.hasOwnProperty(input)) { // if they enter the name of an item slot..
            if (player.stats.equips[input] != undefined) { // and if there is something equipped in that slot..
                // call unequip item on the item slot
                equipMenu.unequipItem(input);
            }
            mainView.setInputResponse(equipMenu.inventoryMenu); // resetting the mainview so the player can continue inputting stuff

        } 
        
        else if (item_index != -1) { // else if the input matches the name of an item in inventory..
            // display the name and details of the item, and give the player options as to what to do with it
            const item = player.inventory[item_index];
            const itemDetails = items[item]; // get the item from the item directory
            // preparing to display all the item properties

            equipMenu.currentItem = item;
            equipMenu.itemLoop();

        } 
        
        else if (input == "back" || input == "b") {
            mainView.displayMessage("<br>Returning...");
            equipMenu.currentIndex = -1 // we need to reset this, it is MANDATORY
            equipMenu.returnFunction();
            equipMenu.reset();
        } 
        
        else if (input == "p" || input == "pouch") {
            mainView.displayMessage("Entering the pouch menu...");
            equipMenu.pouchMenuLoop();
        }

        else {
            mainView.displayMessage("<br>Invalid input");
            mainView.setInputResponse(equipMenu.inventoryMenu);
        }

        //updateDisplay(gameData.data.player, "normal");
            
    },

    pouchMenuLoop() {
        const player = gameData.data.player;

        if (player.stats.pouch.length == 0) {
            mainView.displayMessage("Your pouch is empty!");
            equipMenu.menuLoop();
        } else {
            mainView.displayMessage("Currently in the pouch menu. Options:");
            mainView.displayMessage("<br> - Type the name of an item to remove it from the pouch.");
            mainView.displayMessage(" - b/back (to return)");
            mainView.displayMessage("<br>Items currently in pouch:<br>");
            player.stats.pouch.forEach(item => {
                mainView.displayMessage(`${item[1]} ${items[item[0]].name}`);
            });
            mainView.setInputResponse(equipMenu.pouchMenuResponse);
        }
        
    },

    pouchMenuResponse() {
        mainView.removeInputResponse(equipMenu.pouchMenuResponse);
        const input = mainView.getInput().toLowerCase();
        const player = gameData.data.player;

        if (player.stats.pouch.findIndex(item => getItemIdentfierByName(input) == item[0]) != -1) {
            // if they inputted an item in the pouch, remove it
            const itemIndex = player.stats.pouch.findIndex(item => getItemIdentfierByName(input) == item[0]);
            const itemIdentifier = player.stats.pouch[itemIndex][0];
            const itemAmount = player.stats.pouch[itemIndex][1]
            const itemName = items[itemIdentifier].name;
            mainView.displayMessage(`Removed ${itemAmount} ${itemName}`);
            addItem(itemIdentifier, itemAmount, itemAmount);
            player.stats.pouch.splice(itemIndex, 1);
            equipMenu.pouchMenuLoop();
        }

        else if (input == "b" || input == "back") {
            // return
            mainView.displayMessage("Returning..");
            equipMenu.menuLoop();
        }

        else {
            mainView.displayMessage("Invalid input");
            mainView.setInputResponse(equipMenu.pouchMenuResponse);
        }
    }, 

    itemLoop() {

        const player = gameData.data.player;

        const item = equipMenu.currentItem;
        const itemDetails = (isReagent(item) ? items[item[0]] : items[item]);


        equipMenu.currentIndex = player.inventory.findIndex(item => {
            if (isReagent(item)) {
                return item[0] == equipMenu.currentItem[0];
            } else {
                return item == equipMenu.currentItem;
        }});


        const itemIterable = JSON.parse(JSON.stringify(itemDetails)); // creating a copy of the object so we don't mess w/ the one in inventory
        var elementIterable = null;
        if (itemIterable.hasOwnProperty("elemental")) {
            elementIterable = JSON.parse(JSON.stringify(itemIterable.elemental)); // need to copy since its an object
            delete itemIterable.elemental; // we want to iterate over element separately since its more complex
        } else {
        }
        mainView.displayMessage(`<br>${itemDetails.name} selected.`);
        displayDetails(itemDetails);


        // this means the item can be equipped
        mainView.displayMessage("<br>say 'e'/'equip' to equip this item, and 'u'/'use to consume it.  Otherwise, enter 'b' to return. The item" +
        "'s position in your inventory is marked in <b>bold</b>. Input 'z' to scroll up or 'x' to scroll down.");
        mainView.displayMessage("<br>Options:");
        mainView.displayMessage("<br> - e/equip (to equip it)");
        mainView.displayMessage("<br> - u/use (to consume it)");
        mainView.displayMessage("<br> - p/pouch (to add the item to your pouch - or remove it if it already added)");
        mainView.displayMessage("<br> - z to scroll up in inventory");
        mainView.displayMessage("<br> - x to scroll down in inventory");
        mainView.displayMessage("<br> - b/back to return");

        
        equipMenu.currentItem = item;

        updateDisplay(gameData.data.player, "normal");


        mainView.setInputResponse(equipMenu.itemMenu);
    },

    itemMenu() {
        mainView.removeInputResponse(equipMenu.itemMenu);
        const player = gameData.data.player;
        const input = mainView.getInput().toLowerCase();
        const item = equipMenu.currentItem;
        const itemDetails = (isReagent(item) ? items[item[0]] : items[item]);

        if (input == 'e' || input == 'equip') {
            if (itemDetails.type == "reagent") {
                mainView.displayMessage("<br>You cannot equip reagents.");
                mainView.setInputResponse(equipMenu.itemMenu);
            } else {
                const item_index = player.inventory.findIndex(cur => {
                    return cur == item.toLowerCase()
                }) // we know the object exists because it was previously seleced
                
                if (itemDetails.type != "misc") {
                    if (player.stats.equips[itemDetails.type] == undefined) { // if there is nothing in that slot..
                        equipMenu.equipItem(item_index);
                    } else {
                        // if there is something in that slot, we need to unequip it first
                        equipMenu.unequipItem(itemDetails.type);
                        equipMenu.equipItem(item_index);
                    }
                } else {
                    // need to handle misc differently since there are two misc slots
                    if (player.stats.equips.misc1 != undefined && player.stats.equips.misc2 != undefined) {
                        // we only need to do something if both slots are full, otherwise the equipItem funtion will handle it..
                        // in this case just unequip whatever is in the first misc slot
                        equipMenu.unequipItem("misc1")
                    }
                    equipMenu.equipItem(item_index);
                };

                equipMenu.menuLoop();
            }

        }
        
        else if (input == "u" || input == "use") {
            if (itemDetails.hasOwnProperty("use") != true) {
                mainView.displayMessage("This item cannot be used.");
                mainView.setInputResponse(equipMenu.itemMenu);
            } else {

                // check use case
                if (itemDetails.use.case != "all" && itemDetails.use.case != "outside") {
                    mainView.displayMessage("This item cannot be used here!");
                    mainView.setInputResponse(equipMenu.itemMenu);
                } else {
                    const itemEffect = itemDetails.use.effect;
                    var actuallyUse = true;
                    itemEffect.forEach(effect => {
                        switch (effect[1]) {

                            case "health": {
                                var amountToHeal;
                                if (effect[2] == "flat") {
                                    amountToHeal = effect[3];
                                } else if (effect[2] == "percentile") {
                                    amountToHeal = Combat.getMaxHealth(player.stats) * (effect[3] / 100);
                                }
                                if (player.stats.current_health + amountToHeal < 0) {
                                    mainView.displayMessage("Your health is too low to use that item!");
                                    actuallyUse = false;
                                } else {
                                   //console.log(player);
                                    player.stats.current_health += amountToHeal;
                                   //console.log(player);
                                    if (player.stats.current_health > Combat.getMaxHealth(player.stats)) { player.stats.current_health = Combat.getMaxHealth(player.stats) }
                                    mainView.displayMessage(`Recovered ${amountToHeal} HP!`);
                                    //mainView.setInputResponse(equipMenu.itemMenu);
                                    updateDisplay(player, "normal");
                                }
                                break;
                            }

                            case "mana": {
                                var amountToHeal;
                                if (effect[2] == "flat") {
                                    amountToHeal = effect[3];
                                } else if (effect[2] == "percentile") {
                                    amountToHeal = Combat.getPlayerAdd(player.stats).max_mana * (effect[3] / 100);
                                }
                                if (player.stats.current_mana + amountToHeal < 0) {
                                    mainView.displayMessage("Your mana is too low to use that item!");
                                    actuallyUse = false;
                                } else {
                                   //console.log(player);
                                    player.stats.current_mana += amountToHeal;
                                   //console.log(player);
                                    if (player.stats.current_mana > Combat.getPlayerAdd(player.stats).max_mana) {
                                        player.stats.current_mana = Combat.getPlayerAdd(player.stats).max_mana;
                                    }
                                    mainView.displayMessage(`Recovered ${amountToHeal} MP!`);
                                    //mainView.setInputResponse(equipMenu.itemMenu);
                                    //updateDisplay(player, "normal");
                                }
                                break;
                            }

                            case "stamina": {
                                var amountToHeal;
                                if (effect[2] == "flat") {
                                    amountToHeal = effect[3];
                                } else if (effect[2] == "percentile") {
                                    amountToHeal = Combat.getPlayerAdd(player.stats).max_stamina * (effect[3] / 100);
                                }
                                if (player.stats.current_mana + amountToHeal < 0) {
                                    mainView.displayMessage("Your stamina is too low to use that item!");
                                    actuallyUse = false;
                                } else {
                                   //console.log(player);
                                    player.stats.current_stamina += amountToHeal;
                                   //console.log(player);
                                    if (player.stats.current_stamina > Combat.getPlayerAdd(player.stats).max_stamina) {
                                        player.stats.current_stamina = Combat.getPlayerAdd(player.stats).max_stamina;
                                    }
                                    mainView.displayMessage(`Recovered ${amountToHeal} stamina!`);
                                    //mainView.setInputResponse(equipMenu.itemMenu);
                                    //updateDisplay(player, "normal");
                                }
                                break;
                            }

                            
                            case "teleport": {
                                const currentZone = getCurrentZone();
                                if (currentZone == undefined) {
                                    mainView.displayMessage('<br>This item cannot be used right now!');
                                    actuallyUse = false;
                                } else {
                                    if (currentZone.name != effect[2]) {
                                        mainView.displayMessage("<br>You can't use this item right now! You're in the wrong zone!");
                                        actuallyUse = false;
                                    } else {
                                        teleport(effect[3])
                                        
                                    }
                                }
                                break;
                            }
                            

                            default: {
                                mainView.displayMessage("Error occurred: Effect invalid");
                                actuallyUse = false;
                                mainView.setInputResponse(equipMenu.itemMenu);
                            }
                        };


                        var goBack = false;
                        if (actuallyUse) {
                           //console.log(`AAAAAAAAAAAAAAAAAAAAAAAAAAAA ${getItemIdentfierByName(itemDetails.name)}`);
                            removeItem(getItemIdentfierByName(itemDetails.name), 1);
                            if (getQuantity(getItemIdentfierByName(itemDetails.name), gameData.data.player.inventory) == 0) {
                                goBack = true;
                            }
                        }

                        if (!goBack) {
                            mainView.setInputResponse(equipMenu.itemMenu);
                        } else { equipMenu.menuLoop() }
                        updateDisplay(player, "normal");
                    });
                }
            }
        
        }

        else if (input == "p" || input == "pouch") {
            const itemName = getItemIdentfierByName(itemDetails.name);
            // check if the item is in the pouch. If so, remove it and return
            if (player.stats.pouch.findIndex(item => item[0] == itemName) != -1) {
                const itemIndex = player.stats.pouch.findIndex(item => item[0] == itemName);
                const itemAmount = player.stats.pouch[itemIndex][1]
                addItem(itemName, itemAmount, itemAmount);
                player.stats.pouch.splice(itemIndex, 1);
                mainView.displayMessage(`Removed ${itemAmount} ${itemDetails.name} from the pouch.`);
                equipMenu.itemLoop();
            }

            else if (itemDetails.hasOwnProperty("use")) {
                if (itemDetails.use.hasOwnProperty("battleEffect")) {
                    if (player.stats.pouch.length < gameData.constants.pouchMaxStorage) {
                        mainView.displayMessage(`How many ${itemDetails.name} would you like to add to your pouch? Input anything invalid to return.`)
                        mainView.displayMessage(`Do note that you cannot add more than ${itemDetails.use.pouchMax} of this item.`);
                        mainView.setInputResponse(equipMenu.addPouchResponse);
                    } else {
                        mainView.displayMessage("<b>Your pouch is full!</b>");
                        equipMenu.itemLoop();
                    }
                } else {
                    mainView.displayMessagesDelayed([["This item cannot be added to your pouch!", 2]], "outside", equipMenu.itemLoop);
                    //equipMenu.itemLoop();
                }
            }

            else {
                mainView.displayMessagesDelayed([["This item cannot be added to your pouch!", 2]], "outside", equipMenu.itemLoop);
                //equipMenu.itemLoop();
            }
            // if not, ensure the item can be added to the pouch. If so, ask the player how many of the item they...
            // want to add to the pouch.
        }
        
        else if (input == "z" || input == "x") { // this is not really necessary, but it's here because I want to..
            // ..keep this block somewhat separate

            const currentItem = equipMenu.currentItem;


            const itemIndex = equipMenu.currentIndex;

            if (input == "z") {
                mainView.displayMessage(`${separator}Scrolling up..`);

                var newIndex = itemIndex - 1;
                if (newIndex < 0) { newIndex = player.inventory.length - 1 };

                var newItem;
                if (isReagent(player.inventory[newIndex])) { // needed :(
                    newItem = player.inventory[newIndex][0];
                } else { newItem = player.inventory[newIndex]}

                //console.log(player.inventory);
                //console.log(`player len is ${player.inventory.length}`);


                equipMenu.currentItem = player.inventory[newIndex];
                equipMenu.itemLoop();
            } else {
                mainView.displayMessage(`${separator}Scrolling down..`);
               
                var newIndex = itemIndex + 1;
                if (newIndex == player.inventory.length) { newIndex = 0 };

                var newItem;
                if (isReagent(player.inventory[newIndex])) { // needed :(
                    newItem = player.inventory[newIndex][0];
                } else { newItem = player.inventory[newIndex]}

                equipMenu.currentItem = player.inventory[newIndex];
                equipMenu.itemLoop();
            }
        } else if (input == "b" || input == "back") {
            mainView.displayMessage(`${separator}Returning...`);
            equipMenu.menuLoop();
        } else {
            mainView.displayMessage("<br>Invalid input.");
            mainView.setInputResponse(equipMenu.itemMenu);
        }

    },

    addPouchResponse() {
        mainView.removeInputResponse(equipMenu.addPouchResponse);
        const player = gameData.data.player;
        const input = mainView.getInput().toLowerCase();
        const item = equipMenu.currentItem;
        const itemDetails = (isReagent(item) ? items[item[0]] : items[item]);
        const itemName = getItemIdentfierByName(itemDetails.name);
        const itemIndex = player.inventory.findIndex(item => item[0] == itemName);


        // if number inputted
        if (parseInt(input).toString != "NaN") {
            const amount = parseInt(input);
            // and number is within pouchlimit
            var removedAll = false;
            if (amount > 0 && amount <= itemDetails.use.pouchMax) {
                // and player has that number in inventory
                if (amount <= player.inventory[itemIndex][1]) {
                    // add item to pouch
                    if (amount == player.inventory[itemIndex][1]) { removedAll = true };
                    removeItem(itemName, amount);
                    player.stats.pouch.push([itemName, amount]);
                    mainView.displayMessage(`Added ${amount} ${itemDetails.name} to pouch.`);
                    mainView.displayMessage("When you want to remove this item from your pouch, if you have none of it left" +
                    " in your inventory, you can remove it via the pouch menu accessible by inputting p/pouch instead of an item" +
                    " name at the inventory menu.");
                } else {
                    mainView.displayMessage("You don't have enough of this item!");
                }
            } else {
                mainView.displayMessage("That amount is either beyond the pouch limit or below out of range!");
            }
        
        } else {
            mainView.displayMessage("Invald input");
            equipMenu.itemLoop();
        }

        if (removedAll) {
            mainView.displayMessagesDelayed([["Returning..", 2]], "outside", equipMenu.menuLoop);
        }
        else {
            mainView.displayMessagesDelayed([["Returning..", 2]], "outside", equipMenu.itemLoop);
        }
        //equipMenu.itemLoop();
    },

    unequipItem(slot) {
        const player = gameData.data.player;
        const temp = player.stats.equips[slot] // we are going to delete the item and then add the temp into inventory
        const tempDetails = items[temp];
        player.stats.equips[slot] = undefined;
        player.inventory.push(temp); // adding item to inventory array
        mainView.displayMessage(`${separator}${tempDetails.name} unequipped.`); // telling the player item was unequipped
        updateDisplay(player, "normal");

    },

    equipItem(item_index) { // NEED TO EDIT
        const player = gameData.data.player;
        const temp = player.inventory[item_index]; // getting item from item dir. and copying it
        const tempDetailsCopy = {...items[temp]};
        if (tempDetailsCopy.type == "misc") { // misc. items have to be handled specially since there are two slots for them
            if (player.stats.equips["misc1"] == undefined) {
                tempDetailsCopy.type = "misc1";
            } else if (player.stats.equips["misc2"] == undefined) {
                tempDetailsCopy.type = "misc2";
            } else {
                tempDetailsCopy.type = "misc1"; // if this is not here, the type will remain "misc", which will raise an error later.
                // setting it to "misc1" which will be full means that the game will inform the player that there is no slot
                // for the misc item rather than raising an error
            }
        }; 

        // removeItem could be used here, but this procedure is uniform and using removeItem() would be superfluous so I didn't
        if (player.stats.equips[tempDetailsCopy.type] == undefined) { // if there is no item equipped in that slot..
            //console.log(`${tempDetailsCopy.type} selected`)
            const itemIdentifier = player.inventory[item_index]; // "slime_sword" vs. "Slime Sword"
            delete player.inventory[item_index]
            player.stats.equips[tempDetailsCopy.type] = itemIdentifier;
            /*if (temp.type == "misc1" || temp.type == "misc2") { // resetting misc type, see above subroutine with misc
                temp.type = "misc";
            };*/
            mainView.displayMessage(`${separator}${tempDetailsCopy.name} equipped.`);
        } else {
            mainView.displayMessage("There is already an item equipped in that slot."); // this will not happen but ill leave it here
        }

        for (var i = 0; i < player.inventory.length; i++) { // for loop needed since map/forEach skip empty objects
            if (player.inventory[i] == undefined) { // if a certain index in inventory has value undefined...
                player.inventory.splice(i, 1 ); // destroy it since otherwise it messes stuff up. yare yare
            }
        }
        updateDisplay(player, "normal");

    }
}


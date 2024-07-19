import * as mainView from '../views/mainView';
import * as gameData from './data';
import { getQuantity, displayDetails, items, addItem, removeItem } from './items';
import { separator, tutorialMessages } from '../views/baseView';
import { mainLoop } from '..';
import { updateDisplay, tutorialMessage } from './baseModel';
import { recipeDirectory } from '../../directories/recipes/recipes';

const recipes = recipeDirectory;

const floorRecipes = {
    0: ["wooden_sword", "health_potion"],

    1: ["wooden_sword", "wooden_stave", "wooden_armour", "wooden_trousers", "leather_cap",
    "leather_armour", "leather_pants", "wolven_reavers", "leather", "pickaxe", "blue_vine_charm", "vinewarding_charm",
    "bearkiller_charm", "canine_charm", "vine_armour"]
};

export const initCrafting = (returnFunction, recipesAvailable = undefined) => {
    recipeHandler.returnFunction = returnFunction; // so the player knows where to go back to
    recipeHandler.recipesAvailable = recipesAvailable;

    // -- TUTORIAL -- \\
    const tutorials = gameData.data.tutorials;
    if (tutorials.includes('crafting_1') == false && gameData.data.special.doingTutorial == true) {
        gameData.data.tutorials.push('crafting_1');
        mainView.displayWaitForInput(tutorialMessages.crafting_1, recipeHandler.recipesLoop);
    }
    else {
        recipeHandler.recipesLoop();
    }

}

export const getCraftingDetails = () => {
    return {
         recipesAvailable: recipeHandler.recipesAvailable,
         currentRecipe: recipeHandler.currentRecipe,
         recipesArray: recipeHandler.recipesArray,
         returnFunctionm: recipeHandler.returnFunction,
         craftingFromNpc: recipeHandler.craftingFromNpc
    }
}

export const resetCrafting = () => {
    recipeHandler.reset();
}

const recipeHandler = {
    
    recipesAvailable: undefined, // if we are using a craftsperson
    currentRecipe: undefined,
    recipesArray: undefined, // because the order we display them will change
    returnFunction: undefined,
    craftingFromNpc: undefined,

    reset() {
        this.recipesAvailable = undefined,
        this.currentRecipe = undefined,
        this.recipesArray = undefined,
        this.returnFunction = undefined,
        this.craftingFromNpc = undefined
    },
    
    recipesLoop: (showMsg = true) => {
        if (recipeHandler.recipesAvailable == undefined) {
            // player is using their own recipes
            mainView.displayMessage(`${separator}Currently in the recipes menu. Input 'f'/'floor' to use the recipes allocated` +
            ` to your floor. If you have any personal recipes, input 'p'/'personal' in order to access them.`);
            mainView.displayMessage("Input <b>'b'</b> or <b>back</b> to return.")
            mainView.setInputResponse(recipeHandler.recipesLoopResponse);
            mainView.initInputShortcuts(["floor", "personal", "back"]);
            recipeHandler.craftingFromNpc = false;

        } else {
            mainView.displayMessage("Currently crafting using recipes you do not own...");
            recipeHandler.craftingFromNpc = true;
            recipeHandler.recipesLoop2();
        }
    },

    recipesLoopResponse() {
        mainView.removeInputResponse(recipeHandler.recipesLoopResponse);
        const input = mainView.getInput().toLowerCase();
        if (input == "f" || input == "floor") {
            mainView.displayMessage("<br>Using floor recipes..");
            recipeHandler.recipesAvailable = floorRecipes[gameData.data.current_floor];
            recipeHandler.recipesLoop2();
        }
        else if (input == "p" || input == "personal") {
            const personalRecipes = gameData.data.player.recipes;
            if (personalRecipes.length == 0) {
                mainView.displayMessage("<br>You don't have any personal recipes!");
                recipeHandler.recipesLoop();

            } else {
                recipeHandler.recipesLoop2();
            }
        }
        else if (input == "b" || input == "back") {
            mainView.displayMessage("<br>Returning...");
            // reset recipe handler
            recipeHandler.recipesAvailable = undefined; // if we are using a craftsperson
            recipeHandler.currentRecipe =  undefined;
            recipeHandler.recipesArray = undefined; // because the order we display them will change
            recipeHandler.craftingFromNpc = undefined;

            recipeHandler.returnFunction();
            recipeHandler.returnFunction = undefined;
        }
        else {
            mainView.displayMessage("<br>Invalid input.");
            mainView.setInputResponse(recipeHandler.recipesLoopResponse);
        }
    },

    recipesLoop2: (showMsg = true) => {
        updateDisplay(gameData.data.player, "normal");

        if (showMsg) {
            mainView.displayMessage(`${separator}Input 'a' to see them all in alphabetical order, ` + 
            `or input 'r' to see first all recipes that can be crafted.`);
            mainView.displayMessage("<br>Input <b>'b'/'back'</b> to return.")
        }
        mainView.initInputShortcuts(["alphabetical", "ready", "back"]);
        mainView.setInputResponse(recipeHandler.displayRecipes);
    },

    displayRecipes: () => {
        const input = mainView.getInput().toLowerCase();
        mainView.removeInputResponse(recipeHandler.displayRecipes);

        const player = gameData.data.player;

        // first things first, sort the recipes the player has
        
        var recipesArr;
        if (recipeHandler.recipesAvailable == undefined) {
            recipesArr = player.recipes.map(recipe => {
                return recipes[recipe];
            })
        } else {
            recipesArr = recipeHandler.recipesAvailable.map(recipe => {
                return recipes[recipe];
            })
        }
       //console.log("LOGGING RECIPES ARR");
       //console.log(recipesArr);
       //console.log(recipeHandler.recipesAvailable);
       //console.log(recipeHandler.finishFunction);

        const alphabet = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a','b','c','d','e','f','g','h','i','j','k',
        'l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

        var listed = false; // will be used to ensure we only operate on the list if they asked for one

        switch (input) {
            case "alphabetical":
            case "a":
                listed = true;
                for (var i = 0; i < recipesArr.length; i++) {
                    for (var x = 1; x < recipesArr.length; x++) {
                        var foundShorter = false;
                        var pos = 0;
                        while (foundShorter == false) {
                            const letterA = alphabet.indexOf(recipesArr[x].name[pos].toLowerCase()) // getting the pos. in the alphabet of first letter
                            const letterB = alphabet.indexOf(recipesArr[x-1].name[pos].toLowerCase()); // see above
                            if (letterA < letterB) { // if the item infront is in front in the alphabet
                                // we need to change that
                                const temp = recipesArr[x];
                                recipesArr[x] = recipesArr[x - 1];
                                recipesArr[x - 1] = temp; // 
                                foundShorter = true;
                            } else if (letterA > letterB) {
                                foundShorter = true; // this means they are the right way around
                            } else { // stop the loop if we have already reached the end of one of the letters
                                if (pos + 1 >= recipesArr[x].name.length || pos + 1 >= recipesArr[x - 1].name.length) {
                                    foundShorter = true;
                                } else { pos ++ }; 
                            }
                        }
                    }
                }
                break;

            case "ready":
            case "r":
                listed = true;
                var counter = 0;
                for (var i = 1; i < recipesArr.length; i++) {
                    if (recipeHandler.checkReady(recipesArr[i], inventory)) {
                        const temp = {...recipesArr[i]} // we need to copy it since we are going to delete the original
                        delete recipesArr[i];
                        recipesArr.unshift(temp)
                        i++;
                        counter++;
                        if (counter == recipesArr.length) {
                            i = recipesArr.length // otherwise this script will loop if all of the recipes are ready
                        };
                    }
                };
                recipesArr = recipesArr.filter(function( element ) {
                    return element !== undefined;
                });
                break; 

            case "back":
            case "b":
                mainView.displayMessage("<br>Returning...");

                if (recipeHandler.craftingFromNpc == true) {
                    // for crafting with a NPC, this is essentially the highest-level menu. But for crafting from menu...
                    // ..., we need to return to recipesLoop(1).
                    // reset recipe handler
                    recipeHandler.recipesAvailable = undefined;
                    recipeHandler.currentRecipe =  undefined;
                    recipeHandler.recipesArray = undefined; // because the order we display them will change
                    recipeHandler.craftingFromNpc = undefined;

                    recipeHandler.returnFunction();
                    recipeHandler.returnFunction = undefined;
                } else {
                    recipeHandler.recipesAvailable = undefined;
                    recipeHandler.recipesLoop();
                }
                break;

            default:
                mainView.displayMessage("<br>Invalid input.");
                recipeHandler.recipesLoop2(false);
                break;
            }
            
            if (listed) {


                recipeHandler.recipesArray = recipesArr;

                //console.log("LOGGING RECIPES ARR");
                //console.log(recipesArr);
    
                mainView.displayMessage(`${separator}Showing recipes...`);
                // display the recipes
                recipesArr.forEach(recipe => {
                    const notation = (recipeHandler.checkReady(recipe, inventory) == true ? '[X]' : '[ ]');
                    mainView.displayMessage(`${recipesArr.indexOf(recipe) + 1} - ${recipe.name} (${notation})`)
                })
                mainView.displayMessage(`${separator}Say the name or number of a recipe to access it. From there you can see the` +
                ` items and gold required, and craft the recipe if you desire as well.`);
                mainView.displayMessage("Input <b>'b'</b> or <b>'back'</b> to return.")
    
                var inputShortcuts = recipesArr.map(recipe => {
                    return recipe.name
                }) // these are objects right? haha

                mainView.setInputResponse(recipeHandler.recipesMenu);
            };

    },

    recipesMenu: () => {
        mainView.removeInputResponse(recipeHandler.recipesMenu);
        const input = mainView.getInput().toLowerCase();

        const recipesArr = recipeHandler.recipesArray;

        // process input
        // if the player enters 's' or 'scroll', enter scroll mode
        // if the player enters the name of a recipe, move to recipe menu
        // if the player enters the number of a recipe, move to recipe menu
        // if the player enters back, move back to recipes main loop
        // if the player enters anything else, inform that their input is invalid and put them back here

        const index = parseInt(input);
        var wasIndex = false;

        if (index.toString() != "NaN") {
            if (recipesArr.length > index - 1) {
                wasIndex = true;
            }
        }


        
        var wasName = false;
        var recipe;
        recipesArr.forEach(_recipe => {
            if (_recipe.name.toLowerCase() == input) {
                wasName = true;
                //console.log(`logging recipe -1`);
                //console.log(_recipe);
                recipe = _recipe; // if the input was a name, this will save the recipe so we don't have to find it again
            }
        })


        switch (true) {

            case (wasIndex): {
                const recipe = recipesArr[index - 1];
                recipeHandler.currentRecipe = recipesArr[index - 1];
                recipeHandler.recipeLoop();
                break;
            }

            case (wasName): {
                /*const _index = recipesArr.findIndex(recipe => {
                    recipe.name.toLowerCase() == input;
                });
                //console.log(`index RN is ${_index}`);
                const recipe = recipesArr[_index - 1];*/
                //console.log(`logging recipe`);
                //console.log(recipe);
                recipeHandler.currentRecipe = recipe;
                recipeHandler.recipeLoop();
                break;
            }

            case (input == "b"):
            case (input == "back"): {
                mainView.displayMessage(`${separator}Returning..`);
                recipeHandler.recipesLoop2();
                break;
            }

            default: {
                mainView.displayMessage(`${separator}Invalid input.`);
                mainView.setInputResponse(recipeHandler.recipesMenu);
            }

        }
    },

    recipeLoop: () => {

        const recipesArr = recipeHandler.recipesArr;
        const recipe = recipeHandler.currentRecipe;
        const inventory = gameData.data.player.inventory;

        mainView.displayMessage(`${separator}Currently viewing ${recipe.name} recipe.`);
        mainView.displayMessage(`The following is required:`);
        mainView.displayMessage(`${recipe.gold} gold (You have ${gameData.data.player.gold})`)
        recipe.items.forEach(item => {
            mainView.displayMessage(`${item[1]} ${items[item[0]].name}${item[1] > 1 ? 's' : ''} (You have ${getQuantity(item[0], inventory)})`)
        });
        mainView.displayMessage(`<br>The recipe will craft the following item:`);
        displayDetails(items[recipe.item], true, true, true, false, true);

        const canCraft = recipeHandler.checkReady(recipe, inventory);

        if (canCraft) { mainView.displayMessage("<br>This item can be crafted.")};

        mainView.displayMessage(`<br> - c/craft (to craft it, if possible).`);
        mainView.displayMessage(`<br> - z (to scroll up; looking through more recipes)`);
        mainView.displayMessage(`<br> - x (to scroll down; looking through more recipes)`);
        mainView.displayMessage(`<br> - l (reprint list of recipes, and your position)`);
        mainView.displayMessage(`<br> - b/back (to return)`);

        mainView.initInputShortcuts(['up', 'down', 'list', 'craft', 'back']);
        mainView.setInputResponse(recipeHandler.recipeMenu)

    },

    recipeMenu: () => {
        mainView.removeInputResponse(recipeHandler.recipeMenu);
        const input = mainView.getInput().toLowerCase();

        const recipesArr = recipeHandler.recipesArray;
       //console.log(recipesArr);
        const recipe = recipeHandler.currentRecipe;
        const inventory = gameData.data.player.inventory;

        // if the player inputted z, look at the item 1 index below current
        // if the player inputted x, look at the item 1 index above current
        // if the player inputted b or back, perform recipesLoop
        // if the player inputted anything else, state invalid input
        
        var currentIndex = recipesArr.findIndex(_recipe => { // we need to know this to scroll forward or backward
           //console.log(_recipe);
            return recipe.name == _recipe.name;
        })

        switch (input) {
            
            case 'up':
            case 'z': {
                mainView.displayMessage(`${separator}Scrolling back..`);
                if (currentIndex == 0) { currentIndex = recipesArr.length - 1} else { currentIndex-- };
                recipeHandler.currentRecipe = recipesArr[currentIndex];
                //console.log(recipesArr);
                //console.log(recipesArr[newIndex]);
                //console.log(currentIndex);
                recipeHandler.recipeLoop();
                
                break;    
            }

            case 'down':
            case 'x': {
                var newIndex;
                mainView.displayMessage(`${separator}Scrolling forward..`);
                if (currentIndex == recipesArr.length - 1) { currentIndex = 0} else { currentIndex++ };
                recipeHandler.currentRecipe = recipesArr[currentIndex];
                recipeHandler.recipeLoop();
                
                break;    
            }

            case 'list':
            case 'l': {
                mainView.displayMessage(`${separator}Displaying recipes...`);
                var notation
                recipesArr.forEach(recipe => {
                    if (recipe.name == recipeHandler.currentRecipe.name) {
                        notation = '<b>';
                    } else { notation = '' };
                    mainView.displayMessage(`${notation}${recipe.name}${notation == '<b>' ? '</b>' : ''}`);
                })
                mainView.displayMessage("<br>You are still in the recipe menu. See above options.");
                mainView.setInputResponse(recipeHandler.recipeMenu);
                mainView.initInputShortcuts(['up', 'down', 'list', 'craft', 'back']);
                break;
            }

            case 'craft':
            case 'c': {
                const canCraft = recipeHandler.checkReady(recipeHandler.currentRecipe, inventory);
                if (!canCraft) {
                    mainView.displayMessage("<br>This item cannot be crafted.");
                    mainView.setInputResponse(recipeHandler.recipeMenu);
                    mainView.initInputShortcuts(['up', 'down', 'list', 'craft', 'back']);
                } else {
                    mainView.displayMessage(`${separator}How many of this item would you like to craft? Please input the ` +
                    ` number you would like to craft, or input '0' if you would like to return.`);
                    mainView.setInputResponse(recipeHandler.inputQuantity);
                }
                break;
            }

            case 'back':
            case 'b': {
                mainView.displayMessage("<br>Returning...");
                recipeHandler.recipesLoop();
                break;
            }

            default: {
                mainView.displayMessage("<br>Invalid input.");
                mainView.setInputResponse(recipeHandler.recipeMenu);
                mainView.initInputShortcuts(['up', 'down', 'list', 'craft', 'back']);
            }
        }

    },

    inputQuantity: () => {
        const input = mainView.getInput().toLowerCase();
        mainView.removeInputResponse(recipeHandler.inputQuantity);

        const inventory = gameData.data.player.inventory;

        if (parseInt(input).toString() == 'NaN') {
            mainView.displayMessage("<br>Invalid input.");
            mainView.setInputResponse(recipeHandler.inputQuantity);
        } else if (parseInt(input) == 0) {
            mainView.displayMessage("<br>Returning...");
            recipeHandler.recipeLoop();
        } else {
            const amount = parseInt(input);
            const tempRecipe = JSON.parse(JSON.stringify(recipeHandler.currentRecipe)); // we will use this to see if they have enough reagents/items
            tempRecipe.items.forEach(value => {
                value[1] = value[1] * amount;
            });
            tempRecipe.gold = tempRecipe.gold * amount;
            
            //console.log("logging temp recipe");
            //console.log(tempRecipe);

            const canCraft = recipeHandler.checkReady(tempRecipe, inventory);
            
            mainView.displayMessage(`${separator}In order to craft ${input} ${items[recipeHandler.currentRecipe.item].name}` +
             `${amount > 1 ? 's' : ''}, You will need the following items:`);

            // we know they have at least 1 of each item, so fewer checks will be needed here

            tempRecipe.items.forEach(item => {
                const itemName = item[0];
                const itemAmount = item[1]
                const playerAmount = getQuantity(itemName, inventory);
                mainView.displayMessage(`${itemAmount} ${items[itemName].name} (You have ${playerAmount})`);
            })
            mainView.displayMessage(`${tempRecipe.gold} gold`)

            if (!canCraft) {
                mainView.displayMessagesDelayed([["<br>You cannot craft this much of that item!", 2]], "outside", () => {
                    recipeHandler.recipeLoop();
                })
            } else {
                mainView.displayMessage(`<br>Are you sure you would like to craft ${amount}` +
                 ` ${items[recipeHandler.currentRecipe.item].name}? Input 'y'/'yes' to confirm, or enter` +
                 ` anything else to return.`)
                 recipeHandler.craftAmount = amount;
                mainView.setInputResponse(recipeHandler.craftConfirmation);
            }
        }

    },

    craftConfirmation: () => {
        mainView.removeInputResponse(recipeHandler.craftConfirmation);

        const input = mainView.getInput().toLowerCase();
        mainView.removeInputResponse(recipeHandler.craftConfirmation);

        const player = gameData.data.player;

        if (input == 'y' || input == 'yes') {
            const recipe = recipeHandler.currentRecipe;
            const amount = recipeHandler.craftAmount;

            for (var i = 0; i < amount; i++) {
                player.gold -= recipe.gold;
                recipe.items.forEach(item => {
                    removeItem(item[0], item[1])
                });
            }

            addItem(recipe.item, amount, amount);
            updateDisplay(player, "normal");

            mainView.displayMessagesDelayed([[`${separator}Returning to recipe menu...`, 2]], "outside", () => {
                recipeHandler.recipeLoop();
            })
        } else {
            mainView.displayMessage("<br>Returning...");
            recipeHandler.recipeLoop();
        }

    },

    checkReady: (recipe, inventory) => { // checks if a recipe can be crafted or not
        const inv = gameData.data.player.inventory;
        const needed = recipe.items;
        var owned = true;
        
        needed.forEach(item => {
            // check if the item is a reagent
            // ..if a reagent, find and check quantity accordingly 
            // same if item
            var quantity;
           //console.log(item);
            if ((getQuantity(item[0], inv) >= item[1]) == false) {
                owned = false;
            }
            
        })

        if (gameData.data.player.gold < recipe.gold) {
            owned = false;
        };

        return owned;
    }
}

export const unlockRecipes = (recipe, showUnlock = true) => {
    if (recipe[0].length == 1) {
        recipe = [recipe];
    }
    recipe.forEach(recipeName => {
       //console.log(recipeName);
        if (recipes[recipeName] != undefined) {
            // ensure the player doesn't already have the recipe
            if (gameData.data.player.recipes.indexOf(recipeName) == -1) {
                gameData.data.player.recipes.push(recipeName);
                if (showUnlock) {
                    mainView.displayMessage(`<br>Unlocked recipe [${recipes[recipeName].name}]`);
                }
            } else {
               //console.log("recipe already owned");
            }
        } else {
           //console.log("recipe does not exist");
        } 
    });
}
import * as mainView from '../views/mainView';
import * as statView from '../views/statView';
import { skills } from './skills';
import * as gameData from './data';
import { settings } from './data';
import { separator, tutorialMessages } from '../views/baseView';
import { updateDisplay, findAmount } from './baseModel';
import { clamp } from './baseModel';
import { basename } from 'path';
import { mainLoop } from '../index';
import { ai } from './enemies';
import { addItem, items, displayDetails, removeItem, isReagent, getName, getQuantity } from './items';
import { parse } from 'querystring';

// -- SHOP IMPORTS -- \\
import { floor1 } from '../../directories/shops/floor1';

export const initShop = (shop, returnFunction) => {
    shopHandler.currentShop = shops[shop];
    shopHandler.returnFunction = returnFunction;

    
    shopHandler.shopLoop();
}

export const floorToShop = {
    1: "f1_shop"
};

export const getShopDetails = () => {
    return {
        currentItem: shopHandler.currentItem,
        currentShop: shopHandler.currentShop,
        returnFunction: shopHandler.returnFunction,
        mode: shopHandler.mode,
        price: shopHandler.price,
        menuOptions: shopHandler.menuOptions
    }
}

export const resetShop = () => {
    shopHandler.reset();
}

const shops = Object.assign(floor1, )

const shopHandler = {
    currentItem: undefined, // WHEN SELLING, THIS IS IN SAME FORMAT AS PL. INVENTORY. WHEN BUYING, IS IN FORMAT SEEN IN SHOP (ex. ["slime_sword", 1000])
    currentShop: undefined,
    returnFunction: undefined,
    mode: undefined,
    price: undefined,
    menuOptions: undefined, // this is needed for sell mode

    reset() {
        this.currentItem = undefined;
        this.currentShop = undefined;
        this.returnFunction = undefined;
        this.mode = undefined;
        this.price = undefined;
        this.menuOptions = undefined;
    },

    shopLoop: (showItems = true) => {
        const currentShop = shopHandler.currentShop;
        mainView.displayMessage(`${separator}Currently shopping at ${currentShop.name}`);
        mainView.displayMessage("Wares available:");
        currentShop.items.forEach(ware => {
            const itemIndex = currentShop.items.findIndex(cur => {
                return cur[0] == ware[0]
            })
            mainView.displayMessage(`${itemIndex + 1} - ${items[ware[0]].name} - ${ware[1]}G`)
        });
        mainView.displayMessage("Type the name/number of an item to buy it, or type 's'/'sell' to enter sell mode.");
        mainView.displayMessage("<br>Input <b>'b'/'back'</b> to return.")
        mainView.setInputResponse(shopHandler.shopResponse);
    },

    shopResponse: () => {
        mainView.removeInputResponse(shopHandler.shopResponse);

        const currentShop = shopHandler.currentShop;
        const input = mainView.getInput().toLowerCase();

        // we must at first check if their input was a valid number or a valid item name
        var itemIndex = (currentShop.items[input - 1] != undefined ? parseInt(input) - 1 : -1); // is it a valid item number?
        //console.log(`currently, item index is ${itemIndex}`);

        if (itemIndex == -1) { // to prevent us from restting it from the previous check
            itemIndex = currentShop.items.findIndex(item => {
                return input == items[item[0]].name.toLowerCase() // we need to get the display name of the item from the directory
            }) // is it the name of an item in the shop?
        }

        //console.log(`item index is now ${itemIndex}`);

        // if they selected an item, we need to begin letting them buy it
        if (itemIndex != -1) {
            const item = currentShop.items[itemIndex];
            //console.log(`item is ${item}`); // for testing purpose
            mainView.displayMessage(`${separator}${items[item[0]].name} selected.`);
            displayDetails(items[item[0]]);
            mainView.displayMessage("<br>Type 'b' or 'buy to buy it. Otherwise, type anything else to return.");
            shopHandler.currentItem = item;
            //console.log(`shophandler.currentitem = ${shopHandler.currentItem}`);
            shopHandler.mode = "buy";

            mainView.initInputShortcuts(['buy']);
            mainView.setInputResponse(shopHandler.itemMenu)
        } else if (input == 'sell' || input == 's') {
            shopHandler.mode = "sell";
            mainView.displayMessage(`${separator}Entering sell mode..`);
            shopHandler.sellLoop()
        } else if (input == 'back' || input == 'b') {
            mainView.displayMessage(`${separator}Returning...`);
            shopHandler.returnFunction();
        } else {
            mainView.displayMessage("<br>Invalid input.");
            mainView.setInputResponse(shopHandler.shopResponse);
        }

    },

    sellLoop: (displayinv = true) => {
        const player = gameData.data.player;

        mainView.displayMessage(`${separator}Currently in sell mode. Type the name/number of an item in the inventory to see
        its details and sell it. Type 'b'/'back' to exit sell mode.`);
        mainView.displayMessage("<br>Inventory:");
        
        // before iterating over the player's inventory, we will delete all duplicates
        var invIterable = [];
        player.inventory.forEach(cur => { // map does not work here
            if (isReagent(cur)) { invIterable.push(cur) } else {
                //console.log(`cur is ${cur}, inviterable is ${invIterable}`)
                if (invIterable.includes(cur)) { } else { invIterable.push(cur) }
            }
        })
        
        //console.log(invIterable);

        if (displayinv) {
            invIterable.forEach((cur,index) => {
                var item;
                var itemName;
                if (isReagent(cur)) {
                    item = items[cur[0]] // don't have to copy since we aren't changing any values
                    itemName = cur[0];
                    //console.log(`ITEMNAME IS ${cur[0]}`)
                } else if (cur == "nothing") {
                    //pass
                } else {
                    item = items[cur] // see above
                    itemName = cur;
                }
                //console.log("PRINTING PLAYER INVENORY");
                //console.log(player.inventory);
                //console.log(player);
                mainView.displayMessage(`${index + 1} - ${item.name} (x${findAmount(itemName, player.inventory)}) - ${item.sell_value}${item.sell_value == "unsellable" ? '' : 'G'}`);
            })
        }

        shopHandler.menuOptions = invIterable;

        mainView.setInputResponse(shopHandler.sellResponse);
    },

    sellResponse: () => {
        mainView.removeInputResponse(shopHandler.sellResponse);

        const input = mainView.getInput().toLowerCase();
        const menuOptions = shopHandler.menuOptions;

        var index = -1; // init. variable 
        if (parseInt(input).toString() != "NaN") { // if they inputted an integer
            if (menuOptions.length >= parseInt(input)) { // if they inputted a number in range
                mainView.displayMessage(`<br>${items[getName(menuOptions[parseInt(input - 1)])].name} selected.`);
                index = input - 1;
            } else {
                mainView.displayMessage("<br>Number out of range.");
            }
        } else {
            menuOptions.forEach((cur, ind) => { // otherwise check if they inputted the name of an item
                //console.log(`cur and ind are ${cur} and ${ind}`);
                if (isReagent(cur)) {
                    //console.log(items[cur[0]])
                    if (items[cur[0]].name.toLowerCase() == input) { index = ind };
                } else {
                    //console.log(items[cur]);
                    if (items[cur].name.toLowerCase() == input) { index = ind }
                }
            });
            if (index != -1) { mainView.displayMessage(`<br>${items[menuOptions[parseInt(index)].name]} selected.`); };
        }

        // if they properly searched for an item, we want to tell them the details of the item and allow them to sell it
        if (index != -1) {
            displayDetails(items[getName(menuOptions[index])]);
            shopHandler.currentItem = menuOptions[index];
            if (items[getName(menuOptions[index])].sell_value != "unsellable") {
                mainView.displayMessage(`${separator}If you would like to sell this item, type 's'/'sell'. Otherwise, type anything else to return.`)
                mainView.setInputResponse(shopHandler.itemMenu);
            } else {
                mainView.displayMessage(`This item cannot be sold.`);
                shopHandler.sellLoop();
            };

        } else if (input == 'b' || input == 'back') {
            mainView.displayMessage(`${separator}Returning...`);
            shopHandler.shopLoop();
        } else {
            mainView.displayMessage("<br>Invalid input.");
            mainView.setInputResponse(shopHandler.sellResponse);
        }
    },

    itemMenu: () => {
        mainView.removeInputResponse(shopHandler.itemMenu);

        const currentShop = shopHandler.currentShop;
        const input = mainView.getInput().toLowerCase();

        var choice = "none";

        if (input == 'b' || input == 'buy') { // catch both inputs
            choice = 'buy'
        } else if (input == 's' || input == 'sell') {
            choice = 'sell'
        };

        if (choice == shopHandler.mode) { // if they're buying an item and choice 'buy', visa versa
            
            if (choice == 'buy') {
                mainView.displayMessage(`${separator}How many would you like to buy? (Please type a numerical integer value` + 
                `, or type '0' to return)`) // pls 1/2/23 etc
            } else {
                mainView.displayMessage(`${separator}<br>How many would you like to sell? (Please type a numerical integer value` +
                `, or type '0' to return. If you want to sell the maximum amount of this item input 'a'/'all'.`);
            }
            mainView.setInputResponse(shopHandler.itemConfirmation); // we will use the same function here as well
        } else {
            mainView.displayMessage(`${separator}Returning...`);
            if (shopHandler.mode == "buy") {
                shopHandler.shopLoop();
            } else {
                shopHandler.sellLoop();
            }
        }
    },

    itemConfirmation: () => {
        mainView.removeInputResponse(shopHandler.itemConfirmation);

        const player = gameData.data.player;

        const currentShop = shopHandler.currentShop;
        const input = mainView.getInput().toLowerCase();

        var validated = false;

        //console.log(`current item is ${currentShop.currentItem}`);

        //console.log(`parse int is ${parseInt(input)}, type is ${typeof(parseInt(input))}`)

        if (parseInt(input).toString() != "NaN" || input == "a" || input == "all") { // if they input an actual number/ 'a'/'all'
            if (parseInt(input) > 0 && shopHandler.mode == 'buy') {
                const amount = parseInt(input);
                //console.log(`currentshop.currentitem (2) is ${currentShop.currentItem}`)
                const price = amount * shopHandler.currentItem[1];
    
                mainView.displayMessage(`${separator}buying ${amount} ${items[shopHandler.currentItem[0]].name}${amount > 1 ? 's' : ''} will cost` +
                ` ${price}G. Are you sure? Type 'y' or 'yes' to confirm, or anything else to return.`);
    
                shopHandler.price = price;
    
                mainView.setInputResponse(shopHandler.itemTransaction);

                validated = true;
            } else if (parseInt(input) > 0 || input == 'a' || input == 'all' && shopHandler.mode == 'sell') {
                var amount = parseInt(input);
                // selling all
                if (input == 'a' || input == 'all') {
                   //console.log(shopHandler.currentItem);
                    if (isReagent(shopHandler.currentItem)) {
                        amount = getQuantity(shopHandler.currentItem[0], player.inventory); 
                    } else {
                        amount = getQuantity(shopHandler.currentItem, player.inventory); 
                    }
                };
                var itemName;
                var price;
                //console.log(`CURRENTITEM IS ${shopHandler.currentItem}`);
                if (isReagent(shopHandler.currentItem)) {
                    //console.log(itemName = items[shopHandler.currentItem[0]]);
                    price = amount * items[shopHandler.currentItem[0]].sell_value;
                    itemName = items[shopHandler.currentItem[0]].name;
                } else {
                    //console.log(itemName = items[shopHandler.currentItem]);
                    price = amount * items[shopHandler.currentItem].sell_value;
                    itemName = items[shopHandler.currentItem].name;
                }
             
                mainView.displayMessage(`${separator}${amount} ${itemName}${amount > 1 ? 's' : ''} will sell for
                ${price}G. Are you sure? Type 'y' or 'yes' to confirm, or anything else to return.`);

                shopHandler.price = price;

                mainView.setInputResponse(shopHandler.itemTransaction);
                
                validated = true;
            } else if (parseInt(input) == 0) {
                mainView.displayMessage(`${separator}Returning..`);
                validated = true;
                if (shopHandler.mode == "buy") {
                    shopHandler.shopLoop();
                } else {
                    shopHandler.sellLoop();
                }
            }

        } 
        if (validated == false) {
            mainView.displayMessage("<br>Invalid input");
            mainView.setInputResponse(shopHandler.itemConfirmation);
        }

    },

    itemTransaction: () => {
        mainView.removeInputResponse(shopHandler.itemTransaction);

        const currentShop = shopHandler.currentShop;
        const input = mainView.getInput().toLowerCase();
        const player = gameData.data.player;
        const price = shopHandler.price;

        //console.log(`input is ${input}`)

        if (input == 'y' || input == 'yes') { // if they chose yes...
            if (shopHandler.mode == 'buy') { // if they are buying something..
                if (player.gold >= price) { // if they can afford the item..
                    player.gold -= price;
                    const amount = price / shopHandler.currentItem[1]; // we can deduce how many they bought w/ this
                    mainView.displayMessage(`${separator}Purchasing...`);
                    addItem(shopHandler.currentItem[0], amount, amount);
                    mainView.displayMessage("Returning...");
                    shopHandler.shopLoop();

                } else {
                    mainView.displayMessage("<br><b>Too expensive!</b>");
                    shopHandler.shopLoop();
                }
            } else {
                //console.log(`currentitem is ${shopHandler.currentItem}`)
                const item = shopHandler.currentItem;
                const inventory = player.inventory;
                if ((isReagent(item) ? findAmount(item[0], inventory) : findAmount(item, inventory)) >=
                 price / items[getName(shopHandler.currentItem)].sell_value) {
                    player.gold += price;
                    //console.log(`got name ${getName(item)}`)
                    const amount = price / items[getName(shopHandler.currentItem)].sell_value // we can deduce how many they bought w/ this
                    removeItem(getName(shopHandler.currentItem), amount);
                    mainView.displayMessage(`${separator}Selling..`);
                    mainView.displayMessage("<br>Returning...");
                    shopHandler.sellLoop();
                } else {
                    mainView.displayMessage(`${separator}Not enough of the item in the inventory!`);
                    shopHandler.sellLoop();
                }
            }
        } else {
            mainView.displayMessage("<br>Returning..");
            if (shopHandler.mode == "buy") {
                shopHandler.shopLoop();
            } else {
                shopHandler.sellLoop();
            }

        }

        updateDisplay(gameData.data.player);
    }


}
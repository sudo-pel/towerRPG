import * as mainView from '../views/mainView';
import *  as gameData from './data';
import { itemsDirectory } from '../../directories/items/items';

/* ITEM TEMPLATE
{
            name: "pendant",
            type: "misc",
            speed: 10,
            elemental: {
                offence: {
                },
                defence: {
                }
            }
        }
*/

/* REAGENT TEMPLATE
    slime_ball: {
        name: "Slime Ball",
        type: "reagent",
        desc: "A ball of green slime. Although it has shape, it is easy to press into. Has a peculiar texture.",
}
*/

export const items = itemsDirectory;



export const addItem = (thing, min = 1, max = 1) => {
    const item = {...items[thing]}; // get the item from the item directory (copying it just incase)
    const amount = Math.floor(Math.random() * (max - min + 1)) + min; // how many of the item we will add
    mainView.displayMessage(`<br>Attained ${amount} ${item.name}${amount > 1 ? 's' : ''}!`);
    var alreadyAdded = false; // so we dont already add reagents
    const player = gameData.data.player;
    if (item.type == "reagent") {
        //console.log("item is reagent")
        player.inventory.forEach(cur => {
            //console.log(cur[1]);
            //console.log(thing)
            if (cur[0] == thing) {
                cur[1] += amount
                alreadyAdded = true;
                //console.log(`item count increased ${cur[1]}`)
            }
        })
    }

    if (alreadyAdded == false) {
        if (item.type != "reagent") {
            for (var i = 1; i < amount + 1; i++) {
                gameData.data.player.inventory.push(thing); // add the item to the player's inventory
            }
        } else {
            gameData.data.player.inventory.push([thing, amount])
            //console.log(gameData.data.player.inventory);
            //console.log(item);

        }

    }
}

export const removeItem = (thing, amount) => {
    const item = items[thing];
    mainView.displayMessage(`<br>Removed ${amount} ${item.name}${amount > 1 ? 's' : ''}!`);
    var alreadyRemoved = false; // so we dont add already added reagents
    const player = gameData.data.player;
    if (item.type == "reagent") {
        //console.log("item is reagent")
        const player = gameData.data.player;
        player.inventory.forEach(cur => {
            if (cur[0] == thing) {
                cur[1] -= amount
                if (cur[1] == 0) {
                    const itemIndex = player.inventory.findIndex(cur_ => {
                        return cur_[0] == thing;
                    });
                   //console.log(itemIndex);
                    player.inventory.splice(itemIndex, 1);
                }
                alreadyRemoved = true;
                //console.log(`item count decreased ${cur[1]}`)
            }
        })
    }

    if (alreadyRemoved == false) { // item must then be an equipment already added
        for (var i = 1; i < amount + 1; i++) {
            if (player.inventory.indexOf(thing) != -1) { // so we don't delete thing in index -1
                delete player.inventory[player.inventory.indexOf(thing)] // remove item from plr inventory
                cleanInventory();
                alreadyRemoved = false;
            }
        }
    }

    cleanInventory();

    if (alreadyRemoved == false) {
        return -1;
    } else {
        return 0; // 0 = item(s) removed, -1 = no items(s) removed
    }

}  

export const displayDetails = (item, stats = true, desc = true, type = true, sell_value = true, name = false, pouch_limit = true) => {
    const statsList = ["atk", "def", "matk", "mdef", "speed", "crit_chance", "crit_damage", "effectiveness", "resistance",
    "max_stamina", "max_mana", "evasion"];
    const statsNames = ["attack", "defence", "magic attack", "magic defence", "speed", "critical chance", "critical damage",
     "effectiveness", "resistance", "max stamina", "max mana", "evasion"];
    
     if (name) {mainView.displayMessage(item.name)};
     Object.keys(item).forEach(cur => {
        const property = item[cur];
        if (type && cur == "type") { mainView.displayMessage(`Type: ${property}`)}
        if (stats && statsList.includes(cur)) {
            if (["evasion", "crit_chance", "crit_damage"].includes(cur)) {
                mainView.displayMessage(`${Math.round(property * 100)}% ${statsNames[statsList.indexOf(cur)]}`)
            }
            else {
                mainView.displayMessage(`${property} ${statsNames[statsList.indexOf(cur)]}`)
            }

        }
        if (stats && cur == "elemental") {
            Object.keys(property.offence).forEach(el => {
                mainView.displayMessage(`${property.offence[el] < 0 ? '' : '+'}${property.offence[el]} ${el} attack`)
            })
            Object.keys(property.defence).forEach(el => {
                mainView.displayMessage(`${property.defence[el] < 0 ? '' : '+'}${property.defence[el]} ${el} defence`)
            })
        }
        if (stats && cur == "use") {
            // not sure if i will put anything here, description should be sufficient
        }
        if (desc && cur == "desc") { mainView.displayMessage(`Description: ${property}`)};
        if (desc && cur == "sell_value") { mainView.displayMessage(`Sell value: ${property}`)}
        if (pouch_limit && cur == "use") { 
            if (item[cur].pouchMax != undefined) {
                mainView.displayMessage(`Pouch limit: ${property.pouchMax}`)
            }
        };
    })
}


export const isReagent = (item) => {
    // because I keep having to do this
    if (item[0].length > 1) {
        return true
    } else {
        return false
    }
}

export const getName = (item) => {
    // becacuse I keep having the do this (2)
    if (isReagent(item)) {
        return item[0]
    } else {
        return item
    }
}

export const getQuantity = (item, inventory) => {

    var counter = 0;

    if (items[item].type != "reagent") { // iterate over each item in the inventory, if its what we need, counter++
        inventory.forEach(invItem => {
            if (invItem == item) {
                counter++;
            }
        }) 
    } else {
        inventory.forEach(invItem => { // will only find the item once (if it is there) and will get how many of the item there are
            if (invItem[0] == item) {
                counter = invItem[1];
            }
        })
    }

    //console.log(`searched for ${item} and found ${counter}`)

    return counter;
}

export const getItemIdentfierByName = (name) => {
    
    const keys = Object.keys(items);
    for (var i = 0; i < keys.length; i++) {
        if (items[keys[i]].name == name) {
            return keys[i]
        }
    }
    return false;

}

export const cleanInventory = () => {
   //console.log("clean inv called")
   //console.log(gameData.data.player.inventory)
    const player = gameData.data.player;
    for (var i = 0; i < player.inventory.length; i++) { // for loop needed since map/forEach skip empty objects
        if (player.inventory[i] == undefined || player.inventory[i] == null) { // if a certain index in inventory has value undefined...
            player.inventory.splice(i, 1 ); // destroy it since otherwise it messes stuff up. yare yare
        }
    }
}
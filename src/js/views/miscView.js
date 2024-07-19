import { elements } from './baseView';
import { items } from '../models/items';
import { equipMenu } from '../models/equipMode';
import { exp_requirements } from '../models/data';
import { generateMiniMap } from '../models/rooms';

export const updatePlayerStats = player => {

   //console.log("update player stats called");

    elements.minimap.style.visibility = "hidden";
    elements.miscView.style.visibility = "visible";

    var equipped_items = "";
    const equips = player.stats.equips;

    Object.keys(player.stats.equips).forEach(equip => {
        const item = equips[equip];
        const itemDetails = {...items[item]};
        var hasElement = false;
        equipped_items += `${equip.toUpperCase()}: ` // SWORD:
        if (itemDetails.name != undefined) { // this will return true if the item exists
            equipped_items += `${itemDetails.name}<br>` // SWORD: Greatsword
            delete itemDetails.name;
    
            var elemental_string = "";
            // have to do elements first so we can remove it and then iterate over every property of the item w/o issue
            if (itemDetails.hasOwnProperty('elemental')) { // if the object has elemental components...
                //var elemental_string = "Elemental offence:<br>";
                Object.keys(itemDetails.elemental.offence).forEach(cur => { // even if an object has just offence/defence we will do both since this is less clunky
                    elemental_string += `${cur} attack: ${itemDetails.elemental.offence[cur]}<br>` // fire: 20
                })
                //elemental_string += "Elemental defence:<br>";
                Object.keys(itemDetails.elemental.defence).forEach(cur => {
                    elemental_string += `${cur} defence: ${itemDetails.elemental.defence[cur]}<br>` // fire: 20
                })
                delete itemDetails.elemental; // remove it so it isnt included when we iterate over all other properties
                hasElement = true; // so we know to add the elemental string to the main one
            };
    
            Object.keys(itemDetails).forEach(cur => {
                if (cur != 'desc' && cur != 'sell_value' && cur != 'description') { // dont want to display this
                    equipped_items += `${cur}: ${itemDetails[cur]}<br>`; // iterate over properties like atk, ... and add them
                }
                
            })
    
            if (hasElement == true) { equipped_items += elemental_string};
        } else {
            // do nothing lol [if there is no item equipped as getting the name will return undefined]
        }


        equipped_items += "<br>";
    })
    
    const markupLeft = `
    Level: ${player.level}<br>
    EXP: ${player.exp}/${exp_requirements[player.level]}<br>
    Gold: ${player.gold}<br>
    SP: ${player.sp}<br>
    AP: ${player.ap}<br><br>
    
    <b>Equipped items</b><br>
    ${equipped_items}


    `; // Level, exp and gold should all be self-explanatory. See above function for equipped items, its an array with <br>

    var inventory_string;

    if (player.inventory.length > 0) {
        inventory_string = Object.keys(player.inventory).map((cur, index) => {
            //console.log(`index is ${index}, currentindex is ${equipMenu.currentIndex}`)
    
            const openNotation = (index == equipMenu.currentIndex ? '<b>' : '');
            const closeNotation = (index == equipMenu.currentIndex ? '</b>' : '');
            if (player.inventory[cur][1].length < 2) {
                return (`${openNotation}${items[player.inventory[cur]].name}${closeNotation}`)
            } else {
                return (`${openNotation}${player.inventory[cur][1]} ${items[player.inventory[cur][0]].name}${closeNotation}`)
            }
        });
    } else {
        inventory_string = [];
    }

   //console.log(`INV STRING IS ${inventory_string}`)

    const markupRight = `
    <b>Inventory</b><br>
    ${inventory_string.join('<br>')}`

    elements.playerStats.innerHTML = markupLeft;
    elements.inventory.innerHTML = markupRight;
}

export const updateMiniMap = (map, zone, playerCoordinates = [999, 999]) => {

   //console.log("update mini map called");

    const mapString = generateMiniMap(map, zone, playerCoordinates);
    elements.miscView.style.visibility = "hidden";
    elements.minimap.style.visibility = "visible";
    elements.minimap.innerHTML = mapString;
}

// sword: iphone
// atk: 55
// matk: 100
// def: ...
// OFFENSIVE ELEMENTS:
// fire: ...
// DEFENSIVE ELEMENTS:
// fire: ...
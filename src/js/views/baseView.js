//import * as miscView from './miscView';
//import * as statView from './statView';
//import { Combat } from '../models/combat';
//import { items } from '../models/items';
import * as gameData from '../models/data';
import { mainLoop } from '..';


export const elements = {
    mainBox: document.querySelector('.main'),
    main: document.querySelector('.mainText'),
    input: document.querySelector('.main-input'),
    form: document.querySelector('.form-input'),
    mainStats: document.querySelector('#mainstats'),
    elementalStats: document.querySelector('#elemstats'),
    playerStats: document.querySelector('#playerstats'),
    inventory: document.querySelector('#inventory'),
    minimap: document.querySelector('#minimapview'),
    miscView: document.querySelector('#miscview'),
};

export const presetMenuOptions = { // for input shortcut
    statMenu: ['skills', 'sp', 'back'],
    settingsHelp: ['gamestart', 'explore', 'shop' ,'equip', 'stats', 'crafting', 'settings', 'combat', 'combat-complex','back'],
    settingsMain: ['message delay', 'change shortcut', 'toggle sticky shortcut', "test message",'toggle scroll', 'save', 'toggle auto save', 'see music credits', 'back'],
    allocateSP: ['health', 'mana', 'atk', 'def', 'matk', 'mdef', 'speed', 'back']
};


export const elementColours = {
    none: "#FFFFFF",
    physical: "#737373",
    fire: "#FF2D00",
    water: "#000FFF",
    earth: "#7F2C00",
    thunder: "#DAAB00",
    dark: "#2A003D",
    light: "#E8CC3E",
    wind: "#8BF020"
    
};

export const separator = `<br> --------------------------------<br><br>`;

export const presetMessageDelays = {
    battle: {
        slow: 0.8,
        medium: 0.6,
        fast: 0.4,
    },

    outside: {
        slow: 0.8,
        medium: 0.6,
        fast: 0.4,
    }
};

export const keysToCode = {
    Rshift: "ShiftRight",
    Lshift: "ShiftLeft",
    Lctrl: "ControlLeft",
    Rctrl: "ControlRight",
    Altleft: "AltLeft",
    Altright: "AltRight",
    "¬": "Backquote"
    // need to find a way to represent the key that makes this '¬' symbol
}

export const tutorialMessages = {
    gameIntroPartOne: [
        `<br><b>IMPORTANT!!! This game is currently undergoing testing. Please join the discord noted later or message the creator (iuc#1105) if you have any feedback or questions.</b>`,
        `<b>Please do not play this game on mobile.</b>`,
        `<br>(There is currently an issue with the looping of some music tracks. I don't currently have a solution for this but will update if I find one, sorry about this)`,
        `<br><b>You may want to make use of <u>Super Commands</u> to enhance your experience. They can do things like resize the text, change the music volume and more.` +
        ` To see how, use the help module by inputting 'help' or 'sc-help'.</b>`,
        `${separator}Welcome to Tower RPG (TRPG!) This is an entirely text-based game focused around combat.`,
        `<br>The game is centered around Floors. The goal of the game is to defeat the boss of each floor in order to advance to the next.` +
        ` To do so, you will find yourself exploring, fighting and getting stronger on each floor.`,
        `<br>If you enjoy the game or are interested in its progress, please join the discord: <b>https://discord.com/invite/w73Z44z</b>. (see at any time by inputting 'sc-discord')` +
        ` It's where I will post updates regarding the game, ask for help testing it, where you can talk with others about it and do various other things.`,
        `<br>Anyways, I hope you enjoy Tower RPG!`
    ],

    gameIntroPartTwo: [
    `${separator}There is a tutorial for this game that will teach you the basics.`,
    `<br>If you haven't played this game before, it is <b>STRONGLY RECOMMENEDED</b> that you play through the tutorial.` +
    ` It is a short series of events wherein you follow somebody from TRPG history. Gold, EXP, etc.` +
    ` obtained in the tutorial will not carry over to your account, but you will receive a small reward when you complete the tutorial.`,
    `<br>Also, because of the nature of the tutorial, it cannot be replayed or played after starting the game without resetting` +
    ` your data. Please take this into consideration.`,
    `<br>Would you like to play through the tutorial?`,
    `<br> - yes`,
    ` - no`
    ],

    inventory_1: [`${separator}Here, you can equip and unequip items. The instructions should explain most things.`,
    `<br>While you're here, I'll briefly explain about the pouch.`,
    `<br>While exploring, you can use items like health potions and mana potions to keep yourself alive. But your` +
    ` inventory is inaccessible during combat.`,
    `<br>To use items during battle, you need to move them from your inventory to your <b>pouch</b>. Items in your pouch can` +
    ` be used in combat (at the cost of an action) by inputting 'p' or 'pouch' during battle.`,
    `<br>Your pouch can hold up to 3 different items, and different items have different 'Pouch Limits'. For example,` +
    ` you can have up to 5 Health Potions in your pouch, but no more than 3 Stamina Vials.`,
    `<br>Equip the Wooden Sword you should have crafted, then add the Health Potion you should've crafted to your pouch.` +
    ` Then, proceed to the north.`],

    stats_1: [`${separator}Here, you can equip and unequip skills, and also allocate and reset your SP` +
    ` (stat points, not the SP used in battle!)`,
    `<br>You can also allocate and reset Stat Points which you earn upon levelling up to increase specific stats further.` +
    ` But this is simple enough, so I'll let you figure it out on your own.`,
    `<br>If you get confused or lost, just use the Help Module (input 'help' or 'sc-help)`],

    crafting_1: [`${separator}Welcome to the crafing menu! Here, you can use items you own (along with gold, usually)` +
    ` to craft items.`,
    `<br>There isn't much to be said here. Just know that each floor has it's own set of recipes, but you also have` +
    ` "personal recipes", which you can use wherever you are. These have to be unlocked, though, so you won't have any` +
    ` right now.`,
    `<br>Once you've crafted the Health Potion and Wooden Sword, navigate to the inventory, where you'll learn how to ` +
    `equip them.`],

    battle_1: [`${separator}Your first battle! Don't panic, this should be an easy ride. Just remember the` +
    ` following things:`,
    `<br><u>You will probably find it very helpful to use Input Shortcut when battling.</u>`,
    `<br><b>Skills</b> will display all the skills you have access to and their effects. You will always be able to attack and guard.`,
    `<br><b>Status</b> will display all buffs and debuffs applied to your character, and <b>Enemy</b> will do the same` +
    ` for your opponent.`,
    `<br><b>Flee</b> will end a fight immediately, but it will be your loss and you will return to the main menu. Don't be` +
    ` a pussy!`,
    `<br>Don't worry if there are some things that you don't understand, more will be explained throughout the tutorial. ` +
    `But if you ever do need help, you can open the help module by inputting 'sc-help' or 'help'. Now show this slime who's boss!`],
    
    battle_2: [`${separator}OK! You should've gotten the hang of it by now, so I won't keep you for too long.`,
    `<br>Just note your "actions" that will be noted when you start the fight. As you might expect, they are consumed in using items` +
    ` and skills. Once you run out of them, your turn will end.`,
    `<br>You often will only have one action, but you can gain more using skills - like the 'Boost' skill. For now, you can` +
    ` 'Guard' to gain SP, and then 'Boost' on subsequent turns to deal a burst of high damage!`,
    `<br>One more thing-- your 'Speed' stat can help you gain extra actions. If your speed is twice your opponent's or more,` +
    ` you will start the turn with two actions, instead of one.`,
    `<br>Use the 'Check' skill to see the opponent's stats. There'll be a lot of info, but for now, just focus on the` +
    ` <b>speed</b> stat of the enemy and any <b>observations</b> you can make. You might be able to find something that` +
    ` will give you a massive advantage in this fight..`,
    `<br>Finally, turn your atttention to your <b>Stamina</b>, <b>Mana</b> and <b>SP</b>.`,
    `<br>They are all resources for using skills, but all function a little differently:`,
    `<br><b>Mana</b> doesn't regenerate at all. <b>Stamina</b> does regenerate (1/10 at the end of each of your turns).` +
    ` <b>SP</b> (Special Points) don't regenerate, and unlike the other two, which refill whenever you're healed, you always start a fight with` +
    ` 0 SP.`],

    battle_3: [`${separator}It looks like you're in a hurry this time, so I won't keep you for long. There are just a few more` +
    ` things you need to know.`,
    `<br>You'll notice the two stats <b>effectiveness</b> and <b>resistance</b> that you have. They're used for resisting and` +
    ` applying debuffs.`,
    `<br>When someone tries to apply a debuff on you, the percentage chance of that happening is <u>reduced</u> by your` +
    ` <u>resistance</u>, and <u>increased</u> by their effectiveness. This goes both ways, of course.`,
    `<br>So if a debuff has a 50% chance of applying and you have 50 resistance and they have 0 effectiveness, you will` +
    ` always <u>Resist</u> the debuff. But if they have 50 effectiveness and you have 0 resistance, the debuff will always` +
    ` be applied.`,
    `<br>100 resistance at this level is enough to easily resist almost all debuffs. Keep that in mind!`,
    `<br>By the way, you should now have a 'tp stone' in your inventory. You can use this while you're exploring (not in the main menu) to return to this spot. Don't worry about having to navigate here again if you are defeated.`,
    `<br>If you get stuck, try looking around for items or crafting more health potions to use in battle.`,
    `<br>I hope you have some pouch items at the ready. Save Lucia no matter what!`],

    battle_4: [
    `<br>${separator}We're almost there! I'll just ask you to turn your attention to your <b>Elemental Stats.</b>.`,
    `<br>Elemental offence is a percentage applied to damage dealt of that element. Elemental defence is a percentage applied` +
    ` to damage taken of that element.`,
    `<br>So if you have 200 fire offence, your fire attacks will deal 2x (200%) damage. If you have 200 fire defence, fire` +
    ` attacks aimed at you will deal 2x (200%) damage. The most straightforward way to alter these is with equippable items.`,    
    `<br>You've now learned the basics of TRPG. Congratulations, and thanks for playing the tutorial!`,
    `<br>What is coming up now is a fight against a fearsome foe. If you'd like to stop here, you will notice that the` +
    ` "ascend" option will be unlocked in the main menu; this is usually used to fight the floor boss, but in this case,` +
    ` it'll just end the demo.`,
    `<br>But if you want to prove yourself and see Lore and Lucia's story through to the end, you'll have to beat this boss!`,
    `<br>Be aware though, you might not beat it first try. Or second...`,
    `<br>I invite you to see what you can do! You can 'ascend' whenever you're ready. Good luck!`],

    tutorial_end: [`${separator}Congratulations on clearing the tutorial!`,
    `<br>There isn't much for me to tell you now. You will find that in your adventures, you will have a lot less guidance. But I believe in you!`,
    `<br>One thing you won't have seen in this tutorial is the 'shop' function; in the main menu, you can access a shop selling certain items.` +
    ` The shop is different for each floor.`,
    `<br>You will probably find things that will be incredibly useful for your adventures there, so be sure to check it out!`,
    `<br>I hope you enjoy tower RPG! I'll give you a little reward for cleaing the demo, and another small reward if you reached the true ending.`,
    `<br>This page will now refresh...`]

}

export const musicCredits = [
    'Main menu theme - Brave Frontier OST - Main Menu',
    'Forest theme - "RPG Maker Music - (FOREST) - On A Quest For Mushrooms" (https://www.youtube.com/watch?v=Et57WaDFlKk)',
    'Battle theme 1 - RPG Maker MV - Battle 1',
    '"Intimidating enemy" theme - Xenoblade Chronicles Definitive Edition - An Obstacle in Our Path',
    '"Mechanical Rhythm" - Xenoblade Chronicles Definitive Edition - Mechanical Rhythm',
    '"Creator" - Brave Frontier OST - Creator'
]

export const inputSeparator = "<br>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

export const resizeText = (type, size) => {
    switch (type) {
        case "main":
            elements.main.style.fontSize = size;
            break;

        case "stat":
            elements.mainStats.style.fontSize = size;
            elements.elementalStats.style.fontSize = size;
            break;

        case "misc":
            elements.miscView.style.fontSize = size;
            break;

        default:
            console.log("invalid input for resizing text");

    }
}
// -- IMPORTS -- \\
/*
import * as mainView from '../../js/views/mainView';
import { settings } from '../../js/models/data'; // need messageDelay
import { Combat } from '../../js/models/combat'; // only need endturn and getequips
import * as gameData from '../../js/models/data';
import { enemies } from '../../js/models/enemies';
import { addItem } from '../../js/models/items';
import { mainLoop } from '../../js/index';
import { equipMode } from '../../js/models/equipMode';
import { initNpc } from '../../js/models/npc';
import { updateDisplay } from '../../js/models/baseModel';
import { initStats } from '../../js/models/learnSkills';
import { initSettings } from '../../js/models/settings';
import { initCrafting } from '../../js/models/crafting';
import { separator, tutorialMessages } from '../../js/views/baseView';
import { baseOptions } from '../../js/models/rooms';
*/
// ----------- \\

// -- ROOM TEMPLATE -- \\
/*
room_name: {
    entrance: "",
    
    extraOptions: [],

    explores: [[]],
    encounters: [[]],
    finds: [[]],
    ambushes: [],
    interacts: [],

    left: "",
    right: "",
    south: "",
    north: ""

},
*/
// ------------- \\

    // ------------------ USEFUL STUFF ------------------- \\
const standardForest = {
    explores: [["encounter", 60], ["find", 40]], // chances of different events
    encounters: [["slime", 25, { levelCap: 5 }],
                ["lesser_teravalum", 25, { levelCap: 6 }],
                ["brown_bear", 25, { levelCap: 7 }],
                ["grey_wolf", 25, { levelCap: 7 }]], // possible enemy encounters
    finds: [
            ["wood", 17, 1, 3],
            ["slime_ball", 14, 1, 3],
            ["brown_fur", 14, 1, 3],
            ["weak_vine", 14, 1, 3],
            ["grey_wolf_pelt", 14, 1, 3],
            ["hempweed_ligament", 11, 1, 2],
            ["sharp_claw", 11, 1, 2],
            ["damaged_dagger", 1, 1, 1],
            ["damaged_helm", 1, 1, 1],
            ["damaged_pantaloons", 1, 1, 1],
            ["damaged_armour", 1, 1, 1],
            ["damaged_sword", 1, 1, 1]], // possible items one can find
    ambushes:[["slime", 5, { levelCap: 5 }],
    ["lesser_teravalum", 5, { levelCap: 6 }],
    ["brown_bear", 5, { levelCap: 7 }],
    ["grey_wolf", 5, { levelCap: 7 }]], //[["slime", 30], ["lesser_teravalum", 30]],
    interacts: [],
    onEnter: []
}

const standardDeepForest = {
    explores: [["encounter", 65], ["find", 35]], // chances of different events
    encounters: [["young_venomous_wolf", 35, { levelCap: 16 }],
                ["lesser_forest_scourge", 30, { levelCap: 18 }],
                ["mobile_lesser_ent", 25, { levelCap: 20 }]], // possible enemy encounters
    finds: [
        ["forest_scourge_scale", 27, 1, 3],
        ["sharp_claw", 27, 2, 3],
        ["venomous_claw", 17, 1, 3],
        ["grey_wolf_pelt", 17, 2, 5],
        ["magic_bark", 10, 1, 3],
        ["sharpened_sword", 2, 1, 1]
    ],
    ambushes:[["grey_wolf", 10, { changeLevel: 9, levelCap: 15 }],
    ["brown_bear", 10, { changeLevel: 10, levelCap: 10 }],
    ["young_venomous_wolf", 10, { levelCap: 16 }],
    ["lesser_forest_scourge", 10, { levelCap: 18 }]], //[["slime", 30], ["lesser_teravalum", 30]],
    interacts: [],
    onEnter: []
}

const standardRiver = {
    explores: [["encounter", 70], ["find", 30]],
    encounters: [["greater_slime", 40, true, false, false],
    ["lesser_water_klastera", 30, true, false, false], ["young_water_lizard", 30, true, false, false]],
    finds: [["slime_ball", 40, 2, 5],
            ["weak_membrane", 20, 1, 2],
            ["tiny_lizard_tail", 20, 1, 1],
            ["aquus_cluster", 17, 1, 2],
            ["water_orb", 3, 1, 1]],
    ambushes: [],
    interacts: [],
    onEnter: []
}

const standardDarkforest = {
    explores: [["encounter", 70], ["find", 30]],
    encounters: [["red_slime", 35, true, false, false],
    ["venomous_wolf", 30, true, false, false],
    ["grey_wolf", 25, 16, false, false],
    ["dark_beast", 10, true, false, false]],
    finds: [["red_slime_ball", 40, 3, 4],
            ["grey_wolf_pelt", 30, 2, 4],
            ["sharp_claw", 20, 1, 1],
            ["shadow_pelt", 10, 2, 3]],
    ambushes: [],
    interacts: [],
    onEnter: []
}

const standardSettlement = {
    explores: [["find", 100]],
    encounters: [],
    finds: [["trash", 100, 1, 1]],
    ambushes: [[]],
    interacts: [[]],
    onEnter: []
}
// -------------------------------------------------- \\
// ROOMS

export const floor1 = {

    name: "floor1",

    //start: [10,8], // these are [y,x] coordinates

    // n - nothing
    // s- settlement
    // f - forest
    // i - deep forest
    // r - river
    // q - dark forest
    zone: [
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "r", "r", "r", "r", "r", "r", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "r", "r", "r", "r", "r", "r", "r", "n", "n", "n", "n", "n"], 
            ["n", "z", "z", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "r", "r", "r", "r", "r", "r", "r", "n", "n", "n", "n", "n"], 
            ["n", "z", "z", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "r", "r", "r", "r", "r", "n", "n", "n", "n", "n"], 
            ["n", "z", "z1", "f", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "d", "d", "n", "n", "d", "d", "d20", "n", "n", "n", "n", "d", "n", "r", "r", "r", "r", "n", "n", "n", "n", "n"], 
            ["n", "n", "f", "f", "f", "n", "n", "d", "d", "d", "d19", "n", "n", "n", "n", "n", "d", "d", "d6", "n", "n", "d", "n", "d", "d", "n", "d", "d", "d", "d", "n", "r", "r", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "f", "d", "d", "n", "d", "n", "n", "d", "n", "d", "d", "d", "d", "d", "n", "d", "d", "d", "d1", "n", "n", "d", "n", "d", "n", "n", "d", "n", "r", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "d", "n", "n", "d", "n", "d20", "d", "d", "d22", "n", "n", "d", "n", "n", "d", "n", "n", "d", "d", "n", "d", "d", "d", "d", "n", "d", "d", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "d", "n", "d21", "d", "n", "n", "n", "n", "d", "n", "n", "d", "n", "n", "d7", "n", "f", "f", "f", "n", "n", "n", "n", "f31", "n", "d", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "d", "n", "d", "n", "n", "n", "n", "f7", "f", "f", "f40", "d19", "n", "n", "n", "n", "f11", "n", "f", "n", "f", "f", "f", "f", "d", "d", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "d", "d", "d", "d", "n", "n", "n", "n", "f", "n", "f", "f", "f", "f", "f", "n", "n", "n", "f", "n", "f", "n", "n", "n", "n", "d", "n", "d9", "d", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "d", "n", "n", "d", "f29", "f", "f", "f", "f", "n", "f", "n", "f10", "n", "f", "f", "f44", "f", "f", "f45", "f", "n", "n", "n", "n", "d", "n", "n", "d", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "d12", "d", "d", "d", "n", "f", "n", "n", "n", "f8", "n", "f9", "n", "n", "n", "f", "n", "n", "n", "n", "n", "f", "f", "f12", "n", "d", "d", "d", "n", "d", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "d", "n", "n", "d", "n", "f", "n", "n", "n", "n", "n", "n", "n", "n", "n", "f", "n", "f", "f", "f", "n", "f13", "n", "n", "n", "d15", "n", "d", "n", "d", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "d", "n", "n", "d", "n", "f", "n", "f4", "n", "n", "f45", "f", "f", "f", "f", "f", "f", "f", "n", "f", "n", "n", "n", "n", "n", "d", "n", "d16", "d", "d25", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "d", "d", "d", "d", "d", "f46", "n", "f", "f", "f", "f", "n", "n", "n", "f", "n", "n", "f", "n", "f27", "f", "f", "n", "n", "n", "d", "n", "d", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "d4", "n", "n", "f", "n", "n", "n", "n", "f41", "n", "n", "n", "n", "n", "f99", "f98", "n", "n", "n", "f", "n", "f14", "f", "d", "d", "d", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "d5", "d", "d", "d", "d", "f28", "f", "f", "f6", "n", "f", "n", "f", "f", "f1", "n", "f97", "f96", "n", "n", "n", "f43", "n", "n", "f", "n", "d", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "d", "n", "n", "n", "n", "f", "n", "f", "n", "n", "f", "n", "f", "n", "s", "n", "n", "n", "n", "f", "f", "f", "f15", "n", "f", "n", "d", "n", "d11", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "d", "n", "n", "n", "n", "f", "n", "f45", "n", "f5", "f", "f", "f26", "n", "f2", "n", "f", "f3", "n", "f", "n", "n", "n", "n", "f46", "d", "d", "d", "d", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "d27", "n", "n", "d", "d", "f", "n", "f", "n", "n", "n", "n", "f", "f", "f", "f", "f", "n", "n", "f", "n", "f26", "f", "f", "f", "d", "d19", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "h1", "h", "d19", "d", "d", "n", "n", "n", "f", "n", "n", "n", "n", "n", "f", "n", "n", "f", "n", "n", "f", "n", "f", "n", "n", "n", "d", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "d", "n", "n", "f", "f", "f", "f", "f", "n", "n", "f", "n", "n", "f", "n", "f16", "f", "f45", "f", "f25", "n", "n", "d", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "d19", "n", "n", "f46", "n", "n", "n", "f30", "n", "n", "f", "f", "f", "f35", "n", "n", "f", "n", "n", "f", "n", "n", "d", "d", "d", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "d", "n", "n", "f", "n", "f", "f", "f", "f", "f", "f", "n", "n", "f", "n", "n", "f", "n", "n", "f", "n", "n", "n", "n", "d3", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "d", "d", "d", "f", "f", "n", "f38", "n", "n", "n", "n", "f23", "n", "n", "f", "f", "f", "f", "f17", "n", "f", "n", "n", "n", "n", "d", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "d2", "n", "n", "n", "f24", "n", "f", "n", "n", "n", "n", "n", "n", "n", "f42", "n", "n", "n", "n", "n", "f", "n", "n", "d17", "d", "d", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "d", "n", "n", "n", "n", "n", "f", "f", "f", "f45", "f", "f", "f20", "n", "f", "n", "f18", "f", "f", "f", "f", "n", "n", "n", "n", "d", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "d", "n", "n", "n", "f33", "f", "f", "n", "f22", "n", "n", "f", "n", "n", "f", "n", "n", "f", "n", "n", "f37", "f", "f32", "d", "d", "d20", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "d", "d", "d", "d", "d", "f", "d", "n", "n", "n", "n", "f21", "n", "f", "f", "n", "n", "f19", "n", "n", "d", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "d", "n", "n", "n", "d", "n", "n", "n", "n", "n", "n", "f34", "n", "n", "n", "n", "d", "n", "d", "n", "n", "q", "q", "q", "q", "q", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "d", "d14", "n", "n", "d24", "d", "d", "d", "d", "d", "d", "d", "n", "n", "n", "n", "d", "d", "d", "n", "q", "n", "q", "n", "n", "q", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "d18", "d", "d", "d", "d", "n", "n", "n", "n", "d", "n", "d", "n", "n", "n", "n", "n", "d", "n", "n", "q", "q", "q", "q", "n", "q", "n", "q", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "d8", "d", "d", "d", "n", "d", "d28", "d", "d", "d", "d", "d23", "n", "q", "q", "n", "n", "q", "q", "q", "n", "q", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "d13", "n", "n", "n", "n", "n", "d", "n", "n", "q", "q", "q", "q", "n", "q", "n", "q", "n", "q", "n", "q", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "d10", "n", "q", "q", "n", "q", "n", "n", "q", "n", "q", "q", "q", "n", "q", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "q", "n", "q", "q", "n", "q", "n", "n", "n", "q", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "q", "q", "q", "n", "n", "n", "n", "q", "n", "n", "n", "q", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "q", "n", "q", "q", "q", "q", "q", "q", "q", "q", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "q", "n", "q", "n", "n", "q", "n", "n", "n", "q", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "q", "n", "q", "n", "n", "q", "n", "n", "n", "q", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "q", "q", "q", "q", "q", "q", "q", "q", "q", "q", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"]
    ],

    // ---------------------------------- FOREST ------------------------------------ \\
    // ----- ------ -------- \\
    // notes: little girl, rude kid, lost teenager, simple sword, damaged helm
    s: {
        entrance: "Green grass unfolds like a blanket in all directions. As far as can be seen, the view is fairly" +
        " unchanging - vibrant leafage darkened by a lack of light caused by the sheltering of arborous towers above." +
        " Medum-sized bushes and thickets prevent a clear view in any particular direction, however to the north-east," +
        " some very faint echoes of water splashing can be heard.",
        colour: "#0b6d00",

        extraOptions: [["Approach person being attacked by slime", ["flag: -f1_spoken_to_tutorial_man"]]],
        music: "forest",
    
        explores: standardForest.explores,
        encounters: standardForest.encounters,
        finds: standardForest.finds,
        ambushes: [],
        interacts: [["f1_tutorial_man", ["flag: -f1_spoken_to_tutorial_man"]]],
        onEnter: []
    },

    f: {
        entrance: "The forest remains unchanging for a large distance. It is easy to travel if one avoids the occasional" +
        " bushy path.",
        colour: "#0b6d00",

        extraOptions: [],
        music: "forest",
        
        explores: standardForest.explores,
        encounters: standardForest.encounters,
        finds: standardForest.finds,
        ambushes: standardForest.ambushes,
        interacts: standardForest.interacts,
        onEnter: standardForest.onEnter,

        specialRooms: {
            1: {
                extraOptions: [["Speak to little girl", []]],
                interacts: [["f1_little_girl", []]],
            },
            2: {
                extraOptions: [["Speak to rude-looking kid", ["flag: -f1_spoken_to_rude_kid"]]],
                interacts: [["f1_rude_kid", ["flag: -f1_spoken_to_rude_kid"]]],
            },
            3: {
                extraOptions: [["Speak to lost looking teenager", ["flag: -f1_spoken_to_lost_teenager"]]],
                interacts: [["f1_lost_teenager", ["flag: -f1_spoken_to_lost_teenager"]]],
            },
            4: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_simple_sword"]]],
                interacts: [["f1_simple_sword_on_floor", ["flag: -f1_picked_up_simple_sword"]]],
            },
            5: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_damaged_helm"]]],
                interacts: [["f1_damaged_helm_on_floor", ["flag: -f1_picked_up_damaged_helm"]]],
            },
            6: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_metal_stave"]]],
                interacts: [["f1_metal_stave_on_floor", ["flag: -f1_picked_up_metal_stave"]]],
            },
            7: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_silver_axe"]]],
                interacts: [["f1_silver_axe_on_floor", ["flag: -f1_picked_up_silver_axe"]]],
            },
            8: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_simple_dagger"]]],
                interacts: [["f1_simple_dagger_on_floor", ["flag: -f1_picked_up_simple_dagger"]]],
            },
            9: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_pickaxe"]]],
                interacts: [["f1_pickaxe_on_floor", ["flag: -f1_picked_up_pickaxe"]]],
            },
            10: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_brown_pelt"]]],
                interacts: [["f1_brown_pelt_on_floor", ["flag: -f1_picked_up_brown_pelt"]]],
            },
            11: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_silver_helm"]]],
                interacts: [["f1_silver_helm_on_floor", ["flag: -f1_picked_up_silver_helm"]]],
            },
            12: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_venomous_claw"]]],
                interacts: [["f1_venomous_claw_on_floor", ["flag: -f1_picked_up_venomous_claw"]]],
            },
            13: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_vine_helmet"]]],
                interacts: [["f1_vine_helmet_on_floor", ["flag: -f1_picked_up_vine_helmet"]]],
            },
            14: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_ninja_headcloak"]]],
                interacts: [["f1_ninja_headcloak_on_floor", ["flag: -f1_picked_up_ninja_headcloak"]]],
            },
            15: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_makeshift_steel_armour"]]],
                interacts: [["f1_makeshift_steel_armour_on_floor", ["flag: -f1_picked_up_makeshift_steel_armour"]]],
            },
            16: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_earthen_shield_potion"]]],
                interacts: [["f1_earthen_shield_potion_on_floor", ["flag: -f1_picked_up_earthen_shield_potion"]]],
            },
            17: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_vine_pantaloons"]]],
                interacts: [["f1_vine_pantaloons_on_floor", ["flag: -f1_picked_up_vine_pantaloons"]]],
            },
            18: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_silver_legwear"]]],
                interacts: [["f1_silver_legwear_on_floor", ["flag: -f1_picked_up_silver_legwear"]]],
            },
            19: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_slime_ball"]]],
                interacts: [["f1_slime_ball_on_floor", ["flag: -f1_picked_up_slime_ball"]]],
            },
            20: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_weak_vine"]]],
                interacts: [["f1_weak_vine_on_floor", ["flag: -f1_picked_up_weak_vine"]]],
            },
            21: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_hempweed_ligament"]]],
                interacts: [["f1_hempweed_ligament_on_floor", ["flag: -f1_picked_up_hempweed_ligament"]]],
            },
            22: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_wood"]]],
                interacts: [["f1_wood_on_floor", ["flag: -f1_picked_up_wood"]]],
            },
            23: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_steel"]]],
                interacts: [["f1_steel_on_floor", ["flag: -f1_picked_up_steel"]]],
            },
            24: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_health_potion"]]],
                interacts: [["f1_health_potion_on_floor", ["flag: -f1_picked_up_health_potion"]]],
            },
            25: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_greater_health_potion"]]],
                interacts: [["f1_greater_health_potion_on_floor", ["flag: -f1_picked_up_greater_health_potion"]]],
            },
            26: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_mana_potion"]]],
                interacts: [["f1_mana_potion_on_floor", ["flag: -f1_picked_up_mana_potion"]]],
            },
            27: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_greater_mana_potion"]]],
                interacts: [["f1_greater_mana_potion_on_floor", ["flag: -f1_picked_up_greater_mana_potion"]]],
            },
            28: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_crafted_health_potion"]]],
                interacts: [["f1_crafted_health_potion_on_floor", ["flag: -f1_picked_up_crafted_health_potion"]]],
            },
            29: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_forest_explorer_daggers"]]],
                interacts: [["f1_forest_explorer_daggers_on_floor", ["flag: -f1_picked_up_forest_explorer_daggers"]]],
            },
            30: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_forest_explorer_cap"]]],
                interacts: [["f1_forest_explorer_cap_on_floor", ["flag: -f1_picked_up_forest_explorer_cap"]]],
            },
            31: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_forest_explorer_armour"]]],
                interacts: [["f1_forest_explorer_armour_on_floor", ["flag: -f1_picked_up_forest_explorer_armour"]]],
            },
            32: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_forest_explorer_pants"]]],
                interacts: [["f1_forest_explorer_pants_on_floor", ["flag: -f1_picked_up_forest_explorer_pants"]]],
            },
            33: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_forest_explorer_pendant"]]],
                interacts: [["f1_forest_explorer_pendant_on_floor", ["flag: -f1_picked_up_forest_explorer_pendant"]]],
            },
            34: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_forest_explorer_charm"]]],
                interacts: [["f1_forest_explorer_charm_on_floor", ["flag: -f1_picked_up_forest_explorer_charm"]]],
            },
            35: {
                extraOptions: [["Speak to travelling hermit", ["flag: -f1_spoken_to_hermit"]]],
                interacts: [["f1_travelling_hermit", ["flag: -f1_spoken_to_hermit"]]],
            },
            36: {
                extraOptions: [["Speak to lost-looking person", ["flag: -f1_spoken_to_person_looking_for_settlement"]]],
                interacts: [["f1_person_looking_for_settlement", ["flag: -f1_spoken_to_person_looking_for_settlement"]]],
            },
            37: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_taken_crafted_sword"]]],
                interacts: [["f1_owned_crafted_sword", ["flag: -f1_taken_crafted_sword"]]],
            },
            38: {
                extraOptions: [["Speak to explorer woman", []]],
                interacts: [["f1_explorer_woman", []]],
            },
            // TBA 39 - Person who gives custom TP stone
            40: {
                extraOptions: [["Check out person in the distance", []]],
                interacts: [["f1_person_on_toilet", []]],
            },

            41: {
                extraOptions: [["Check out sign", []]],
                interacts: [["f1_forest_settlement_sign_east", []]],
            },

            42: {
                extraOptions: [["Check out sign", []]],
                interacts: [["f1_forest_settlement_sign_north", []]],
            },

            43: {
                extraOptions: [["Check out sign", []]],
                interacts: [["f1_forest_settlement_sign_west", []]],
            },

            44: {
                extraOptions: [["Check out sign", []]],
                interacts: [["f1_forest_settlement_sign_south", []]],
            },

            45: {
                extraOptions: [["Check out peculiar tree", []]],
                interacts: [["f1_lesser_treant", []]],
            },

            46: {
                extraOptions: [["Check out peculiar tree", []]],
                interacts: [["f1_treant", []]],
            },

            47: {
                extraOptions: [["Check out peculiar tree", []]],
                interacts: [["f1_lesser_ent", []]],
            },

            // forest settlement
            99: {
                desc: "Some kind of a settlement in a clearing surrounded by what almost feels like a protective barrier of" +
                " trees. Green tents and other small structures blend well into the surroundings and grant the area a camp-like" +
                ", homely feel. A few people are moving about or stationary doing their own thing in near silence.",
                extraOptions: [["Speak to alchemist lady", []]],
                interacts: [["f1_alchemist_woman", []]],
                explores: [["find", 100]],
                encounters: [],
                finds: [["trash", 100, 1, 1]],
                ambushes: [[]],
            },
            98: {
                desc: "Some kind of a settlement in a clearing surrounded by what almost feels like a protective barrier of" +
                " trees. Green tents and other small structures blend well into the surroundings and grant the area a camp-like" +
                ", homely feel. A few people are moving about or stationary doing their own thing in near silence.",
                extraOptions: [["Speak to craftsman", []]],
                interacts: [["f1_forest_craftsman", []]],
                explores: [["find", 100]],
                encounters: [],
                finds: [["trash", 100, 1, 1]],
                ambushes: [[]],
            },
            97: {
                desc: "Some kind of a settlement in a clearing surrounded by what almost feels like a protective barrier of" +
                " trees. Green tents and other small structures blend well into the surroundings and grant the area a camp-like" +
                ", homely feel. A few people are moving about or stationary doing their own thing in near silence.",
                extraOptions: [["Speak to teenage cleric", []]],
                interacts: [["f1_forest_cleric", []]],
                explores: [["find", 100]],
                encounters: [],
                finds: [["trash", 100, 1, 1]],
                ambushes: [[]],
            },
            96: {
                desc: "Some kind of a settlement in a clearing surrounded by what almost feels like a protective barrier of" +
                " trees. Green tents and other small structures blend well into the surroundings and grant the area a camp-like" +
                ", homely feel. A few people are moving about or stationary doing their own thing in near silence.",
                extraOptions: [["Speak to ninja", []]],
                interacts: [["f1_ninja_trainer", []]],
                explores: [["find", 100]],
                encounters: [],
                finds: [["trash", 100, 1, 1]],
                ambushes: [[]],
            },
            
        }
    },
    

    // ---------------------------------- DEEP FOREST ------------------------------------ \\
    // ---------------------------------- DEEP FOREST ------------------------------------ \\
    // notes: wanderer statue, alchemist lady, traveller woman, wolf area, wolf man in wolf area

    d: {
        entrance: "The grass is clearly a shade or two darker than where you began. There is still a relaxing atmosphere" +
        ", albeit more... dangerous.",
        colour: "#cc9900",
        
        extraOptions: [],
        music: "forest",

        explores: standardDeepForest.explores,
        encounters: standardDeepForest.encounters,
        finds: standardDeepForest.finds,
        ambushes: standardDeepForest.ambushes,
        interacts: standardDeepForest.interacts,
        onEnter: standardDeepForest.onEnter,

        specialRooms: {
            1: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_crafted_mana_potion_2"]]],
                interacts: [["f1_crafted_mana_potion_on_floor_2", ["flag: -f1_picked_up_crafted_mana_potion_2"]]],
            },
            2: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_greater_health_potion_2"]]],
                interacts: [["f1_greater_health_potion_on_floor_2", ["flag: -f1_picked_up_greater_health_potion_2"]]],
            },
            3: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_greater_mana_potion_2"]]],
                interacts: [["f1_greater_mana_potion_on_floor_2", ["flag: -f1_picked_up_greater_mana_potion_2"]]],
            },
            4: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_hempweed_ligament_2"]]],
                interacts: [["f1_hempweed_ligament_on_floor_2", ["flag: -f1_picked_up_hempweed_ligament_2"]]],
            },
            5: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_makeshift_steel_legwear"]]],
                interacts: [["f1_makeshift_steel_legwear_on_floor", ["flag: -f1_picked_up_makeshift_steel_legwear"]]],
            },
            6: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_runic_dagger"]]],
                interacts: [["f1_runic_dagger_on_floor", ["flag: -f1_picked_up_runic_dagger"]]],
            },
            7: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_deep_forest_explorer_scythe"]]],
                interacts: [["f1_deep_forest_explorer_scythe_on_floor", ["flag: -f1_picked_up_deep_forest_explorer_scythe"]]],
            },
            8: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_deep_forest_explorer_cap"]]],
                interacts: [["f1_deep_forest_explorer_cap_on_floor", ["flag: -f1_picked_up_deep_forest_explorer_cap"]]],
            },
            9: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_deep_forest_explorer_armour"]]],
                interacts: [["f1_deep_forest_explorer_armour_on_floor", ["flag: -f1_picked_up_deep_forest_explorer_armour"]]],
            },
            10: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_deep_forest_explorer_pants"]]],
                interacts: [["f1_deep_forest_explorer_pants_on_floor", ["flag: -f1_picked_up_deep_forest_explorer_pants"]]],
            },
            11: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_deep_forest_explorer_necklace"]]],
                interacts: [["f1_deep_forest_explorer_necklace_on_floor", ["flag: -f1_picked_up_deep_forest_explorer_necklace"]]],
            },
            12: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_deep_forest_explorer_bracelet"]]],
                interacts: [["f1_deep_forest_explorer_bracelet_on_floor", ["flag: -f1_picked_up_deep_forest_explorer_bracelet"]]],
            },
            13: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_forest_scourge_scale"]]],
                interacts: [["f1_forest_scourge_scale_on_floor", ["flag: -f1_picked_up_forest_scourge_scale"]]],
            },
            14: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_venomous_claw_2"]]],
                interacts: [["f1_venomous_claw_on_floor_2", ["flag: -f1_picked_up_venomous_claw_2"]]],
            },
            15: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_magic_bark"]]],
                interacts: [["f1_magic_bark_on_floor", ["flag: -f1_picked_up_magic_bark"]]],
            },
            16: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_sharp_claw_2"]]],
                interacts: [["f1_sharp_claw_on_floor_2", ["flag: -f1_picked_up_sharp_claw_2"]]],
            },
            17: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_ailwarder_charm"]]],
                interacts: [["f1_ailwarder_charm_on_floor", ["flag: -f1_picked_up_ailwarder_charm"]]],
            },
            18: {

                entrance: "The grass is clearly a shade or two darker than where you began. There is still a relaxing atmosphere" +
                ", albeit more... dangerous. In this area, you can feel something strange - a powerful force that beckons you.",

                extraOptions: [["Heed beckoning force", ["flag: -f1_found_guarded_earthen_manasoul"]]],
                interacts: [["f1_guarded_earthen_manasoul", ["flag: -f1_found_guarded_earthen_manasoul"]]],
            },
            19: {
                extraOptions: [["Check out peculiar tree", []]],
                interacts: [["f1_treant", []]],
            },
            20: {
                extraOptions: [["Check out peculiar tree", []]],
                interacts: [["f1_lesser_ent", []]],
            },
            21: {
                extraOptions: [["Speak to worried girl", ["flag: -f1_helped_person_looking_for_cat"]]],
                interacts: [["f1_person_looking_for_cat", ["flag: -f1_helped_person_looking_for_cat"]]],
            },
            22: {
                extraOptions: [["Interact with cat", ["flag: -f1_found_bellas_cat"]]],
                interacts: [["f1_bellas_cat", ["flag: -f1_found_bellas_cat"]]]
            },
            23: {
                extraOptions: [["Speak to strangely-clothed girl", []]],
                interacts: [["f1_chuuni", []]],
            },
            24: {
                extraOptions: [["Pick up gold on the floor", ["flag: -f1_picked_up_gold_1"]]],
                interacts: [["f1_gold_on_floor", ["flag: -f1_picked_up_gold_1"]]],
            },
            25: {
                extraOptions: [["Pick up gold on the floor", ["flag: -f1_picked_up_gold_2"]]],
                interacts: [["f1_gold_on_floor_2", ["flag: -f1_picked_up_gold_2"]]],
            },
            26: {
                extraOptions: [["Pick up gold on the floor", ["flag: -f1_picked_up_gold_3"]]],
                interacts: [["f1_gold_on_floor_3", ["flag: -f1_picked_up_gold_3"]]],
            },
            27: {
                extraOptions: [["Inspect statue", []]],
                interacts: [["f1_wanderer_statue", []]],
            },
            28: {
                extraOptions: [["Speak to merchant", []]],
                interacts: [["f1_forest_merchant", []]],
            }
            
        }
    },

    // ---------------------------------- RIVER ------------------------------------ \\
    // ---------------------------------- RIVER ------------------------------------ \\
    // notes: hydra staff, docile slime, old man

    r: {
        entrance: "A thin river runs with numerous tributaries flowing out in all directions, such that no matter where you" +
        " go, the river seems to follow. The grass is very short compared to the forest and it is much easier to see where" +
        " you're going.",
        colour: "#0018a8",
        
        extraOptions: [],
    
        explores: standardRiver.explores,
        encounters: standardRiver.encounters,
        finds: standardRiver.finds,
        ambushes: standardRiver.ambushes,
        interacts: standardRiver.interacts,
        onEnter: standardRiver.onEnter
    },


    // ---------------------------------- DARK FOREST ------------------------------------ \\
    // ---------------------------------- DARK FOREST ------------------------------------ \\
    // notes: little boy, lost person, crown of darkness on floor

    q: {
        entrance: "The trees are taller and brimming with leaves, although their black-purple hue makes them seem as though" +
        " they are dead and rotton. The grass beneath your feet is crusty and uncomfortable to walk on. There is a dead silence" +
        " that makes even taking a step an uncomfortable endeavour as the leafage crinkles below your feet.",
        colour: "#ff9900",
        
        extraOptions: [],
    
        explores: standardDarkforest.explores,
        encounters: standardDarkforest.encounters,
        finds: standardDarkforest.finds,
        ambushes: standardDarkforest.ambushes,
        interacts: standardDarkforest.interacts,
        onEnter: standardDarkforest.onEnter,

        specialRooms: {
            1: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_crafted_mana_potion_2"]]],
                interacts: [["f1_crafted_mana_potion_on_floor_2", ["flag: -f1_picked_up_crafted_mana_potion_2"]]],
            },
            2: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_greater_health_potion_2"]]],
                interacts: [["f1_greater_health_potion_on_floor_2", ["flag: -f1_picked_up_greater_health_potion_2"]]],
            },
            3: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_greater_mana_potion_2"]]],
                interacts: [["f1_greater_mana_potion_on_floor_2", ["flag: -f1_picked_up_greater_mana_potion_2"]]],
            },
            4: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_hempweed_ligament_2"]]],
                interacts: [["f1_hempweed_ligament_on_floor_2", ["flag: -f1_picked_up_hempweed_ligament_2"]]],
            },
            5: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_makeshift_steel_legwear"]]],
                interacts: [["f1_makeshift_steel_legwear_on_floor", ["flag: -f1_picked_up_makeshift_steel_legwear"]]],
            },
            6: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_runic_dagger"]]],
                interacts: [["f1_runic_dagger_on_floor", ["flag: -f1_picked_up_runic_dagger"]]],
            },
            7: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_deep_forest_explorer_scythe"]]],
                interacts: [["f1_deep_forest_explorer_scythe_on_floor", ["flag: -f1_picked_up_deep_forest_explorer_scythe"]]],
            },
            8: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_deep_forest_explorer_cap"]]],
                interacts: [["f1_deep_forest_explorer_cap_on_floor", ["flag: -f1_picked_up_deep_forest_explorer_cap"]]],
            },
            9: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_deep_forest_explorer_armour"]]],
                interacts: [["f1_deep_forest_explorer_armour_on_floor", ["flag: -f1_picked_up_deep_forest_explorer_armour"]]],
            },
            10: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_deep_forest_explorer_pants"]]],
                interacts: [["f1_deep_forest_explorer_pants_on_floor", ["flag: -f1_picked_up_deep_forest_explorer_pants"]]],
            },
            11: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_deep_forest_explorer_necklace"]]],
                interacts: [["f1_deep_forest_explorer_necklace_on_floor", ["flag: -f1_picked_up_deep_forest_explorer_necklace"]]],
            },
            12: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_deep_forest_explorer_bracelet"]]],
                interacts: [["f1_deep_forest_explorer_bracelet_on_floor", ["flag: -f1_picked_up_deep_forest_explorer_bracelet"]]],
            },
            13: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_forest_scourge_scale"]]],
                interacts: [["f1_forest_scourge_scale_on_floor", ["flag: -f1_picked_up_forest_scourge_scale"]]],
            },
            14: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_venomous_claw_2"]]],
                interacts: [["f1_venomous_claw_on_floor_2", ["flag: -f1_picked_up_venomous_claw_2"]]],
            },
            15: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_magic_bark"]]],
                interacts: [["f1_magic_bark_on_floor", ["flag: -f1_picked_up_magic_bark"]]],
            },
            16: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_sharp_claw_2"]]],
                interacts: [["f1_sharp_claw_on_floor_2", ["flag: -f1_picked_up_sharp_claw_2"]]],
            },
            17: {
                extraOptions: [["Check out interesting item on floor", ["flag: -f1_picked_up_ailwarder_charm"]]],
                interacts: [["f1_ailwarder_charm_on_floor", ["flag: -f1_picked_up_ailwarder_charm"]]],
            },
            18: {

                entrance: "The trees are taller and brimming with leaves, although their black-purple hue makes them seem as though" +
                " they are dead and rotton. The grass beneath your feet is crusty and uncomfortable to walk on. There is a dead silence" +
                " that makes even taking a step an uncomfortable endeavour as the leafage crinkles below your feet. In this area, you can feel something strange - a powerful force that beckons you.",

                extraOptions: [["Heed beckoning force", ["flag: -f1_found_guarded_earthen_manasoul"]]],
                interacts: [["f1_guarded_earthen_manasoul", ["flag: -f1_found_guarded_earthen_manasoul"]]],
            },
            19: {

            }
        }
    },

    // ---------------------------------- ORA'S HUT ------------------------------------ \\
    // ---------------------------------- ORA'S HUT ------------------------------------ \\

    h: {
        entrance: 'There are a few torches about, and probably some kind of warding magic since you cannot see nor hear any creatures nearby. Just ahead is a small wooden hut, enterable via a single door of a lighter shade of brown. It seems unlocked.',

        colour: "#996633",
        music: "forest",
        
        extraOptions: [],
    
        explores: [],
        encounters: [],
        finds: [],
        ambushes: [],
        interacts: [],
        onEnter: [],

        specialRooms: {
            1: {
                entrance: 'Inside the hut, there is a singular room. For one room, it is fairly spacious, but it still makes for a pretty small house. The walls are made of singular logs, and join quite nicely to the similarly crafted triangular ceiling. In one corner there is a decent-sized bed designed to fit one person. Sitting at a desk reading a book is a man in clothes reminiscent of plain-looking tropical wear. The area is dimly lit, but it is still easy to see.',

                extraOptions: [["Speak to man at the desk", []]],
                interacts: [["f1_ora", []]]
            }
        }

    },

    // ---------------------------------- SETTLEMENT ------------------------------------ \\
    // ---------------------------------- SETTLEMENT ------------------------------------ \\
    // note: misc shop, craftswoman, hunter lady, worried woman, weapons shop, armour shop, casual-looking man

    z: {
        entrance:`Most of the semblance of 'forest' has been cleared out of this area. Shops line the far left and small residential buildings the far right. Between them is a very beaten-down forest path, worn in to the extent that its verdant origins are unrecognisable.`,
        colour: "#cc00ff",
        music: "forest",
        
        extraOptions: [],
    
        explores: standardSettlement.explores,
        encounters: standardSettlement.encounters,
        finds: standardSettlement.finds,
        ambushes: standardSettlement.ambushes,
        onEnter: standardSettlement.onEnter,
        interacts: [],

        specialRooms: {
            1: {
                onEnter: [['f1_thanks_for_playing', ['flag: -thanks_for_playing']]]
            }
        }
    
    },

}
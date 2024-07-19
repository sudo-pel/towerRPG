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
    const standardMeadow = {
        explores: [], // chances of different events
        encounters: [[]], // possible enemy encounters
        finds: [[]], // possible items one can find
        ambushes:[[]], //[["slime", 30], ["lesser_teravalum", 30]],
        interacts: [],
        onEnter: []
    }

    // -------------------------------------------------- \\
    // ROOMS
    
    export const floor0 = {
    
        name: "floor0",
    
        //start: [10,8], // these are [y,x] coordinates
    
        // n - nothing
        // s- settlement
        // f - forest
        // i - deep forest
        // r - river
        // q - dark forest
        zone: [
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "z2", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "z1", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "p", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "p", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "p", "n", "n", "n", "p", "p", "p", "p", "p", "p", "p9", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "p8", "p", "p", "p", "n", "n", "p", "n", "n", "n", "n", "n", "p", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "p", "n", "n", "p7", "p", "p", "p", "p", "p", "n", "n", "n", "p", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "p", "n", "n", "p", "n", "n", "n", "p", "n", "n", "n", "n", "p", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "p", "n", "n", "p", "n", "n", "n", "p", "n", "n", "p", "n", "p", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "p", "n", "n", "p3", "n", "n", "n", "n", "p", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "p6", "n", "p", "p", "p", "p", "p", "n", "p4", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "p", "n", "n", "n", "p", "n", "p", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "p", "p", "p1", "p", "p2", "p", "p", "p5", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "p", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "p", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "t4", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "t3", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "t2", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "t1", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "t", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "f", "f", "f", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "f", "s", "f", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "f", "f", "f", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"], 
            ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n", "n"]
        ],

    
        // ---------------------------------- FOREST ------------------------------------ \\
        // ----- ------ -------- \\
        // notes: little girl, rude kid, lost teenager, simple sword, damaged helm
        s: {
            entrance: "The area is a small clearing; a somewhat square area enclosed with a thick barrier of trees in all" +
            " directions except north. It is clearly very light but the overhead covering of leaves allows only a small" +
            " amount of the intense sunlight to stream through. To the north is a tall tunnel of green foliage for which no" +
            " end can be seen.",
            colour: "#0b6d00",
    
            extraOptions: [],
            music: "forest",
        
            explores: standardMeadow.explores,
            encounters: standardMeadow.encounters,
            finds: standardMeadow.finds,
            ambushes: [],
            interacts: [],
            onEnter: [["f0_intro", ["flag: -f0_done_intro"]]]
        },
    
        f: {
            entrance: "This area is part of the clearing. It's hard to understand how you got here. There's no entrance, only" +
            " a more dimly-lit tunnel formed with trees and their multitudinous branches overhead.",
            colour: "#0b6d00",
    
            extraOptions: [],
            music: "forest",
            
            explores: standardMeadow.explores,
            encounters: standardMeadow.encounters,
            finds: standardMeadow.finds,
            ambushes: standardMeadow.ambushes,
            interacts: standardMeadow.interacts,
            onEnter: standardMeadow.onEnter,
        },

        t: {
            entrance: "To the south, you can see the clearing; it's comparative brightness beckoning you. But you know you must" +
            " continue towards the north, through the grassy cavern that has no end in sight.",
            colour: "#0b6d00",
    
            extraOptions: [],
            music: "forest",
            
            explores: standardMeadow.explores,
            encounters: standardMeadow.encounters,
            finds: standardMeadow.finds,
            ambushes: standardMeadow.ambushes,
            interacts: standardMeadow.interacts, // blank
            onEnter: standardMeadow.onEnter, // blank

            specialRooms: {
                1: {
                    onEnter: [['f0_slime_fight', ["flag: -f0_fought_slime"]]]
                },
                2: {
                    onEnter: [['f0_young_wolf_fight', ["flag: -f0_fought_young_wolf"]]]
                },
                3: {
                    onEnter: [['f0_teaching_crafting', ["flag: -f0_been_taught_crafting"]]]
                },
                4: {
                    onEnter: [['f0_f4_checkpoint', ["flag: -f0_passed_t4"]]]
                }
            }
        },

        z: {
            entrance: "...",
            colour: "#ff0000",
    
            extraOptions: [],
            music: "none",
            
            explores: standardMeadow.explores,
            encounters: standardMeadow.encounters,
            finds: standardMeadow.finds,
            ambushes: standardMeadow.ambushes,
            interacts: standardMeadow.interacts, // blank
            onEnter: standardMeadow.onEnter, // blank

            specialRooms: {
                1: {
                    onEnter: [['f0_dreadful_wolf_fight', ['flag: -f0_fought_dreadful_wolf']]],
                },
                2: {
                    onEnter: [['f0_charon_fight', ['flag: -f0_fought_charon']]],
                }
            }
        },

        p: {
            entrance: "The area is more open here, but any practical movement is still fairly restricted to a main path. At some points, the grassy trail" +
            " offshoots or breaks into multiple options. You sometimes feel the shifting of leaves around you, reminding you that you could be attacked at any moment.",
            colour: "#00ccff",
    
            extraOptions: [],
            music: "forest",
            
            explores: [["find", 50], ["encounter", 50]],
            encounters: [["slime", 34, { levelCap: 1, modifyEnemy: { exp: 0 }}],
                            ["young_wolf", 33, { levelCap: 1, modifyEnemy: { exp: 0 }}],
                            ["young_bear", 33, { levelCap: 1, modifyEnemy: { exp: 0 }}]],
            finds: [["slime_ball", 100, 2, 4]],
            ambushes: [["slime", 5, { levelCap: 1, modifyEnemy: { exp: 0 }} ],
            ["young_wolf", 5, { levelCap: 1, modifyEnemy: { exp: 0 }} ],
            ["young_bear", 5, { levelCap: 1, modifyEnemy: { exp: 0 }} ]],
            interacts: standardMeadow.interacts, // blank
            onEnter: standardMeadow.onEnter, // blank

            specialRooms: {
                1: {
                    extraOptions: [["Check out interesting item on floor", ["flag: -f0_picked_up_greater_health_potion"]]],
                    interacts: [["f0_greater_health_potion_on_floor", ["flag: -f0_picked_up_greater_health_potion"]]],
                },
                2: {
                    extraOptions: [["Check out interesting item on floor", ["flag: -f0_picked_up_greater_mana_potion"]]],
                    interacts: [["f0_greater_mana_potion_on_floor", ["flag: -f0_picked_up_greater_mana_potion"]]],
                },
                3: {
                    extraOptions: [["Check out interesting item on floor", ["flag: -f0_picked_up_invigorating_flower"]]],
                    interacts: [["f0_invigorating_flower_on_floor", ["flag: -f0_picked_up_invigorating_flower"]]],
                },
                4: {
                    extraOptions: [["Check out interesting item on floor", ["flag: -f0_picked_up_desperate_flower"]]],
                    interacts: [["f0_desperate_flower_on_floor", ["flag: -f0_picked_up_desperate_flower"]]],
                },
                5: {
                    extraOptions: [["Check out interesting item on floor", ["flag: -f0_picked_up_stamina_vial"]]],
                    interacts: [["f0_stamina_vial_on_floor", ["flag: -f0_picked_up_stamina_vial"]]],
                },
                6: {
                    extraOptions: [["Check out interesting item on floor", ["flag: -f0_picked_up_monster_essence"]]],
                    interacts: [["f0_monster_essence_on_floor", ["flag: -f0_picked_up_monster_essence"]]],
                },
                7: {
                    extraOptions: [["Check out interesting item on floor", ["flag: -f0_picked_up_simple_sword"]]],
                    interacts: [["f0_simple_sword_on_floor", ["flag: -f0_picked_up_simple_sword"]]],
                },
                8: {
                    extraOptions: [["Check out interesting item on floor", ["flag: -f0_picked_up_leather_cap"]]],
                    interacts: [["f0_leather_cap_on_floor", ["flag: -f0_picked_up_leather_cap"]]],
                },
                9: {
                    extraOptions: [["Check out interesting item on floor", ["flag: -f0_picked_up_wolfhide_charm"]]],
                    interacts: [["f0_wolfhide_charm_on_floor", ["flag: -f0_picked_up_wolfhide_charm"]]],
                }
            }

        },

    
}
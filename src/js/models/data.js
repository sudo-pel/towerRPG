export const data = {
    player: {
        name,
        gold: 100,
        exp: 0,
        level: 1,
        sp: 0,
        ap: 0,
        sp_investment: {
            health: 0,
            mana: 0,
            atk: 0,
            def: 0,
            matk: 0,
            mdef: 0,
            speed: 0
        },
        stats: {
            health: 60,
            current_health: 60,
            max_sp: 100,
            max_mana: 100,
            current_mana: 100,
            max_stamina: 100,
            current_stamina: 100,
            atk: 30,
            def: 30,
            matk: 30,
            mdef: 30,
            speed: 20,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 0,
            resistance: 0,
            evasion: 0,
            elemental: {
                offence: {
                    none: 100,
                    physical: 100,
                    fire: 100,
                    water: 100,
                    earth: 100,
                    wind: 100,
                    thunder: 100,
                    dark: 100,
                    light: 100
                },
                defence: {
                    none: 100,
                    physical: 100,
                    fire: 100,
                    water: 100,
                    earth: 100,
                    wind: 100,
                    thunder: 100,
                    dark: 100,
                    light: 100
                }
            },
            skills: [
                'attack',
                'guard',
                'adventurer-0',
                'adventurer-1'
            ],
            equips: {
                weapon: undefined,
                head: undefined,
                body: undefined,
                legs: undefined,
                misc1: undefined,
                misc2: undefined
            },
            pouch: [] // store like reagents in inventory [item_name, amount]
        },
        inventory: [], // for  normal items, place the name of the item, for reagents, an array [item_name, amount]
        library: [ // should contain a reference to the skill in question in disciplines; ex adventurer-1 or whatever.
            'attack',
            'guard',
            'adventurer-0',
            'adventurer-1'

        ], // all skills known, including those in the skills array
        recipes: [
            // place name of the recipe in here
        ],
        maps: {
            floor0: [...Array(65)].map(e => Array(65).fill(undefined)),
            floor1: [...Array(65)].map(e => Array(65).fill(undefined))
        },
        exploreCache: {
            zone: undefined,
            coordinates: [],
        }
    },
    max_floor: 1,
    current_floor: 1,
    first_time: {
        explore: true,
        //shop: true,
        equip: true,
        stats: true,
        crafting: true,
        //settings: true,
        game: true,
        combat: true
    },
    version: 0.182,
    unlocked: {
        explore: true,
        shop: true,
        inventory: true,
        stats: true,
        crafting: true,
        settings: true,
        ascend: true,
    },
    tutorials: [],
    special: {
        doingTutorial: false,
        clearedTutorialTrue: false,
        clearedTutorial: false,
        canToggleAutosave: true,
        dataCache: {}
    },
    presents: [
        
    ]
};

export const floors = {
    max: 1,
    1: {
        boss: 'flame_minotaur'
    }
};

export const settings = {
    messageDelay: 0.8,
    battleMessageDelay: 0.6,
    scrollStyle: 'input',
    toggleShortcut: '',
    scrollLimit: 200,
    mainTextSize: "17px",
    miscTextSize: "17px",
    statsTextSize: "16px",
    stickyInputShortcut: {
        on: false,
        active: false
    },
    autoSave: true
}

export const level_cap = 25;

export const exp_requirements = { // this could easily be an array but making it an object improves readability
    1: 100, // each property shows the exp required to advance from the current level to the next,
    2: 400, // so 1 being equal to 100 means that 100 exp is required to advance from level 1 (to level 2)
    3: 800,
    4: 1100,
    5: 1500,
    6: 2000,
    7: 3000,
    8: 3500,
    9: 4000,
    10: 4500,
    11: 5000,
    12: 5500,
    13: 6100,
    14: 6700,
    15: 7500,
    16: 8500,
    17: 9600,
    18: 10700,
    19: 12000,
    20: 14000,
    21: 16500,
    22: 19000,
    23: 23000,
    24: 26000,
    25: 30000,
}

export const sp_investment_caps = {
    1: 2,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 7,
    9: 8,
    9: 8,
    10: 9,
    11: 9,
    12: 9,
    13: 9,
    14: 10,
    15: 10,
    16: 10,
    17: 11,
    18: 11,
    19: 11,
    20: 12,
    21: 12,
    22: 12,
    23: 13,
    24: 14,
    25: 15
}

export const constants = {
    damageCap: 999,
    minBuffMod: 0.1,
    maxBuffMod: 5,
    minElementMod: -99,
    maxElementMod: 500,
    pouchMaxStorage: 3
}

export const disciplines = {
    adventurer: {
        name: "adventurer",
        requirements: {
            skills: [],
            level: 1,
            flags: []
        },
        cost: {
            gold: 0,
            items: []
        },
        skills: [
            {
                name: "boost",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: [],
                },
                disciple: "adventurer",
                cost: {
                    gold: 0,
                    items: [],
                    ap: 1
                },
                code: "adventurer-0",
                unlocked: true,
                unlearnable: false
                
            },
            {
                name: "check",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "adventurer",
                cost: {
                    gold: 25,
                    items: [],
                    ap: 1
                },
                code: "adventurer-1",
                unlocked: true,
                unlearnable: false
            },
            {
                name: "brutal_swipe",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "adventurer",
                cost: {
                    gold: 40,
                    items: [],
                    ap: 2
                },
                code: "adventurer-2",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "dagger_throw",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "adventurer",
                cost: {
                    gold: 40,
                    items: [],
                    ap: 2
                },
                code: "adventurer-3",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "piercing_dagger_throw",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "adventurer",
                cost: {
                    gold: 40,
                    items: [],
                    ap: 2
                },
                code: "adventurer-4",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "smokescreen",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "adventurer",
                cost: {
                    gold: 40,
                    items: [],
                    ap: 2
                },
                code: "adventurer-5",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "hex",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "adventurer",
                cost: {
                    gold: 25,
                    items: [],
                    ap: 1
                },
                code: "adventurer-6",
                unlocked: false,
                unlearnable: true
            },
            
        ],
        unlocked: true,
        visible: true,
        complete: false,
        conditions: {
            level: 1,
            discplines: []
        }
    },
    
    mage: {
        name: "mage",
        desc: "A magic-based discipline that has access to elemental attacks of the Fire, Water and Earth elements. Using one" +
        " grants the user an 'elemental charge', which can be consumed using 'Enforce Energy' or 'Imbue Energy' in order to apply certain effects." +
        " Charges can be fused by using different elemental attacks while having certain charges already applied. By using" +
        " skills in certain orders to create special charges, the mage can induce powerful effects and deal high damage.",
        requirements: {
            skills: [],
            level: 4,
            flags: []
        },
        cost: {
            gold: 100,
            items: []
        },
        skills: [
            {
                name: "fireball",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "mage",
                cost: {
                    gold: 50,
                    items: [],
                    ap: 2
                },
                code: "mage-0",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "icebolt",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "mage",
                cost: {
                    gold: 50,
                    items: [],
                    ap: 2
                },
                code: "mage-1",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "lesser_quake",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "mage",
                cost: {
                    gold: 50,
                    items: [],
                    ap: 2
                },
                code: "mage-2",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "imbue_energy",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "mage",
                cost: {
                    gold: 25,
                    items: [],
                    ap: 1
                },
                code: "mage-3",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "enforce_energy",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "mage",
                cost: {
                    gold: 25,
                    items: [],
                    ap: 1
                },
                code: "mage-4",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "blood_pact",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "mage",
                cost: {
                    gold: 50,
                    items: [],
                    ap: 2
                },
                code: "mage-5",
                unlocked: false,
                unlearnable: true
            },
        ],
        unlocked: false,
        visible: true,
        complete: false,
        conditions: {
            level: 1,
            discplines: []
        }
    },
    
    guardian: {
        name: "guardian",
        desc: "A primarily defensive discipline that focuses on lasting and keeping itself alive with by increasing its defence, removing" +
        " debuffs from themselves and removing buffs from the enemy. When needed, they can use the powerful 'Sentinel Blow' " +
        " which deals damage based on the user's defence stat instead of attack to deal high amounts of damage.",
        requirements: {
            skills: [],
            level: 4,
            flags: []
        },
        cost: {
            gold: 100,
            items: []
        },
        skills: [
            {
                name: "sentinel_blow",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "guardian",
                cost: {
                    gold: 50,
                    items: [],
                    ap: 1
                },
                code: "guardian-0",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "stalwart_strike",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "guardian",
                cost: {
                    gold: 50,
                    items: [],
                    ap: 1
                },
                code: "guardian-1",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "debilitate",
                requirements: {
                    skills: [],
                    level: 3,
                    flags: []
                },
                disciple: "guardian",
                cost: {
                    gold: 50,
                    items: [],
                    ap: 2
                },
                code: "guardian-2",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "enduring_fortress",
                requirements: {
                    skills: [],
                    level: 3,
                    flags: []
                },
                disciple: "guardian",
                cost: {
                    gold: 50,
                    items: [],
                    ap: 2
                },
                code: "guardian-3",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "sacred_shield",
                requirements: {
                    skills: [],
                    level: 3,
                    flags: []
                },
                disciple: "guardian",
                cost: {
                    gold: 50,
                    items: [],
                    ap: 2
                },
                code: "guardian-4",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "guard_conversion",
                requirements: {
                    skills: [],
                    level: 3,
                    flags: []
                },
                disciple: "guardian",
                cost: {
                    gold: 50,
                    items: [],
                    ap: 2
                },
                code: "guardian-5",
                unlocked: false,
                unlearnable: true
            },
        ],
        unlocked: false,
        visible: true,
        complete: false,
        conditions: {
            level: 1,
            discplines: []
        }
    },

    ninja: {
        name: "ninja",
        desc: "Probably the most complex of the starter disciplines, the ninja uses skills that apply certain buffs and debuffs" +
        ", which can be 'chained' into other skills while those buffs or debuffs are applied for special effects. When the" +
        " ninja has applied a sufficient number of buffs or debuffs, they can fuse them into one powerful buff or debuff using" +
        " the 'Enforce Infliction' and 'Imbue Infliction' skills, so that they can stack them all over again. 'Shadow Strike'" +
        " serves as a powerful attack that when used right, can grant SP to further extend the user's turn to deal greater damage.",
        requirements: {
            skills: [],
            level: 4,
            flags: []
        },
        cost: {
            gold: 100,
            items: []
        },
        skills: [
            {
                name: "swift_strike",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "ninja",
                cost: {
                    gold: 50,
                    items: [],
                    ap: 1
                },
                code: "ninja-0",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "shinobi_strike",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "ninja",
                cost: {
                    gold: 50,
                    items: [],
                    ap: 1
                },
                code: "ninja-1",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "crippling_blow",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "ninja",
                cost: {
                    gold: 50,
                    items: [],
                    ap: 2
                },
                code: "ninja-2",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "enfeebling_blow",
                requirements: {
                    skills: [],
                    level: 1,
                    flags: []
                },
                disciple: "ninja",
                cost: {
                    gold: 50,
                    items: [],
                    ap: 2
                },
                code: "ninja-3",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "imbue_infliction",
                requirements: {
                    skills: [],
                    level: 3,
                    flags: []
                },
                disciple: "ninja",
                cost: {
                    gold: 25,
                    items: [],
                    ap: 2
                },
                code: "ninja-4",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "enforce_infliction",
                requirements: {
                    skills: [],
                    level: 4,
                    flags: []
                },
                disciple: "ninja",
                cost: {
                    gold: 25,
                    items: [],
                    ap: 2
                },
                code: "ninja-5",
                unlocked: false,
                unlearnable: true
            },
            {
                name: "shadow_strike",
                requirements: {
                    skills: [],
                    level: 4,
                    flags: []
                },
                disciple: "ninja",
                cost: {
                    gold: 50,
                    items: [],
                    ap: 2
                },
                code: "ninja-6",
                unlocked: false,
                unlearnable: true
            },
        ],
        unlocked: false,
        visible: true,
        complete: false,
        conditions: {
            level: 1,
            discplines: []
        }
    },

    lore: {
        name: "lore",
        requirements: {
            skills: [],
            level: 99999999999
        },
        cost: {
                    gold: 0,
                    items: []
        },
        skills: [
            {
                        name: "boost",
                        requirements: {
                            skills: [],
                            level: 1,
                            flags: [],
                        },
                        disciple: "lore",
                        cost: {
                            gold: 0,
                            items: [],
                            ap: 1
                        },
                        code: "lore-0",
                        unlocked: false,
                        unlearnable: true
                        
            },
            {
                        name: "check",
                        requirements: {
                            skills: [],
                            level: 1,
                            flags: []
                        },
                        disciple: "lore",
                        cost: {
                            gold: 0,
                            items: [],
                            ap: 1
                        },
                        code: "lore-1",
                        unlocked: false,
                        unlearnable: true
            },
            {
                        name: "forgotten_haste",
                        requirements: {
                            skills: [],
                            level: 1,
                            flags: []
                        },
                        disciple: "lore",
                        cost: {
                            gold: 0,
                            items: [],
                            ap: 0
                        },
                        code: "lore-2",
                        unlocked: false,
                        unlearnable: true
            },
            {
                        name: "divine_protection",
                        requirements: {
                            skills: [],
                            level: 1,
                            flags: ["f0_fought_young_wolf"]
                        },
                        disciple: "lore",
                        cost: {
                            gold: 0,
                            items: [],
                            ap: 0
                        },
                        code: "lore-3",
                        unlocked: false,
                        unlearnable: true
            },
            {
                        name: "guard_crush",
                        requirements: {
                            skills: [],
                            level: 1,
                            flags: ["f0_fought_young_wolf"]
                        },
                        disciple: "lore",
                        cost: {
                            gold: 0,
                            items: [],
                            ap: 0
                        },
                        code: "lore-4",
                        unlocked: false,
                        unlearnable: true
            },
            {
                        name: "smite",
                        requirements: {
                            skills: [],
                            level: 1,
                            flags: ["f0_fought_young_wolf"]
                        },
                        disciple: "lore",
                        cost: {
                            gold: 0,
                            items: [],
                            ap: 0
                        },
                        code: "lore-5",
                        unlocked: false,
                        unlearnable: true
            },
                    
        ],
        unlocked: false,
        visible: false,
        complete: false,
        conditions: {
            level: 999999999999,
            discplines: []
        }
    }
}

export const flags = {

    impossible_flag: {
        desc: "Used for locking content indefinitely. Will never be set to true.",
        complete: false
    },

    // FLOOR ZERO
    /* #region */
    f0_done_intro: {
        desc: "Complete the intro on floor zero.",
        complete: false
    },

    f0_fought_slime: {
        desc: "Fight the slime on floor zero.",
        complete: false,
    },

    f0_learnt_prerequisite_skills_1: {
        desc: "Learn boost and check on floor zero.",
        complete: false,
    },

    f0_fought_young_wolf: {
        desc: "Fight the young wolf on floor zero.",
        complete: false
    },

    f0_learnt_prerequisite_skills_2: {
        desc: "Learn the remainders of Lore's skills on floor zero.",
        complete: false
    },

    f0_been_taught_crafting: {
        desc: "Be told about crafting by Lucia.",
        complete: false
    },

    f0_crafted_required_items: {
        desc: "Crafted a wooden sword and health potion.",
        complete: false
    },

    f0_passed_t4: {
        desc: "Show Lucia the health potion and wooden sword you've crafted on floor zero.",
        complete: false
    },

    f0_fought_dreadful_wolf: {
        desc: "Defeat the dreadful wolf on floor zero",
        complete: false
    },

    f0_fought_charon: {
        desc: "Defeat the myserious enemy on floor zero.",
        complete: false
    },

    // INTERESTING ITEMS
    /* #region */
    f0_picked_up_greater_health_potion: {
        desc: "Pick up a greater health potion on floor zero.",
        complete: false
    },
    f0_picked_up_greater_mana_potion: {
        desc: "Pick up a greater mana potion on floor zero.",
        complete: false
    },
    f0_picked_up_invigorating_flower: {
        desc: "Pick up an invigorating flower on floor zero.",
        complete: false
    },
    f0_picked_up_desperate_flower: {
        desc: "Pick up a desperate flower on floor zero.",
        complete: false
    },
    f0_picked_up_stamina_vial: {
        desc: "Pick up a stamina vial on floor zero.",
        complete: false
    },
    f0_picked_up_monster_essence: {
        desc: "Pick up monster essence on floor zero.",
        complete: false
    },
    f0_picked_up_simple_sword: {
        desc: "Pick up a simple sword on floor zero.",
        complete: false
    },
    f0_picked_up_leather_cap: {
        desc: "Pick up a leather cap on floor zero.",
        complete: false
    },
    f0_picked_up_wolfhide_charm: {
        desc: "Pick up a wolfhide charm on floor zero.",
        complete: false
    },
    /* #endregion */
    /* #endregion */

    // FLOOR ONE
    /* #region  */
    f1_spoken_to_tutorial_man: {
        desc: "Speak to the tutorial man on floor one.",
        complete: false
    },

    beatSlime: {
        desc: "Defeat the slime on floor one.",
        complete: false
    },

    f1_spoken_to_little_girl: {
        desc: "Speak to a little girl on floor one about her slime problem.",
        complete: false
    },

    f1_helped_little_girl: {
        desc: "Help a little girl on floor one with her slime problem.",
        complete: false
    },

    f1_spoken_to_docile_slime: {
        desc: "Interact with a docile slime on floor one.",
        complete: false
    },

    f1_helped_docile_slime: {
        desc: "Help a docile slime on floor one gather their bretheren.",
        complete: false
    },

    f1_spoken_to_rude_kid: {
        desc: "Speak to a rude kid on floor one.",
        complete: false
    },
    
    f1_kicked_rude_kids_shin: {
        desc: "Kick the shin of a rude kid on floor one.",
        complete: false
    },

    f1_extended_convo_with_rude_kid: {
        desc: "Have an extended conversation with a rude kid on floor one.",
        complete: false
    },

    f1_spoken_to_little_boy: {
        desc: "Speak to a young boy in the dark forest of floor one.",
        complete: false
    },
    
    f1_helped_little_boy: {
        desc: "Help the young boy in the dark forest of floor one.",
        complete: false
    },

    f1_spoken_to_wanderer_collector: {
        desc: "Speak to the collector of wanderer memorabilia on floor one.",
        complete: false
    },

    f1_helped_wanderer_collector: {
        desc: "Help out the collector of wanderer memorabilia on floor one.",
        complete: false
    },

    f1_met_wanderer_at_statue: {
        desc: "Meet a wanderer at the statue of Lucia, the Solace Goddess on floor one.",
        complete: false
    },

    f1_spoken_to_lost_teenager: {
        desc: "Speak to a lost teenager in the forest on floor one.",
        complete: false,
    },

    f1_spoken_to_traveller_woman: {
        desc: "Speak to a travelling woman with a green backpack on floor one.",
        complete: false
    },

    f1_helped_alchemist_lady: {
        desc: "Help an alchemist lady on floor one and in return, be taught how to make crafted health potions.",
        complete: false,
    },

    f1_spoken_to_alchemist_lady: {
        desc: "Speak to an alchemist lady on floor one.",
        complete: false
    },

    f1_gotten_beginner_recipes: {
        desc: "Receive beginner recipes from the craftswomen in the settlement at floor one.",
        complete: false
    },

    f1_gotten_advanced_recipes: {
        desc: "Received advanced recipes from the artisan in the settlement at floor one.",
        complete: false
    },

    f1_spoken_to_hermit: {
        desc: "Speak to the travelling hermit on floor one.",
        complete: false
    },

    f1_spoken_to_person_looking_for_settlement: {
        desc: "Speak to the person looking for the settlement on floor one.",
        complete: false
    },

    f1_helped_person_looking_for_settlement: {
        desc: "Help the person looking for the settlement on floor one.",
        complete: false
    },

    f1_taken_crafted_sword: {
        desc: "Successfully taken a crafted sword in the forest on floor one.",
        complete: false
    },

    f1_bought_from_teenage_mage: {
        desc: "Buy a cheat sheet from a teenage mage on floor one.",
        complete: false,
    },

    f1_spoken_to_forest_craftsman: {
        desc: "Speak to the craftsman in the forest settlement on floor one.",
        complete: false,
    },

    f1_spoken_to_aina: {
        desc: "Speak to Aina in the forest settlement on the floor one",
        complete: false
    
    },

    f1_spoken_to_sora: {
        desc: "Speak to Sora in the forest settlement on floor one.",
        complete: false
    },

    f1_spoken_to_daryl: {
        desc: "Speak to the teenage mage in the forest area on floor one.",
        complete: false
    },

    f1_spoken_to_ora: {
        desc: "Speak to Ora in the deep forest on floor one.", 
        complete: false
    },

    f1_defeated_ora: {
        desc: "Defeat Ora in battle in the deep forest on floor one.",
        complete: false
    },

    f1_found_guarded_earthen_manasoul: {
        desc: "Find and obtain the earthen manasoul in the deep forest on floor one.", 
        complete: false
    },

    f1_spoken_to_person_looking_for_cat: {
        desc: "Speak to the person looking for their cat in the deep forest on floor one.",
        complete: false,
    },

    f1_helped_person_looking_for_cat: {
        desc: "Help out the person looking for their cat in the deep forest on floor one.",
        complete: false,
    },

    f1_found_bellas_cat: {
        desc: "Find Bella's cat, Rayla, in the dark forest on floor one.",
        complete: false
    },

    f1_picked_up_gold_1: {
        desc: "Picked up gold in the deep forest on floor one.",
        complete: false
    },

    f1_picked_up_gold_2: {
        desc: "Picked up gold in the deep forest on floor one.",
        complete: false
    },

    f1_picked_up_gold_3: {
        desc: "Picked up gold in the deep forest on floor one.",
        complete: false
    },

    thanks_for_playing: {
        desc: "Thanks for playing TRPG!",
        complete: false,
    },

    // INTERESTING ITEM FLAGS
    /* #region */
    f1_picked_up_hydra_staff: {
        desc: "Pick up a hydra staff on floor one.",
        complete: false
    },

    f1_picked_up_crown_of_darkness: {
        desc: "Pick up a crown of darkness on floor one.",
        complete: false
    },

    f1_picked_up_simple_sword: {
        desc: "Pick up a simple sword on floor one.",
        complete: false
    },
    
    f1_picked_up_damaged_helm: {
        desc: "Pick up a damaged helm on floor one.",
        complete: false
    },

    f1_picked_up_metal_stave: {
        desc: "Pick up a metal stave on floor one.",
        complete: false
    },

    f1_picked_up_silver_axe: {
        desc: "Pick up a silver axe on floor one.",
        complete: false
    },

    f1_picked_up_silver_dagger: {
        desc: "Pick up a silver dagger on floor one.",
        complete: false
    },

    f1_picked_up_pickaxe: {
        desc: "Pick up a pickaxe on floor one.",
        complete: false
    },

    f1_picked_up_feathervine_sword: {
        desc: "Pick up a feathervine sword on floor one.",
        complete: false
    },

    f1_picked_up_silver_helm: {
        desc: "Pick up a silver helm on floor one.",
        complete: false
    },

    f1_picked_up_wolfhide_cap: {
        desc: "Pick up a wolfhide cap on floor one.",
        complete: false
    },

    f1_picked_up_vine_helmet: {
        desc: "Pick up a vine helmet on floor one.",
        complete: false
    },

    f1_picked_up_ninja_headcloak: {
        desc: "Pick up a ninja headcloak on floor one.",
        complete: false
    },

    f1_picked_up_makeshift_steel_armour: {
        desc: "Pick up a makeshift steel armour on floor one.",
        complete: false
    },

    f1_picked_up_vine_armour: {
        desc: "Pick up a vine armour on floor one.",
        complete: false
    },

    f1_picked_up_vine_pantaloons: {
        desc: "Pick up a vine pantaloons on floor one.",
        complete: false
    },

    f1_picked_up_silver_legwear: {
        desc: "Pick up a silver legwear on floor one.",
        complete: false
    },

    f1_picked_up_slime_ball: {
        desc: "Pick up a slime ball on floor one.",
        complete: false
    },

    f1_picked_up_weak_vine: {
        desc: "Pick up a weak vine on floor one.",
        complete: false
    },

    f1_picked_up_hempweed_ligament: {
        desc: "Pick up a hempweed ligament on floor one.",
        complete: false
    },

    f1_picked_up_wood: {
        desc: "Pick up a wood on floor one.",
        complete: false
    },

    f1_picked_up_steel: {
        desc: "Pick up a steel on floor one.",
        complete: false
    },

    f1_picked_up_health_potion: {
        desc: "Pick up a health potion on floor one.",
        complete: false
    },

    f1_picked_up_greater_health_potion: {
        desc: "Pick up a greater health potion on floor one.",
        complete: false
    },

    f1_picked_up_crafted_health_potion: {
        desc: "Pick up a crafted health potion on floor one.",
        complete: false
    },

    f1_picked_up_greater_mana_potion: {
        desc: "Pick up a crafted mana potion on floor one.",
        complete: false
    },

    f1_picked_up_mana_potion: {
        desc: "Pick up a mana potion on floor one.",
        complete: false
    },

    f1_picked_up_earthen_shield_potion: {
        desc: "Pick up an earthen shield potion on floor one.",
        complete: false
    },

    f1_picked_up_brown_pelt: {
        desc: "Pick up some brown pelt on floor one.",
        complete: false
    },

    f1_picked_up_venomous_claw: {
        desc: "Pick up a venomous claw on floor one.",
        complete: false
    },

    f1_picked_up_crafted_mana_potion: {
        desc: "Pick up a crafted mana potion on floor one.",
        complete: false
    },

    f1_picked_up_forest_explorer_daggers: {
        desc: "Pick up a forest explorer daggers on floor one.",
        complete: false
    },

    f1_picked_up_forest_explorer_cap: {
        desc: "Pick up a forest explorer cap on floor one.",
        complete: false
    },

    f1_picked_up_forest_explorer_armour: {
        desc: "Pick up a forest explorer armour on floor one.",
        complete: false
    },

    f1_picked_up_forest_explorer_pants: {
        desc: "Pick up a forest explorer pants on floor one.",
        complete: false
    },

    f1_picked_up_forest_explorer_pendant: {
        desc: "Pick up a forest explorer pendant on floor one.",
        complete: false
    },

    f1_picked_up_forest_explorer_charm: {
        desc: "Pick up a forest explorer charm on floor one.",
        complete: false
    },

    // ------------------------- DARK FOREST -------------------- \\

    f1_picked_up_crafted_mana_potion_2: {
        desc: "Pick up a crafted mana potion on floor one.",
        complete: false
    },

    f1_picked_up_greater_health_potion_2: {
        desc: "Pick up a greater health potion on floor one.",
        complete: false
    },

    f1_picked_up_greater_mana_potion_2: {
        desc: "Pick up a greater mana potion on floor one.",
        complete: false
    },

    f1_picked_up_hempweed_ligament_2: {
        desc: "Pick up a hempweed ligament on floor one.",
        complete: false
    },

    f1_picked_up_makeshift_steel_legwear: {
        desc: "Pick up a makeshift steel legwear on floor one.",
        complete: false
    },

    f1_picked_up_runic_dagger: {
        desc: "Pick up a runic dagger on floor one.",
        complete: false
    },

    f1_picked_up_deep_forest_explorer_scythe: {
        desc: "Pick up a deep forest explorer scythe on floor one.",
        complete: false
    },

    f1_picked_up_deep_forest_explorer_cap: {
        desc: "Pick up a deep forest explorer cap on floor one.",
        complete: false
    },

    f1_picked_up_deep_forest_explorer_armour: {
        desc: "Pick up a deep forest explorer armour on floor one.",
        complete: false
    },

    f1_picked_up_deep_forest_explorer_pants: {
        desc: "Pick up a deep forest explorer pants on floor one.",
        complete: false
    },

    f1_picked_up_deep_forest_explorer_necklace: {
        desc: "Pick up a deep forest explorer necklace on floor one.",
        complete: false
    },

    f1_picked_up_deep_forest_explorer_bracelet: {
        desc: "Pick up a deep forest explorer bracelet on floor one.",
        complete: false
    },

    f1_picked_up_forest_scourge_scale: {
        desc: "Pick up a forest scourge scale on floor one.",
        complete: false
    },

    f1_picked_up_venomous_claw_2: {
        desc: "Pick up a venomous claw on floor one.",
        complete: false
    },

    f1_picked_up_magic_bark: {
        desc: "Pick up a magic bark on floor one.",
        complete: false
    },

    f1_picked_up_sharp_claw_2: {
        desc: "Pick up a sharp claw on floor one.",
        complete: false
    },

    f1_picked_up_ailwarder_charm: {
        desc: "Pick up an ailwarder charm on floor one.",
        complete: false
    },

    /* #endregion */
    /* #endregion */
};
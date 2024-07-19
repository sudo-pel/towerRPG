// -- IMPORTS -- \\
import { skills, getSkill, getDamage, buffCount, useRandom, stackCount,
        findTimesUsed } from '../../js/models/skills';
import { Combat } from '../../js/models/combat';
import * as mainView from '../../js/views/mainView';
import { copy } from '../../js/models/baseModel';
//


// -- ENEMIES -- \\
export const enemiesDirectory = {

    // TUTORIAL EXCLUSIVE \\
    young_wolf: {

        stats: {
            base_level: 2,
            max_health: 75,
            atk: 30,
            def: 30,
            matk: 30,
            mdef: 30,
            speed: 16,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 0,
            resistance: 10,
            evasion: 0,
            max_mana: 100,
            max_stamina: 100,
            max_sp: 100,
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
            ai: 'young_wolf',
            mode: 'young_wolf',
            skills: ["attack", "boost"],
            name: 'Young Wolf',
            baseLevel: 2,
            exp: 150,
            gold: 20,
            drops: [],
            desc: "A wolf that, although is of moderate size, is clearly inexperienced in battle. Appears to boost whenever" +
            " possible. Given it's speed, it appears that if you were to increase your speed with a skill, you would be" +
            " able to double this enemy..."
        }
    },

    dreadful_wolf: {

        stats: {
            base_level: 3,
            max_health: 120,
            atk: 30,
            def: 30,
            matk: 30,
            mdef: 30,
            speed: 55,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 5,
            resistance: 25,
            evasion: 0,
            max_mana: 100,
            max_stamina: 100,
            max_sp: 100,
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
                    physical: 90,
                    fire: 100,
                    water: 100,
                    earth: 100,
                    wind: 100,
                    thunder: 100,
                    dark: 100,
                    light: 150
                }
            },
            ai: 'dreadful_wolf',
            mode: 'dreadful_wolf',
            skills: ["attack"],
            name: 'Dreadful Wolf',
            exp: 250,
            gold: 20,
            drops: [],
            desc: "A wolf whose hide seems to have been afflicted with some kind of curse. It's fur is long and dark, with" +
            " the occasional purple pigment. It writhes as though each individual fibre has a life of its own." +
            " You manage to glean the info that this enemy will attempt to use a powerful debuff every 3rd turn" +
            ", and will boost whenever possible."
        }
    },

    charon: {

        stats: {
            base_level: 5,
            max_health: 225,
            atk: 30,
            def: 30,
            matk: 30,
            mdef: 30,
            speed: 55,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 5,
            resistance: 0,
            evasion: 0,
            max_mana: 100,
            max_stamina: 100,
            max_sp: 100,
            elemental: {
                offence: {
                    none: 100,
                    physical: 100,
                    fire: 100,
                    water: 100,
                    earth: 100,
                    wind: 100,
                    thunder: 100,
                    dark: 200,
                    light: 100
                },
                defence: {
                    none: 100,
                    physical: 80,
                    fire: 50,
                    water: 50,
                    earth: 50,
                    wind: 50,
                    thunder: 50,
                    dark: 50,
                    light: 100
                }
            },
            ai: 'charon',
            mode: 'charon',
            skills: ["attack"],
            name: '???',
            exp: 500,
            gold: 20,
            drops: [],
            desc: "There's no way this thing is actually human. Even though it has the stature and body parts of one," +
            " it's skin is charcoal black and littered with bright red patterns. It is 'wearing' brown, raglike clothing" +
            " that succeeds only in covering his torso and a small amount of his legs. It's eyes are black, with white" +
            " irises and red 'strain-marks' dirtying the cornea. Somehow, you glean that he will boost whenever available" +
            " and that his malice peaks every 4th turn."
        }
    },

    young_bear: {

        stats: {
            base_level: 3,
            max_health: 100,
            atk: 40,
            def: 25,
            matk: 20,
            mdef: 20,
            speed: 15,
            crit_chance: 0.5,
            crit_damage: 1.25,
            effectiveness: 0,
            resistance: 30,
            evasion: 0,
            max_mana: 100,
            max_stamina: 150,
            max_sp: 100,
            elemental: {
                offence: {
                    none: 100,
                    physical: 110,
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
                    fire: 120,
                    water: 90,
                    earth: 75,
                    wind: 105,
                    thunder: 105,
                    dark: 100,
                    light: 25
                }
            },
            ai: 'young_bear',
            mode: 'young_bear',
            skills: ["attack"],
            name: 'Young Bear',
            baseLevel: 3,
            exp: 175,
            gold: 20,
            drops: [["stamina_vial", 500, 1, 2]],
            desc: "A young brown bear. Clearly inexperienced but still old enough to put up a fight. Seems like it can't boost, and that it will use a powerful attack every 2nd turn."
        }
    },

    // ------

    slime: {

        stats: {
            base_level: 1,
            max_health: 40,
            atk: 30,
            def: 30,
            matk: 30,
            mdef: 30,
            speed: 16,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 0,
            resistance: 0,
            evasion: 0,
            max_mana: 100,
            max_stamina: 100,
            max_sp: 100,
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
                    fire: 50,
                    water: 50,
                    earth: 50,
                    wind: 50,
                    thunder: 150,
                    dark: 75,
                    light: 75
                }
            },
            ai: 'slime',
            mode: 'slime',
            skills: ["splash", "boost"],
            name: 'Slime',
            baseLevel: 1,
            exp: 100,
            gold: 10,
            drops: [["slime_ball", 1000, 2, 5], ["slime_ball", 500, 2, 5]],
            desc: "A blue slime. From their movement and feel one would assume they are amorphous but they seem to always" +
            " settle upon the same semispherical shape. They seem sentient, however not very intelligent - as though" +
            " unlikely to have any particular strategy."
        }
    },

    lesser_teravalum: { 

        stats: {
            base_level: 2,
            max_health: 35,
            atk: 0,
            def: 25,
            matk: 30,
            mdef: 30,
            speed: 10,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 0,
            resistance: 0,
            evasion: 0,
            max_mana: 100,
            max_stamina: 70,
            max_sp: 100,
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
                    physical: 80,
                    fire: 150,
                    water: 50,
                    earth: 50,
                    wind: 120,
                    thunder: 40,
                    dark: 100,
                    light: 100
                }
            },
            ai: 'lesser_teravalum',
            mode: 'lesser_teravalum',
            skills: ["constrict", "guard"],
            name: 'Lesser Teravalum',
            baseLevel: 1,
            exp: 150,
            gold: 10,
            drops: [["weak_vine", 1000, 2, 5], ["weak_vine", 500, 2, 5], ["hempweed_ligament", 300, 1, 2], ["vine_helmet", 200, 1, 1]],
            desc: "A mass of tangled green vines that somehow has sentience. There is no indication of facial features or" +
            " emotion, although the creature is clearly sentient. It seems suited only for constricting enemies and" +
            " defending itself."
        }
    },

    grey_wolf: {

        stats: {
            base_level: 3,
            max_health: 45,
            atk: 25,
            def: 30,
            matk: 30,
            mdef: 20,
            speed: 35,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 0,
            resistance: 0,
            evasion: 0,
            max_mana: 100,
            max_stamina: 100,
            max_sp: 100,
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
                    fire: 120,
                    water: 100,
                    earth: 80,
                    wind: 100,
                    thunder: 100,
                    dark: 100,
                    light: 100
                }
            },
            ai: 'grey_wolf',
            mode: 'grey_wolf',
            skills: ["attack", "boost", "rend"],
            name: 'Grey Wolf',
            baseLevel: 1,
            exp: 200,
            gold: 15,
            drops: [["grey_wolf_pelt", 1000, 2, 4], ["grey_wolf_pelt", 500, 3, 6], ["sharp_claw", 300, 1, 2]],
            desc: "A wolf with bristling grey fur. Despite its aggression, the wolf has a sort of rough beauty about it." +
            " Seems to" +
            " attack indiscriminately." +
            " It has a desperate fury about it - as though it will grow faster as it becomes weaker."
        }
    },

    brown_bear: {

        stats: {
            base_level: 3,
            max_health: 55,
            atk: 20,
            def: 25,
            matk: 20,
            mdef: 20,
            speed: 17,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 0,
            resistance: 10,
            evasion: 0,
            max_mana: 100,
            max_stamina: 150,
            max_sp: 100,
            elemental: {
                offence: {
                    none: 100,
                    physical: 110,
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
                    fire: 120,
                    water: 90,
                    earth: 75,
                    wind: 105,
                    thunder: 105,
                    dark: 100,
                    light: 100
                }
            },
            ai: 'brown_bear',
            mode: 'brown_bear',
            skills: ["attack", "rend"],
            name: 'Brown Bear',
            baseLevel: 4,
            exp: 250,
            gold: 20,
            drops: [["brown_fur", 1000, 1, 7], ["brown_fur", 500, 2, 5], ["sharp_claw", 300, 1, 2]],
            desc: "A simple-looking (or as simple looking as they come) brown bear. It has a somewhat calm demeanour but" +
            " clearly does not appreciate your presence. Even when on all fours it is taller than you, and when it jumps up" +
            " to deliver a powerful blow, its stature has an effect comparable to blotting out the sun. It seems to only" +
            " have the energy to do this occasionally, however. You infer that it does so in regular periods, and also boosts whenever" +
            " possible."
        }
    },

    lesser_treant: {

        stats: {
            base_level: 7,
            max_health: 230,
            atk: 45,
            def: 45,
            matk: 50,
            mdef: 50,
            speed: 20,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 25,
            resistance: 25,
            evasion: 0,
            max_mana: 50,
            max_stamina: 100,
            max_sp: 100,
            elemental: {
                offence: {
                    none: 100,
                    physical: 110,
                    fire: 100,
                    water: 100,
                    earth: 120,
                    wind: 100,
                    thunder: 100,
                    dark: 100,
                    light: 100
                },
                defence: {
                    none: 100,
                    physical: 80,
                    fire: 140,
                    water: 70,
                    earth: 40,
                    wind: 115,
                    thunder: 90,
                    dark: 100,
                    light: 100
                }
            },
            ai: 'lesser_treant',
            mode: 'lesser_treant',
            skills: ["attack", "constrict"],
            name: 'Lesser Treant',
            exp: 450,
            gold: 50,
            drops: [["wood", 500, 2, 3], ["magic_bark", 450, 1, 2], ["special_sap", 250, 1, 2], ["magic_bark", 1000, 1, 2],
            ["special_sap", 1000, 1, 1]],
            desc: "A fairly large tree. It isn't really mobile, but is capable of moving it's branches around like appendages." +
            " It has a semblance of a face, with grooves resembling eyes and a mouth that move about arthritically, but no" +
            " actual facial features. It seems to be of moderate intelligence, but not much can be gleaned" +
            " from its appearance."
        }
    },

    treant: {

        stats: {
            base_level: 12,
            max_health: 400,
            atk: 65,
            def: 80,
            matk: 65,
            mdef: 80,
            speed: 25,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 25,
            resistance: 40,
            evasion: 0,
            max_mana: 75,
            max_stamina: 100,
            max_sp: 100,
            elemental: {
                offence: {
                    none: 100,
                    physical: 110,
                    fire: 100,
                    water: 100,
                    earth: 125,
                    wind: 100,
                    thunder: 100,
                    dark: 110,
                    light: 100
                },
                defence: {
                    none: 100,
                    physical: 75,
                    fire: 130,
                    water: 60,
                    earth: 30,
                    wind: 105,
                    thunder: 80,
                    dark: 90,
                    light: 105
                }
            },
            ai: 'treant',
            mode: 'treant',
            skills: ["attack", "constrict", "forest_curse"],
            name: 'Treant',
            baseLevel: 4,
            exp: 700,
            gold: 85,
            drops: [["wood", 500, 5, 7], ["magic_bark", 450, 3, 4], ["special_sap", 250, 3, 4], ["magic_bark", 1000, 3, 4],
            ["special_sap", 1000, 2, 4]],
            desc: "A fairly large tree. It isn't really mobile, but is capable of moving it's branches around like appendages." +
            " It has a semblance of a face, with grooves resembling eyes and a mouth that move about eloquently, but no" +
            " actual facial features. It seems to be of moderate intelligence, but not much useful information can be gleaned" +
            " from its appearance. It radiates an energy that is at once sinister and serene."
        }
    },

    lesser_ent: {

        stats: {
            base_level: 17,
            max_health: 650,
            atk: 80,
            def: 100,
            matk: 80,
            mdef: 120,
            speed: 25,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 40,
            resistance: 60,
            evasion: 0,
            max_mana: 120,
            max_stamina: 200,
            max_sp: 100,
            elemental: {
                offence: {
                    none: 100,
                    physical: 110,
                    fire: 100,
                    water: 100,
                    earth: 125,
                    wind: 100,
                    thunder: 100,
                    dark: 110,
                    light: 100
                },
                defence: {
                    none: 100,
                    physical: 65,
                    fire: 120,
                    water: 60,
                    earth: 20,
                    wind: 100,
                    thunder: 70,
                    dark: 80,
                    light: 105
                }
            },
            ai: 'lesser_ent',
            mode: 'lesser_ent',
            passedThresholds: [],
            skills: ["constrict", "forest_curse"],
            name: 'Lesser Ent',
            baseLevel: 4,
            exp: 1000,
            gold: 120,
            drops: [["wood", 500, 10, 15], ["magic_bark", 650, 6, 8], ["special_sap", 500, 6, 9], ["magic_bark", 1000, 6, 8],
            ["special_sap", 1000, 4, 8]],
            desc: "A large tree. Unlike other trees and treants, this tree has a venerate aura about it. It's attacks are" +
            " almost absentminded, as though it is focusing on something else completely, and yet they are still so dangerous." +
            " Its facial features are equally indescriptive as other treefolk, however here they are also faded and more immobile." +
            " The almost automatic defences it puts up makes you wonder if it has some pre-prepared responses to certain scenarios or " +
            "danger levels."
        }
    },

    lesser_forest_scourge: { // improve droprates

        stats: {
            base_level: 10,
            max_health: 200,
            atk: 50,
            def: 60,
            matk: 70,
            mdef: 50,
            speed: 80,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 25,
            resistance: 0,
            evasion: 0,
            max_mana: 200,
            max_stamina: 200,
            max_sp: 100,
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
                    fire: 120,
                    water: 100,
                    earth: 80,
                    wind: 110,
                    thunder: 100,
                    dark: 100,
                    light: 100
                }
            },
            ai: 'lesser_forest_scourge',
            mode: 'lesser_forest_scourge',
            skills: ["attack", "constrict", "deep_envenom", "forest_curse", "killing_blow"],
            name: 'Lesser Forest Scourge',
            baseLevel: 4,
            exp: 320,
            gold: 40,
            drops: [["forest_scourge_scale", 750, 3, 5], ["venomous_claw", 500, 1, 2]],
            desc: "It is difficult to see exactly what this creature is due to how quickly it moves, but it seems to be" +
            " some kind of snake. It's scales are coloured similarly to the grass, with green scales of different hues" +
            " interlocking seamlessly and shifting silently and the creature sifts around the surroundings. Like an"+ 
            " experienced killer, it seems to have some kind of routine technique."
        }
    },

    young_venomous_wolf: { // improve droprates

        stats: {
            base_level: 7,
            max_health: 185,
            atk: 40,
            def: 50,
            matk: 40,
            mdef: 55,
            speed: 50,
            crit_chance: 0.3,
            crit_damage: 1.25,
            effectiveness: 0,
            resistance: 10,
            evasion: 0,
            max_mana: 100,
            max_stamina: 150,
            max_sp: 100,
            elemental: {
                offence: {
                    none: 100,
                    physical: 120,
                    fire: 100,
                    water: 100,
                    earth: 120,
                    wind: 100,
                    thunder: 100,
                    dark: 100,
                    light: 100
                },
                defence: {
                    none: 100,
                    physical: 100,
                    fire: 120,
                    water: 100,
                    earth: 70,
                    wind: 100,
                    thunder: 100,
                    dark: 100,
                    light: 100
                }
            },
            ai: 'young_venomous_wolf',
            mode: 'young_venomous_wolf',
            skills: ["attack", "rend", "rush_attack", "poison_claws"],
            name: 'Young Venemous Wolf',
            exp: 300,
            gold: 20,
            drops: [["sharp_claw", 500, 1, 2], ["grey_wolf_pelt", 1000, 2, 5], ["venomous_claw", 650, 1, 2]],
            desc: "Seems to be a similar species to grey wolves; a generally similar build with a similarly rugged appearence. although this creature is more lean" +
            " - perhaps a quality made possible by its claws dripping with poison. Seems to attack indiscrimately."
        }
    },

    mobile_lesser_ent: { // improve droprates

        stats: {
            base_level: 12,
            max_health: 250,
            atk: 120,
            def: 80,
            matk: 120,
            mdef: 100,
            speed: 15,
            crit_chance: 0,
            crit_damage: 1,
            effectiveness: 0,
            resistance: 20,
            evasion: 0,
            max_mana: 100,
            max_stamina: 100,
            max_sp: 100,
            elemental: {
                offence: {
                    none: 100,
                    physical: 110,
                    fire: 100,
                    water: 100,
                    earth: 125,
                    wind: 100,
                    thunder: 100,
                    dark: 110,
                    light: 100
                },
                defence: {
                    none: 100,
                    physical: 75,
                    fire: 130,
                    water: 60,
                    earth: 30,
                    wind: 105,
                    thunder: 80,
                    dark: 90,
                    light: 105
                }
            },
            ai: 'mobile_lesser_ent',
            mode: 'mobile_lesser_ent',
            skills: ["forest_rupture"],
            name: 'Mobile Lesser Ent',
            baseLevel: 4,
            exp: 400,
            gold: 85,
            drops: [["wood", 500, 5, 7], ["magic_bark", 350, 2, 3], ["special_sap", 200, 2, 3], ["magic_bark", 800, 2, 3],
            ["special_sap", 800, 1, 3], ["earthen_manasoul", 100, 1, 1]],
            desc: "A very tall bipedal... tree? It looks more like a treant than an ent, with a less fixed 'face', and" +
            " a fluidity of motion that surpasses both species. However, it seems notably less intelligent than either."
        }
    },

    ora: {

        // empoisons enemy
        // only boosts when can do so twice in one turn
        // drains SP from the player every 5 turns
        // keeps up "halycon ennchantment" (-20 all, +25% def/mdef) with mana; once it fades, applies "final haste" (+1 action onTick)
        // constrict, attack, brutal swipe
        // uses forest rupture every 6 turns
        stats: {
            base_level: 12,
            max_health: 560,
            atk: 65,
            def: 50,
            matk: 50,
            mdef: 55,
            speed: 85,
            crit_chance: 0.5,
            crit_damage: 1.5,
            effectiveness: 25,
            resistance: 25,
            evasion: 0.1,
            max_mana: 80,
            max_stamina: 150,
            max_sp: 100,
            elemental: {
                offence: {
                    none: 100,
                    physical: 125,
                    fire: 100,
                    water: 125,
                    earth: 125,
                    wind: 125,
                    thunder: 100,
                    dark: 100,
                    light: 100
                },
                defence: {
                    none: 100,
                    physical: 90,
                    fire: 100,
                    water: 120,
                    earth: 120,
                    wind: 100,
                    thunder: 30,
                    dark: 100,
                    light: 100
                }
            },
            ai: 'ora',
            mode: 'ora',
            skills: ["attack", "brutal_swipe", "constrict"],
            name: 'Ora',
            exp: 1200,
            gold: 150,
            drops: [],
            desc: "A fairly old man with a dark complexion and short build. Despite his nimble frame, he is clearly quite powerful. He seems reluctant to Boost except when he can do so to great effect, and also seems to have access to a periodical powerful attack. Although his general repertoire seems limited, you can tell he has a few tricks in order to gain an edge. There is a certain calmness about him, but you get the feeling that if he runs out of mana, that may change. Somehow, he has a Monster Soul..."
        }
    },
    // ----------------------------------------------------------
    // ------------ NOT REWORKED --------------------------------
    // ----------------------------------------------------------
    wayward_traveler: { // not reworked
        stats: {
            max_health: 500,
            base_level: 10,
            atk: 65,
            def: 55,
            matk: 50,
            mdef: 60,
            speed: 25,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 10,
            resistance: 10,
            evasion: 0,
            max_mana: 100,
            max_stamina: 100,
            max_sp: 100,
            elemental: {
                offence: {
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
                    physical: 80,
                    fire: 110,
                    water: 110,
                    earth: 110,
                    wind: 110,
                    thunder: 110,
                    dark: 110,
                    light: 110
                }
            },
            ai: 'wayward_traveler',
            mode: 'wayward_traveler',
            skills: ["attack", "guard_break", "rush_attack", "healing_potion"],
            name: 'Wayward Traveler',
            exp: 500,
            gold: 50,
            drops: [["damaged_sword", 50, 1, 1],
                    ["damaged_armour", 50, 1, 1],
                    ["damaged_pantaloons", 50, 1, 1],
                    ["damaged_helm", 50, 1, 1],
                    ["wanderer_memorabilia", 1000, 2, 3]],
                    
            desc: "A traveler who seems to have lost their way. From their responsive battle style and analytic glances, you" +
            " infer that they seem to have some kind of specific strategy in mind."
        }  
    },

    greater_slime: { // not reworked

        stats: {
            base_level: 5,
            max_health: 150,
            atk: 60,
            def: 60,
            matk: 70,
            mdef: 60,
            speed: 22,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 0,
            resistance: 30,
            evasion: 0,
            max_mana: 100,
            max_stamina: 100,
            max_sp: 100,
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
                    physical: 70,
                    fire: 0,
                    water: 10,
                    earth: 50,
                    wind: 50,
                    thunder: 200,
                    dark: 75,
                    light: 75
                }
            },
            ai: 'greater_slime',
            mode: 'greater_slime',
            skills: ["splash", "icebolt"],
            name: 'Greater Slime',
            exp: 300,
            gold: 15,
            drops: [["slime_ball", 1000, 5, 8]],
            desc: "A blue slime. From their movement and feel one would assume they are amorphous but they seem to always" +
            " settle upon the same semispherical form. Generally, their disposition seems to mirror your own actions." +
            " Seems larger and more experienced(?) than most slimes."
        }
    },

    lesser_water_klastera: { // not reworked

        stats: {
            base_level: 6,
            max_health: 125,
            atk: 60,
            def: 70,
            matk: 70,
            mdef: 70,
            speed: 25,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 0,
            resistance: 50,
            evasion: 0,
            max_mana: 200,
            max_stamina: 100,
            max_sp: 100,
            elemental: {
                offence: {
                    none: 100,
                    physical: 100,
                    fire: 100,
                    water: 150,
                    earth: 100,
                    wind: 100,
                    thunder: 100,
                    dark: 100,
                    light: 100
                },
                defence: {
                    none: 100,
                    physical: 80,
                    fire: 0,
                    water: 80,
                    earth: 80,
                    wind: 80,
                    thunder: 150,
                    dark: 80,
                    light: 80
                }
            },
            ai: 'lesser_water_klastera',
            mode: 'lesser_water_klastera',
            skills: ["icebolt", "arcane_shield", "channel_health", "splash"],
            name: 'Lesser Water Klastera',
            exp: 350,
            gold: 15,
            drops: [["aquus_cluster", 500, 1, 3], ["manasoul", 10, 1, 1], ["water_orb", 1, 1, 1]],
            desc: "A being comprised of only water. It's body seems to be some kind of deep blue semi-solid. It's only facial" +
            " feature is white, oval eyes that convey no sense of emotion. One might infer from its formulaic structure that" +
            " the same could be said about its battle style."
        }
    },

    young_water_lizard: { // not reworked

        stats: {
            base_level: 7,
            max_health: 100,
            atk: 60,
            def: 60,
            matk: 40,
            mdef: 50,
            speed: 50,
            crit_chance: 0.3,
            crit_damage: 1.5,
            effectiveness: 0,
            resistance: 0,
            evasion: 0,
            max_mana: 100,
            max_stamina: 150,
            max_sp: 100,
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
                    fire: 50,
                    water: 50,
                    earth: 100,
                    wind: 120,
                    thunder: 120,
                    dark: 100,
                    light: 100
                }
            },
            ai: 'young_water_lizard',
            mode: 'young_water_lizard',
            skills: ["attack", "rush_attack", "camoflague"],
            name: 'Young Water Lizard',
            exp: 400,
            gold: 20,
            drops: [["weak_membrane", 500, 1, 3], ["tiny_lizard_tail", 250, 1, 1], ["light_absorbant_eye", 100, 1, 2]],
            desc: "A relatively small reptile. It has clearly rough skin, although the abundant tiny spikes all over its body" +
            " are clearly conscious designs of nature. Perhaps due to the size difference, it seems wary of any attacks."
        }
    },

    red_slime: { // not reworked

        stats: {
            base_level: 11,
            max_health: 250,
            atk: 70,
            def: 70,
            matk: 70,
            mdef: 70,
            speed: 35,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 0,
            resistance: 30,
            evasion: 0,
            max_mana: 150,
            max_stamina: 70,
            max_sp: 100,
            elemental: {
                offence: {
                    none: 100,
                    physical: 100,
                    fire: 150,
                    water: 100,
                    earth: 100,
                    wind: 100,
                    thunder: 100,
                    dark: 100,
                    light: 100
                },
                defence: {
                    none: 100,
                    physical: 80,
                    fire: 0,
                    water: 50,
                    earth: 70,
                    wind: 70,
                    thunder: 70,
                    dark: 60,
                    light: 130
                }
            },
            ai: 'red_slime',
            mode: 'red_slime',
            skills: ["fireball", "guard", "engulf", "attack"],
            name: 'Red Slime',
            exp: 500,
            gold: 35,
            drops: [["red_slime_ball", 1000,  5, 8]],
            desc: "A red slime. From their movement and feel one would assume they are amorphous but they seem to always" +
            " settle upon the same semispherical form. Seems to be wary of boons you grant yourself."
        }
    },

    venomous_wolf: { // not reworked

        stats: {
            base_level: 14,
            max_health: 210,
            atk: 80,
            def: 60,
            matk: 70,
            mdef: 55,
            speed: 80,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 0,
            resistance: 10,
            evasion: 0,
            max_mana: 100,
            max_stamina: 170,
            max_sp: 100,
            elemental: {
                offence: {
                    none: 100,
                    physical: 120,
                    fire: 100,
                    water: 100,
                    earth: 120,
                    wind: 100,
                    thunder: 100,
                    dark: 100,
                    light: 100
                },
                defence: {
                    none: 100,
                    physical: 100,
                    fire: 120,
                    water: 100,
                    earth: 70,
                    wind: 100,
                    thunder: 100,
                    dark: 100,
                    light: 100
                }
            },
            ai: 'venemous_wolf',
            mode: 'venemous_wolf',
            skills: ["attack", "rend", "rush_attack", "poison_claws"],
            name: 'Venemous Wolf',
            exp: 550,
            gold: 30,
            drops: [["sharp_claw", 500, 1, 2], ["venomous_claw", 250, 1, 2], ["grey_wolf_pelt", 1000, 2, 5]],
            desc: "Seems to be a similar species to grey wolves; a generally similar build, although this creature is more lean" +
            " - perhaps a quality made possible by its claws dripping with poison. Seems to attack indiscrimately."
        }
    },

    dark_beast: { // not reworked

        stats: {
            base_level: 18,
            max_health: 300,
            atk: 90,
            def: 70,
            matk: 80,
            mdef: 80,
            speed: 70,
            crit_chance: 0.1,
            crit_damage: 1.5,
            effectiveness: 0,
            resistance: 10,
            evasion: 0.1,
            max_mana: 120,
            max_stamina: 100,
            max_sp: 100,
            elemental: {
                offence: {
                    none: 100,
                    physical: 120,
                    fire: 100,
                    water: 100,
                    earth: 100,
                    wind: 100,
                    thunder: 100,
                    dark: 120,
                    light: 100
                },
                defence: {
                    none: 100,
                    physical: 80,
                    fire: 100,
                    water: 100,
                    earth: 100,
                    wind: 100,
                    thunder: 100,
                    dark: 0,
                    light: 150
                }
            },
            ai: 'dark_beast',
            mode: 'dark_beast',
            skills: ["attack", "rend", "rush_attack", "nox_curse", "dark_howl", "hex"],
            name: 'Dark Beast',
            exp: 800,
            gold: 10,
            drops: [["sharp_claw", 500, 1, 2], ["venemous_claw", 250, 1, 2], ["grey_wolf_pelt", 1000, 2, 5]],
            desc: "A creature with a wolf-like structure, but with a larger upper body. It's entire body is shrouded in an" +
            " oppressive mist that makes you uncomfortable. Little regarding its disposition can be inferred from its movements"
             + " besides its apparent intelligence compared to its wolf 'bretheren'."
        }
    },

    flame_minotaur: { // not reworked

        stats: {
            base_level: 30,
            max_health: 5000,
            atk: 110,
            def: 80,
            matk: 80,
            mdef: 80,
            speed: 65,
            crit_chance: 0,
            crit_damage: 1.5,
            effectiveness: 30,
            resistance: 0,
            evasion: 0,
            max_mana: 100,
            max_stamina: 100,
            max_sp: 100,
            elemental: {
                offence: {
                    none: 100,
                    physical: 120,
                    fire: 120,
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
                    fire: 0,
                    water: 130,
                    earth: 90,
                    wind: 120,
                    thunder: 80,
                    dark: 110,
                    light: 90
                }
            },
            ai: 'flame_minotaur',
            mode: 'flame_minotaur',
            mode2: 'phase one',
            skills: ["boar_strike", "boar_rush", "flame_impact", "ignis_destroyer", "boar_haste", "engulf", "true_cleanse"],
            name: 'Flame Minotaur',
            exp: 5000,
            gold: 2500,
            drops: [["flamme_kaiser", 1000, 1, 1]],
            desc: "A tall beast of extremely muscular built. It is difficult to fully appreciate the stature of the minotaur" +
            ", as it is several times taller than you. However you can feel it's scorching breath, and see it's giant," +
            " rune-encrusted axe. Nothing can about it's mannerisms can be inferred from its appearance besides its " +
            "great power."
        }
    },
    
}
//

// -- MODES -- \\
export const modeDirectory = {

    charon: (state, player, enemy, finishFunction) => { finishFunction(); },

    dreadful_wolf: (state, player, enemy, finishFunction) => { finishFunction(); },

    young_wolf: (state, player, enemy, finishFunction) => { finishFunction(); },
    
    slime: (state, player, enemy, finishFunction) => { finishFunction(); },

    grey_wolf: (state, player, enemy, finishFunction) => { finishFunction(); },

    brown_bear: (state, player, enemy, finishFunction) => { finishFunction(); },

    young_bear: (state, player, enemy, finishFunction) => { finishFunction(); },

    ora: (state, player, enemy, finishFunction) => { finishFunction(); },

    lesser_treant: (state, player, enemy, finishFunction) => { 
        // at sub 50%, gain a chance to heal
        // at sub 30%, use anima bark

        console.log("mode called");

        const animaBarkStacks = Combat.checkStacks(enemy.buffs, "anima bark");

        if (enemy.health <= enemy.max_health * (30/100) && animaBarkStacks == 0) {
            enemy.modeBattle = "anima bark";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} feels mystical energy welling within..`, 1]], "battle", finishFunction);
        } else if (enemy.health <= enemy.max_health / 2) {
            enemy.modeBattle = "heal";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} is wary of their condition..`, 1]], "battle", finishFunction);
        } else {
            enemy.modeBattle = "normal";
            finishFunction();
        }
    },

    treant: (state, player, enemy, finishFunction) => { 
        // at sub 50%, gain a chance to heal
        // at sub 30%, use anima bark

        console.log("mode called");

        const animaBarkStacks = Combat.checkStacks(enemy.buffs, "anima bark");

        if (enemy.health <= enemy.max_health * (30/100) && animaBarkStacks == 0) {
            enemy.modeBattle = "anima bark";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} feels mystical energy welling within..`, 1]], "battle", finishFunction);
        } else if (enemy.health <= enemy.max_health / 2) {
            enemy.modeBattle = "heal";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} is wary of their condition..`, 1]], "battle", finishFunction);
        } else {
            enemy.modeBattle = "normal";
            finishFunction();
        }
    },

    lesser_ent: (state, player, enemy, finishFunction) => { 
        // at sub 80%, use forest rupture -- add phase 1
        // at sub 60%, gain a chance to heal + use anima bark
        // at sub 50%, use forest rupture -- add phase 2 
        // at sub 40%, use greater anima bark
        // at sub 20%, use forest rupture -- add phase 3

        console.log("mode called");

        const animaBarkStacks = Combat.checkStacks(enemy.buffs, "anima bark");
        const g_animaBarkStacks = Combat.checkStacks(enemy.buffs, "greater anima bark");

        // threshold attacks
        console.log(`INDEX OF ${enemy.passedThresholds.indexOf("one")}`)
        console.log(enemy.health)
        console.log(enemy.max_health * (80/100))
        console.log(enemy.health <= enemy.max_health * (80/100))
        console.log(enemy.passedThresholds.indexOf("one") == -1)
        if (enemy.health <= enemy.max_health * (80/100) && enemy.passedThresholds.indexOf("one") == -1) {
            enemy.modeBattle = "threshold-one"
            finishFunction();
        }

        else if (enemy.health <= enemy.max_health * (50/100) && enemy.passedThresholds.indexOf("two") == -1) {
            enemy.modeBattle = "threshold-two"
            finishFunction();
        }

        else if (enemy.health <= enemy.max_health * (20/100) && enemy.passedThresholds.indexOf("three") == -1) {
            enemy.modeBattle = "threshold-three"
            finishFunction();
        }

        //
        
        else if (enemy.health <= enemy.max_health * (40/100) && g_animaBarkStacks == 0) {
            enemy.modeBattle = "greater anima bark";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} feels great mystical energy welling within..`, 1]], "battle", finishFunction);
        }

        else if (enemy.health <= enemy.max_health * (60/100) && animaBarkStacks == 0) {
            enemy.modeBattle = "anima bark";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} feels mystical energy welling within..`, 1]], "battle", finishFunction);
        }

        else if (enemy.health <= enemy.max_health * (60/100)) {
            enemy.modeBattle = "heal";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} is wary of their condition..`, 1]], "battle", finishFunction);
        }
        
        else {
            enemy.modeBattle = "normal";
            finishFunction();
        }
    },

    wayward_traveler: (state, player, enemy, finishFunction) => {
        // if the player has less than 3 stacks of guard_break applied, use guard break (if stamina available)
        // if the player has 3 stacks of guard break applied, use rush attack
        // however, if the traveler's health goes below 50%, use healing potion
        const enemyHealth = enemy.health;
        const guardBreakStacks = Combat.checkStacks(player.debuffs, "guard broken");
        console.log(`found ${guardBreakStacks} guard broken stacks`)
        if (enemyHealth < enemy.max_health / 2) {
            if (enemy.mana > 30) {
                enemy.modeBattle = "wary";
                mainView.displayMessagesDelayed([[`<br>${enemy.name} is concerned about their condition..`, 1]], "battle", finishFunction);
            } else {
                enemy.modeBattle = "desperate";
                mainView.displayMessagesDelayed([[`<br>${enemy.name} is employing a last ditch attempt!`, 1]], "battle", finishFunction);
            }
        } else if (guardBreakStacks < 3) {
            enemy.modeBattle = "preparing";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} seems to be setting something up..`, 1]], "battle", finishFunction);
        } else {
            enemy.modeBattle = "allout";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} is going all out!`, 1]], "battle", finishFunction);
        }
    },

    greater_slime: (state, player, enemy, finishFunction) => {
        const plrActions = state[Combat.turn - 1]["player"];
        var twoGuard = false;
        var allDamage = true;

        var guardCounter = getSkill(plrActions, "guard");
        var plrDamage = getDamage(plrActions);
        console.log("logging player damage");
        console.log(plrDamage);
        plrDamage.forEach(dmg => {
            if (dmg < 1) { allDamage = false };
        })
        if (guardCounter > 0) {
            // If the player guarded more than once previous turn, become "defensive" (guard 3 times)
            enemy.modeBattle = "defensive";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} eyes ${player.name} cautiously...`, 1]], "battle", finishFunction);
        } else if (allDamage) {
            // If the player dealt damage all of their actions the previous turn, become aggressisve (attack 3 times)
            enemy.modeBattle = "aggressive";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} assumes an aggressive stance!`, 1]], "battle", finishFunction);
        } else {
            /// Otherwise, become "normal" (random choice of actions)
            enemy.modeBattle = "normal";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} assumes a normal stance.`, 1]], "battle", finishFunction);
        }


    },

    lesser_water_klastera: (state, player, enemy, finishFunction) => {
        // keep arcane shield buff up and otherwise use icebolt. Every 3 turns use icebolt if possible
        var arcaneStacks = Combat.checkStacks(enemy.buffs, "arcane protection");
        var healUses = 0;
        if (state[Combat.turn - 1]["enemy"] != undefined) {
            healUses = getSkill(state[Combat.turn - 1]["enemy"], "channel_health")
        }
        if (arcaneStacks == 0) {
            enemy.modeBattle = "arcane";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} would like to enhance themselves with magic...`, 1]], "battle", finishFunction);
        } else if (Combat.turn % 3 == 0) {
            if (healUses == 0) {
                enemy.modeBattle = "heal";
                mainView.displayMessagesDelayed([[`<br>${enemy.name} would like to heal..`, 1]], "battle", finishFunction);
            } else {
                enemy.modeBattle = "normal";
                mainView.displayMessagesDelayed([[`<br>${enemy.name} has no particular desire.`, 1]], "battle", finishFunction);
            }
        } else {
            enemy.modeBattle = "normal";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} has no particular desire.`, 1]], "battle", finishFunction);
        }
    },

    young_water_lizard: (state, player, enemy, finishFunction) => {
        // if the player didn't guard at all, enter cautious mode
        // otherwise, normal
        const guardCounter = getSkill(state[Combat.turn - 1]["player"], "guard");
        if (guardCounter == 0) {
            enemy.modeBattle = "cautious";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} feels uncomfortable...`, 1]], "battle", finishFunction);
        } else {
            enemy.modeBattle = "normal";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} seems to be feeling normal.`, 1]], "battle", finishFunction);
        }
    },

    red_slime: (state, player, enemy, finishFunction) => {

        enemy.modeBattle = "normal";
        finishFunction();


    },

    venemous_wolf: (state, player, enemy, finishFunction) => { finishFunction(); },

    young_venomous_wolf: (state, player, enemy, finishFunction) => { finishFunction(); },

    dark_beast: (state, player, enemy, finishFunction) => {
        const atkbuffStacks = Combat.checkStacks(enemy.buffs, "ATK up");
        const matkbuffStacks = Combat.checkStacks(enemy.buffs, "MATK up");
        const speedbuffStacks = Combat.checkStacks(enemy.buffs, "SPEED up");
        const hexStacks = Combat.checkStacks(player.debuffs, "hexed");
        const debuffCount = stackCount(player.debuffs);
        // dark pact, hex, dark howl, nox curse, rend, attack
        // keep dark pact up, use hex, then other 3 skills

        // if dark pact not applied and dark pact can be used, use dark pact
        if (atkbuffStacks < 3 && matkbuffStacks < 3 && speedbuffStacks < 3) {
            enemy.modeBattle = "dark pact";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} eyes ${player.name} with a slight glare.`, 1]], "battle", finishFunction);
        } else if (hexStacks == 0) {
            enemy.modeBattle = "hex";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} eyes ${player.name} with a malicious glare.`, 1]], "battle", finishFunction);
        } else if (debuffCount - Combat.checkStacks(player.debuffs, "nox curse") > 1) { // ensure nox curse not counted
                enemy.modeBattle = "nox curse";
                mainView.displayMessagesDelayed([[`<br>${enemy.name} eyes ${player.name} with a malevolent glare.`, 1]], "battle", finishFunction);
        } else {
            enemy.modeBattle = "normal";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} eyes ${player.name} with a dry glare.`, 1]], "battle", finishFunction);
        }
        // otherwise if hex not applied and hex can be used, use hex
        // otherwise if 2 or more debuffs applied to enemy, use nox curse if possible
        // otherwise use dark howl, rend, or attack

        

    },

    flame_minotaur: (state, player, enemy, finishFunction) => {
        const turn = Combat.turn;
        const debuffsApplied = buffCount(enemy.debuffs);
        const buffsEnemy = buffCount(player.buffs);
        const hasteCount = Combat.checkStacks(enemy.buffs, "boar haste");

        var phase = enemy.mode2;
        var ignisDestroyer = 5;
        if (phase == 'phase two') { ignisDestroyer = 3 };

        if (enemy.health < enemy.max_health / 2 && phase == 'phase one') {
            mainView.displayMessage('<span style="color:red"><b>The minotaur grows evermore furious..</span></b>');
            enemy.mode2 = 'phase two';
            phase = 'phase two';
        } 

        if (phase == 'phase two' && hasteCount == 0) {
            enemy.modeBattle = "boar_haste";
            finishFunction();
        } else if (turn % ignisDestroyer == 0) {
            enemy.modeBattle = "ignis_destroyer";
            finishFunction();
        } else if (skills.flare_impact.cost(enemy) == true) {
            enemy.modeBattle = "flare_impact";
            finishFunction();
        } else if (debuffsApplied > 2) {
            if (skills.true_cleanse.cost(enemy) == true) {
                enemy.modeBattle = "true_cleanse";
                finishFunction();
            } else {
                enemy.modeBattle = "ignis_destroyer";
                finishFunction();
            }
        } else if (buffsEnemy > 2) {
            if (skills.engulf.cost(enemy) == true) {
                enemy.modeBattle = "engulf"
                finishFunction();
            } else {
                enemy.modeBattle = "ignis_destroyer"
                finishFunction();
            }
            
        } else {
            enemy.modeBattle = "normal";
            finishFunction();
        }

    },

    lesser_teravalum: (state, player, enemy, finishFunction) => {
        if (skills.constrict.cost(enemy) == true) {
            enemy.modeBattle = "constrict";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} is in the mood to constrict..`, 1]], "battle", finishFunction);
        } else {
            enemy.modeBattle = "guard";
            mainView.displayMessagesDelayed([[`<br>${enemy.name} assumes a defensive stance.`, 1]], "battle", finishFunction);
        }
    },

    lesser_forest_scourge: (state, player, enemy, finishFunction) => { finishFunction(); },

    mobile_lesser_ent: (state, player, enemy, finishFunction) => { finishFunction(); },


}
//

// -- AI -- \\
export const aiDirectory = { // we need to export this separately because we can't deep copy objects with functions in them.

    young_bear: () => {
        const enemy = Combat.getEnemy();

        if (Combat.turn % 2 == 0 && skills.crushing_blow.cost(enemy, Combat.getPlayer()) == true && Combat.turn != 1) {
            skills.crushing_blow.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        } else {
            useRandom(enemy, enemy.skills);
        }
    },

    ora: () => {
        const enemy = Combat.getEnemy();
        const player = Combat.getPlayerAdd(Combat.getPlayer())

        // if first turn and first action, use monster soul
        // else if empoison not applied, use empoison
        // if >=20 SP/used boost before, use boost
        // else if halycon enchantment/final haste not applied, use halycon enchantment; if unable, use final haste
        // if turn divisible by 5, use soul drain
        // if turn divisible by 6, use forest rupture
        // otherwise use random from main roster

        console.log(enemy);
        if (Combat.checkStacks(enemy.buffs, "monster soul") == 0) {
            useSkill("monster_soul");
        }
        else if (Combat.checkStacks(player.debuffs, "empoisoned") == 0) {
            useSkill("empoison");
        }
        else if (enemy.sp >= 20 || (enemy.sp >= 10 && findTimesUsed("enemy", "boost") == 1)) {
            useSkill("boost");
        }
        else if (Combat.checkStacks(enemy.buffs, "halycon enchantment") == 0 && Combat.checkStacks(enemy.buffs, "final haste") == 0) {
            if (canUse(enemy, Combat.getPlayer(), "halycon_enchantment")) { useSkill("halycon_enchantment") } else { useSkill("final_haste") };
        }
        else if (Combat.turn % 6 == 0 && findTimesUsed("enemy", "soul_drain") == 0) {
            useSkill("soul_drain");
        }
        else if (Combat.turn % 5 == 0 && findTimesUsed("enemy", "forest_rupture") == 0) {
            useSkill("forest_rupture");
        }
        else { useRandom(enemy, enemy.skills) };


    },

    charon: () => {
        const enemy = Combat.getEnemy();

        if (Combat.turn % 3 == 0 && enemy.actionsTaken == 0) {
            mainView.displayMessagesDelayed([["???: Ahhh. I need energy...", 0.2], ["??? gained 30 SP!", -0.2]], "outside", () => {
                enemy.sp += 30;
                if (skills.boost.cost(enemy, Combat.getPlayerAdd(Combat.getPlayer())) == true) {
                    skills.boost.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
                } else if (Combat.turn % 4 == 0 && skills.malice.cost(enemy, Combat.getPlayerAdd(Combat.getPlayer())) == true && findTimesUsed("enemy", "malice") == 0) {
                    skills.malice.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
                } else {
                    useRandom(enemy, enemy.skills);
                }
            })
        } else {
            if (skills.boost.cost(enemy, Combat.getPlayerAdd(Combat.getPlayer())) == true) {
                skills.boost.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
            } else if (Combat.turn % 4 == 0 && skills.malice.cost(enemy, Combat.getPlayerAdd(Combat.getPlayer())) == true && findTimesUsed("enemy", "malice") == 0) {
                skills.malice.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
            } else {
                useRandom(enemy, enemy.skills);
            }
        }
    
    },

    dreadful_wolf: () => {
        const enemy = Combat.getEnemy();

        if (Combat.turn == 1 && enemy.actionsTaken == 0) {
            skills.monster_soul.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        } else if (skills.boost.cost(enemy, Combat.getPlayer()) == true) {
            skills.boost.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        } else if (Combat.turn % 3 == 0 && skills.malice.cost(enemy, Combat.getPlayer()) == true && findTimesUsed("enemy", "malice") == 0) {
            skills.malice.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        } else {
            useRandom(enemy, enemy.skills);
        }
    },

    young_wolf: () => {
        const enemy = Combat.getEnemy();

        if (Combat.turn == 1 && enemy.actionsTaken == 0) {
            skills.monster_soul.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        } else if (skills.boost.cost(enemy, Combat.getPlayer()) == true) {
            skills.boost.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        } else {
            useRandom(enemy, enemy.skills);
        }
    },

    slime: () => {
        const enemy = Combat.getEnemy();

        if (Combat.turn == 1 && enemy.actionsTaken == 0) {
            skills.monster_soul.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        } else {
            useRandom(enemy, enemy.skills);
        }
    },

    grey_wolf: () => {
        const enemy = Combat.getEnemy();

        if (Combat.turn == 1 && enemy.actionsTaken == 0) {
            skills.wolven_soul.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        } else {
            useRandom(enemy, enemy.skills);
        }
    },

    brown_bear: () => {
        const enemy = Combat.getEnemy();

        if (Combat.turn == 1 && enemy.actionsTaken == 0) {
            skills.monster_soul.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        } else if (skills.boost.cost(enemy, Combat.getPlayer()) == true) {
            skills.boost.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        } else if (Combat.turn % 3 == 0 && skills.brutal_swipe.cost(enemy, Combat.getPlayer()) == true) {
            skills.brutal_swipe.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        } else {
            useRandom(enemy, enemy.skills);
        }
    },

    lesser_treant: () => {
        const enemy = Combat.getEnemy();
        const mode = enemy.modeBattle;

        if (Combat.turn == 1 && enemy.actionsTaken == 0) {
            skills.kindred_soul.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        }
        else if (mode == "anima bark") {
            skills.anima_bark.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        } else if (mode == "heal") {
            var random = Math.floor(Math.random() * 100) + 1; // 0 to 100
            if (random <= 75 && skills.nature_healing.cost(enemy, Combat.getPlayer()) == true) {
                skills.nature_healing.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
            } else {
                useRandom(enemy, enemy.skills);
            }
        } else {
            useRandom(enemy, enemy.skills);
        }
    },

    treant: () => {
        const enemy = Combat.getEnemy();
        const mode = enemy.modeBattle;

        if (Combat.turn == 1 && enemy.actionsTaken == 0) {
            skills.anima_soul.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        }
        else if (skills.boost.cost(enemy, Combat.getPlayer()) == true) {
            skills.boost.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        }
        else if (mode == "anima bark") {
            skills.anima_bark.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        }
        else if (mode == "heal") {
            var random = Math.floor(Math.random() * 100) + 1; // 0 to 100
            if (random <= 75 && skills.lesser_anima_healing.cost(enemy, Combat.getPlayer()) == true) {
                skills.lesser_anima_healing.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
            } else {
                useRandom(enemy, enemy.skills);
            }
        }
        else {
            useRandom(enemy, enemy.skills);
        }
    },

    lesser_ent: () => {
        const enemy = Combat.getEnemy();
        const mode = enemy.modeBattle;
        console.log(`MODE IF ${mode}`)

        if (Combat.turn == 1 && enemy.actionsTaken == 0) {
            skills.anima_soul.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        }

        else if (skills.boost.cost(enemy, Combat.getPlayer()) == true) {
            skills.boost.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        }

        else if (mode == "anima bark") {
            skills.anima_bark.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        }

        else if (mode == "greater anima bark") {
            skills.greater_anima_bark.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        }

        else if (mode == "threshold-one") {
            console.log(`THRESHOLD ONE REACHED`)
            enemy.passedThresholds.push("one");
            skills.forest_rupture.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        }
        
        else if (mode == "threshold-three") {
            enemy.passedThresholds.push("three");
            skills.forest_rupture.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        }

        else if (mode == "threshold-two") {
            enemy.passedThresholds.push("two");
            skills.forest_rupture.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        }

        else if (mode == "heal") {
            var random = Math.floor(Math.random() * 100) + 1; // 0 to 100
            if (random <= 75 && skills.lesser_anima_healing.cost(enemy, Combat.getPlayer()) == true) {
                skills.lesser_anima_healing.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
            } else {
                if (skills.constrict.cost(enemy, Combat.getPlayer()) == true && skills.forest_curse.cost(enemy, Combat.getPlayer() == true)) {
                    useRandom(enemy, enemy.skills);
                } else {
                    skills.guard.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
                }
            }
        }

        else {
            if (skills.constrict.cost(enemy, Combat.getPlayer()) == true && skills.forest_curse.cost(enemy, Combat.getPlayer() == true)) {
                useRandom(enemy, enemy.skills);
            } else {
                skills.guard.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
            }

        }
    },

    wayward_traveler: () => {
        const mode = Combat.getEnemy().modeBattle;

        console.log("this was called");
        console.log(mode);

        // if the mode is "wary", use heath potion
        if (mode == "wary") {
            skills.health_potion.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
        } else if (mode == "desperate" || mode == "allout") {
            // if mode is "desperate" or "allout", try to use rush attack, otherwise use attack
            if (skills.rush_attack.cost(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer())) == true) {
                skills.rush_attack.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            } else {
                skills.attack.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            }
        } else if (mode == "preparing") {
            // if mode is "preparing", try to use guard break, otherwise use attack
            if (skills.guard_break.cost(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer())) == true) {
                skills.guard_break.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            } else {
                skills.attack.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            }
        }
    },

    greater_slime: () => {
        // get mode
        const mode = Combat.getEnemy().modeBattle;

        // if the mode is "aggressive", use 'splash' only
        if (mode == "aggressive") {
            const random = Math.round((Math.random() + 0.1) * 2)
            if (random == 1) {
                skills.splash.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            } else {
                skills.icebolt.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            }
        } else if (mode == "defensive") {
            // if the mode is "defensive", guard only
            skills.guard.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
        } else {
            // if the mode is "normal", make it random
            const random = Math.round((Math.random() + 0.1) * 3)
            if (random == 1) {
                skills.guard.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            } else if (random == 2) {
                skills.splash.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            } else {
                skills.splash.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            }
        }
    // endEnemyTurn()
    },

    lesser_water_klastera: () => {
        const enemy = Combat.getEnemy();
        const mode = enemy.modeBattle;

        if (mode == "normal") {
            if (skills.icebolt.cost(enemy) == true) {
                skills.icebolt.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            } else {
                skills.splash.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            }
        } else if (mode == "heal") {
            if (skills.channel_health.cost(enemy) == true) {
                skills.channel_health.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            } else {
                skills.splash.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            }
        } else if (mode == "arcane") {
            if (skills.arcane_shield.cost(enemy) == true) {
                skills.arcane_shield.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            } else {
                skills.splash.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            }
        }
    },

    young_water_lizard: () => {
        const enemy = Combat.getEnemy();
        const player = Combat.getPlayerAdd(Combat.getPlayer())
        const mode = enemy.modeBattle;

        if (mode == "cautious" && skills.camoflague.cost(enemy, player) == true && Combat.checkStacks(enemy.buffs, "camoflague") == 0) {
            // use camoflague
            skills.camoflague.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
        } else {
            // 50/50 rush attack or attack
            const random = Math.round(Math.random() * 3 + 1);
            if (random == 1 && skills.rush_attack.cost(enemy, player) == true) {
                // use rush attack
                skills.rush_attack.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            } else {
                // use attac
                skills.attack.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            }
        }
    },

    red_slime: () => {
        // get mode and other stuff
        const enemy = Combat.getEnemy();
        const mode = Combat.getEnemy().modeBattle;
        
        const playerBuffCount = buffCount(Combat.getPlayer().buffs);
        console.log(`PLAYERBUFFCOUNT ${playerBuffCount}`)
        // only use engulf when player has over 1 buff applied
        // if the mode is "aggressive", try use engulf then fireball then attack
        if (mode == "normal") {
           if (enemy.actionsTaken == 0 && skills.engulf.cost(enemy) == true && playerBuffCount > 1) {
                skills.engulf.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
           } else if (skills.fireball.cost(enemy) == true) {
                skills.fireball.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
           } else {
                skills.attack.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
           }
        }
    // endEnemyTurn()
    },

    venomous_wolf: () => {
        // get enemy and other stuff
        const enemy = Combat.getEnemy();
        const player = Combat.getPlayer();

        // uses random attacks
        const skillsTemp = copy(enemy.skills);
        
        if (Combat.checkStacks(player.debuffs, "bleed") == 1) {
            skillsTemp.splice(skillsTemp.indexOf("rend"), 1);
        };

        if (Combat.checkStacks(player.debuffs, "viridian toxin") == 1) {
            skillsTemp.splice(skillsTemp.indexOf("poison_claws"), 1);
        };

        useRandom(enemy, skillsTemp);
    },

    young_venomous_wolf: () => {
        // get enemy and other stuff
        const enemy = Combat.getEnemy();
        const player = Combat.getPlayer();

        // uses random attacks
        const skillsTemp = copy(enemy.skills);
        
        if (Combat.checkStacks(player.debuffs, "bleed") == 1) {
            skillsTemp.splice(skillsTemp.indexOf("rend"), 1);
        };

        if (Combat.checkStacks(player.debuffs, "viridian toxin") == 1) {
            skillsTemp.splice(skillsTemp.indexOf("poison_claws"), 1);
        };

        if (Combat.turn == 1 && enemy.actionsTaken == 0) {
            skills.wolven_soul.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        } else {
            useRandom(enemy, skillsTemp);
        }
    },

    dark_beast: () => {
        const enemy = Combat.getEnemy();
        const mode = enemy.modeBattle;
        // keep dark pact up, use hex, then other 3 skills
        // if dark pact not applied and dark pact can be used, use dark pact
        if (mode == "dark pact" && skills.dark_pact.cost(enemy) == true) {
            skills.dark_pact.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
        } else if (mode == "hex" && skills.hex.cost(enemy) == true) {
            skills.hex.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            // otherwise if hex not applied and hex can be used, use hex
        } else if (mode == "nox curse" && skills.nox_curse.cost(enemy) == true) {
            skills.nox_curse.use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
            // otherwise if 2 or more debuffs applied to enemy, use nox curse if possible
        } else {
            useRandom(enemy, ["rend", "attack", "dark_howl"]);
            // otherwise use dark howl, rend, or attack
        }
         
    },

    flame_minotaur: () => {
        const enemy = Combat.getEnemy();
        const mode = enemy.modeBattle;

        if (mode != "normal") {
            skills[mode].use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
        } else {
            useRandom(enemy, ["boar_strike", "boar_rush"]);
        }
    },

    lesser_teravalum: () => {
        const enemy = Combat.getEnemy();
        const mode = enemy.modeBattle;
        if (Combat.turn == 1 && enemy.actionsTaken == 0) {
            skills.kindred_soul.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        } else if (mode != "normal") {
            skills[mode].use(Combat.getEnemy(), Combat.getPlayerAdd(Combat.getPlayer()), 'enemy');
        }
    },

    lesser_forest_scourge: () => {
        const enemy = Combat.getEnemy();
        const player = Combat.getPlayer();

        const envenomedStacks = Combat.checkStacks(player.debuffs, "viridian toxin");
        const constrictStacks = Combat.checkStacks(player.debuffs, "constricted");
        const preparedStacks = Combat.checkStacks(enemy.buffs, "prepared");
        const forestCurseStacks = Combat.checkStacks(player.debuffs, "forest curse");

        if (forestCurseStacks > 0) {
            skills.killing_blow.use(enemy, player, "enemy");
        }

        else if (preparedStacks > 0 && canUse(enemy, player, "forest_curse") == true) {
            skills.forest_curse.use(enemy, player, "enemy");
        }

        else if (constrictStacks > 0 && canUse(enemy, player, "deep_envenom") == true) {
            skills.deep_envenom.use(enemy, player, "enemy");
        }

        else if (envenomedStacks > 0 && canUse(enemy, player, "constrict") == true) {
            skills.constrict.use(enemy, player, "enemy");
        }

        else if (canUse(enemy, player, "poison_claws") == true) {
            skills.poison_claws.use(enemy, player, "enemy");
        }

        else {
            skills.attack.use(enemy, player, "enemy");
        }
    },

    mobile_lesser_ent: () => {
        const enemy = Combat.getEnemy();

        if (Combat.turn == 1 && enemy.actionsTaken == 0) {
            skills.kindred_soul.use(enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
        } else {
            useRandom(enemy, enemy.skills);
        }
    },

}
//

const canUse = (enemy, target, skill) => {
    return skills[skill].cost(enemy, target);
}

const useSkill = (name) => {
    skills[name].use(Combat.enemy, Combat.getPlayerAdd(Combat.getPlayer()), "enemy");
}
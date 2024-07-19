// -- IMPORTS -- \\
import * as mainView from '../../js/views/mainView';
import *  as gameData from '../../js/models/data';
import { skills } from '../../js/models/skills';
import { Combat } from '../../js/models/combat';
//


// -- ITEMS -- \\

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

export const itemsDirectory = {
    //  WEAPONS
    // #region 
    damaged_dagger: {
        name: "damaged dagger", 
        type: "weapon",
        atk: 4,
        def: 1,
        matk: 5,
        mdef: 3,
        speed: 5,
        elemental: {
            offence: {},
            defence: {}
        },
        element: "physical",
        desc: "A damaged dagger. Slightly rusty. It's corrogated edge may help against some enemies, but will not do" +
        " any favours against slimes.",
        sell_value: 100
    },

    damaged_sword: {
        name: "damaged sword",
        type: "weapon",
        atk: 7,
        def: 4,
        matk: 5,
        mdef: 5,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "physical",
        desc: "A damaged sword. It is a little bit rusty, with varying sharpness throughout the length of its edge. It's" +
        " uneven length is unlikely to assist its user in swordplay.",
        sell_value: 100
    },

    simple_sword: {
        name: "simple sword",
        type: "weapon",
        atk: 5,
        def: 1,
        matk: 2,
        mdef: 1,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "physical",
        desc: "A sword of craftmanship evidently skilled and yet still simplistic. It has a presently untouched silver blade" +
        " under a brown hilt. Swords of this type are often used by skilled adventurers who want to return to their roots.",
        sell_value: 25
    },

    sharpened_sword: {
        name: "sharpened sword",
        type: "weapon",
        atk: 12,
        def: 3,
        matk: 4,
        mdef: 3,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "physical",
        desc: "The blade atop this sword is noticeable sharper than weaker swords. It has a weightier feel that allows for" +
        " stronger swings.",
        sell_value: 100
    },

    crafted_blade: {
        name: "crafted blade",
        type: "weapon",
        atk: 20,
        def: 4,
        matk: 5,
        mdef: 5,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "physical",
        desc: "The result of a very skilled weapon forger working with limited materials. Even one unknowledgable in swords" +
        " can infer the love put into this blade from the intricate hilt to the blade optimised for killing.",
        sell_value: 250
    },

    silver_axe: {
        name: "silver axe",
        type: "weapon",
        atk: 18,
        def: 6,
        matk: 6,
        mdef: 6,
        speed: -10,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "physical",
        desc: "An axe forged of silver. It is double-bladed, and the weight on either side makes it a little uncomfortable to" +
        " handle.",
        sell_value: 120
    },

    reinforced_silver_axe: {
        name: "reinforced silver axe",
        type: "weapon",
        atk: 25,
        def: 8,
        matk: 8,
        mdef: 8,
        speed: -20,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "physical",
        desc: "An axe that seems to be exactly like the silver axe except it has been reinforced by various stronger materials." +
        " However, the materials used to reinforce it seem to have been applied unevenly, which makes this weapon, however strong," +
        " difficult to use.",
        sell_value: 300
    },

    metal_stave: {
        name: "metal stave",
        type: "weapon",
        atk: 3,
        def: 1,
        matk: 6,
        mdef: 2,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "physical",
        desc: "It is a common misconception that simple weaponry for mages are made out of wood. Wood actually doesn't really" +
        " conduct mana very well and is susceptible to breaking and fragmenting, making it a poor choice. Instead, a simple" +
        " stave constructed from various metals melded together haphazardly is the weapon of choice for beginning magic users.",
        sell_value: 30
    },

    magisteel_stave: {
        name: "magisteel stave",
        type: "weapon",
        atk: 7,
        def: 1,
        matk: 13,
        mdef: 3,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "physical",
        desc: "A stave made from a single alloy that is particularly good at conducting mana. Useful for intermediate mages but" +
        " a lack of resistance to mana makes it unsuitable for stronger users.",
        sell_value: 150
    },

    enchanted_magisteel_stave: {
        name: "enchanted magisteel stave",
        type: "weapon",
        atk: 9,
        def: 1,
        matk: 20,
        mdef: 8,
        elemental: {
            offence: { water: 10 },
            defence: { water: -10 },
        },
        element: "water",
        desc: "A stave made from an alloy that conducts maigc easily, but also enchanted so that more powerful spells can be" +
        " cast using it. It seems to have been enchanted with water magic.",
        sell_value: 350
    },

    conduit_orb: {
        name: "conduit orb",
        type: "weapon",
        matk: 20,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "none",
        desc: "Most orbs are formed from solidified mana over a very long period of time, and therefore has a very high mana" +
        " conductivity that allows for the use of very powerful spells. However this orb is manmade with no elemental alignment" +
        " using a complicated and specialised technique. It offers no other combat advantages, however allows a user a relatively" +
        " high increase in magic power for its price.",
        sell_value: 200
    },
    
    simple_dagger: {
        name: "simple dagger",
        type: "weapon",
        atk: 2,
        speed: 5,
        mdef: 1,
        def: 2,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "physical",
        desc: "A weapon that seems almost identical to another named 'simple sword' although it is smaller in length. It has" +
        " a lightly curved blade that allows attacks to be parried more easily.",
        sell_value: 25
    },

    crafted_dagger: {
        name: "crafted dagger",
        type: "weapon",
        atk: 10,
        speed: 10,
        evasion: 0.1,
        mdef: 3,
        def: 3,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "none",
        desc: "A wonderfully crafted weapon. It's hilt it designed such that the weapon can be held in most positions very" +
        " comfortably, and such that the way the weapon is held can be changed at will. The blade is an intricate array of" +
        " grooves and smooth edges that allow attacks to be blocked and parried with great ease and effectiveness. Not to be" +
        " used by newbie dagger wielders.",
        sell_value: 250
    },

    silver_shield: {
        name: "silver shield",
        type: "weapon",
        def: 25,
        mdef: 20,
        speed: -20,
        elemental: {
            offence: {},
            defence: { physical: -10 },
        },
        element: "physical",
        desc: "A silver shield. It is well-made and sturdy but with little nuance to speak of.",
        sell_value: 200,
    },

    runeblade: {
        name: "runeblade",
        type: "weapon",
        atk: 10,
        matk: 7,
        mdef: 5,
        def: 5,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "physical",
        desc: "A blade of simple structure. The blade has been formed of two half-blades with runic inscriptions on the inside" +
        " of either welded together such that the inscriptions cannot be seen. This along with a basic enchantment placed on" +
        " the blade makes it easy to enhance with some runes.",
        sell_value: 150
    },

    runic_dagger: {
        name: "runic dagger",
        type: "weapon",
        atk: 7,
        matk: 5,
        mdef: 2,
        def: 2,
        speed: 7,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "physical",
        desc: "A dagger of simple structure. The weapon is too small for inscriptions to be placed inside of the blade so they" +
        " are plainly visible. The runes along with a basic enchantment placed on the blade makes it easy to enhance with some" +
        " runes.",
        sell_value: 150
    },

    magisteel_runic_dagger: {
        name: "magisteel runic dagger",
        type: "weapon",
        atk: 10,
        matk: 8,
        mdef: 7,
        def: 5,
        speed: 7,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "physical",
        desc: "A dagger crafted meticulously with the magisteel alloy and also encrusted with runes. This along with an enchantment" +
        " placed upon the blade makes it possible to enhance the dagger with some runes, and even without magic, the expert" +
        " craftsmanship evident on the weapon makes it an effective combat tool.",
        sell_value: 300
    },

    slime_reinforced_sword: {
        name: "slime reinforced sword",
        type: "weapon",
        atk: 3,
        def: 1,
        mdef: 3,
        elemental: {
            offence: { water: 10 },
            defence: {},
        },
        element: "water",
        desc: "A basic sword reinforced with some slime. It is a little heavier and more dull but grants some more elemental" +
        " defence.",
        sell_value: 50
    },

    wolfhide_dagger: {
        name: "wolfhide dagger",
        type: "weapon",
        atk: 3,
        speed: 6,
        def: 1,
        mdef: 1,
        elemental: {
            offence: {},
            defence: { fire: 10 },
        },
        element: "physical",
        desc: "A simple dagger wherein the grip has been enhanced with grey wolf's skin.",
        sell_value: 50
    },

    pickaxe: {
        name: "pickaxe",
        type: "weapon",
        atk: 3,
        def: 2,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "physical",
        desc: "It's a pickaxe. What more do you want?",
        sell_value: 25
    },

    earthen_sword: {
        name: "earthen sword",
        type: "weapon",
        atk: 23,
        def: 2,
        matk: 6,
        mdef: 4,
        elemental: {
            offence: {
                earth: 15,
                wind: -5
            },
            defence: {
                earth: -6,
                wind: 6,
                fire: 10
            },
        },
        element: "earth",
        desc: "A blade enhanced with the venom of a venomous wolf from the dark forest. It can't really poison enemies due" +
        " the limited quantity of poison, but it does grant the sword some earthen qualities.",
        sell_value: 390
    },

    makeshift_sword: {
        name: "makeshift sword",
        type: "weapon",
        atk: 3,
        def: 1,
        matk: 1,
        mdef: 1,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "physical",
        desc: "A sword of limited craftsmanship. Besides that, nothing of note regarding this weapon.",
        sell_value: 25
    },

    wolven_reavers: {
        name: "wolven reavers",
        type: "weapon",
        atk: 4,
        speed: 5,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "physical",
        desc: "Small weapons fashioned from wolf claws and pelt. Easy to carry and useful for close range combat.",
        sell_value: 75
    },

    flamme_kaiser: {
        name: "flamme kaiser",
        type: "weapon",
        atk: 35,
        matk: 15,
        elemental: {
            offence: { fire: 20 },
            defence: { fire: -5, water: 10, thunder: -5 },
        },
        element: "fire",
        desc: "An axe whose craftsmanship is indicative of something beyond the comprehension of even a decently-skilled" +
        " artisan. Even though it should be far too heavy to hold, somehow it is comfortable in just one hand. The heat it" +
        " emanates makes it difficult to hold, however.",
        sell_value: 1000
    },

    fishing_rod: {
        name: "fishing rod",
        type: "weapon",
        atk: 5,
        speed: 5,
        crit_chance: 0.2,
        elemental: {
            offence: {  },
            defence: {  },
        },
        element: "physical",
        desc: "An old fishing rod. You can tell it's used, and the wear of the old user's arms have given it a more comfortable" +
        " grip. However, the compromise is the quality of the rod. It can clearly seen better days.",
        sell_value: 25
    },

    barren_sword: {
        name: "barren sword",
        type: "weapon",
        atk: 30,
        matk: 15,
        speed: 5,
        elemental: {
            offence: {  },
            defence: {  },
        },
        element: "none",
        desc: "There is a distinct lack of personaility and heart put into this sword, in spite of its elegance. Emotion" +
        " is often a strong proponent of items made by skilled craftsmen, and seeing it completely absent in this weapon" +
        " is a little... eerie. It emanates an unknown power.",
        sell_value: "unsellable"
    },

    hydra_staff: {
        name: "hydra staff",
        type: "weapon",
        matk: 25,
        atk: 15,
        mdef: 5,
        elemental: {
            offence: { water: 20, fire: -5 },
            defence: { water: -5, thunder: 5 },
        },
        element: "water",
        desc: "A staff that has been very elegantly crafted - a stick of what looks like ivory has had two white-and-cyan snake" +
        "s wrapped around it, swirling in opposite directions until they meet at the top, just below a water orb." +
        " Or at least, that's what it looks like. If it were truly made from such materials, it would probably be much more" +
        " power. Nevertheless, it seems to be a formidable weapon.",
        sell_value: "unsellable"
    },

    wooden_sword: {
        name: "wooden sword",
        type: "weapon",
        matk: 1,
        atk: 3,
        elemental: {
            offence: { },
            defence: { },
        },
        element: "physical",
        desc: "A sword made from wood. It is a little unpleasant to look at, to be honest.",
        sell_value: 20
    },

    vine_wrapped_wooden_sword: {
        name: "vine wrapped wooden sword",
        type: "weapon",
        matk: 3,
        atk: 6,
        elemental: {
            offence: { earth: 5 },
            defence: { earth: -2 },
        },
        element: "physical",
        desc: "A sword made from wood that has been enhanced with vines. The vines grant it a slight aestetic edge.",
        sell_value: 40
    },

    wooden_stave: {
        name: "wooden stave",
        type: "weapon",
        matk: 3,
        atk: 1,
        elemental: {
            offence: { },
            defence: { },
        },
        element: "physical",
        desc: "A staff made from wood. It is a little unpleasant to look at, to be honest.",
        sell_value: 20
    },

    vine_wrapped_wooden_stave: {
        name: "vine wrapped wooden stave",
        type: "weapon",
        matk: 6,
        atk: 3,
        elemental: {
            offence: { earth: 5 },
            defence: { earth: -2 },
        },
        element: "physical",
        desc: "A stave made from wood that has been enhanced with vines. The vines grant it a slight aestetic edge.",
        sell_value: 40
    },

    feathervine_sword: {
        name: "feathervine sword",
        type: "weapon",
        matk: 5,
        atk: 9,
        elemental: {
            offence: { wind: 5, earth: 5 },
            defence: { wind: -2, earth: -2 },
        },
        element: "physical",
        desc: "This sword doesn't actually have feathers attached to it. But the wolf pelt used in it's creation has been" +
        " frayed and split to the extent that they look a bit like feathered remains.",
        sell_value: 70
    },

    wolf_hermit_staff: {
        name: "wolf hermit staff",
        type: "weapon",
        matk: 10,
        atk: 7,
        elemental: {
            offence: { physical: 15 },
            defence: { },
        },
        element: "physical",
        desc: "This item uses the remains of wolves to capture their essence and in doing so, enhance one's attacks with the" +
        " magic enherent within a grey wolf. The claws it is embroidered with look like charms worn by a hermit.",
        sell_value: 80
    },

    thunder_rod: {
        name: "thunder rod",
        type: "weapon",
        matk: 10,
        atk: 10,
        elemental: {
            offence: { thunder: 10 },
            defence: { },
        },
        element: "thunder",
        desc: "A rod enchanted with simple thunder magic. Used by fighters of all types as a way of easily aligning one's" +
        " attacks with the thunder element.",
        sell_value: 150
    },

    forest_explorer_daggers: {
        name: "forest explorer daggers",
        type: "weapon",
        atk: 8,
        speed: 8,
        resistance: 5,
        mdef: 2,
        def: 2,
        elemental: {
            offence: { earth: 10, dark: 3 },
            defence: { earth: -5, physical: -5, dark: -2 },
        },
        element: "earth",
        desc: "A pair of daggers that seem to have aspects of various creatures found in the forest skillfully woven together" +
        " into a pair of small blades. They also seem to have several enchantments upon them to make exploring the area" +
        " easier. Whoever owned these must have known a lot about the place they were found..",
        sell_value: 250
    },

    earth_mage_staff: {
        name: "earth mage staff",
        type: "weapon",
        atk: 6,
        def: 5,
        matk: 12,
        mdef: 7,
        resistance: 10,
        elemental: {
            offence: { earth: 15 },
            defence: { earth: -5 },
        },
        element: "earth",
        desc: "A staff formed from enchanted bark. It feels a little hollow, but clearly has potent magic-channeling capabilities. It seems particualrly attuned to earth magic.",
        sell_value: 250
    },

    earth_magus_staff: {
        name: "earth magus staff",
        type: "weapon",
        atk: 9,
        def: 8,
        matk: 16,
        mdef: 10,
        resistance: 15,
        elemental: {
            offence: { earth: 20 },
            defence: { earth: -5 },
        },
        element: "earth",
        desc: "A staff formed from enchanted bark. It emanates a great power; in fact, it is likely that the power of the weapon is bottlenecked by the materials it is made from. If the full energy of the manasoul were used, the item would likely break immediately.",
        sell_value: 350
    },

    virulent_bracers: {
        name: "virulent bracers",
        type: "weapon",
        atk: 15,
        def: 7,
        matk: 3,
        mdef: 1,
        effectiveness: 10,
        elemental: {
            offence: {
                earth: 15,
            },
            defence: {
                earth: -5,
                physical: -5,
                thunder: -10,
            },
        },
        element: "earth",
        desc: "Bracers that cover most of the fist with a powerful material. From each bracer extends a fairly long and sharp spike dripping with a venomous substance.",
        sell_value: 250
    },

    living_virulent_bracers: {
        name: "living virulent bracers",
        type: "weapon",
        atk: 20,
        def: 10,
        matk: 4,
        mdef: 2,
        effectiveness: 10,
        elemental: {
            offence: {
                earth: 15,
            },
            defence: {
                earth: -5,
                physical: -5,
                thunder: -10,
            },
        },
        crit_chance: 0.05,
        crit_damage: 0.2,
        element: "earth",
        desc: "Bracers that cover most of the fist with a powerful material. From each bracer extends a fairly long and sharp spike dripping with a venomous substance. The spikes move in a fluid motion as though they have a life of their own -- and when fighting, they claw and jab at the opponent, enhancing your strikes to deal greater damage.",
        sell_value: 250
    },

    deep_forest_explorer_scythe: {
        name: "deep forest explorer scythe",
        type: "weapon",
        atk: 13,
        def: 5,
        matk: 5,
        speed: 7,
        resistance: 10,
        elemental: {
            offence: {
                earth: 15,
            },
            defence: {
                earth: -6,
            },
        },
        element: "earth",
        desc: "A scythe is a bit of a weird weapon, and not very nice to use in a dense forest. But the range it grants is nice, and the curved edge allows for some interesting offensive options.",
        sell_value: 250
    },
    //#endregion


    // HEAD
    //#region 
    damaged_helm: {
        name: "damaged helm",
        type: "head",
        def: 7,
        mdef: 3,
        elemental: {
            offence: {},
            defence: {
                physical: -5,
                fire: 1,
            }
        },
        element: "physical",
        desc: "A damaged helm. The perforations in the front may help the user to see better. The ones in the back, not so much.",
        sell_value: 100
    },

    leather_cap: {
        name: "damaged helm",
        type: "head",
        def: 5,
        mdef: 2,
        elemental: {
            offence: {},
            defence: {}
        },
        element: "physical",
        desc: "A cap made of brown leather.",
        sell_value: 20
    },

    silver_helm: {
        name: "damaged helm",
        type: "head",
        def: 3,
        mdef: 2,
        elemental: {
            offence: {},
            defence: {
                physical: -2,
                water: -2,
                fire: 2,
            }
        },
        element: "physical",
        desc: "A silver helm. It is not a full helm, instead protecting the neck and head. Offers less protection than a full" +
        " helm but does not restrict movement or sight.",
        sell_value: 50
    },

    advanced_silver_helm: {
        name: "advanced silver helm",
        type: "head",
        def: 8,
        mdef: 4,
        elemental: {
            offence: {},
            defence: {
                physical: -5,
                water: -5,
                fire: 3,
            }
        },
        element: "physical",
        desc: "A helm made of impressive silver. It has more coverage than some lower end helmets but is still fairly free, at" +
        " the cost of protection.",
        sell_value: 80
    },

    silver_knight_helm: {
        name: "silver knight helm",
        type: "head",
        def: 10,
        mdef: 5,
        speed: -5,
        evasion: -0.1,
        elemental: {
            offence: {},
            defence: {
                physical: -5,
                water: -5,
                fire: 3,
            }
        },
        element: "physical",
        desc: "A knight's helm made of silver. It covers the face completely, but the limited view makes it harder to accurately" +
        " move about and evade attacks.",
        sell_value: 200
    },

    ninja_wrap: {
        name: "ninja wrap",
        type: "head",
        def: 2,
        mdef: 1,
        speed: 5,
        elemental: {
            offence: {},
            defence: {
                dark: -2,
                light: 5
            }
        },
        element: "dark",
        desc: "Black cloth intricately wrapped such that it can be wore on the head, hiding most of the face. Offers almost" +
        " no protection but does not restrict movement at all.",
        sell_value: 90
    },

    wizard_headband: {
        name: "wizard headband",
        type: "head",
        def: 1,
        mdef: 4,
        matk: 3,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "physical",
        desc: "Stereotypical wizard hats are worn by many but often cannot function as much more than a fashion piece. This" +
        " wizard headband, crafted from silver with a small gem at the center is designed to enhance spells cast by the wielder.",
        sell_value: 70
    },

    enchanted_wooden_helm: {
        name: "enchanted wooden helm",
        type: "helm",
        def: 5,
        mdef: 2,
        elemental: {
            offence: {},
            defence: {
                water: -10,
                fire: 30,
                physical: -5
            }
        },
        element: "physical",
        desc: "One would assume that a wooden helm would be very ineffective, but it seems to have been enchanted that prevents" +
        " it from fragmenting and greatly increases its water absorbance.",
        sell_value: 75
    },

    wolfhide_cap: {
        name: "wolfhide cap",
        type: "head",
        def: 1,
        mdef: 1,
        speed: 2,
        elemental: {
            offence: {
                physical: 5
            },
            defence: {
                earth: -5,
            }
        },
        element: "physical",
        desc: "A cap fashioned from grey wolves hide. It doesn't offer much protection but does look quite nice!",
        sell_value: 50
    },

    water_infused_helm: {
        name: "water infused helm",
        type: "head",
        def: 8,
        mdef: 6,
        elemental: {
            offence: {},
            defence: {
                physical: -5,
                water: -10,
                fire: -5,
            }
        },
        element: "water",
        desc: "A metal helm infused with water mana. Surprisingly, the water magic does not change how the helm feels to wear" +
        ". Grants some nice protection against the elements.",
        sell_value: 120
    },

    makeshift_steel_helm: {
        name: "makeshift steel helm",
        type: "head",
        def: 2,
        mdef: 1,
        elemental: {
            offence: {},
            defence: {
                physical: -3
            }
        },
        element: "physical",
        desc: "The artisanship observed with this helm is fairly weak. It's clear it was made by someone fairly inexperienced",
        sell_value: 50
    },

    shinobi_headcloak: {
        name: "shinobi headcloak",
        type: "head",
        def: 8,
        mdef: 6,
        speed: 5,
        evasion: 0.05,
        crit_chance: 0.1,
        elemental: {
            offence: {},
            defence: {
                dark: -12,
                physical: -5,
                light: 15
            }
        },
        element: "dark",
        desc: "Basic black fabric that stealthy fighters use to hide their faces has been enhanced with the pelt of dark beasts" +
        ". Just like their skin, it has an ethereal quality.",
        sell_value: 400
    },

    vine_helmet: {
        name: "vine helmet",
        type: "head",
        def: 3,
        mdef: 4,
        elemental: {
            offence: {},
            defence: {
                earth: -5,
                physical: -5,
                fire: 20,
                water: -2,
                thunder: -2
            }
        },
        element: "earth",
        desc: "Vines from a teravalum that looks a bit like a helmet. Better than nothing but since it's not designed to be" +
        " a helmet, but it's a little uncomfortable.",
        sell_value: 35
    },

    crown_of_darkness: {
        name: "crown of darkness",
        type: "head",
        def: 10,
        mdef: 7,
        evasion: 0.1,
        elemental: {
            offence: { dark: 10, physical: 5 },
            defence: {
                dark: -10,
                light: 15,
                physical: -5,
            }
        },
        element: "dark",
        desc: "A small crown-looking headpiece. It is entirely black but unlike shadow pelts, completely solid. It is quite" +
        " difficult to tell what material this item is made from, although it is imbued with magical power.",
        sell_value: "unsellable"
    },

    leather_cap: {
        name: "leather cap",
        type: "head",
        def: 3,
        mdef: 4,
        elemental: {
            offence: {},
            defence: {}
        },
        element: "physical",
        desc: "A cap made of brown leather. Uncomfortable and not practical. Is this even helpful?",
        sell_value: 20
    },

    forest_explorer_cap: {
        name: "forest explorer cap",
        type: "head",
        def: 8,
        mdef: 7,
        resistance: 5,
        elemental: {
            offence: {},
            defence: { earth: -10, physical: -5, dark: -5 }
        },
        element: "earth",
        desc: "The cap of an experienced explorer of the forest. It seems to have several enchantments placed upon it" +
        " designed to aid someone in a normal forest. Whoever previously owned these must have known a lot about the area" +
        " in which they were found...",
        sell_value: 250
    },

    geomancers_hood: {
        name: "geomancer's hood",
        type: "head",
        matk: 5,
        def: 6,
        mdef: 6,
        elemental: {
            offence: { earth: 5 },
            defence: {
                earth: -5,
                thunder: -6,
                fire: 10,
                water: -2
            }
        },
        element: "earth",
        desc: "A hood woven with magic bark. It is brown, embroidered with patterns of lighter brown. It emanates considerable magical energy.",
        sell_value: 150
    },

    virulent_brawler_helm: {
        name: "virulent brawler helm",
        type: "head",
        def: 12,
        mdef: 4,
        elemental: {
            offence: { earth: 5 },
            defence: {
                earth: -2,
                thunder: -6,
                fire: 15,
                water: -2,
                physical: -5
            }
        },
        element: "earth",
        desc: "A helmet designed for effective closeup combat. It doesn't cover enough to block one's side vision, but is fairly protective otherwise.",
        sell_value: 150
    },

    deep_forest_explorer_cap: {
        name: "deep forest explorer cap",
        type: "head",
        def: 4,
        mdef: 8,
        atk: 3,
        matk: 3,
        elemental: {
            offence: { earth: 5 },
            defence: {
                earth: -8,
            }
        },
        element: "earth",
        desc: "The cap of a deep forest explorer. It is a dark green that blends well into the surroundings. It doesn't do much in the way of protecting the head, and seems ot be more of a magically-enchanted item.",
        sell_value: 150
    },

    //#endregion


    // BODY
    //#region
    damaged_armour: {
        name: "damaged armour",
        type: "body",
        def: 6,
        mdef: 7,
        speed: -5,
        elemental: {
            offence: {},
            defence: {
                physical: -5,
                fire: 1
            }
        },
        element: "physical",
        desc: "A damaged chestplate. The damage to the ligaments would increase one's agility were it not for the rusting" +
        " forcing one to move against the resistance of the joints.",
        sell_value: 100
    },

    leather_armour: {
        name: "leather armour",
        type: "body",
        def: 4,
        mdef: 3,
        elemental: {
            offence: {},
            defence: {
                physical: -5,
                fire: 1
            }
        },
        element: "physical",
        desc: "A chestplate made of leather.",
        sell_value: 20
    },

    silver_armour: {
        name: "silver armour",
        type: "body",
        def: 5,
        mdef: 4,
        elemental: {
            offence: {},
            defence: {
                physical: -5,
                water: -5,
                fire: 2,
            }
        },
        element: "physical",
        desc: "Armour designed to protect the main vulnerable part of the body, leaving a chainmail pattern around the joints" +
        " for movement. Not expertly cafted, but well made nonetheless.",
        sell_value: 50
    },

    advanced_silver_armour: {
        name: "advanced silver armour",
        type: "body",
        def: 8,
        mdef: 4,
        elemental: {
            offence: {},
            defence: {
                physical: -5,
                water: -5,
                fire: 2,
            }
        },
        element: "physical",
        desc: "An armour made almost entirely of silver. The joints use overlapping and interlocking pieces of iron to enable" +
        " movement while facilitating good protection.",
        sell_value: 80
    },

    silver_knight_armour: {
        name: "silver knight armour",
        type: "body",
        def: 13,
        mdef: 7,
        speed: -5,
        evasion: -0.1,
        elemental: {
            offence: {},
            defence: {
                physical: -5,
                water: -5,
                fire: 3,
            }
        },
        element: "physical",
        desc: "A complete silver knight's armour. It still allows movement at the joints, but still restricts movement slightly." +
        " In exchange, the wearer is granted greater defenses.",
        sell_value: 200
    },

    ninja_garb: {
        name: "ninja garb",
        type: "body",
        def: 5,
        mdef: 2,
        speed: 10,
        evasion: 0.1,
        elemental: {
            offence: {},
            defence: {
                dark: -5,
                light: 10,
            }
        },
        element: "dark",
        desc: "The equivalent of a chestplate for a ninja. It is made of a thin black fabric that offers little protection but" +
        " allows for quick movement without detection.",
        sell_value: 130
    },

    light_wizard_robes: {
        name: "light wizard robes",
        type: "body",
        def: 3,
        mdef: 7,
        matk: 7,
        elemental: {
            offence: {},
            defence: {
            }
        },
        element: "physical",
        desc: "Grey and blue wizard robes are often worn by new mages. They have a light enchant to enhance spells cast by the" +
        " user, are comfortable to move about in and are fairly stylish.",
        sell_value: 70
    },

    tattered_magus_robes: {
        name: "tattered magus robes",
        type: "body",
        def: 5,
        mdef: 10,
        matk: 9,
        elemental: {
            offence: {},
            defence: {
            }
        },
        element: "physical",
        desc: "Magi are extremely powerful magic users. Becaue of the powerful magic they use, spellcaster garb that they wear" +
        " can wear out quickly. Some magi discard them and others donate them. These robes seem to have sustained a lot of damage" +
        ", but are still better than most beginners wear. ",
        sell_value: 140
    },

    wolfhide_armour: {
        name: "wolfhide armour",
        type: "body",
        def: 3,
        mdef: 2,
        speed: 5,
        elemental: {
            offence: { physical: 5 },
            defence: { earth: -7 }
        },
        element: "physical",
        desc: "Armour fashioned from grey wolf hide. It is comfortable and enabled great movement.",
        sell_value: 50
    },

    water_infused_armour: {
        name: "water infused armour",
        type: "body",
        def: 8,
        mdef: 7,
        elemental: {
            offence: {},
            defence: {
                physical: -5,
                water: -10,
                fire: -5,
            }
        },
        element: "water",
        desc: "Metal armour enhanced with water magic. Grants increased defence against the elements.",
        sell_value: 120
    },

    makeshift_steel_armour: {
        name: "makeshift steel armour",
        type: "body",
        def: 4,
        mdef: 3,
        elemental: {
            offence: {},
            defence: {
                physical: -5,
            }
        },
        element: "physical",
        desc: "Makeshift steel armour. Not made very well, but grants rudimentary protection.",
        sell_value: 50
    },

    shinobi_armour: {
        name: "shinobi armour",
        type: "body",
        def: 10,
        mdef: 8,
        speed: 8,
        evasion: 0.05,
        crit_chance: 0.1,
        elemental: {
            offence: {},
            defence: {
                dark: -8,
                physical: -5,
                light: 12
            }
        },
        element: "dark",
        desc: "Body wear worn by stealth fighters enhanced with the pelt of a dark beast. Having part of them on you makes" +
        " you feel a little like a dark beast yourself.",
        sell_value: 400
    },

    shadow_cloak: {
        name: "Shadow cloak",
        type: "body",
        def: 13,
        mdef: 10,
        speed: 15,
        evasion: 0.1,
        crit_chance: 0.1,
        elemental: {
            offence: {},
            defence: {
                physical: -10,
                dark: -15,
                light: 15
            }
        },
        element: "physical",
        desc: "A cloak that looks as though it was fashioned from darkness itself. It cannot be felt physically when worn" +
        " but its power can still be felt.",
        sell_value: 600
    },

    bladed_armour: {
        name: "bladed armour",
        type: "body",
        def: 5,
        mdef: 3,
        atk: 5,
        elemental: {
            offence: {},
            defence: {
                physical: -5,
            }
        },
        element: "physical",
        desc: "Simple armour with claws used to grant the wearer an offensive edge.",
        sell_value: 120
    },

    vine_armour: {
        name: "vine armour",
        type: "body",
        def: 4,
        mdef: 4,
        speed: -2,
        elemental: {
            offence: {},
            defence: {
                fire: 5,
                earth: -2,
            },
        },
        element: "earth",
        desc: "Armour fashioned from vines. It's surprisingly comofrtable, but grants little insulation.",
        sell_value: 20
    },
    
    wooden_armour: {
        name: "wooden armour",
        type: "body",
        def: 3,
        mdef: 3,
        elemental: {
            offence: {},
            defence: {
            },
        },
        element: "earth",
        desc: "Armour made from wood. You could get splinters wearing this!",
        sell_value: 15
    },

    strong_vine_chestplate: {
        name: "strong vine chestplate",
        type: "body",
        def: 6,
        mdef: 6,
        elemental: {
            offence: {},
            defence: {
                fire: 4,
                earth: -3,
                physical: -2
            },
        },
        element: "earth",
        desc: "Armour from vines enhanced with hempwood ligaments. The use of the flexible but strong ligaments allows for" +
        " better movement, and they cover vulnerable gaps present in armour without it.",
        sell_value: 45
    },

    leather_amour: {
        name: "leather armour",
        type: "body",
        def: 4,
        mdef: 4,
        elemental: {
            offence: {},
            defence: {},
        },
        element: "physical",
        desc: "Armour made from leather. Fairly comfortable to move in but doesn't help keep you alive that much.",
        sell_value: 30
    },

    forest_explorer_armour: {
        name: "forest explorer armour",
        type: "body",
        def: 10,
        mdef: 7,
        resistance: 5,
        elemental: {
            offence: {},
            defence: { earth: -10, physical: -5, dark: -3 }
        },
        element: "earth",
        desc: "A pair of daggers that seem to have aspects of various creatures found in the forest skillfully woven together" +
        " into it. They also seem to have several enchantments upon them to make exploring the area" +
        " easier. Whoever owned these must have known a lot about the place they were found..",
        sell_value: 250
    },

    geomancers_cloak: {
        name: "geomancer's cloak",
        type: "body",
        matk: 7,
        def: 7,
        mdef: 8,
        elemental: {
            offence: { earth: 10 },
            defence: {
                earth: -7,
                thunder: -10,
                water: -3,
                fire: 10
            }
        },
        element: "earth",
        desc: "The cloak of a geomancer. It is various shades of brown and emanates a fairly strong magical aura. Those well attuned with earth magic would notice something like this from a far distance away.",
        sell_value: 250
    },

    virulent_brawler_plates: {
        name: "virulent brawler plates",
        type: "body",
        atk: 3,
        def: 13,
        elemental: {
            offence: { earth: 5 },
            defence: {
                earth: -7,
                thunder: -10,
                water: -3,
                fire: 10,
                physical: -5
            }
        },
        element: "earth",
        desc: "The chestplate of a brawler, made with various items found in the F1 Deep Forest. There are many places wherein there is not much protection to allow for flexible joint movement. However the vital spaces that are covered are shielded by a very tough material.",
        sell_value: 250
    },

    deep_forest_explorer_armour: {
        name: "deep forest explorer armour",
        type: "body",
        atk: 2,
        matk: 2,
        mdef: 6,
        def: 8,
        elemental: {
            offence: { earth: 5 },
            defence: {
                earth: -12,
            }
        },
        element: "earth",
        desc: "Green armour that seems fashioned primarily from forest scourge scales. It is comfortable and highly flexible.",
        sell_value: 250
    },
    //#endregion


    // LEGS
    //#region 
    damaged_pantaloons: {
        name: "damaged pantaloons",
        type: "legs",
        def: 5,
        mdef: 3,
        elemental: {
            offence: {
            },
            defence: {
                physical: -5,
                fire: 1
            }
        },
        element: "physical",
        desc: "Damaged pantaloons. They're pretty uncomfortable, and rapid movement causes them to make a sound that hurts the" +
        " ear. Also, pantaloons is such a silly sounding word.",
        sell_value: 100

    },

    leather_pants: {
        name: "leather pants",
        type: "legs",
        def: 4,
        mdef: 3,
        elemental: {
            offence: {
            },
            defence: {}
        },
        element: "physical",
        desc: "Trousers made of brown leather.",
        sell_value: 20

    },

    silver_legwear: {
        name: "silver legwear",
        type: "legs",
        def: 3,
        mdef: 2,
        elemental: {
            offence: {
            },
            defence: {
                physical: -4,
                water: -3,
                fire: 2,
            }
        },
        element: "physical",
        desc: "Silver legwear. There is some type of fabric protecting the legs down to the knees, beyond which silver armour" +
        " is present.",
        sell_value: 50

    },

    advanced_silver_legwear: {
        name: "advanced silver legwear",
        type: "legs",
        def: 6,
        mdef: 3,
        elemental: {
            offence: {
            },
            defence: {
                physical: -5,
                water: -5,
                fire: 2,
            }
        },
        element: "physical",
        desc: "Advanced silver legwear. It uses relatively advanced craftsmanship to allow movement at the joints with overlapping" +
        " and interlocking pieces of silver.",
        sell_value: 80

    },

    silver_knight_legwear: {
        name: "silver knight legwear",
        type: "legs",
        def: 10,
        mdef: 7,
        speed: -10,
        evasion: -0.1,
        elemental: {
            offence: {
            },
            defence: {
                physical: -5,
                water: -5,
                fire: 3,
            }
        },
        element: "physical",
        desc: "Legwear made of silver used by knights. There is a considerable compromise in movement in exchange for improved" +
        " defenses.",
        sell_value: 200

    },

    ninja_legwear: {
        name: "ninja legwear",
        type: "legs",
        def: 7,
        mdef: 3,
        speed: 10,
        elemental: {
            offence: {
            },
            defence: {
                dark: -2,
                light: 10,
            }
        },
        element: "dark",
        desc: "Plain black legwear that looks a little like joggings. They offer great movement and are very comfortable, and" +
        " seem to have been lightly enchanted for a little protection",
        sell_value: 90

    },

    light_wizard_leggings: {
        name: "light wizard leggings",
        type: "legs",
        def: 2,
        mdef: 5,
        matk: 3,
        elemental: {
            offence: {
            },
            defence: {
            }
        },
        element: "physical",
        desc: "Simple legwear designed to synergise aesthetically with simple wizard robes. Has a light enchant to boost magical" +
        " power.",
        sell_value: 70

    },

    wolfhide_leggings: {
        name: "wolfhide leggings",
        type: "legs",
        def: 1,
        mdef: 2,
        speed: 3,
        elemental: {
            offence: {
                physical: 5
            },
            defence: { earth: -5 }
        },
        element: "physical",
        desc: "Legwewar fasioned from grey wolf's hide. It is comfortable, and allows for great movement.",
        sell_value: 50

    },

    water_infused_legwear: {
        name: "water infused legwear",
        type: "legs",
        def: 6,
        mdef: 5,
        elemental: {
            offence: {
            },
            defence: {
                physical: -5,
                water: -10,
                fire: -5,
            }
        },
        element: "water",
        desc: "Basic metal armour infused with water magic. Asides from enhanced physical protection, it also grants some" +
        " defence against the elements.",
        sell_value: 120

    },

    makeshift_steel_legwear: {
        name: "makeshift steel legwear",
        type: "legs",
        def: 2,
        mdef: 1,
        elemental: {
            offence: {
            },
            defence: {
                physical: -4,
            }
        },
        element: "physical",
        desc: "Steel legwear made somewhat poorly, but not unwearable. Seems like it might fall apart after some use.",
        sell_value: 50

    },

    shinobi_leggings: {
        name: "shinobi leggings",
        type: "legs",
        def: 9,
        mdef: 5,
        speed: 10,
        elemental: {
            offence: {
            },
            defence: {
                dark: -9,
                physical: -5,
                light: 12
            }
        },
        element: "dark",
        desc: "Plain black legwear that looks a little like joggings, but that have been enhanced using the pelt of a dark" +
        " beast. Quite comfortable, but have an ethereal quality to them.",
        sell_value: 400

    },

    vine_pantaloons: {
        name: "vine pantaloons",
        type: "legs",
        def: 2,
        mdef: 2,
        elemental: {
            offence: {
            },
            defence: {
                fire: 3,
                earth: -2
            }
        },
        element: "earth",
        desc: "Trousers fashioned from vines. It's surprisingly comofrtable, but grants little insulation.",
        sell_value: 15

    },

    wooden_trousers: {
        name: "wooden trousers",
        type: "legs",
        def: 1,
        mdef: 1,
        elemental: {
            offence: {
            },
            defence: {
                fire: 3,
            }
        },
        element: "physical",
        desc: "Trousers crudely made from wood. You could get splinters from these!",
        sell_value: 10

    },

    leather_pants: {
        name: "leather pants",
        type: "legs",
        def: 2,
        mdef: 2,
        elemental: {
            offence: {
            },
            defence: {}
        },
        element: "physical",
        desc: "Trousers fashioned entirely from brown leather. Comfortable to wear but do not offer great protecton.",
        sell_value: 15

    },

    forest_explorer_pants: {
        name: "forest explorer pants",
        type: "legs",
        def: 9,
        mdef: 6,
        resistance: 5,
        elemental: {
            offence: {
            },
            defence: { earth: -10, physical: -5, dark: -3}
        },
        element: "earth",
        desc: "Legwear that somehow has aspects of all the creatures found in the F1 forest woven together and still looks" +
        " nice. It also seems to have various enchantments placed upon it aimed to grant an advantage to the wearer against" +
        " the enemies found in the area. Whoever previously owned these must have known a lot about the place they were found..",
        sell_value: 250

    },

    geomancers_lower_robes: {
        name: "geomancer's lower robes",
        type: "legs",
        def: 3,
        mdef: 6,
        matk: 5,
        elemental: {
            offence: {
                earth: 5
            },
            defence: {
                earth: -6,
                thunder: -6,
                fire: 12,
                water: -3
            }
        },
        element: "earth",
        desc: "The lower cloak of a geomancer, for covering their legs and feet. It is various shades of brown and emanates a fairly strong magical aura. Those well attuned with earth magic would notice something like this from a far distance away.",
        sell_value: 150

    },

    virulent_brawler_leg_guards: {
        name: "virulent brawler leg guards",
        type: "legs",
        def: 10,
        mdef: 5,
        elemental: {
            offence: {
            },
            defence: {
                earth: -2,
                thunder: -6,
                fire: 15,
                water: -2,
                physical: -5
            }
        },
        element: "earth",
        desc: "'Armour' is probably the wrong word to describe this equipment; it is closer to a few plates protection joints such as the knees, since much more could hinder the amount of maneouvrability required for success with this battle style. The plates are very strong, however, and an experienced brawler could probably use the leg guards creatively to block some attacks.",
        sell_value: 150

    },

    deep_forest_explorer_pants: {
        name: "deep forest explorer pants",
        type: "legs",
        def: 8,
        mdef: 5,
        elemental: {
            offence: {
                earth: 5
            },
            defence: {
                earth: -8,
            }
        },
        element: "earth",
        desc: "The pants of a deep forest explorer. It grants good camoflague in a forest, and forest scourge scales seem to be protecting important joints like the knees.",
        sell_value: 150

    },


    //#endregion


    //MISC
    //#region 

    villageseeker_charm: {
        name: "Villageseeker Charm",
        type: "misc",
        atk: 1,
        def: 1,
        matk: 1,
        mdef: 1,
        speed: 1,
        elemental: {
            offence: {
                all: 10
            },
            defence: {
                all: -10
            }
        },
        element: "light",
        desc: "Evidence of one who reached the small village settlement on the outskirts of the forest. Congratulations, and thanks for playing TRPG!",
        sell_value: "unsellable"
    },

    shadowwarding_pendant: {
        name: "Shadowwarding Pendant",
        type: "misc",
        atk: 5,
        def: 5,
        matk: 7,
        mdef: 8,
        elemental: {
            offence: {
            },
            defence: {
                dark: -10,
                light: 10
            }
        },
        element: "physical",
        desc: "A short pendant with a silver chain. On the front seems to be a small, dark purple crystal. It seems" +
        " that the pendant is designed to defend against the more dangerous creatures in the dark forest.",
        sell_value: 500
    },

    slime_bracers: {
        name: "Slime bracers",
        type: "misc",
        def: 3,
        mdef: 4,
        speed: -3,
        resistance: 5,
        elemental: {
            offence: {
                water: 10
            },
            defence: {
                water: -5,
                fire: -10,
                thunder: 10
            }
        },
        element: "water",
        desc: "Bracers for defending one's arms fashioned from slime. The solid and slightly sticky substance offers" +
        " fairly good elemental protection but stunts one's ability to move somewhat.",
        sell_value: 30
    },

    wolfhide_charm: {
        name: "Wolfhide charm",
        type: "misc",
        atk: 4,
        def: 3,
        mdef: 2,
        speed: 3,
        evasion: 0.05,
        crit_chance: 0.1,
        elemental: {
            offence: {
                physical: 8
            },
            defence: {
                fire: 10,
            }
        },
        element: "physical",
        desc: "A charm fashioned from wolf pelts. The residual inherent mana of the wolves seems to grant the charm" +
        " some special qualities.",
        sell_value: 60
    },

    lizard_bracelet: {
        name: "Lizard bracelet",
        type: "misc",
        atk: 7,
        def: 4,
        mdef: 3,
        evasion: 0.1,
        elemental: {
            offence: {
            },
            defence: {
                fire: -5,
            }
        },
        element: "water",
        desc: "Small parts of lizard tails were wrapped intricately together to create a bracelet. It is quite pretty, "+
        "and seems to have some magical properties.",
        sell_value: 100
    },

    aquus_orb: {
        name: "Aquus orb",
        type: "misc",
        matk: 7,
        mdef: 6,
        resistance: 10,
        elemental: {
            offence: {
                water: 10,
                fire: -10
            },
            defence: {
                water: -15,
                fire: -6,
                thunder: 12
            }
        },
        element: "water",
        desc: "Aquus clusters condensed to form a small orb capable of enhancing the capabilities of the wielder.",
        sell_value: 100
    },

    luminant_charm: {
        name: "Luminant charm",
        type: "misc",
        matk: 5,
        atk: 5,
        mdef: 6,
        speed: 2,
        elemental: {
            offence: {
                light: 10
            },
            defence: {
                light: -5,
                dark: -10
            }
        },
        element: "light",
        desc: "A simple charm enhanced with the luminescent eye of a water lizard. Can be worn on jewelry or held in" +
        " a pocket.",
        sell_value: 150
    },
    
    tear_of_lucia: {
        name: "Tear of lucia",
        type: "misc",
        matk: 7,
        mdef: 7,
        resistance: 5,
        elemental: {
            offence: {
                water: 20
            },
            defence: {
                water: -15,
                fire: -10,
                dark: -5,
                light: -5,
                earth: -5,
                thunder: -5,
                wind: -5
            }
        },
        element: "water",
        desc: "A manasoul condensed using a makeshift orb into a very small space. The compactness of the charm causes" +
        " the mana inside the be quite powerful. Items of this nature are called 'Tears of Lucia' as it believed that the" +
        " tears of the Solace goddess will grant any who observes them inpenetrable safety, and the mana of this item for" +
        " some reason has a very soothing aura.",
        sell_value: 350
    },

    lores_legacy: {
        name: "Lore's Legacy",
        type: "misc",
        atk: 5,
        def: 5,
        matk: 5,
        mdef: 5,
        speed: 5,
        elemental: {
            offence: {
                all: 7
            },
            defence: {
                all: -7,
            }
        },
        element: "light",
        desc: "A trinket previously owned by a man who adventured with a girl named Lucia. After a fearsome encounter one day, she disappeared after making a deal with a higher being," +
        " and he never saw her again. It is said that the first thing he did after the event is return to Arlam, his hometown, however since he" +
        " was now blind, he received help along the way from adventurers he met. Some of them stuck around with him, and they formed an team." +
        " They then became renowned adventurers, and later Wanderers.",
        sell_value: "unsellable"
    },

    red_slime_bracers: {
        name: "Red slime bracers",
        type: "misc",
        def: 9,
        mdef: 13,
        speed: -5,
        resistance: 5,
        crit_damage: 0.1,
        elemental: {
            offence: {
                fire: 10
            },
            defence: {
                water: 5,
                fire: -13,
                thunder: -5
            }
        },
        element: "water",
        desc: "Bracers for defending one's arms fashioned from red slime. It is more solid than blue slime and has" +
        " different elemental properties.",
        sell_value: 300
    },

    special_armband: {
        name: "Special armband",
        type: "misc",
        atk: 3,
        def: 3,
        matk: 3,
        mdef: 3,
        speed: 3,
        max_stamina: 60,
        max_mana: 60,
        elemental: {
            offence: {
                all: 5
            },
            defence: {
                all: -5
            }
        },
        element: "physical",
        desc: "A simple bracelet that promotes spirituality. It's a little tight..",
        sell_value: 200
    },
    
    friendly_slime: {
        name: "Friendly slime",
        type: "misc",
        def: 9,
        mdef: 13,
        resistance: 5,
        max_mana: 20,
        max_stamina: 5,
        elemental: {
            offence: {
                water: 20
            },
            defence: {
                water: -7,
                fire: -8,
                thunder: 15
            }
        },
        element: "water",
        desc: "A slime to help you in battle! Where'd you find this little guy?",
        sell_value: 250
    },

    friendly_greater_slime: {
        name: "Friendly greater slime",
        type: "misc",
        def: 15,
        mdef: 20,
        resistance: 5,
        max_mana: 30,
        max_stamina: 5,
        elemental: {
            offence: {
                water: 25
            },
            defence: {
                water: -10,
                fire: -10,
                thunder: 15
            }
        },
        element: "water",
        desc: "A greater slime to help you in battle! Where'd you find this little guy?",
        sell_value: 400
    },

    vine_membrane_bracers: {
        name: "Vine membrance bracers",
        type: "misc",
        atk: 2,
        def: 5,
        mdef: 4,
        max_stamina: 5,
        elemental: {
            offence: {
                earth: 10
            },
            defence: {
                earth: -4,
                fire: 4
            }
        },
        element: "earth",
        desc: "Bracers made from vines and hempweed ligaments. They offer a good mixture of offence and defence.",
        sell_value: 40
    },

    water_orb_necklace: {
        name: "Water orb necklace",
        type: "misc",
        matk: 10,
        def: 5,
        mdef: 10,
        max_mana: 50,
        elemental: {
            offence: {
                water: 25, thunder: -10, fire: -10
            },
            defence: {
                thunder: 20,
                fire: -10,
                water: -5
            }
        },
        element: "water",
        desc: "A simple necklace with a water orb encrusted at its center. Basic but very effective.",
        sell_value: 200
    },

    blue_vine_charm: {
        name: "Blue vine charm",
        type: "misc",
        atk: 3,
        matk: 3,
        def: 3,
        mdef: 3,
        speed: -2,
        max_mana: 10,
        max_stamina: 10,
        elemental: {
            offence: {
                water: 5, earth: 5
            },
            defence: {
                fire: 25,
                water: -5,
                earth: -5
            }
        },
        element: "water",
        desc: "A necklace fashioned from various items that can be found from blue slimes and vined creatures." +
        " The coalesce of their inherent magics grants the wearer a range of boons.",
        sell_value: 30
    },

    fishers_lucky_charm: {
        name: "Fisher's lucky charm",
        type: "misc",
        atk: 6,
        matk: 7,
        def: 4,
        mdef: 5,
        crit_chance: 0.2,
        crit_damage: 0.15,
        evasion: 0.05,
        elemental: {
            offence: {
            },
            defence: {
            }
        },
        element: "water",
        desc: "Many fishers are known for their extreme luck both in finding rare and dangerous fish and surviving" +
        " various encounters with them. Is this item the sole reason for that..?",
        sell_value: 50
    },

    vinewarding_charm: {
        name: "Vinewarding charm",
        type: "misc",
        atk: 3,
        matk: 2,
        def: 4,
        mdef: 3,
        resistance: 15,
        elemental: {
            offence: {
            },
            defence: { earth: -10 }
        },
        element: "earth",
        desc: "A charm infused with the essence of a teravalum. As such, it is useful in defending against them.",
        sell_value: 30
    },

    bearkiller_charm: {
        // note to self: give this item SP regen when that becomes possible
        name: "Bearkiller charm",
        type: "misc",
        def: 9,
        elemental: {
            offence: {
            },
            defence: { physical: -5 }
        },
        element: "physical",
        desc: "This charm isn't actually infused with a bear's essence, unfortunately. Since bears specialise in" +
        " offence what is needed to beat them is a good defence, and this is what this item offers.",
        sell_value: 30
    },

    canine_charm: {
        name: "Canine charm",
        type: "misc",
        atk: 5,
        speed: 8,
        elemental: {
            offence: { physical: 10 },
            defence: { }
        },
        element: "physical",
        desc: "A charm infused with the essence of a wolf. Interestingly, many species of wolves may show respect" +
        ", rather than hatred towards wearers of this charm. Such is the way of the canine.",
        sell_value: 30
    },

    forest_explorer_pendant: {
        name: "Forest explorer pendant",
        type: "misc",
        def: 8,
        mdef: 8,
        resistance: 10,
        elemental: {
            offence: { earth: 10 },
            defence: { earth: -10, physical: -5, dark: -3 }
        },
        element: "earth",
        desc: "A pendant with a silver chain and green gem at the center. The gem seems to have the essences of" +
        " various creatures found in floor one infused into it, granting the wearer a series of boons.",
        sell_value: 250
    },

    forest_explorer_charm: {
        name: "Forest explorer charm",
        type: "misc",
        atk: 8,
        mdef: 8,
        effectiveness: 10,
        elemental: {
            offence: { earth: 15 },
            defence: { earth: -6, physical: -2, dark: -1 }
        },
        element: "earth",
        desc: "A charm made with several parts of various creatures from the floor one forest. It should look like a" +
        " complete mess, but... it actually looks rather nice.",
        sell_value: 250
    },

    ailwarder_charm: {
        name: "Ailwarder Charm",
        type: "misc",
        atk: 1,
        def: 3,
        matk: 2,
        mdef: 4,
        elemental: {
            offence: {
            },
            defence: {
            }
        },
        resistance: 15,
        element: "earth",
        desc: "A small charm formed that although made using poison, seems to paradoxically help repel it. You should still probably keep this away from your mouth, though.",
        sell_value: 200
    },

    small_scaled_shield: {
        name: "Small Scaled Shield",
        type: "misc",
        atk: 1,
        def: 9,
        mdef: 4,
        resistance: 4,
        elemental: {
            offence: {
            },
            defence: {
                all: -2,
                physical: -5,
            }
        },
        element: "physical",
        desc: "A small shield formed with various interlocking scales. The design is plain since the scales are all the same, but the curved tile-like scales still look quite nice. The protection is nice for blocking some attacks, but would be impractical as a primary method of defence.",
        sell_value: 150
    },

    tectonic_charm: {
        name: "Tectonic Charm",
        type: "misc",
        atk: 12,
        matk: 6,
        elemental: {
            offence: {
                all: 5,
                earth: 5
            },
            defence: {
            }
        },
        element: "earth",
        desc: "A charm imbued with raging earth magic. Is it just you, or does this item quake in your grasp?",
        sell_value: 200
    },

    virulent_charm: {
        name: "Virulent Charm",
        type: "misc",
        atk: 7,
        elemental: {
            offence: {
            },
            defence: {
            }
        },
        resistance: 10,
        effectiveness: 10,
        element: "earth",
        desc: "A venomous enchanted charm. It's hard to wear this safely, but if you are able, the boons it grants are sure to be very helpful to an up-and-coming adventurer.",
        sell_value: 200
    },

    deep_forest_explorer_necklace: {
        name: "deep forest explorer necklace",
        type: "misc",
        atk: 4,
        def: 4,
        mdef: 4,
        matk: 4,
        effectiveness: 30,
        elemental: {
            offence: {
                earth: 10
            },
            defence: {
                earth: -10
            }
        },
        element: "earth",
        desc: "A necklace enchanted with potent magic. It seems to be enchanted with the manasouls of various creatures that inhabit the deep forest on Floor one.",
        sell_value: 250
    },

    deep_forest_explorer_bracelet: {
        name: "deep forest explorer bracelet",
        type: "misc",
        atk: 4,
        def: 4,
        mdef: 4,
        matk: 4,
        resistance: 30,
        elemental: {
            offence: {
                earth: 10
            },
            defence: {
                earth: -10
            }
        },
        element: "earth",
        desc: "A bracelet enchanted with potent magic. It seems to be enchanted with the manasouls of various creatures that inhabit the deep forest on Floor one.",
        sell_value: 250
    },

    cats_foot: {
        name: "Cat's foot",
        type: "misc",
        atk: 2,
        def: 2,
        matk: 2,
        mdef: 2,
        speed: 2,
        crit_chance: 0.1,
        crit_damage: 0.25,
        evasion: 0.07,
        resistance: 5,
        effectiveness: 5,
        elemental: {
            offence: {
                all: 2
            },
            defence: {
                all: -2
            }
        },
        element: "physical",
        desc: "Not actually the foot of a cat. It's just a good luck charm that is known as 'cats foot'. It does have some fur on it though...",
        sell_value: 250
    },

    /*
    eternal_life: { TBA
        name: "Ailwarder Charm",
        type: "misc",
        atk: 1,
        def: 3,
        matk: 2,
        mdef: 4,
        elemental: {
            offence: {
            },
            defence: {
            }
        },
        resistance: 15,
        element: "earth",
        desc: "A small charm formed that although made using poison, seems to paradoxically help repel it. You should still probably keep this away from your mouth, though.",
        sell_value: 200
    },
    */

    //#endregion


    // REAGENTS
    //#region 
    slime_ball: {
        name: "Slime Ball",
        type: "reagent",
        desc: "A ball of blue slime. Although it has shape, it is easy to press into. Has a peculiar texture.",
        sell_value: 5
    },

    grey_wolf_pelt: {
        name: "Grey Wolf Pelt",
        type: "reagent",
        desc: "The fur of a grey wolf. Most of it remains intact, but if you shake the straps of fur, parts of it will flake off rapidly",
        sell_value: 7
    },

    wanderer_memorabilia: {
        name: "Adventurer Memorabilia",
        type: "reagent",
        desc: "Various things that may remind an old advenutrer of the adventures they had.",
        sell_value: 0
    },

    weak_membrane: {
        name: "Weak Membrane",
        type: "reagent",
        desc: "A very thin layer of skin from some kind of weap reptile. A single wrong move and it would tear.",
        sell_value: 10
    },

    tiny_lizard_tail: {
        name: "Tiny Lizard Tail",
        type: "reagent",
        desc: "The tail of a lizard. It still moves sometimes.",
        sell_value: 12
    },

    aquus_cluster: {
        name: "Aquus Cluster",
        type: "reagent",
        desc: "An undeveloped orb of weak water magic. 'Aquus' refers to weak water magic. There wasn't enough of it to form" +
        " an orb, so the mana settled as a semi-solid substance that has form and yet is very soft and malleable. Even so," +
        " it is fairly useful to novice mages.",
        sell_value: 25
    },

    water_orb: {
        name: "Water Orb",
        type: "reagent",
        desc: "Water magic that gathered at a single point over a fairly long period of time and eventually reached a high" +
        " enough concentration to possess crystalline form. These very rarely form naturally, and are often crafted by" +
        " strong magic users to store mana of a particular alignment.",
        sell_value: 400
    },

    manasoul: {
        name: "Manasoul",
        type: "reagent",
        desc: "Beings such as klastera and elementals with no anatomy or creature soul are animated by a 'manasoul', mana" +
        " with the power to grant consciousness. It is not known how to create these and so they are often extracted from" +
        " naturally occurring creatures such as klastera, elementals and very rarely, dragons.",
        sell_value: 1000
    },

    light_absorbant_eye: {
        name: "Light absorbant eye",
        type: "reagent",
        desc: "The eye of a class of lizard that absorbs light from the sun to be used to keep the body warm during hibernation." +
        " In many places with cold winters there is little space to burrow or make warm refuge, and so this skill is essential" +
        " in keeping the lizards alive when the climate becomes cold.",
        sell_value: 20
    },

    red_slime_ball: {
        name: "Red slime ball",
        type: "reagent",
        desc: "A ball of red slime. It can be pressed into but seems to return to a general shape after the deforming force is" +
        " removed. Has a peculiar texture.",
        sell_value: 7
    },

    sharp_claw: {
        name: "Sharp claw",
        type: "reagent",
        desc: "A dull grey claw. Seems to be sharper than most. Both the sides and prick cause bleeding upon contact.",
        sell_value: 8
    },

    venomous_claw: {
        name: "Venomous claw",
        type: "reagent",
        desc: "A dull greenish-grey claw. The venom the claw is laced with seems to cause fatigue in small amounts. It would" +
        " be unwise to toy with this item.",
        sell_value: 8
    },

    shadow_pelt: {
        name: "Shadow pelt",
        type: "reagent",
        desc: "A patch of fur from a Dark beast. Although it is clearly tangible, it has an ethereal quality that makes it" +
        " uncomfortable to hold - like it would just fade into black smoke.",
        sell_value: 10
    },

    shadow_corona: {
        name: "Shadow corona",
        type: "reagent",
        desc: "It's difficult to tell what part of the Dark beast this comes from - it seems like a particularly tough, solid" +
        " patch of its fur. It is heavily enchanted and seems to serve as some kind of evidence that the dark beast is in fact" +
        " a dark beast.",
        sell_value: 20
    },

    trash: {
        name: "Trash",
        type: "reagent",
        desc: "Human garbage. Arguably of negative value.",
        sell_value: -1
    },

    fire_rune: {
        name: "Fire rune",
        type: "reagent",
        desc: "A simple flame rune. It is contained in a transparent box of some material that seems to block any heat" +
        " emanating from them.",
        sell_value: 40
    },

    water_rune: {
        name: "Water rune",
        type: "reagent",
        desc: "A simple water rune. It isn't dangerous, but feels a little weird to touch - probably due to the water mana" +
        " constantly emanating from it.",
        sell_value: 40
    },

    thunder_rune: {
        name: "Thunder rune",
        type: "reagent",
        desc: "A simple thunder rune. Touching it would shock the user a little, so it is encased in a transparent box of" +
        " some material.",
        sell_value: 40
    },

    dark_rune: {
        name: "Dark rune",
        type: "reagent",
        desc: "A simple dark rune. It is uncomfortable to have in your inventory due to the foreboding enery it emits.",
        sell_value: 40
    },

    light_rune: {
        name: "Light rune",
        type: "reagent",
        desc: "A simple light rune. It is difficult to tell whether it is emitting light or light mana.",
        sell_value: 40
    },

    vip_card: {
        name: "VIP card",
        type: "reagent",
        desc: "A basic-looking small card. Apparently functions as evidence of one's generous patronage.",
        sell_value: 100
    },

    steel: {
        name: "steel",
        type: "reagent",
        desc: "It's steel. What more do you want?",
        sell_value: 10
    },

    wood: {
        name: "wood",
        type: "reagent",
        desc: "Some wood. Who cares what type it is?",
        sell_value: 8
    },

    leather: {
        name: "leather",
        type: "reagent",
        desc: "Leather. It is cheap but fairly well made.",
        sell_value: 9
    },

    stone: {
        name: "stone",
        type: "reagent",
        desc: "Stone.",
        sell_value: 3
    },

    water_energy: {
        name: "water energy",
        type: "reagent",
        desc: "Pure water energy. Humans have not yet learned to replicate this with magic; this is something only animals" +
        " can create. Can be used by some creatures to strengthen themselves.",
        sell_value: 60
    },

    weak_vine: {
        name: "weak vine",
        type: "reagent",
        desc: "Weak vines woven of some kind of thick cellulose material. It feels a little leathery.",
        sell_value: 6
    },

    hempweed_ligament: {
        name: "hempweed ligament",
        type: "reagent",
        desc: "Seems to form the ligaments of a Lesser Teravalum. It is very thin, but very strong. Could probably be woven" +
        " into a fabric",
        sell_value: 7
    },

    brown_fur: {
        name: "brown fur",
        type: "reagent",
        desc: "The brown fur of a brown bear. Despite feeling quite nice, it smells very bad.",
        sell_value: 6
    },

    magic_bark: {
        name: "Magic bark",
        type: "reagent",
        desc: "Bark of a tree imbued with magic. The material of the tree itself seems to have a relatively poor magical" +
        ", however bark of this nature could still be very useful to beginning adventurers.",
        sell_value: 12
    },

    special_sap: {
        name: "Special sap",
        type: "reagent",
        desc: "The sap of a treant. It has potent magical qualities, specifically in healing. It's quite bitter, so" +
        " in healing potions for children, sugar is often added to it.",
        sell_value: 15
    },

    forest_scourge_scale: {
        name: "Forest scourge scale",
        type: "reagent",
        desc: "The scales of a forest scourge. They are dull, likely to aid camoflague, but incredibly tough and smooth" +
        " to the touch.",
        sell_value: 12
    },

    mage_cheat_sheet: {
        name: "Mage cheat sheet",
        type: "reagent",
        desc: "A cheat sheet for some basic spells. It reads (messily):" +
        "<i><br>Water charge: fire + ice" +
        "<br>Steam charge: fire + water" +
        "<br>Soil charge: earth + water" +
        "<br>Magma charge: fire + earth" +
        "<br>Volcano charge: magma + earth" +
        "<br>Obsidian charge: magma + water" +
        "<br>Frozen Earth charge: ice + earth</i>", 
        sell_value: 300
    },

    forest_merchant_advert: {
        name: "Forest merchant advert",
        type: "reagent",
        desc: 'Less of an advert and more a slip of paper. It reads simply <b>"Find me at [ADD COORDS]! I sell all sorts of items found in the deep forest, for affordable priecs!"</b>',
        sell_value: 1
    },

    earthen_manasoul: {
        name: "Earthen manasoul",
        type: "reagent",
        desc: "It looks like a sphere of green glowing mist with an ephemeral feel. It seems to be a ball of condensed Earth magic, capable of granting sentience to" +
        " things that it has an affinity with. It is the catalyst for creating lesser Earth elementals.",
        sell_value: 30
    },

    cat_food: {
        name: "Cat food",
        type: "reagent",
        desc: "Food for a cat. You will not want to eat this.",
        sell_value: "unsellable"
    },

    bellas_cat: {
        name: "Bella's Cat",
        type: "reagent",
        desc: "Bella's Cat. It's a black and white cat with brown eyes. You don't know the breed, but it is very cute. Meow!",
        sell_value: "unsellable"
    },
    //#endregion


    // MISC - USABLES
    //#region 
    f1_settlement_teleportation_stone: {
        name: "f1 settlement tp stone",
        type: "reagent",
        desc: "It is difficult to explain the function of this item, but it allows for instantaneous travel, albeit is destroyed" +
        " afterwards. When exploring on floor one, consume to travel to the settlement in the north-west of the map.",
        sell_value: 5,
        use: {
            case: "outside",
            effect: [["player", "teleport", "floor1", [4,2]]] // change to correct
            // TBA: ADD BATTLE EFFECT?
        }
    },

    f1_forest_settlement_teleportation_stone: {
        name: "f1 forest settlement tp stone",
        type: "reagent",
        desc: "It is difficult to explain the function of this item, but it allows for instantaneous travel, albeit is destroyed" +
        " afterwards. [When exploring on floor one, consume to travel to the settlement in the forest region of the map.]",
        sell_value: 5,
        use: {
            case: "outside",
            effect: [["player", "teleport", "floor1", [17,20]]] // change to correct
            // TBA: ADD BATTLE EFFECT?
        }
    },

    f1_oras_hut_teleportation_stone: {
        name: "f1 ora's hut tp stone",
        type: "reagent",
        desc: "It is difficult to explain the function of this item, but it allows for instantaneous travel, albeit is destroyed" +
        " afterwards. [When exploring on floor one, consume to travel to ora's hut in the forest region of the map.]",
        sell_value: 5,
        use: {
            case: "outside",
            effect: [["player", "teleport", "floor1", "h"]] // change to correct
            // TBA: ADD BATTLE EFFECT?
        }
    },

    f0_end_teleportation_stone: {
        name: "f0 end tp stone",
        type: "reagent",
        desc: "It is difficult to explain the function of this item, but it allows for instantaneous travel, albeit is destroyed" +
        " afterwards. [When exploring on floor zero, consume to travel to the end of the path.]",
        sell_value: "unsellable",
        use: {
            case: "outside",
            effect: [["player", "teleport", "floor0", "z1"]] // change to correct
            // TBA: ADD BATTLE EFFECT?
        }
    },
    //#endregion


    // MISC - USABLE IN BATTLE
    //#region 
    stamina_vial: {
        name: "stamina vial",
        type: "reagent",
        desc: "A vial filled with invigorating reagents. Recovers 40 stamina upon use.",
        sell_value: 3,
        use: {
            case: "all",
            effect: [["player", "stamina", "flat", 40]],
            battleEffect: () => {
                const state = ["item:stamina_vial", {
                    damage: 30,
                    type: ["gain_stamina", "item"],
                    target: "self",
                }, "player"]
                skills.pushMessagesToState([`Used stamina vial!`])
                skills.gainStamina("player", 40, "self", state, true, Combat.getPlayer(), Combat.getEnemy());
            },
            pouchMax: 4
        }
    },

    health_potion: {
        name: "health potion",
        type: "reagent",
        desc: "A simple health potion. Recovers 40 HP upon use.",
        sell_value: 3,
        use: {
            case: "all",
            effect: [["player", "health", "flat", 40]],
            battleEffect: () => {
                const state = ["item:health_potion", {
                    damage: 30,
                    type: ["heal", "item"],
                    target: "self",
                }, "player"]
                skills.pushMessagesToState([`Used health potion!`])
                skills.gainHealth("player", 40, "self", state, true, Combat.getPlayer(), Combat.getEnemy());
            },
            pouchMax: 5
        }
    },

    greater_health_potion: {
        name: "greater health potion",
        type: "reagent",
        desc: "A fairly well-made health potion. Recovers 80 HP upon use.",
        sell_value: 15,
        use: {
            case: "all",
            effect: [["player", "health", "flat", 80]],
            battleEffect: () => {
                const state = ["item:greater_health_potion", {
                    damage: 80,
                    type: ["heal", "item"],
                    target: "self"
                }, "player"]
                skills.pushMessagesToState([`Used greater health potion!`])
                skills.gainHealth("player", 80, "self", state, true, Combat.getPlayer(), Combat.getEnemy());
            },
            pouchMax: 5
        }
    },

    crafted_health_potion: {
        name: "crafted health potion",
        type: "reagent",
        desc: "This health potion is somewhat of a spectacle of artisanship. Recovers 200 HP upon use.",
        sell_value: 50,
        use: {
            case: "all",
            effect: [["player", "health", "flat", 200]],
            battleEffect: () => {
                const state = ["item:crafted_health_potion", {
                    damage: 150,
                    type: ["heal", "item"],
                    target: "self",
                }, "player"]
                skills.pushMessagesToState([`Used crafted health potion!`])
                skills.gainHealth("player", 200, "self", state, true, Combat.getPlayer(), Combat.getEnemy());
            },
            pouchMax: 5
        }
    },

    mana_potion: {
        name: "mana potion",
        type: "reagent",
        desc: "A simple mana potion. Recovers 40 MP upon use.",
        sell_value: 3,
        use: {
            case: "all",
            effect: [["player", "mana", "flat", 40]],
            battleEffect: () => {
                const state = ["item:health_potion", {
                    type: ["mana_gain", "item"],
                    mana: 40,
                    target: "self",
                }, "player"]
                skills.pushMessagesToState([`Used mana potion!`])
                skills.gainMana("player", 40, "self", state, true, Combat.getPlayer(), Combat.getEnemy());
            },
            pouchMax: 5
        }
    },

    greater_mana_potion: {
        name: "greater mana potion",
        type: "reagent",
        desc: "A fairly well-made mana potion. Recovers 80 MP upon use.",
        sell_value: 15,
        use: {
            case: "all",
            effect: [["player", "mana", "flat", 80]],
            battleEffect: () => {
                const state = ["item:greater_health_potion", {
                    mana: 200,
                    type: ["mana_gain", "item"],
                    target: "self",
                }, "player"]
                skills.pushMessagesToState([`Used greater mana potion!`])
                skills.gainMana("player", 80, "self", state, true, Combat.getPlayer(), Combat.getEnemy());
            },
            pouchMax: 5
        }
    },

    crafted_mana_potion: {
        name: "crafted mana potion",
        type: "reagent",
        desc: "This mana potion is somewhat of a spectacle of artisanship. Recovers 200 MP upon use.",
        sell_value: 50,
        use: {
            case: "all",
            effect: [["player", "mana", "flat", 200]],
            battleEffect: () => {
                const state = ["item:crafted_health_potion", {
                    mana: 200,
                    type: ["mana_gain", "item"],
                    target: "self",
                }, "player"]
                skills.pushMessagesToState([`Used crafted mana potion!`])
                skills.gainMana("player", 200, "self", state, true, Combat.getPlayer(), Combat.getEnemy());
            },
            pouchMax: 5
        }
    },

    earthen_shield_potion: {
        name: "earthen shield potion",
        type: "reagent",
        desc: "A potion infused with the concentrated essence of the forest. Applies <u>Earthen Shield</u> [+100 resistance"+ 
        ", +50% mitigation, 1T duration] to the user. Can only be used in battle.",
        sell_value: 10,
        use: {
            case: "battle",
            battleEffect: () => {
                const state = ["item:health_potion", {
                    damage: 0,
                    type: ["buff", "item"],
                    target: "self",
                }, "player"]
                skills.pushMessagesToState([`Used earthen shield potion!`])
                const buff = {
                    name: "earthen shield",
                    duration: 1,
                    resistance: 100,
                    mitigation: 0.5,
                    element: "earth",
                    types: ["buff"],
                    apply_text: " is protected by the earth!",
                    max_stacks: 1,
                };
                const func = () => {
                    Combat.applyBuff(buff, 100, Combat.getPlayer(), Combat.getPlayer(), "buffs");
                };
                skills.applyBuff("player", func, "self", state, true, Combat.getPlayer(), Combat.getEnemy());
            },
            pouchMax: 3
        }
    },

    weak_slingshot: {
        name: "weak slingshot",
        type: "reagent",
        desc: "A weak slingshot. It can be used once but will break afterwards. Use in battle to deal low physical damage and" +
        " gain an action.",
        sell_value: 10,
        use: {
            case: "battle",
            battleEffect: () => {
                const state = ["item:weak_slingshot", {
                    damage: 0,
                    type: ["attack", "item"],
                    target: "opponent",
                }, "player"]
                const player = Combat.getPlayer();
                const enemy = Combat.getEnemy();

                const damage = skills.calcDamage(player, enemy, "atk", "def", "physical", "physical", 0.9, 1.15, 0.5);
            
                skills.prepareAttackMessage(player.name, enemy.name, `<br>${player.name} slung a slingshot at their enemy!`, damage);

                skills.dealDamage("player", damage.damage, "opponent", false, false, player, enemy);
                skills.gainActions("player", 1, "self", state, true, player, enemy, true);
            },
            pouchMax: 4
        }
    },

    invigorating_flower: {
        name: "invigorating flower",
        type: "reagent",
        desc: "An edible flower with invigorating qualities. Eat it in battle to gain 20 SP.",
        sell_value: 10,
        use: {
            case: "battle",
            battleEffect: () => {
                const state = ["item:invigorating_flower", {
                    damage: 0,
                    type: ["buff", "item"],
                    target: "self",
                }, "player"]
                skills.pushMessagesToState([`Used invigorating flower!`])
                skills.gainSP("player", 20, "self", state, true, Combat.getPlayer(), Combat.getEnemy(), true);
            },
            pouchMax: 3
        }
    },

    desperate_flower: {
        name: "desperate flower",
        type: "reagent",
        desc: "An edible flower with properties that increase with in effectiveness depending on the desperation" +
        " of the consumer. Grants 2 extra actions, then 1 additional action for every 30% of HP lost.",
        sell_value: 10,
        use: {
            case: "battle",
            battleEffect: () => {
                const state = ["item:desperate_flower", {
                    damage: 0,
                    type: ["buff", "item"],
                    target: "self",
                }, "player"]
                const player = Combat.getPlayer();
                const enemy = Combat.getEnemy();

                skills.pushMessagesToState([`Used desperate flower!`])

                skills.gainActions("player", 2, "self", false, false, player, enemy, true);
                if (player.health <= player.max_health * (70/100)) {
                    skills.gainActions("player", 1, "self", false, false, player, enemy, true);
                }
                if (player.health <= player.max_health * (40/100)) {
                    skills.gainActions("player", 1, "self", false, false, player, enemy, true);
                }
                if (player.health <= player.max_health * (10/100)) {
                    skills.gainActions("player", 1, "self", false, false, player, enemy, true);
                }
                skills.pushCustomFunc("player", () => {}, "self", state, true, player, enemy, false);
            },
            pouchMax: 2
        }
    },

    monster_essence: {
        name: "monster essence",
        type: "reagent",
        desc: "A pouch infused with various monster essences. Consume during battle to grant oneself a <u>Monster Soul</u>" +
        " for the duration of that battle.",
        sell_value: 20,
        use: {
            case: "battle",
            battleEffect: () => {
                const state = ["item:monster_essence", {
                    damage: 0,
                    type: ["buff", "item"],
                    target: "self",
                }, "player"]
                skills.pushMessagesToState([`Used monster essence!`])
                const buff = {
                    name: "monster soul",
                    duration: 999,
                    element: "none",
                    types: ["buff"],
                    fade: false,
                    unstrippable: true,
                    onTick: (type, user, plr, enemy) => {
                        skills.pushMessagesToState(["<br>The afflicted's monster soul radiates energy!"], true, "push");
                        skills.gainSP(type, 5, "self", false, false, plr, enemy, true);
                    },
                    apply_text: "'s monster soul radiates energy!",
                    max_stacks: 1
                }
                const func = () => {
                    Combat.applyBuff(buff, 100, Combat.getPlayer(), Combat.getPlayer(), "buffs");
                };
                skills.applyBuff("player", func, "self", state, true, Combat.getPlayer(), Combat.getEnemy());
            },
            pouchMax: 1
        }
    },

    kindred_essence: {
        name: "kindred essence",
        type: "reagent",
        desc: "A pouch infused with various kindred essences. Consume during battle to grant oneself a <u>Kindred Soul</u>" +
        " for the duration of that battle.",
        sell_value: 20,
        use: {
            case: "battle",
            battleEffect: () => {
                const state = ["item:kindred_essence", {
                    damage: 0,
                    type: ["buff", "item"],
                    target: "self",
                }, "player"]
                skills.pushMessagesToState([`Used kindred essence!`])
                const buff = {
                    name: "kindred soul",
                    duration: 999,
                    element: "earth",
                    types: ["buff"],
                    fade: false,
                    unstrippable: true,
                    onTick: (type, target, plr, enemy) => {
                        console.log(target);
                        skills.pushMessagesToState(["<br>The afflicted's kindred soul radiates energy!"], true, "push");
                        skills.gainHealth(type, Math.round(user.max_health * (3/100)), "self", false, false, plr, enemy, true);
                    },
                    apply_text: "'s kindred soul radiates energy!",
                    max_stacks: 1
                }
                const func = () => {
                    Combat.applyBuff(buff, 100, Combat.getPlayer(), Combat.getPlayer(), "buffs");
                };
                skills.applyBuff("player", func, "self", state, true, Combat.getPlayer(), Combat.getEnemy());
            },
            pouchMax: 1
        }
    },

    toxic_grenade: {
        name: "toxic grenade",
        type: "reagent",
        desc: "A small handcrafted grenade containing noxious materials. Deals very low physical damage, and applies <u>Empoisoned</u> [1% HP DOT, 50T duration, unstrippable] to the enemy. Application ignores resistance, and the attack cannot be evaded or crit.",
        sell_value: 30,
        use: {
            case: "battle",
            battleEffect: () => {
                const state = ["item:toxic_grenade", {
                    damage: 0,
                    type: ["attack", "item","debuff"],
                    target: "opponent",
                }, "player"]
                const player = Combat.getPlayer();
                const enemy = Combat.getEnemy();

                const damage = skills.calcDamage(player, enemy, "atk", "def", "physical", "physical", 0.25, 1.15, 0.5, { canCrit: false, canEvade: false});
                state.damage = damage;
            
                skills.prepareAttackMessage(player.name, enemy.name, `<br>${player.name} threw a toxic bomb at the enemy!`, damage);

                skills.dealDamage("player", damage.damage, "opponent", false, false, player, enemy);

                const buff = {
                    name: "empoisoned",
                    duration: 50,
                    element: "physical",
                    types: ["debuff"],
                    apply_text: " is empoisoned!",
                    damage: ["percentile", 1],
                    max_stacks: 1,
                    unstrippable: true
                };
                const func = () => {
                    Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs", { ignoreRes: true });
                };
                skills.applyBuff("player", func, "opponent", state, true, plr, enemy);

            },
            pouchMax: 4
        }
    },
    //#endregion
}
//
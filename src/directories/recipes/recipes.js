// -- IMPORTS -- \\

//


// -- RECIPES -- \\
export const recipeDirectory = {

    health_potion: {
        name: "Health potion",
        item: "health_potion",
        description: `Allows for the crafting of an item.`,
        gold: 5,
        items: [
            ["slime_ball", 2],
        ]
    },

    mana_potion: {
        name: "Mana potion",
        item: "mana_potion",
        description: `Allows for the crafting of an item.`,
        gold: 5,
        items: [
            ["slime_ball", 2],
        ]
    },

    // ----------------------- STARTING RECIPES ---------------------- \\
    // ----------------------- STARTING RECIPES ---------------------- \\
    // ----------------------- STARTING RECIPES ---------------------- \\
    // #region
    
    wooden_sword: {
        name: "Wooden sword",
        item: "wooden_sword",
        description: `Allows for the crafting of an item.`,
        gold: 0,
        items: [
            ["wood", 2],
        ]
    },

    vine_wrapped_wooden_sword: {
        name: "Vine wrapped wooden sword",
        item: "vine_wrapped_wooden_sword",
        description: `Allows for the crafting of an item.`,
        gold: 10,
        items: [
            ["wooden_sword", 1],
            ["weak_vine", 6]
        ]
    },

    wooden_stave: {
        name: "Wooden stave",
        item: "wooden_stave",
        description: `Allows for the crafting of an item.`,
        gold: 0,
        items: [
            ["wood", 2],
        ]
    },
    
    vine_wrapped_wooden_stave: {
        name: "Vine wrapped wooden stave",
        item: "vine_wrapped_wooden_stave",
        description: `Allows for the crafting of an item.`,
        gold: 10,
        items: [
            ["wooden_stave", 1],
            ["weak_vine", 6]
        ]
    },

    vine_armour: {
        name: "Vine armour",
        item: "vine_armour",
        description: `Allows for the crafting of an item.`,
        gold: 10,
        items: [
            ["weak_vine", 12]
        ]
    },

    strong_vine_chestplate: {
        name: "Strong vine chestplate",
        item: "strong_vine_chestplate",
        description: `Allows for the crafting of an item.`,
        gold: 15,
        items: [
            ["vine_armour", 1],
            ["weak_vine", 3],
            ["hempweed_ligament", 3]
        ]
    },

    vine_pantaloons: {
        name: "Vine pantaloons",
        item: "vine_pantaloons",
        description: `Allows for the crafting of an item.`,
        gold: 10,
        items: [
            ["weak_vine", 8]
        ]
    },

    feathervine_sword: {
        name: "Feathervine sword",
        item: "feathervine_sword",
        description: `Allows for the crafting of an item.`,
        gold: 25,
        items: [
            ["wood", 3],
            ["grey_wolf_pelt", 10],
            ["weak_vine", 7]
        ]
    },

    wolf_hermit_staff: {
        name: "Wolf hermit staff",
        item: "wolf_hermit_staff",
        description: `Allows for the crafting of an item.`,
        gold: 30,
        items: [
            ["wooden_stave", 1],
            ["grey_wolf_pelt", 10],
            ["sharp_claw", 2]
        ]
    },

    wooden_armour: {
        name: "Wooden armour",
        item: "wooden_armour",
        description: `Allows for the crafting of an item.`,
        gold: 0,
        items: [
            ["wood", 4],
        ]
    },

    wooden_trousers: {
        name: "Wooden trousers",
        item: "wooden_trousers",
        description: `Allows for the crafting of an item.`,
        gold: 0,
        items: [
            ["wood", 3],
        ]
    },

    vine_membrane_bracers: {
        name: "Vine membrane bracers",
        item: "vine_membrane_bracers",
        description: `Allows for the crafting of an item.`,
        gold: 20,
        items: [
            ["hempweed_ligament", 4],
            ["weak_vine", 10]
        ]
    },

    blue_vine_charm: {
        name: "Blue vine charm",
        item: "blue_vine_charm",
        description: `Allows for the crafting of an item.`,
        gold: 35,
        items: [
            ["slime_ball", 10],
            ["hempweed_ligament", 4],
            ["weak_vine", 8]
        ]
    },

    leather_pants: {
        name: "Leather pants",
        item: "leather_pants",
        description: `Allows for the crafting of an item.`,
        gold: 10,
        items: [
            ["leather", 2],
        ]
    },
    
    leather_cap: {
        name: "Leather cap",
        item: "leather_cap",
        description: `Allows for the crafting of an item.`,
        gold: 10,
        items: [
            ["leather", 1],
        ]
    },

    leather_armour: {
        name: "Leather armour",
        item: "leather_armour",
        description: `Allows for the crafting of an item.`,
        gold: 10,
        items: [
            ["leather", 3],
        ]
    },

    //#endregion


    // ----------------------- FLOOR ONE RECIPES BEGINNER ---------------------- \\
    // ----------------------- FLOOR ONE RECIPES BEGINNER ---------------------- \\
    // ----------------------- FLOOR ONE RECIPES BEGINNER ---------------------- \\
    //#region 
    wolfhide_armour: {
        name: "Wolfhide armour",
        item: "wolfhide_armour",
        description: `Allows for the crafting of an item.`,
        gold: 40,
        items: [
            ["grey_wolf_pelt", 8],
            ["leather", 1]
        ]
    },

    wolfhide_cap: {
        name: "Wolfhide cap",
        item: "wolfhide_cap",
        description: `Allows for the crafting of an item.`,
        gold: 30,
        items: [
            ["grey_wolf_pelt", 5],
            ["leather", 1]
        ]
    },

    wolfhide_leggings: {
        name: "Wolfhide leggings",
        item: "wolfhide_leggings",
        description: `Allows for the crafting of an item.`,
        gold: 30,
        items: [
            ["grey_wolf_pelt", 6],
            ["leather", 1]
        ]
    },

    slime_bracers: {
        name: "Slime bracers",
        item: "slime_bracers",
        description: `Allows for the crafting of an item.`,
        gold: 15,
        items: [
            ["slime_ball", 10],
            ["steel", 1]
        ]
    },

    slime_reinforced_sword: {
        name: "Slime reinforced sword",
        item: "slime_reinforced_sword",
        description: `Allows for the crafting of an item.`,
        gold: 5,
        items: [
            ["slime_ball", 10],
            ["simple_sword", 1]
        ]
    },

    wolfhide_charm: {
        name: "Wolfhide charm",
        item: "wolfhide_charm",
        description: `Allows for the crafting of an item.`,
        gold: 10,
        items: [
            ["sharp_claw", 2],
            ["grey_wolf_pelt", 8]
        ]
    },

    lizard_bracelet: {
        name: "Lizard bracelet",
        item: "lizard_bracelet",
        description: `Allows for the crafting of an item.`,
        gold: 150,
        items: [
            ["tiny_lizard_tail", 2],
            ["leather", 3]
        ]
    },

    aquus_orb: {
        name: "Aquus orb",
        item: "aquus_orb",
        description: `Allows for the crafting of an item.`,
        gold: 100,
        items: [
            ["aquus_cluster", 5],
        ]
    },

    water_infused_armour: {
        name: "Water infused armour",
        item: "water_infused_armour",
        description: `Allows for the crafting of an item.`,
        gold: 100,
        items: [
            ["aquus_cluster", 5],
            ["advanced_silver_armour", 1]
        ]
    },

    water_infused_helm: {
        name: "Water infused helm",
        item: "water_infused_helm",
        description: `Allows for the crafting of an item.`,
        gold: 100,
        items: [
            ["aquus_cluster", 3],
            ["advanced_silver_helm", 1]
        ]
    },
    
    water_infused_legwear: {
        name: "Water infused legwear",
        item: "water_infused_legwear",
        description: `Allows for the crafting of an item.`,
        gold: 100,
        items: [
            ["aquus_cluster", 4],
            ["advanced_silver_helm", 1]
        ]
    },

    luminant_charm: {
        name: "Luminant charm",
        item: "luminant_charm",
        description: `Allows for the crafting of an item.`,
        gold: 150,
        items: [
            ["steel", 2],
            ["leather", 2],
            ["light_absorbant_eye", 1]
        ]
    },

    wolfhide_dagger: {
        name: "Wolfhide dagger",
        item: "wolfhide_dagger",
        description: `Allows for the crafting of an item.`,
        gold: 20,
        items: [
            ["simple_dagger", 1],
            ["grey_wolf_pelt", 8]
        ]
    },

    pickaxe: {
        name: "Pickaxe",
        item: "pickaxe",
        description: `Allows for the crafting of an item.`,
        gold: 5,
        items: [
            ["steel", 1],
            ["wood", 1]
        ]
    },

    makeshift_steel_armour: {
        name: "Makeshift steel armour",
        item: "makeshift_steel_armour",
        description: `Allows for the crafting of an item.`,
        gold: 5,
        items: [
            ["steel", 3],
        ]
    },

    makeshift_steel_helm: {
        name: "Makeshift steel helm",
        item: "makeshift_steel_helm",
        description: `Allows for the crafting of an item.`,
        gold: 5,
        items: [
            ["steel", 2],
        ]
    },

    makeshift_steel_legwear: {
        name: "Makeshift steel legwear",
        item: "makeshift_steel_legwear",
        description: `Allows for the crafting of an item.`,
        gold: 5,
        items: [
            ["steel", 3],
        ]
    },

    makeshift_sword: {
        name: "Makeshift sword",
        item: "makeshift_sword",
        description: `Allows for the crafting of an item.`,
        gold: 5,
        items: [
            ["steel", 1],
            ["leather", 1]
        ]
    },

    wolven_reavers: {
        name: "Wolven reavers",
        item: "wolven_reavers",
        description: `Allows for the crafting of an item.`,
        gold: 15,
        items: [
            ["leather", 1],
            ["sharp_claw", 3],
            ["grey_wolf_pelt", 3]
        ]
    },

    bladed_armour: {
        name: "Bladed armour",
        item: "bladed_armour",
        description: `Allows for the crafting of an item.`,
        gold: 50,
        items: [
            ["makeshift_steel_armour", 1],
            ["sharp_claw", 4],
        ]
    },

    friendly_greater_slime: {
        name: "Friendly greater slime",
        item: "friendly_greater_slime",
        description: `Strengthen your slime buddy!`,
        gold: 0,
        items: [
            ["friendly_slime", 1],
            ["water_rune", 1],
            ["water_energy", 1],
            ["slime_bracers", 1]
        ]
    },

    crafted_health_potion: {
        name: "Crafted health potion",
        item: "crafted_health_potion",
        description: `Allows for the crafting of an item.`,
        gold: 10,
        items: [
            ["slime_ball", 3]
        ]
    },

    //#endregion

    // ----------------------- FLOOR ONE RECIPES ADVANCED ---------------------- \\
    // ----------------------- FLOOR ONE RECIPES ADVANCED ---------------------- \\
    // ----------------------- FLOOR ONE RECIPES ADVANCED ---------------------- \\
    //#region
    tear_of_lucia: {
        name: "Tear of Lucia",
        item: "tear_of_lucia",
        description: `Allows for the crafting of an item.`,
        gold: 500,
        items: [
            ["steel", 4],
            ["conduit_orb", 1],
            ["manasoul", 1]
        ]
    },

    shadow_cloak: {
        name: "Shadow cloak",
        item: "shadow_cloak",
        description: `Allows for the crafting of an item.`,
        gold: 400,
        items: [
            ["leather", 3],
            ["shadow_pelt", 8],
            ["shadow_corona", 1],
            ["grey_wolf_pelt", 15]
        ]
    },

    earthen_sword: {
        name: "Earthen sword",
        item: "earthen_sword",
        description: `Allows for the crafting of an item.`,
        gold: 220,
        items: [
            ["sharpened_sword", 1],
            ["venomous_claw", 4],
            ["sharp_claw", 3],
            ["steel", 3]
        ]
    },

    red_slime_bracers: {
        name: "Red slime bracers",
        item: "red_slime_bracers",
        description: `Allows for the crafting of an item.`,
        gold: 150,
        items: [
            ["red_slime_ball", 10],
            ["steel", 2]
        ]
    },

    shinobi_armour: {
        name: "Shinobi armour",
        item: "shinobi_armour",
        description: `Allows for the crafting of an item.`,
        gold: 300,
        items: [
            ["ninja_garb", 1],
            ["grey_wolf_pelt", 10],
            ["shadow_pelt", 5]
        ]
    },

    shinobi_headcloak: {
        name: "Shinobi headcloak",
        item: "shinobi_headcloak",
        description: `Allows for the crafting of an item.`,
        gold: 250,
        items: [
            ["ninja_wrap", 1],
            ["grey_wolf_pelt", 7],
            ["shadow_pelt", 3]
        ]
    },

    shinobi_leggings: {
        name: "Shinobi leggings",
        item: "shinobi_leggings",
        description: `Allows for the crafting of an item.`,
        gold: 280,
        items: [
            ["ninja_legwear", 1],
            ["grey_wolf_pelt", 8],
            ["shadow_pelt", 4]
        ]
    },

    water_orb_necklace: {
        name: "Water orb necklace",
        item: "water_orb_necklace",
        description: `Allows for the crafting of an item.`,
        gold: 200,
        items: [
            ["water_orb", 1],
            ["steel", 5],
            ["aquus_cluster", 12]
        ]
    },

    vinewarding_charm: {
        name: "Vinewarding charm",
        item: "vinewarding_charm",
        description: `Allows for the crafting of an item.`,
        gold: 25,
        items: [
            ["weak_vine", 3],
            ["hempweed_ligament", 2]
        ]
    },

    bearkiller_charm: {
        name: "Bearkiller charm",
        item: "bearkiller_charm",
        description: `Allows for the crafting of an item.`,
        gold: 50,
        items: [
            ["sharp_claw", 2],
            ["brown_fur", 5]
        ]
    },

    canine_charm: {
        name: "Canine charm",
        item: "canine_charm",
        description: `Allows for the crafting of an item.`,
        gold: 50,
        items: [
            ["grey_wolf_pelt", 6],
            ["sharp_claw", 3]
        ]
    },

    earthen_shield_potion: {
        name: "Earthen shield potion",
        item: "earthen_shield_potion",
        description: `Allows for the crafting of an item.`,
        gold: 10,
        items: [
            ["weak_vine", 3],
            ["hempweed_ligament", 1]
        ]
    },

    weak_slingshot: {
        name: "Weak slingshot",
        item: "weak_slingshot",
        description: `Allows for the crafting of an item.`,
        gold: 10,
        items: [
            ["weak_vine", 3],
            ["sharp_claw", 1],
            ["leather", 1]
        ]
    },

    leather: {
        name: "Leather",
        item: "leather",
        description: `Allows for the crafting of an item.`,
        gold: 5,
        items: [
            ["brown_fur", 2],
        ]
    },

    invigorating_flower: {
        name: "Invigorating flower",
        item: "invigorating_flower",
        description: `Allows for the crafting of an item.`,
        gold: 10,
        items: [
            ["brown_fur", 4],
            ["slime_ball", 2]
        ]
    },

    desperate_flower: {
        name: "Desperate flower",
        item: "desperate_flower",
        description: `Allows for the crafting of an item.`,
        gold: 10,
        items: [
            ["grey_wolf_pelt", 4],
            ["sharp_claw", 2]
        ]
    },

    monster_essence: {
        name: "Monster essence",
        item: "monster_essence",
        description: `Allows for the crafting of an item.`,
        gold: 20,
        items: [
            ["brown_fur", 3],
            ["slime_ball", 3],
            ["hempweed_ligament", 2],
            ["sharp_claw", 2],
            ["grey_wolf_pelt", 3],
            ["special_sap", 3]
        ]
    },

    kindred_essence: {
        name: "Kindred essence",
        item: "kindred_essence",
        description: `Allows for the crafting of an item.`,
        gold: 20,
        items: [
            ["monster_essence", 1],
            ["special_sap", 3],
            ["magic_bark", 3]
        ]
    },
    //#endregion

    // ----------------------- FLOOR ONE ORA RECIPES ----------------------- \\
    // ----------------------- FLOOR ONE ORA RECIPES ----------------------- \\
    // ----------------------- FLOOR ONE ORA RECIPES ----------------------- \\
    //#region 

    geomancers_hood: {
        name: "Geomancer's Hood",
        item: "geomancers_hood",
        description: `Allows for the crafting of an item.`,
        gold: 125,
        items: [
            ["magic_bark", 6],
            ["leather", 6],
        ]
    },

    geomancers_lower_robes: {
        name: "Geomancer's Lower Robes",
        item: "geomancers_lower_robes",
        description: `Allows for the crafting of an item.`,
        gold: 125,
        items: [
            ["magic_bark", 7],
            ["leather", 6],
        ]
    },

    virulent_brawler_leg_guards: {
        name: "Virulent Brawler Leg Guards",
        item: "virulent_brawler_leg_guards",
        description: `Allows for the crafting of an item.`,
        gold: 125,
        items: [
            ["venomous_claw", 4],
            ["forest_scourge_scale", 5],
        ]
    },

    virulent_brawler_helm: {
        name: "Virulent Brawler Helm",
        item: "virulent_brawler_helm",
        description: `Allows for the crafting of an item.`,
        gold: 125,
        items: [
            ["venomous_claw", 4],
            ["forest_scourge_scale", 5],
            ["grey_wolf_pelt", 3]
        ]
    },

    earth_mage_staff: {
        name: "Earth Mage Staff",
        item: "earth_mage_staff",
        description: `Allows for the crafting of an item.`,
        gold: 150,
        items: [
            ["magic_bark", 5],
            ["special_sap", 5],
            ["wood", 5]
        ]
    },

    virulent_bracers: {
        name: "Virulent Bracers",
        item: "virulent_bracers",
        description: `Allows for the crafting of an item.`,
        gold: 150,
        items: [
            ["venomous_claw", 3],
            ["grey_wolf_pelt", 8],
            ["sharp_claw", 4]
        ]
    },

    small_scaled_shield: {
        name: "Small Scaled Shield",
        item: "small_scaled_shield",
        description: `Allows for the crafting of an item.`,
        gold: 175,
        items: [
            ["forest_scourge_scale", 12]
        ]
    },

    toxic_grenade: {
        name: "Toxic grenade",
        item: "toxic_grenade",
        description: `Allows for the crafting of an item.`,
        gold: 30,
        items: [
            ["venomous_claw", 2],
            ["leather", 1]
        ]
    },

    // ----------------------------------------------- ADVANCED ---------- \\
    
    earth_magus_staff: {
        name: "Earth Magus Staff",
        item: "earth_magus_staff",
        description: `Allows for the crafting of an item.`,
        gold: 100,
        items: [
            ["earth_mage_staff", 1],
            ["earthen_manasoul", 1]
        ]
    },

    virulent_brawler_plates: {
        name: "Virulent Brawler Plates",
        item: "virulent_brawler_plates",
        description: `Allows for the crafting of an item.`,
        gold: 250,
        items: [
            ["venomous_claw", 4],
            ["forest_scourge_scale", 6],
            ["wood", 5]
        ]
    },

    geomancers_cloak: {
        name: "Geomancer's Cloak",
        item: "geomancers_cloak",
        description: `Allows for the crafting of an item.`,
        gold: 200,
        items: [
            ["magic_bark", 6],
            ["leather", 5],
            ["earthen_manasoul", 1]
        ]
    },

    living_virulent_bracers: {
        name: "Living Virulent Bracers",
        item: "living_virulent_bracers",
        description: `Allows for the crafting of an item.`,
        gold: 100,
        items: [
            ["virulent_bracers", 1],
            ["earthen_manasoul", 1]
        ]
    },

    ailwarder_charm: {
        name: "Ailwarder Charm",
        item: "ailwarder_charm",
        description: `Allows for the crafting of an item.`,
        gold: 175,
        items: [
            ["venomous_claw", 3],
            ["special_sap", 4]
        ]
    },

    tectonic_charm: {
        name: "Tectonic Charm",
        item: "tectonic_charm",
        description: `Allows for the crafting of an item.`,
        gold: 175,
        items: [
            ["wood", 6],
            ["special_sap", 4],
            ["magic_bark", 4]
        ]
    },

    virulent_charm: {
        name: "Virulent Charm",
        item: "virulent_charm",
        description: `Allows for the crafting of an item.`,
        gold: 175,
        items: [
            ["venomous_claw", 4],
            ["grey_wolf_pelt", 8],
        ]
    },
    //#endregion
}
//

/*    
slam_sword: {
    name: "slam sword",
    item: "slam_sword",
    description: "allows for the c.. o k i cba",
    gold: 4000,
    items: [
        ["slime_ball", 12],
        ["shortsword", 1]
    ]
}
*/
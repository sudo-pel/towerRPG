// -- IMPORTS -- \\
import * as gameData from '../../js/models/data';
import { saveGame } from '../../js/models/settings';
import { endTutorial } from '../../js';
//


// -- NPCS -- \\
export const floor0 = {

    f0_intro: {
        name: "Lucia",
        say: [["... <i>(Input anything to continue.)</i>", 0],
                ["...", 0],
                ['"Lore?"', 0],
                ['You slowly regain consciousness.', 0],
                ['"Lore! Lore!"', 0],
                ['You open your eyes.', 0],
                ["You're in a grassy clearing, surrounded by trees.", 0],
                ['???: Lore? Are you alright?', 0],
                ['Someone is standing a few feet away, staring at you. She has long blue hair and a shiny dress.', 0],
                ["???: ..Lore?", 0],
                ["???: Um, do you remember me? My name's Lucia.", 0],
                ["Lucia: Loo-See-Ah. Can you say it?", 0],
                ["Her repeated enunciation feels a little patronising.", 0],
                ["You should probably respond.", 0]],
        options: {
            "Loo-See-Ah": {
                say: [["Lucia smiles and claps happily. She looks a lot nicer with that expression.", 0],
                        ["[name]: Great! Great job!", 0],
                        ["[name]: Uhm...", 0], 
                        ["[name]: OK!", 0]],
                action: ["waypoint", "partTwo"]
            },
            "Loo-Sea": {
                say: [["Lucia pouts angrily at you. But you get the feeling that even if she were erupting with fury," +
                " it wouldn't be the least bit intimidating.", 0],
                ["[name]: Th-that's not how you say it!", 0],
                ["[name]: Loo-See-Ah! Loo-See-Ah! Understand?", 0],
                ["You wonder if she can tell that you're messing with her.", 0],
                ["[name]: <i>*sigh*</i>", 0]],
                action: ["waypoint", "partTwo"]
            }
        },
        "partTwo": {
            say: [
                ["[name]: We should get going. Follow me, okay? And don't lag behind!", 0],
                ["Lucia turns around and begins running (at a fairly pitiful pace) in the north direction, the only exit.", 0, true, { unskippable: true}],
                ["You should probably follow her...", 0],
            ],
            say2: [
                ["<b>NOTE: You will probably want to enable your minimap. Input 'sm'/'show minimap' or use the supercommand" +
                " 'sc-minimap' to toggle it. Otherwise, you won't know where you're going!</b>", 0, true, { unskippable: true }],
                ["<b>Squares that are blank white are squares you have seen (been adjacent to). Coloured squares" +
                " are places you have been to (different colour denotes a different 'type' of area). Squares with vertical" +
                " lines are unseen, and squares with two sets of diagonal lines are walls.", 0, true, { unskippable: true}]
            ],
            action2: ["flag", "f0_done_intro", "true"],
            action3: ["save"],
            action: ["end"]
        },
        end: [["", 0]]
    },

    f0_slime_fight: {
        name: "Lucia",
        say: [["It only takes a brisk walk in order to catch up with Lucia.", 0],
                ["But as you near her, you hear a slow, shifting movement in a group of bushes to the right just in front" +
                " of her.", 0],
                ["You grab her shoulder, and she stops moving.", 0],
                ["[name]: ..?", 0],
                ["The quiverings in the small thicket grow stronger and stronger, until--", 0]
        ],
        action: ["music", "battle$"],
        say2: [
                ["Without warning, a relatively small, somewhat amorphous blue creature bursts from the leaves!", 0],
                ["You charge at it without hesistation--", -0.5],
                ["[name]: Lore--", -0.2]
        ],
        action2: ["battle", [["slime", {
            overlayMusic: true
        }], ["waypoint", "postBattle"]]],
        "postBattle": {
            action: ["music", "forest"],
            say: [
                ["Lucia sighs.", 0],
                ["[name]: I could've handled that myself, Lore.. but thanks--", 0],
                ["You feel a sudden headache and grab at your head.", 0],
                ["[name]: Are you ok..? Are you remembering something?", 0],
                ["Despite her concern, there is a hint of hope in her voice..", 0],
                ["[name]: Just stay here and rest for a bit, okay? We can keep going when you feel better.", 0],
                ["<b>It looks like the battle against the slime jogged Lore's memory a bit, and he can remember some of" +
                " the skills he used to use.</b>", 0, true, { unskippable: true }],
                ["<b>Navigate the newly-unlocked <u>Stats</u> menu to learn the skills <u>Boost</u>, <u>Check</u> and" +
                " <u>Forgotten Haste</u>. Then, continue moving north.</b>", 0, true, { unskippable: true}]
            ],
            action5: ["heal"],
            action3: ["flag", "f0_fought_slime", "true"],
            action2: ["custom", () => {
                gameData.data.unlocked.stats = true;
                saveGame();
            }],
            action4: ["end"]
        },
        end: [["", 0]]
    },

    f0_young_wolf_fight: {
        name: "Lucia",
        action: ["custom", () => {
            const skills = gameData.data.player.stats.skills;
            if (skills.includes("lore-0") && skills.includes("lore-1") && skills.includes("lore-2")) {
                gameData.flags.f0_learnt_prerequisite_skills_1.complete = true;
            }
        }],
        conditional: {
            "flag: f0_learnt_prerequisite_skills_1": {
                action4: ["save"],
                action3: ["heal"],
                say: [
                    ["[name]: Ah-- wait up!", 0],
                    ["As you continue ahead of Lucia, there is a further rustle in a cluster of leaves again. To the left, "+
                    "this time--", 0]
                ],
                action: ["music", "battle$"],
                say2: [
                    ["The leaves quickly part to make way for a moderately-sized wolf, whose low growls appear almost"+
                    " in sync with the bristling of it's grey fur."],
                    ["Lucia appears to stay back intentionally this time, watching you intently."],
                    ["It would appear that there is nothing to do except fight--"]
                ],
                action2: ["battle", [["young_wolf", {
                    overlayMusic: true
                }], ["waypoint", "postBattle"]]],
            },
            "level: 0": {
                say: [
                    ["<b>You need to learn and equip the prerequisite skills before proceeding.</b>", 0]
                ],
                action: ["teleport", "t1"],
                action2: ["end"]
            }
        },
        "postBattle": {
            action: ["music", "forest"],
            say: [
                ["Lucia stares at you for a few seconds before speaking up.", 0],
                ["[name]: Um-- Lore, do you remember anything?", 0],
                ["You feel a little stronger, but you can't remember much--", 0],
                ["Another headache. Stronger this time, and it spreads throughout your entire body - as though something foreign was entering your body.", 0],
                ["[name]: L-Lore!", 0],
                ["[name]: Rest here again for a bit.. we're in no rush. Just try and calm down for a little, okay?", 0],
                ["Lucia's voice puts you at ease. You sit down and try to empty your mind.", 0],
                ["<b>A tiny fraction of Lore's power is returning to him. You should now be able to unlock the remainder" +
                " of his skills. Do so, then equip them and proceed.</b>", 0, true, { unskippable: true }]
            ],
            action2: ["flag", "f0_fought_young_wolf", "true"],
            action3: ["save"],
            action5: ["heal"],
            action4: ["end"]
        },
        end: [["", 0]]
    },

    // -- unshortened

    f0_teaching_crafting: {
        name: "Lucia",
        action: ["custom", () => {
            const skills = gameData.data.player.stats.skills;
            if (skills.includes("lore-3") && skills.includes("lore-4") && skills.includes("lore-5")) {
                gameData.flags.f0_learnt_prerequisite_skills_2.complete = true;
            }
        }],
        conditional: {
            "flag: f0_learnt_prerequisite_skills_2": {
                say: [["You begin to continue walking. Lucia follows to your right, keeping pace.", 0],
                        ["You may imagining this, but is there a slight spring in her step?", 0],
                        ["[name]: Alright! *<i>She taps your shoulder twice before slowing down.*</i>", 0],
                        ["[name]: Lore? I'm going to try and teach you something else now..", 0]
                ],
                options: {
                    "Stop walking": {
                        say: [
                            ["You stop walking and listen.", 0],
                            ["[name]: Wait here for a second!", 0],
                            ["She runs to the south.", 0],
                            ["A few seconds later she returns, holding a few clusters of fairly stiff blue slime in one hand" +
                            ", and some pieces of wood in another.", 0],
                            ["[name]: Um.. you used to be quite good at crafting, so try and make something with these, Okay?", 0],
                            ["[name]: It's okay if you don't get it right the first time, but I think you might remember more" +
                            " if you give this a try!", 0],
                            ["She forces the items into your chest and you take hold of them. Then she stands there expectantly," +
                            " waiting for you to do something.", 0]
                        ],
                        action: ["waypoint", "postChoice"]
                    },
                    "Ignore her": {
                        say: [
                            ["You ignore her and keep walking, leaving her behind in the process. You can tell without looking back" +
                            " that she is both hurt and irritated.", 0],
                            ["[name]: Lore!! Stop ignoring me--", 0]
                        ],
                        action: ["music", "battle$"],
                        say2: [
                            ["[name]: AAH--!", 0],
                            ["A scream?! You quickly ready yourself and whip your head around--"]
                        ],
                        action2: ["music", "forest"],
                        say3: [
                            ["[name]: Just kidding!", 0],
                            ["[name]: That'll teach you to mess with me!", 0],
                            ["Lucia laughs at you for a bit. Then, just as you notice she has her hands behind her back," +
                            " she reproduces from behind her some pieces of wood and some balls of slime.", 0],
                            ["[name]: Try and craft something with these, okay? It might help you remember something.", 0],
                        ],
                        action3: ["waypoint", "postChoice"]
                    }
                }
            },
            "level: 0": {
                say: [
                    ["<b>You need to learn and equip the prerequisite skills before proceeding.</b>", 0],
                    ["<b>Learn and equip the remainder of Lore's skills before continuing.</b>", 0]
                ],
                action: ["teleport", "t2"],
                action2: ["end"]
            },
            "postChoice": {
                say: [
                    ["<b>Lucia's given you some items to practice crafting with. After this, you'll see that you've unlocked" +
                    " the crafting menu. Craft a <u>Wooden Sword</u> and then equip it via the <u>inventory</u>. Then," +
                    " craft a <u>Health Potion</u> and add it to your pouch, also via the inventory. Then, continue north.", 0,
                    true, { unskippable: true }],
                    ["<b>Also, don't worry if you mess up! The game won't save until you progress beyond this point" +
                    ", so just refresh the page if you accidentally consume the health potion.", 0, true, { unskippable: true }]
                ],
                action: ["items", "wood", 2],
                action2: ["items", "slime_ball", 2],
                action3: ["flag", "f0_been_taught_crafting", "true"],
                action4: ["custom", () => {
                    gameData.data.unlocked.crafting = true;
                    gameData.data.unlocked.inventory = true;
                    saveGame();
                }],
                action5: ["end"]
            }
        },
        end: [["", 0]]
    },

    f0_f4_checkpoint: {
        name: "Lucia",
        action: ["custom", () => {
            const equip = gameData.data.player.stats.equips;
            const pouch = gameData.data.player.stats.pouch;
            if (equip.weapon == "wooden_sword" && pouch.findIndex(e => { return e[0] == "health_potion"}) != -1 ) {
                gameData.flags.f0_crafted_required_items.complete = true;
            }
        }],
        conditional: {
            "flag: f0_crafted_required_items": {
                say: [
                    ["Lucia is looking at you expectantly.", 0],
                    ["[name]: Well? Remember anything?", 0],
                    ["...", 0],
                    ["She takes your silence to mean 'no'. She sighs and her face adorns a downcast expression.", 0],
                    ["[name]: Well.. let's just keep going.. watch your step because it looks like there are monsters about.", 0],
                    ["Lucia starts north once again, before disappearing around a turn. It seems at this point the straight north tunnel branches out into different paths.", 0],
                    ["<b>Keep following Lucia as best you can. As she said, watch out for monsters ambushing you as you walk." +
                    " If you come across some slimes, you might be able to use their drops to make more health potions. Also, look out for additional options to interact with objects while you explore!", 0, true,
                    { unskippable: true }],
                    ["<b>In the area to come, you may be able to find some things if you <u>Explore</u>, as well." +
                    " You will either find items or encounter an enemy, so be on your toes!.", 0, true,
                    { unskippable: true }]
                ],
                action5: ["recipe", "mana_potion"],
                say2: [
                    ["<b>You'll find that you've unlocked a personal recipe for crafting mana potions.</b>", 0, true, { unskippable: true }],
                    ["<b>You might need it in the future, so keep it in mind!</b>", 0, true, { unskippable: true }],
                    ["<b>By the way-- auto save will be enabled from this point. If you'd like to disable it, you can do so in setings.", 0, true, { unskippable: true }]
                ],
                action4: ["custom", () => {
                    gameData.settings.autoSave = true;
                    gameData.data.special.canToggleAutosave = true;
                }],
                action: ["flag", "f0_passed_t4", "true"],
                action3: ["save"],
                action2: ["end"]
            },
            "level: 0": {
                say: [
                    ["<b>You need to craft and equip the wooden sword, and craft the health potion and add it to your pouch.</b>"],
                    ["<b>Do these two things, then proceed to the north.</b>"]
                ],
                action: ["teleport", "t3"],
                action2: ["end"]
            }
        },
        end: [["", 0]]
    },

    f0_dreadful_wolf_fight: {
        name: "Lucia",
        action2: ["save"],
        action: ["heal"],
        action3: ["items", "f0_end_teleportation_stone", 1],
        say: [
            ["You and Lucia have been walking for a while now, in complete silence.", 0],
            ["It's difficult to tell how she feels about the situation, and your reluctance to speak. But" +
            " because of your previous headaches and pains, hearing only the low whisp of leaves overhead is quite a" +
            " soothing experience.", 0],
            ["[name]: Umm... Lore.", 0],
            ["Lucia chooses to break the silence.", 0],
            ["[name]: I'm sorry, I've been pushing you around a lot since you woke up.", 0],
            ["[name]: Do you have any questions? You know, about the situation, or what happened...", 0],
            ["It looks like this would be a good chance to get some info. You gathered a bit from things she's" +
            " said but you're still very much in the dark. Really, you don't even know who she is. So, you decide to ask about..", 0]
        ],
        options: {
            "Ask about who Lucia is": {
                say: [
                    ["You ask Lucia about who she is.", 0],
                    ["[name]: Me? Um.."],
                    ["She thinks for a bit.", 0],
                    ["[name]: Well, my name's Lucia. I'm 17 years old!", 0],
                    ["This isn't really what you meant, but you don't say anything.", 0],
                    ["[name]: I'm a type of magic user called a Nexus, which means I draw magic from beings I've" +
                    " contracted with while adventuring. I'm quite accomplished in my field, actually!", 0],
                    ["She smacks her chest in a motion of pride.", 0],
                    ["[name]: I can also do lots of other things like use normal magic, ritual magic," + //  like use basic magic, use ritual magic, perform
                    " internal and external summoning, some spiritual arts..", 0],
                    ["Lucia checks herself.", 0],
                    ["[name]: Um-- anyways, I met you a few years ago and we went on some adventures... then...", 0],
                    ["[name]: ..well, that's everything about me."],
                    ["Lucia stops talking and looks forwards again. You continue in silence for a while.", 0]
                ],
                action: ["waypoint", "postChoice"]
            },
            "Ask about who you are": {
                say: [
                    ["You ask Lucia about who you are.", 0],
                    ["To be honest, you can remember quite a bit about yourself.", 0],
                    ["You're 17, and you come from a rural town named Arlam.", 0],
                    ["You're good with a sword and often called kind, alhough reticent. You had a younger sister.", 0],
                    ["Despite all this knowledge, you feel like there's something missing.. lost in your thoughts" +
                    " for a short while, you miss some of what Lucia was saying.", 0],
                    ["[name]: --And your dad is a great cook-- hey, are you listening?", 0],
                    ["You affirm to her your attention. She looks suspiciously at you then turns forward and continues speaking", 0],
                    ["[name]: Anyways, we met a few years ago. I think your village has a lot of ex-adventurers and mercenaries," +
                    " so by the time we met, you were already good at fighting.", 0],
                    ["[name]: We went on some adventures, finding rare things and learning lots of secrets.", 0],
                    ["Lucia looks at you with a sad smile.", 0],
                    ["[name]: Anyways, it looks like you don't remember much of that stuff.. I won't get into it here.", 0],
                    ["Lucia stops talking and looks forwards again. You continue in silence for a while.", 0]
                ],
                action: ["waypoint", "postChoice"]
            },
            "Ask about what happened": {
                say: [
                    ["You ask Lucia about what happened.", 0],
                    ["As she listens to your question, she starts to look a bit uncomfortable. You can't tell" +
                    " if it's because you're bringing up something she doesn't want you to know, or if it's" +
                    " because you're bringing up something she doesn't want to recall.", 0],
                    ["[name]: ..Um..", 0],
                    ["[name]: Well, we were adventuring partners for a while... but one day..", 0],
                    ["[name]: We were battling an enemy, and they.. did something to you..", 0],
                    ["[name]: And you became like this.", 0],
                    ["[name]: I had to get away with you, but it was hard, and I got hurt a little..", 0],
                    ["Lucia runs her right hand over her left arm. If you squint, you can see very faded cuts and bruises" +
                    ". It looks like they were healed with some kind of magic.", 0],
                    ["[name]: But it's okay now! Really... I think you're slowly returning to normal..", 0],
                    ["Lucia smiles sadly.", 0]
                ],
                action: ["waypoint", "postChoice"]
            },
            "Ask about your relationship with Lucia": {
                say: [
                    ["It's a bit weird how you awoke with Lucia alone, with nothing or nobody in sight.", 0],
                    ["So, you decide to ask about your relationship with Lucia", 0],
                    ["[name]: ..Huh?", 0],
                    ["Lucia seems a little startled at your question.", 0],
                    ["[name]: Is now really the time to be asking something like that? *<i>She says quietly.</i>*"],
                    ["[name]: A-Anyways, we were good friends. We've known each other for a while.", 0],
                    ["She doesn't elaborate.", 0]
                ],
                action: ["waypoint", "postChoice"]
            }, 
            "Don't ask anything": {
                say: [
                    ["You look at her as though to elucidate that you have nothing to say. She looks back at you," +
                    " and then turns her head forwards again.", 0],
                    ["[name]: Hm.. Okay.", 0]
                ],
                action: ["waypoint", "postChoice"]
            }
        },
        "postChoice": {
            say: [
                ["It's been a while. Just as you had started to get into the flow of silently following the repetitive path" +
                ", Lucia stops walking and grabs your arm.", 0]
            ],
            action: ["music", "stop"],
            say2: [
                ["[name]: There's something nearby...", 0],
                ["You sense it isn't as great as what Lucia feels, but a feeling of alarm creeps down your spine and" +
                " throughout your body.", 0],
                ["A rustling sensation crops up in the foliage surrounding the tunnel. It comes and goes, in different" +
                " places each time.", 0],
                ["At first it is distant. You wonder if Lucia heard it from so far away. But it grows closer and closer..", 0],
                ["[name]: LORE! Look out!--", 0]
            ],
            action3: ["music", "intimidating_enemy$"],
            say3: [
                ["A dark grey blur bursts from the right and cuts straight through you!--", 0],
                ["Or it would've, you realised, had Lucia not pushed you out of the way.", 0],
                ["You get up and turn your head to Lucia--", 0],
                ["She's clearly alive, but the <i>thing</i> grazed her arm. It's bleeding, and underneath her skin, you" +
                " can see something blackish-purple pulsating balefully.", 0],
                ["You get up to help her, but something stands in your path.", 0],
                ["It's some kind of wolf, but it's hairs are not only standing on end, but writhing and threshing as though"+ 
                " they're trying to escape the skin of the creature.", 0],
                ["It has irises of purple, the pigment of which leak into a pair of deep black sclera.", 0],
                ["[name]: Lor-e. . Ru-n...", 0],
                ["Lucia looks as though she's on the verge of collapsing. But really, you don't notice.", 0],
                ["Your attention is absorbed by the thing before you, and the fighting instinct that it's awakening in you.", 0],
                ["The thing whose growls sound like how it would feel to drown in a sea of spiders, that is pouncing at you this very moment--", -1]
            ],
            action2: ["battle", [["dreadful_wolf", {
                overlayMusic: true
            }], ["waypoint", "postBattle"]]],
        },
        "postBattle": {
            action: ["music", "none"],
            say: [
                ["With the creature vanquished, your raging mind settles and you turn your focus to Lucia.", 0],
                ["[name]: LORE!!"],
                ["In the brief moments before she hugs you, you note that her wounds are quickly fading. It looks" +
                " like she used some kind of healing magic in the time your spent fighting.", 0],
                ["She quickly lets go of you.", 0],
                ["[name]: W-We don't have time. We need to hurry!", 0],
                ["And with that, she runs onwards, explaining nothing. She doesn't turn her back once, likely trusting" +
                " that you will follow close behind.", 0],
                ["<b>Up ahead is the last encounter of this tutorial. Make sure you're prepared, it may not" +
                " be an easy fight. It is recommended you have full health and mana going into the battle.</b>", 0,
                true, { unskippable: true}],
                ["<b>If need be, you can go back and fight some slimes for more pouch items.</b>", 0, true, { unskippable: true}],
                ["<b>If you have items you would like to preserve or use again, you can disable auto save in settings before the final confrontation.", 0, true, { unskippable: true}]
            ],
            action2: ["flag", "f0_fought_dreadful_wolf", "true"],
            action3: ["save"],
            action4: ["end"]
        },
        end: [["", 0]]
    },

    f0_charon_fight: {
        name: "Lucia",
        action8: ["items", "f0_end_teleportation_stone", 1],
        action7: ["save"],
        action6: ["heal"],
        say: [
            ["It feels like you've been running non-stop for ages.", 0],
            ["[name]: Just... <i>*pant*</i> a lit.. <i>*pant</i>* ..tle more... <i>*pant*</i>...", 0],
            ["For the first time since you started running, Lucia turns back to you.", 0],
            ["[name]: Lore! I can see the end--", 0],
            ["...", 0],
            ["???: Hey.", 0],
            ["[name]: Y.. how...", 0],
            ["???: How? More like, how did you escape? Amirite?", 0],
            ["You haven't turned around to face it, so you don't know what it looks like. But from its voice" +
            " you feel like it were an inescapable chasm, leading to a void that contained every disease;", 0],
            ["Every pain, every kind of suffering possible.", 0],
            ["Slowly, you wrench your head 180 degrees to face what can only be descriped as impending despair.", 0]
        ],
        action: ["music", "intimidating_enemy$"],
        say2: [
            ["It has the clothes of a malnourished peasant.", 0],
            ["Deep black skin embroidered with bright red patterns wearing a single dark brown cloth- that covers its torso" +
            " and a small amount of its legs.", 0],
            ["Through it's black eyes encased in a white-and-red cornea, you wonder if it sees the same world you do.", 0],
            ["???: Horribly convenient, isn't it? For something like <i>teleporation</i> to work while I was around..", 0],
            ["???: I'm pretty sure you had better ways of getting away but you panicked, didn't you? Luckily for me" +
            ", you panicked.", 0],
            ["???: You see, I'm a bit of a genius... so I just re-routed your teleportation to come here. There's nowhere to run now. Barely any mana to draw upon... but you're too wounded now anyways, aren't you?", 0],
            ["[name]: W-Wh...", 1],
            ["???: Aah, whatever. I don't know if I can beat you, but this kid should be easy. You're next, I guess.", 0],
            ["You don't know exactly what's going on or what Lucia knows about this thing, but you don't feel the same" +
            " paralysing trepidation she does.", 0],
            ["You assume a battle-ready stance and face it. In all likelihood, this is your only chance. You have to beat it" +
            " here, or Lucia--", 0]
        ],
        action2: ["music", "mechanical_rhythm$"],
        say3: [
            ["???: You want to fight back?", 0],
            ["It shrugs.", 0],
            ["???: Well, alright. I'll toy with you a bit.. I've been pretty bored lately.", 0],
            ["You narrow your eyes and prepare yourself. He approaches slowly at first...", 0],
            ["Before dashing towards you at breakneck speed!--", -1]
        ],
        action4: ["custom", () => {
            gameData.data.unlocked.ascend = true;
        }],
        action5: ["save"],
        action3: ["battle", [["charon", {
            overlayMusic: true
        }], ["waypoint", "postBattle"]]],
        "postBattle": {
            action: ["music", "intimindating_enemy$"],
            say: [
                ["???: Wow! You're alive.", 0],
                ["There is no mockery or disrespect in his voice. He seems genuinely surprised and impressed.", 0],
                ["??? But of course, you're no match for me. Get out of my sight.", 0],
                ["And with that, he sweeps his arm at your torso.", 0],
                ["You're convinced there must be some kind of special technique he's using; some kind of magic enhancement of his strength - "+ 
                "there's no time to react to his somewhat frail atramentous arm as it strikes you from the side.", 0],
                ["Midway through considering this, all thought is lost as the appendage actually makes contact-- you can feel several bones" +
                " in your body snap as you're flung into a tree in the distance.", 0],
                ["[name]: LORE!!", 0],
                ["Lucia is shouting, but you can barely hear her. Your consciousness mimics your blood and drains from your body rapidly.", 0],
                ["The last thing you see as your vision fades quickly from red, to black, into nothing, is the jet black figure steadily approaching" +
                " Lucia, and the last thing you hear, her cries--", 0],
                ["[name]: LORE!! GET UP!!", 0],
                ["It's no use. Her pleas can't reach you.", 0]
            ],
            say2: [
                ["...", 0],
                ["You're dead.", 0],
                ["If you're dead, then where are you?", 0],
                ["You can't tell.", 0],
                ["Worse yet, you can't even tell that you can't tell, nor can you tell light from dark, night from day. You're dead, after all.", 0],
                ["But still, you feel there is something in you, clinging to life. If 'death' is a murky black sea; Styx; a flowing stream of tar" +
                " from which nothing can escape, then you are hanging on a crag just above--", 0],
                ["You hand clapsing the edge of the cliff is not a physical one, but rather a metaphorical one; 'hope', 'willpower', call it what you will.", 0],
                ["Ultimately, it matters not. Just as the strength faded from your dying body, strength too will fade from your dying soul.", 0],
                ['"..orun..! ..seech! ..heed... ..!!!"', 0],
                ["...", 0],
                ["Was that... sound from the land of the living?", 0],
                ["Just as your grip was fading, and Styx, the Reaper, Hades, all concepts of death seemed so inviting..", 0],
                ["You started to feel light..", 0],
                ["Until eventually, you were lighter than air. And you began to float.", 0],
                ["Out of this land of impending death, out from the depths of your soul, back through the cage of your mind and into the land of the living--", 0]
            ],
            action2: ["music", "creator"],
            say3: [
                ["Your vision is recovering slowly, but at the moment, you can only see splotches; people or things, you presume, in a misty green backdrop.", 0],
                ["One of the blotches has blue hair, you infer. And one is almost pitch black.", 0],
                ["And...", 0],
                ["???: Lucia, you have summoned me. Do you understand what this means?", 0],
                ["It looks like your hearing has returned as well. You don't hear Lucia respond-- you can't tell if that's because she didn't or because" +
                " you didn't hear it.", 0],
                ["It hurts to look at the third blur. It's body emits a blazing light, but you don't think that's the reason you are unable to stare at it.", 0],
                ["It's a different pain from having searing light injected into one's ears. Different from the mind-numbing sensastion of having your" +
                " bones splinter and scrape at your insides.", 0],
                ["Instead, whenever your eyes attempt to focus on it, there's this insurmountable feeling of dread.. like you're unworthy of existing in it's" +
                " presence.", 0],
                ["Focusing on its image in your peripheral vision, you manage to observe it turning from Lucia (who you can now see more clearly) to the thing" +
                " that nearly killed-- no, that <i>did</i> kill you.", 0],
                ["???: Charon. I did not create you, but all acts of creation must be powered or preceded by some prior act of creation. Everything has a source.", 0],
                ["???: I am not your creator. However, if you follow the flow of 'power of creation' that resulted in your conception upstream..", 0],
                ["???: Eventually, you will find myself.", 0],
                ["???: I do not know what, if anything, supersedes my authority. However, although I am not your direct creator...", 0],
                ["???: In this case, I will exert my existential seniority over you and reclaim that which originally came from me.", 0],
                ["Charon: --Wh-", 0],
                ["You assume Charon is the name of the black-and-red, bipedal thing that is recoiling in shock.", 0],
                ["You are healed enough to speak, however an unknown force has sealed your mouth shut.", 0],
                ["Somehow, Charon forces the wind in his lungs against the oppressive force that must be assialing him..", 0],
                ["Charon: ...who.. ar...e...", 0],
                ["???: I will only do what is necessary, and I will as such grant you a 'death' as beings of your Tier see it.", 0],
                ["???: Your physical life will cease, however your abstract life; the memories that others have on you and the impact you have had" +
                " on this world, will remain.", 0],
                ["???: Regardless, you will have no use for my name.", 0],
                ["???: Now, I will make a gesture that those of your Tier see befitting of the action I will undertake...", 0],
                ["You are still unable to look directly at the thing which never even acknowledged you. But you are able to tell that it is moving one of it's hands" +
                ", which was originally held loosely at its side, and raising it to point at Charon.", 0],
                ["???: I cast... ᛞᛖᚨᛏᚺ.", 0],
                ["As he casts his 'spell', you can feel the earth beneath you begin to quiver, then quake, and begin to crumble--", 0],
                ["The light radiating from the unknown entity increases rapidly in intensity, until you have to seal your eyes shut completely" +
                " to avoid becoming blind. But somehow, you know that the measly cover from the flaps of flesh that are you eyelids will be" +
                " insufficient.", 0],
                ["The blackness you percieve from the cover of your eyelids turns red, and then white...", 0]
            ],
            action4: ["music", "none"],
            action3: ["custom", () => {
                gameData.data.special.clearedTutorialTrue = true;
                saveGame();
                endTutorial();
            }]


        }
    },

    // INTERESTING ITEMS ON FLOOR
    /* #region */

    f0_greater_health_potion_on_floor: {
        interesting_item: ["f0_picked_up_greater_health_potion", ["greater_health_potion", 1]],
        end: [["", 0]]
    },
    f0_greater_mana_potion_on_floor: {
        interesting_item: ["f0_picked_up_greater_mana_potion", ["greater_mana_potion", 1]],
        end: [["", 0]]
    },
    f0_invigorating_flower_on_floor: {
        interesting_item: ["f0_picked_up_invigorating_flower", ["invigorating_flower", 1]],
        end: [["", 0]]
    },
    f0_desperate_flower_on_floor: {
        interesting_item: ["f0_picked_up_desperate_flower", ["desperate_flower", 1]],
        end: [["", 0]]
    },
    f0_stamina_vial_on_floor: {
        interesting_item: ["f0_picked_up_stamina_vial", ["stamina_vial", 1]],
        end: [["", 0]]
    },
    f0_monster_essence_on_floor: {
        interesting_item: ["f0_picked_up_monster_essence", ["monster_essence", 1]],
        end: [["", 0]]
    },
    f0_simple_sword_on_floor: {
        interesting_item: ["f0_picked_up_simple_sword", ["simple_sword", 1]],
        end: [["", 0]]
    },
    f0_leather_cap_on_floor: {
        interesting_item: ["f0_picked_up_leather_cap", ["leather_cap", 1]],
        end: [["", 0]]
    },
    f0_wolfhide_charm_on_floor: {
        interesting_item: ["f0_picked_up_wolfhide_charm", ["wolfhide_charm", 1]],
        end: [["", 0]]
    },

    /* #endregion */

}
//


/*

*/
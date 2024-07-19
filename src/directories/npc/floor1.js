// -- IMPORTS -- \\

//


// -- NPCS -- \\
export const floor1 = {
    /*
    old_man: {
        name: "Old man",
        say: [["<i>You approach the old man.", 0], ["[name]: Hello! How are you faring today?", 0]],
        options: {
            "I'm okay, thanks": {
                say: [["[name]: That's good. Hope you've been eating your greens.", 0],
                ["[name]: Any idea where I am?", 0]],
                options: {
                    "no, sorry": {
                        say: [["[name]: Oh, shame. Want to see my teeth?", 0]],
                        options: {
                            "no": {
                                say: [["[name]: Ok.", 0]],
                                options: {
                                    "ok, goodbye": {
                                        action: ["end"]
                                    },
                                    "put 'em up old man": {
                                        say: [["[name]: Okay brother, you're asking for it.", 0],
                                        ["Here we go!", 0]],
                                        action: ["battle", ["wolf", ["waypoint", "no, sorry"]]]
                                    }
                                }
                            },
                            "yes": {
                                say: [[`<i>You respond 'yes', and also compliment him on his teeth.</i>`, 0]],
                                action: ["waypoint", "You have nice teeth"]
                            }
                        }
                    }
                }
            },
            "You have nice teeth": {
                say: [["I know. Here, have a look", 0],
                ["<i>He shows you his teeth</i>", 0],
                ["Buy some!", 0]],
                action: ["shop", "old_man", ["waypoint", "no, sorry"]]
            }
        },
        end: [["[name]: Ok bye", 0]]

    },
    */
    lily: {
        name: "Lily",
        say: [[`<i>You approach the child. As you near her, she backs away slightly.`, 0]],
        conditional: {
            "level: 0": {
                say: [[`[name]: H-Hello [player]... can you help me?`]],
                action: ["gold", 0],
                action3: ["exp", 0],
                action2: ["end"]
            },
            "item: 1212 slime_ball": {
                say: [[`[name]: Icky! Slime!`]],
                action: ["items", "slime_ball", 0],
                action2: ["end"]
            },
            "flag: -beatSlime": {
                say: [[`[name]: You haven't beat the slime? Weakling.`]],
                action: ["recipe", "slam_sword"],
                action2: ["end"]
            },
            "level: 121": {
                say: [[`[name]: I don't have anything interesting to say to you`, 0]],
                action: ["end"]
            }
        },
        end: [["[name]: Goodbye.", 0]]
    },

    f1_little_girl: {
        name: "Little girl",
        conditional: {
            "flag: -f1_spoken_to_little_girl": {
                say: [["[name]: Hello! You can fight right? Help me gather slimes!", 0],
                ["[name]: I loooove slimes. They are so slimy. I love slimy things!", 0],
                ["[name]: If you help me get some slime, I will give you my pocket money! That's a good deal right?" +
                " Get me some slimes! 20 Slime balls, please!", 0]],
                action: ["flag", "f1_spoken_to_little_girl", "true"],
                action2: ["end"]
            },

            "flag: f1_spoken_to_little_girl": {
                conditional: {
                    "flag: -f1_helped_little_girl": {
                        conditional: {
                            "item: 20 slime_ball": {
                                say: [["[name]: You got the slime balls! Thank you Thank youThankyouThankyouThankyou--", 0],
                                ["<i>She takes the slime balls off you without warning or consent.", 0],
                                ["<i>Her excitement is a little disconcerting. Best take the money and leave...</i>", 0]],
                                action: ["gold", 250],
                                action5: ["exp", 250],
                                action2: ["items", "slime_ball", -20],
                                action3: ["flag", "f1_helped_little_girl", "true"],
                                action4: ["end"]
                            },
                            "level: 0": {
                                say: [["[name]: You haven't got the slime balls yet?", 0],
                                ["<i>The girl looks disappointed. Like she might cry..", 0],
                                ["<i>Perhaps best to leave her alone until you have the slime balls.</i>", 0]],
                                action: ["end"]
                            }
                        }
                    },
                    "flag: f1_helped_little_girl": {
                        say: [["<i>The little girl looks as though she is in a trance of ecstasy. Best leave her alone..", 0]],
                        action: ["end"]
                    }
                }
            }
        },
        end: [["<i>You say goodbye to the little girl.</i>", 0]]
    },

    f1_docile_slime: {
        name: "Docile slime",
        say: [["<i>You approach the slime.</i>", 0]],
        conditional: {
            "flag: f1_helped_docile_slime": {
                say: [["<i>The slime looks happy to see you. It wants to show you something.", 0]],
                action: ["shop", "f1_docile_slime_shop", ["end"]]
            },
            "flag: -f1_spoken_to_docile_slime": {
                say: [["<i>Slimes can't speak, obviously. But it seems to want something from you.</i>", 0],
                    ["<i>Somehow you gather that it is trying to gesture to the remnants of slime on the ground.." +
                    " as though it wants some slime for itself.</i>", 0],
                    ["<i>100 Slime balls might be enough to appease the slime. It seems to have nothing more" +
                    " to say to you.", 0]],
                action: ["flag", "f1_spoken_to_docile_slime", "true"],
                action2: ["end"]
            },
            "flag: f1_spoken_to_docile_slime": {
                conditional: {
                    "item: 100 slime_ball": {
                        say: [["<i>The slime looks pleased with you, and hopeful. Will you give the sime what it wants?", 0]],
                        options: {
                            "yes": {
                                exp: ["exp", 0],
                                say: [["<i>You give the slime 100 slime balls. It has way of showing emotion, but you can tell" +
                            " that it's very happy.", 0],
                                ["<i>It seems to want to show you something..", 0]],
                                action3: ["items", "slime_ball", -100],
                                action: ["flag", "f1_helped_docile_slime", "true"],
                                action4: ["items", "friendly_slime", 0],
                                action5: ["recipe", "friendly_greater_slime"],
                                action2: ["shop", "f1_docile_slime_shop", ["end"]]
                            
                            },
                            "no": {
                                say: [["<i>The slime looks disappointed. It doesn't want to speak to you anymore.", 0]],
                                action: ["end"]
                            }
                        }
                    },
                    "level: 0": {
                        say: [["<i>You don't seem to have what the slime wants. It ignores you.</i>", 0]],
                        action: ["end"]
                    }
                }
            }
        },
        end: [["[name]: ...", 0]]
    },

    f1_wanderer_statue: { // rework when adding wayward traveler super boss
        name: "Unnamed Wanderer",
        say: [["<i>You approach the statue.</i>", 0],
            ["<i>It is well looked after, despite showing clear signs of wear. It seems to be of some kind of goddess," +
        " who adorns a benevolent smile with her arms outstreched, as though enveloping many in her embrace.", 2 ],
            ["<i>Below the statue is a tall rectangular stone container. It is filled up about halfway with various" +
        " items.", 0]],
        conditional: {
            "item: 1 wanderer_memorabilia": {
                say: [["Some of the items remind you of the wanderer memorabilia that you found off somebody else. Will you" +
                    " add some to the container?", 0]],
                options: {
                    "yes": {
                        say: [["<i>You place a piece of wanderer memorabilia into the rectangle. Nothing happens for a short" +
                    " while, but a person eventually emerges. They have ragged clothes and a few weapons and other useful items" +
                    " holstered at their waste. Despite their decrepit appearance there is an aura of experience and knowledge" +
                    " that you interpret from their demeanour.", 0],
                        ["[name]: Who are you? You don't look like a wanderer.", 0]],
                        action: ["items", "wanderer_memorabilia", -1],
                        options: {
                            "wanderer?": {
                                say: [["[name]: You must have happened on somebody else's memorabilia...", 0],
                                    ["<i>The person thinks to themselves for a little.</i>", 0],
                                    ["[name]: Many people have gone on adventures in the past in search for some purpose, or" +
                                " in pursuit of some kind of treasure or reward.", 0],
                                    ["[name]: Regardless of whether they find what they are looking for, at the end of their" +
                                " quest, they almost always find that there is nothing more they want to achieve... these" +
                                " people are called wanderers.", 0],
                                    ["[name]: Not all wanderers believe in the Wandering Goddess Lucia, but she is somewhat" +
                                " of an icon for wanderers... hence the statue.", 0],
                                    ["[name]: Wanderers place their memorabilia here in honour of her and other wanderers." +
                                " if two wanderers meet here, they will often battle to remember their days of adventure" +
                                " and learn of the experiences of others.", 0],
                                    ["[name]: You aren't a wanderer, but you still seem like somebody who can fight. If you" +
                                " would like, we can battle here, right now.", 0]],
                                action: ["flag", "f1_met_wanderer_at_statue", "true"],
                                options: {
                                    "yes": {
                                        action: ["waypoint", "let's fight!"]
                                    },
                                    "no": {
                                        say: [["[name]: Alright. Well, now you know the purpose of this area. If you come" +
                                    " here again, it's unlikely you will meet the same person. Keep safe, young one.", 0],
                                    [   "<i>The wanderer walks away. He walks quite quickly, you notice. It isn't long until his footsteps are" + 
                                    " no longer audible.", 0]],
                                        action: ["end"]
                                    }
                                }
                            },
                            "let's fight!": {
                                say: [["[name]: Very well then. Prepare yourself!", 0]],
                                action: ["battle", [["wayward_traveler", {
                                    changeLevel: false,
                                    levelCap: false,
                                    addLevels: false
                                }], ["waypoint", "after_battle"]]]
                            }
                        }
                    },
                    "no": {
                        say: [["<i>You decide to leave the statue alone.", 0]],
                        action: ["end"]
                    }
                }
            },
            "level: 0": {
                say: [["<i>There doesn't seem to be much to do here. Nothing you own reminds you of the items that are" +
            " in your possession. You decide to leave the statue alone. [UNFINISHED]", 0]],
                action: ["end"]
            }
        },
        end: [["", 0]],
        "after_battle": {
            say: [["[name]: It was a good fight. I am glad to have met you. Perhaps we will meet again someday...", 0],
                ["<i>The wanderer walks away. He walks quite quickly, you notice. It isn't long until his footsteps are" + 
            " no longer audible.", 0]],
            action: ["end"]
        }
        
    },

    f1_rude_kid: {
        name: "Kid",
        conditional: {
            "flag: -f1_spoken_to_rude_kid": {
                say: [["<i>You approach the kid. He has an uninviting look on his face. As you near him, he spits on the floor.", 0],
                    ["[name]: Pfft. Whaddya want? Loser.", 0]],
                options: {
                    "<i>kick his shin</i>": {
                        say: [["<i>You kick the kid's shin.</i>", 0],
                            ["[name]: OW! What the hell, dude?!", 0],
                            ["<i>The kid's eyes tear up and he runs away.", 0],
                            ["<i>You notice he left some gold on floor. Hopefully you don't see that kid again.</i>", 0]],
                        action: ["gold", 100],
                        action5: ["exp", 50],
                        action2: ["flag", "f1_kicked_rude_kids_shin", "true"],
                        action3: ["flag", "f1_spoken_to_rude_kid", "true"],
                        action4: ["end"]
                    },
                    "why are you so rude?": {
                        say: [["[name]: Rude? I'm just battle hardened, y'see. Check this out.", 0],
                            ["<i>The kid holds up a small patch of grey wolf fur.</i>", 0],
                            ["[name]: Runt attacked me and my li'l sis. We got separated, and I fought off" +
                        " the wolf with my own bare hands. Not a pretty sight for pansy folk like yourself.", 0],
                            ["[name]: You know what? Keep this pelt. As a reminder of the horrors of war.", 0],
                            ["<i>He throws the pelt at your feet.</i>", 0],
                            ["[name]: Not everyone has to go through what I did...", 0],
                            ["<i>The kid walks away, hands in his pockets. Hopefully you don't see that kid again.", 0]],
                        action: ["items", "grey_wolf_pelt", 3],
                        action5: ["exp", 100],
                        action2: ["flag", "f1_extended_convo_with_rude_kid", "true"],
                        action3: ["flag", "f1_spoken_to_rude_kid", "true"],
                        action4: ["end"]
                    }
                }
            },
            "flag: f1_spoken_to_rude_kid": {
                say: [["<i>You look for the rude kid, but he isn't there anymore.", 0]],
                action: ["end"]
            }

        },

        end: [["", 0]]
    },

    f1_wolf_man: { // rework before adding
        name: "Lucas",
        say: [["<i>You approach the man. As you do so, he stands up. He smells a little.", 0],
            ["[name]: Hi. My name's Lucas. I live in the forest, nearby this area.", 0],
            ["[name]: I thought it would be a good idea to let you know that there more wolves in this spot than normal." +
        " If you need some wolf pelts, it might be worth hanging around here.", 0],
            ["<i>The man closes his eyes. It doesn't seem like he wants to say much else..</i>", 0]],
        action: ["end"],
        end: [["", 0]]
    },

    f1_old_man: { // rework before adding
        name: "Old Man",
        say: [["<i>You start to move towards the old man, but before you can approach, he quickly notices you and" +
        " beckons you over rather enthusiastically.</i>", 0],
            ["[name]: Helloe there! Not many people come 'round these parts no more.", 0],
            ["[name]: It's such a beautifool place.. but a little dangerous for most people, even though it's a little" +
        " less dangerous than the ruins and forest a li'l far off.", 0],
            ["[name]: Must the be rumours of some massive sea serpent, 'though I've never seen nothing like that in my time..", 0],
            ["[name]: Thanks for listenin' to me ramblin' off about nothing. I have some stuff that could be of use to you," +
        " if you're interested...", 0]],
        options: {
            "yes": {
                say: [["[name]: Ok, then - have yourself a look.."]],
                action: ["shop", "f1_old_man", ["end"]]
            },
            "no": {
                say: [["[name]: Alrighty then - I'll be seeyin' ye around, I suppose."]],
                action: ["end"]
            }
        },
        end: [["<i>You say goodbye to the old man.</i>", 0]]
    },

    f1_little_boy: { // rework before adding
        name: "Little boy",
        say: [[`<i>As you begin to approach the kid, you notice his distinctive eyes, a hue of dull red. The dark` +
        ` clothes that he's wearing make him difficult to say, and coalesce with his facial aesthetic into a somewhat` +
        ` edgy demeanour.`, 0]],
        conditional: {
            "flag: f1_helped_little_girl": {
                conditional: {
                    "flag: -f1_spoken_to_little_boy": {
                        say: [["[name]: ...", 0],
                        ["[name]: I don't wanna speak to a weakling like you. Bring me the Crimson Regalia if you're realling worth my time..", 0],
                        ["<i>The kid seems reluctant to speak. Perhaps if you bring him 30 or so red slime balls..", 0]],
                        action: ["flag", "f1_spoken_to_little_boy", "true"],
                        action2: ["end"]
                    },
        
                    "flag: f1_spoken_to_little_boy": {
                        conditional: {
                            "flag: -f1_helped_little_boy": {
                                conditional: {
                                    "item: 30 red_slime_ball": {
                                        say: [["[name]: Is that.. Crimson Reglia?!", 0],
                                        ["<i>The child hesitates a little. It doesn't seem like he thought you'd actually bring him the slime balls.", 0],
                                        ["[name]: I-I bet you stole them from someone. How pathetic--", 0],
                                        ["[player]: What the hell man? What's your problem?", 0],
                                        ["[name]: You can speak?! Crapdude calm down I was just messing around I--", 0],
                                        ["[player]: Kids like you are so annoying.. I'll show you--", 0],
                                        ["[name]: Brocalm down! OK, I found this thing in this forest and I thought it was really cool and since" +
                                        " putting it on I haven't been attacked here just leave me alone!!", 0],
                                        ["<i>The kid hands you a pendant and runs off. By the time you've processed what has happened the kid is out of earshot." +
                                        " Oh well. There was some money on the floor as well... your lucky day.", 0]],
                                        action: ["gold", 0],
                                        action6: ["exp", 0],
                                        action2: ["items", "red_slime_ball", -30],
                                        action5: ["items", "shadowwarding_pendant", 0],
                                        action3: ["flag", "f1_helped_little_boy", "true"],
                                        action4: ["end"]
                                    },
                                    "level: 0": {
                                        say: [["[name]: I don't see the crimson regalia.. get out of my sight.", 0]],
                                        action: ["end"]
                                    }
                                }
                            },
                            "flag: f1_helped_little_boy": {
                                say: [["<i>...Is what you would've seen, but the kid is noowhere to be found.", 0]],
                                action: ["end"]
                            }
                        }
                    }
                },
            },

            "level: 0": {
                say: [["[name]: You aren't worthy.. I can feel it.", 0],
                ["<i>The boy refuses to say anything more. It looks like you need to help someone else before him.</i>", 0]],
                action: ["end"]
            }
        },

        end: [["", 0]]
    },

    f1_lost_person: { // rework before adding?
        name: "Lost person",
        say: [["[name]: Hi... I'm lost. Do you know where I am?", 0]],
        options: {
            "yes": {
                say: [["[name]: Sweet! Can you tell me where I am then?", 0]],
                options: {
                    "Sorry I was lying, I don't know.": {
                        say: [["[name]: ...", 0],
                            ["[name]: Godammit.", 0]],
                        action: ["end"]
                    },
                    "The dark forest": {
                        say: [["[name]: Thanks! That's not helpful at all!", 0],
                            ["[name]: Asshole.", 0]],
                            action: ["end"]
                    },
                    "The twisted trees": {
                        say: [["[name]: I'm pretty sure that's not even a place.", 0]],
                        action: ["end"]
                    },
                    "Hell": {
                        say: [["[name]: Figures. I've raided one too many village I guess..", 0],
                            ["[name]: But the women were worth it.", 0],
                            ["[name]: You were joking? UM..", 0]],
                        action: ["end"]
                    }
                }
            },
            "no": {
                say: [["[name]: Fair enough. Not like I can talk...", 0],
                    ["[name]: I know a bit about the general area we're in. The Driftwood area has four main sections.", 0],
                    ["[name]: In the center sort of is the foresty area. To the north-west is a small settlement. I don't know...", 0],
                    ["...much about the rest but I guess there's one area other than this one..", 0],
                    ["[name]: This place is kind of well-known because it has a bunch of interesting stuff in such a small area.", 0],
                    ["[name]: Apparently there's a hydra in a nearby sea, and some evil creature lurking in the forest.. gives me the creeps!", 0],
                    ["[name]: If you ever find out where this place is, please let me know! I don't wanna stay here any longer...", 0]],
                    action: ["end"]
            }
        },
        end: [["", 0]]
    },

    f1_weapons_shop: { // rework before adding
        name: "Reiner",
        say: [["<i>You approach the weapons merchant. He is quite large and muscular, with brown hair and brown facial hair." +
                " He flashes a friendly smile your way.</i>", 0],
            ["[name]: Hey there, runt! You interested in some weapons?", 0]],
        options: {
            "weapons shop": {
                action: ["shop", "f1_weak_weapons", ["end"]]
            },
            "advanced weapons shop": {
                action: ["shop", "f1_strong_weapons", ["end"]]
            },
            "nope":{
                say: [["[name]: No problem! Seeya around!", 0]],
                action: ["end"]
            }
        },
        end: [["[name]: See you later, runt! Come again soon!", 0]]
    },

    f1_armour_shop: { // rework before adding
        name: "Sora",
        say: [["<i>You approach the armour merchant. They look a little out of place. As you approach him, he scratches his head and watches you as you near.</i>", 0],
                ["[name]: Umm... hi. Would you like some armour?", 0]],
        options: {
            "armour shop": {
                action: ["shop", "f1_weak_armours", ["end"]]
            },
            "advanced armour shop": {
                action: ["shop", "f1_strong_armours", ["end"]]
            },
            "nope":{
                say: [["[name]: Alright. Um..", 0]],
                action: ["end"]
            }
        },
        end: [["[name]: Ok, uh.. see you later, I guess...", 0]]
    },

    f1_misc_shop: { // rework before adding
        name: "Amy",
        say: [["<i>You approach the miscellaneous merchant. She has blond hair and an intelligent glare. She watches" +
                " you silently as you approach, however she has a friendly aura.", 0],
            ["[name]: Hello. I have some stuff for sale. Would you like anything?"]],
        options: {
            "misc shop": {
                action: ["shop", "f1_misc", ["end"]]
            },
            "VIP misc shop": {
                conditional: {
                    "item: 1 vip_card": {
                        action: ["shop", "f1_misc_vip", ["end"]]
                    },
                    "level: 0": {  
                        say: [["[name]: Sorry, you need a VIP card to access the VIP shop.", 0]],
                        action: ["waypoint", "nope"]
                    }
                }
            },
            "nope": {
                say: [["[name]: Ok. Thanks for coming.", 0]],
                action: ["end"]
            }
        },
        end: [["[name]: Ok, see you later.", 0]]
    },

    f1_man_a: { // rework before adding
        name: "Male settler",
        say: [["<i>You approach the man. He, similar to most other men in the settlement, has a somewhat muscular build.", 0],
            ["He had no facial hair and messy black hair, complimenting his plain, dark brown eyes. His attire was...", 0],
            ["...Comparable to most others in the settlement, plain fabric of a dull hue.", 0],
            ["[name]: Hey. What's up?", 0]],
        options: {
            "talk": {
                say: [["[name]: This settlement has existed for a few centuies, I think.. I moved in a few years ago.", 0],
                        ["[name]: It's fairly dangerous around here, so a lot of the people who stay here are fairly strong.", 0],
                        ["[name]: But there are tons of animals here, and some of them can be hunted for good reagents, so it's"
                        + " a great place for adventurers to stay.", 0]],
                conditional: {
                    "level: 0": {
                        options: {
                            "How long are you going to stay here?": {
                                say: [["[name]: Ehh... I don't know. Maybe a few more years.", 0],
                                        ["[name]: Maybe once I've made some more money. There are some safer places nearby.", 0],
                                        ["[name]: I could settle down, get a more stable job and a house.. it's pretty appealing.", 0],
                                        ["[name]: But I don't really know right now. It's pretty nice here right now. Gets" +
                                        " you in the mood for an adventure..", 0]],
                                action: ["waypoint", "level: 0"]
                            },
                            "Do you have a family?": {
                                say: [["[name]: Parents? Yeah. But no wife or kids.", 0],
                                        ["[name]: Women who just want to settle down don't really stay here, it's not a great" +
                                        " place unless you wanna adventure. So most of the girls here are single and uninterested.", 0],
                                        ["[name]: It's a real shame. I wish Amy would take some interest in me..", 0]],
                                action: ["waypoint", "level: 0"]
                            },
                            "bye": {
                                action: ["waypoint", "bye"]
                            }
                        }
                    }
                }
            },
            "bye": {
                action: ["end"]
            }
        },
        
        end: [["[name]: Mk, see you later.", 0]]
    },

    f1_hyssha: { // rework before adding
        name: "Hyssha",
        say: [["<i>You approach the woman. She seems stronger than most of the residents. Wavy auburn hair cascades down her" +
                " spine.</i>", 0],
                ["<i>She has a somewhat tough face, and her blue eyes grant her a piercing gaze. She's wearing brownish hunter" +
                " garb, accentuated by the intricate wooden bow holstered at her back.", 0],
                ["[name]: Hello. I take it you are an adventuerer. My name is Hyssha.", 0]],
        conditional: {
            "level: 0": {
                options: {
                    "What are you doing here?": {
                        say: [["[name]: I have been staying here for some time. I am searching for a legendary beast..", 0],
                                ["[name]: I am trying to hunt powerful beasts. I use each one I slay to improve my" +
                                " adventuring gear.", 0]],
                        options: {
                            "How many beasts have you slain?": {
                                say: [["[name]: Three. Rokusha, an earth anima, whose magical scales I used to enhance my bow.", 0],
                                        ["[name]: Ignia, a fire wyvern. It's wings and scales I used to enhance my armour. With" +
                                        " it's heart, I enhanced my bow.", 0],
                                        ["[name]: The final was a beast in this area.. I don't know it's name, but it escaped" +
                                        " before I could slay it. From a poison-tipped claw it had I enhanced many of my arrows.", 0],
                                        ["[name]: I cannnot simply slay all beasts I come across. I must consider the consequences.", 0],
                                        ["[name]: Otherwise, I would have slain many more creatures..", 0]],
                                        action: ["waypoint", "level: 0"]
                            },
                            "Where's the legendary beast that you're hunting?": {
                                say: [["[name]: I don't know. It is a type of water beast, however to this point is has eluded me.", 0],
                                        ["[name]: Perhaps it is absent, or must be summoned.. I must do more research.", 0],
                                        ["(BOSS NOT ADDED YET)"]],
                                action: ["waypoint", "level: 0"]
                            },
                            "bye": {
                                action: ["waypoint", "bye"]
                            }
                        }
                    },
                    "bye": {
                        say: [["<i>You say goodbye to Hyssha.", 0]],
                        action: ["end"]
                    }
                }
            }
        },
        end: [["[name]: Until next, adventurer.", 0]]
    },

    f1_worried_woman: { // rework before adding
        name: "Worried woman",
        say:
            [["<i>You approach the worried woman. She has short hair and a friendly face, although right now it is warped" +
                " into a worried expression.", 0],
            ["[name]: Hello.. have you seen my kids?", 0],
            ["[name]: They both seem to like slimes a lot.. but they ran off into the forest and I haven't seem them since!", 0],
            ["[name]: I can't go out to find them on my own.. I wouldn't be able to fend for myself.", 0]],
        action: ["end"],
        end: [["[name]: I hope they're ok... if they were hurt, I..", 0]]
    },

    f1_tutorial_man: {
        name: "Pel",
        say: [["<i>You approach the person being attacked by a slime. Despite his body cowering in fear, his facial" +
                " expression shows no signs of trepidation.", 0],
                ["[name]: aah a slime please help me aah noo please", 0],
                ["<i>He doesn't sound like he's in danger. Regardless, probably a good idea to help him out..", 0]],
        options: {
            "Help him out": {
                say: [
                    ["You decide to help him out", 0],
                    ["The slime notices your approach and begins to charge in your direction--", 0]
                ],
                    action: ["battle", [["slime",{ }], ["waypoint", "afterBattle"]]]
            },
            "Ignore him": {
                say: [
                    ["The man doesn't look like he's in trouble, so helping him will probably be a waste of your time.", 0],
                    ["You decide to ignore him and focus your energy elsewhere..", 0]
                ],
                action: ["end"]
                
            }
        },
        "afterBattle": {
            action3: ["music", "forest"],
            say: [["<i>The man dusts himself off briefly and smiles at you.</i>", 0],
                    ["[name]: Whew!", 0],
                    ["[name]: That was a close one. Thanks for saving me, stranger!", 0],
                    ["He looks around as though he is assessing his surroundings, however it is clear that he knows about this area.", 0],
                    ["[name]: Anyways, you seem to have found yourself in a pretty unforgiving place...", 0],
                    ["[name]: I'd recommend you look for the small forest camp in the area. You'll find some people there" +
                    " to speak to.", 0],
                    ["[name]: I think it's... somewhere to the north-east?", 0],
                    ["[name]: Anyways, I'll see you around, probably. Bye!", 0],
                    ["[name]: Oh-- one more thing. <i>The man stops walking and turns around.</i>", 0],
                    ["[name]: Don't wander too far out in any direction. The outskirts of the forest are a little dangerous..", 0],
                    ["<i>And with that, the man disappears into the distance.", 0]
            ],
            action: ["flag", "f1_spoken_to_tutorial_man", "true"],
            action2: ["end"]
        },
        end: [["", 0]]
    },

    f1_wanderer_collector: { // rework before adding
        name: "Man who enjoys collecting",
        say: [["<i>You approach a rather friendly-looking person. He is male and of average build. He has simple black" +
     " hair and no facial hair, along with simple villager clothes.", 0]],

        conditional: {
            "flag: f1_helped_wanderer_collector": {
                say: [["Hato: Yo. I haven't got much for you RN, sorry.", 0]],
                action: ["end"]
            },

            "flag: f1_spoken_to_wanderer_collector": {
                say: [["[name]: Hi there. Do you have the memorabilia?", 0]],
                conditional: {
                    "item: 100 wanderer_memorabilia": {
                        say: [["[name]: Cool! Now, just give it here...", 0]],
                        options: {
                            "give him the memorabilia": {
                                action: ["items", "wanderer_memorabilia", -100],
                                say: [["[name]: Thank you for your patronage! As promised, I will reward you for your" +
                                        " troubles..", 0],
                                        ["Hato: My name's Hato, by the way. Maybe I'll see you again later. Seeya for now!", 0]],
                                action2: ["items", "barren_sword", 0],
                                action3: ["gold", 0],
                                action4: ["exp", 0],
                                action6: ["flag", "f1_helped_wanderer_collector", "true"],
                                action5: ["end"]
                            },
                            "don't give him the memorabilia": {
                                say: [["[name]: Man. Ok. Whatever.", 0]],
                                action: ["end"]
                            }
                        }
                    },
                    "level: 0": {
                        say: [["[name]: Doesn't look like it. Come back another time.", 0]],
                        action: ["end"]
                    }
                
                }
            },

            "level: 0": {
                say: [["[name]: Hello! Do you know what wanderers are?"]],
                options: {
                    "yes": {
                        conditional: {
                            "flag: f1_met_wanderer_at_statue": {
                                say: [["[name]: Alright! Cool. I collect wanderer memorabilia. Interpreting the adventures and pasts" +
                            " of various adventurers... it's really interesting to me. Therefore!", 0],
                                        ["[name]: If you can get me some, let's say, <i>100</i>, I'll take it off your hands and" +
                                        " ensure you're rewarded handsomely. What do you say?", 0],
                                        ["[name]: Well, I won't listen anyways. Come back if you have them and want me to take" +
                                        " them off your hands.", 0],
                                        ["<i>The man doesn't look like he'll say any more. Best to come back if you have what he wants" +
                                        ".", 0]],
                                action: ["flag", "f1_spoken_to_wanderer_collector", "true"],
                                action2: ["end"]
                            },
                            "level: 0": {
                                say: [["[name]: Really? What are they then?", 0],
                                        ["[player]: Uhh...", 0],
                                        ["<i>The man frowns disappointedly.</i>", 0],
                                        ["[name]: Not cool, dude.. come back when you know a little more.", 0]],
                                action: ["end"]
                            }
                        }
                    },
                    "no": {
                        say: [["[name]: Ah, ok. Nevermind - I'll see you around."]],
                        action: ["end"]
                    }
                },
            }
        },

        end: [["", 0]]
    },

    f1_lost_teenager: {
        name: "Lost teenager",
        conditional: {
            "flag: -f1_spoken_to_lost_teenager": {
                say: [["<i>You approach the lost teenager. They don't look particularly worried as you approach. In fact, " +
                "they don't look like they're feeling anything at all.", 0],
                    ["[name]: Hi. I've been here for a while now, I'm not really sure what's going on.", 0],
                    ["[name]: One thing's for sure, I'm probably not getting out of this forest. I've been wandering for ages.", 0],
                    ["[name]: You can have these potions. I'm not gonna need them where I'm going...", 0]],
                action: ["items", "health_potion", 3],
                action2: ["items", "greater_health_potion", 1],
                action3: ["flag", "f1_spoken_to_lost_teenager", "true"],
                action4: ["end"],
            },
            "level: 0": {
                say: [["<i>You look for the lost teenager, but they aren't there anymore.", 0]],
                action: ["end"]
            }
        },
        end: [["", 0]]

    },

    f1_traveller_woman: {
        name: "Traveller woman",
        say: [['<i>You approach the traveler woman. Once distinctive feature you notice is her kale-green backpack, something' +
            ' people seem to not have around here.', 0]],
        conditional: {
            "flag: -f1_spoken_to_traveller_woman": {
                say: [["[name]: Hey.. as you might be able to tell, I'm not from 'round here.", 0],
                        ["[name]: I enjoy seeing what's up about different places. This place is sorta dangerous, there's only one tiny settlement in the forest that I've found!", 0],
                        ["[name]: It's hard to stock up on supplies. I know there are some places outside this main forest, but I can't get to" +
                        " the end of them without turning back... I wonder if there's something there.", 0],
                        ["[name]: Oh well! I guess I'll never know. This looks like a nice place to take a nap..", 0],
                        ["<i>The woman looks sleepy. You don't want to bother her, so you say goodbye.</i>", 0],
                        ["[name]: Oh! I was attacked by some monster as well. I don't need this stuff, so you can have it.", 0],
                        ["<i>The woman hands you some items. You decide to leave afterwards.</i>", 0]],
                action: ["items", "weak_vines", 5],
                action2: ["items", "hempweed_ligament", 2],
                action3: ["items", "sharp_claw", 1],
                action4: ["items", "venomous_claw", 1],
                action5: ["flag", "f1_spoken_to_traveller_woman", "true"],
                action6: ["end"]
            },
            "level: 0": {
                say: [["<i>She's currently asleep. Looks like she can fend for herself - probably shouldn't bother her.", 0]],
                action: ["end"]
            }
        },
        end: [["", 0]]
    },

    f1_alchemist_woman: { // Skyla
        name: "Alchemist woman",
        say: [["<i>You approach the alchemist.</i>", 0]],
        conditional: {
            "flag: f1_helped_alchemist_lady": {
                say: [["Skyla: Hey, [player]! Is there something you need? I owe you after all..", 0]],
                options: {
                    "help me craft reagents": {
                        say: [["Skyla: Alright. If you've gathered things from this area, I can help you make some" +
                                " useful items with them - have a look..", 0]],
                        action: ["crafting", ["earthen_shield_potion", "weak_slingshot", "invigorating_flower",
                                "desperate_flower", "monster_essence", "kindred_essence"], ["waypoint", "goodbye"]]
                    },
                    '"can you use magic?"': {
                        say: [["Skyla: Well, I'm a mage not an alchemist; but it is helpful to know some magic..", 0],
                                ["Skyla: I can use some enchantment and trance spells, which are very helpful. Although"
                                + " a tad immoral!", 0],
                                ["Skyla: That said, I would never use them to do bad things.. sometimes I just really need" +
                                " help, you know?", 0]],
                        action: ["waypoint", "flag: f1_helped_alchemist_lady"]
                    },
                    "ask where to go from here": {
                        say: [
                            ["[name]: The outskirts of the forest are a little dangerous, but if you can travel there, an old man lives somewhere far out..", 0],
                            ["[name]: Around due west of here? I'm sorry, I don't know the exact coordinates.", 0],
                            ["[name]: Oh! There's a larger settlement past the outskirts to the north-west as well. That might be a good place to go. Good luck!", 0]
                        ],
                        action: ["waypoint", "flag: f1_helped_alchemist_lady"]
                    },
                    "nope": {
                        say: [["Skyla: Aw, that's a shame..", 0]],
                        action: ["waypoint", "goodbye"]
                    }
                }
            },
            "flag: f1_spoken_to_alchemist_lady": {
                say: [["[name]: Hi, adventurer! Have you got the items?", 0]],
                options: {
                    "give her the items": {
                        conditional: {
                            "item: 10 grey_wolf_pelt": {
                                conditional: {
                                    "item: 1 special_sap": {
                                        say: [["[name]: You got the items!", 0],
                                                ["<i>She smiles brightly at you. Something about her joyous face makes you feel very pleased.", 0],
                                                ["[name]: As promised, I'll give you something in return. Come a little closer..", 0],
                                                ["<i>You approach her, slowly..</i>", 0],
                                                ["<i>She hands you a piece of paper. It has some writing about potions on it.</i>", 0],
                                                ["[name]: It's a crafting recipe for good health potions. It should help you on your adventures..", 2.25],
                                                ["[name]: Was it what you expected? Hehe.", 0],
                                                ["[name]: You can have some gold as well. My name's Skyla, by the way. I'll remember the help you" +
                                                " gave me today. Come back if you need anything!", 0],
                                                ["<i>She smiles again and waves goodbye.</i>", 0]],
                                        action: ["recipe", "crafted_health_potion"],
                                        action2: ["gold", 300],
                                        action3: ["flag", "f1_helped_alchemist_lady", "true"],
                                        action5: ["items", "grey_wolf_pelt", -10],
                                        action6: ["items", "special_sap", -1],
                                        action4: ["end"]
                                    },
                                    "level: 0": {
                                        say: [["<i>You don't have all the items you need. You have no choice but to tell her" +
                                                "; a little remorsefully, you notice.", 0]],
                                        action: ["waypoint", "tell her you don't have the items"]
                                    }
                                }
                            },
                            "level: 0": {
                                say: [["<i>You don't have all the items you need. You have no choice but to tell her" +
                                    "; a little remorsefully, you notice.", 0]],
                                action: ["waypoint", "tell her you don't have the items"]
                            }
                        }
                    },
                    "tell her you don't have the items": {
                        say: [["<i>Oh, alright.. just come back when you do, okay? I'll be waiting..", 0],
                                ["<i>She seems a little sad but smiles and waves goodbye.</i>", 0]],
                        action: ["end"]
                    },
                    "ask where to find the items": {
                        say: [
                            ["[name]: You should be able to get pelt from wolves in the forest.", 0],
                            ["[name]: You can find special sap from lesser treants in the forest.", 0],
                            ["[name]: Just make sure you're strong enough to catch their attention and defeat them" +
                            " - but I'm sure for you it won't be a problem! There should be one around the coordinates <b>13, 29</b>.", 0],
                            ["[name]: Good luck, [player]! I'll be waiting..", 0]
                        ],
                        action: ["end"]
                    }
                }
            },
            "level: 0": {
                say: [
                    ["<i>She has a large dark blue witch hat which should look silly, but she seems to make" +
                    " it work. It compliments her brown hair nicely, which is medium length and somewhat messy.</i>", 0],
                    ["<i>Her clothes seem to be a modified version of plainish blue robes on top, and on the bottom, " +
                    "robe bottoms fashioned into a skirt to aid movement. Her attire in general seems to be a modified wizard's" +
                    " robe to enable efficient movement and accentuate her female features.", 0],
                    ["<i>As you approach, she greets you with an inviting smile.</i>", 0],
                    ["[name]: Oh, an adventurer? Just my luck, I needed some help.", 0],
                    ["[name]: What's your name, adventurer?", 0],
                    ["<i>You have a sudden, uncontrollable urge to answer her question.</i>", 0],
                    ["[player]:  [player].", 0],
                    ["[name]: [player]? That's a nice name...", 0],
                    ["[name]: Hey, [player].. I need some items for some alchemy I'm doing, but I can't really be bothered to get them myself..", 0],
                    ["[name]: Could you help me? All I need is 10 grey wolf pelts and 1 special sap, nothing that hard to get..", 0],
                    ["[name]: Of course, I'll make it worth your while..", 0]],
                options: {
                    "yes": {
                        say: [["<i>The woman smiles at you. Having her smile at you makes you feel really good for some reason.", 0],
                                ["[name]: Thank you!", 0],
                                ["[name]: In case you didn't know, you can find special sap from lesser treants in the forest.", 0],
                                ["[name]: Just make sure you're strong enough to catch their attention and defeat them" +
                                " - but I'm sure for you it won't be a problem! There should be one around the coordinates <b>13, 29</b>...", 0],
                                ["[name]: Just bring the things back to me whenever you're ready. I'll be waiting..", 0]],
                        action: ["flag", "f1_spoken_to_alchemist_lady", "true"],
                        action2: ["end"]
                    }, 
                    "no": {
                        say: [["<i>The woman frowns slightly, in a disappointed, not angry manner.</i>", 0],
                                ["[name]: Just think about it, please? If you get the items and want to give them to me, " +
                                    "just come over. I'll be waiting.", 0]],
                        action: ["flag", "f1_spoken_to_alchemist_lady", "true"],
                        action2: ["end"]
                    }
                }
            }
        },
        end: [["", 0]],

        "tell her you don't have the items": {
            say: [["[name]: Oh, alright.. just come back when you do, okay? I'll be waiting..", 0],
                    ["<i>She seems a little sad but smiles and waves goodbye.", 0]],
            action: ["end"]
        },

        "goodbye": {
            say: [["Skyla: Come back later, okay?", 0]],
            action: ["end"] 
        }
    },

    f1_forest_craftsman: { // Lucas
        name: "Lucas",
        say: [["<i>You approach the craftsman, who is currently sitting behind a table that has some kind of schematics on" +
                " it.</i>", 0]],
        conditional: {
            "flag: f1_spoken_to_forest_craftsman": {
                action: ["waypoint", "loop"],
            },
            "level: 0": {
                say: [
                ["<i>They're wearing a brown apron and have a somewhat bored expression, which does not help the dull" +
                " impression given by his brown bowl-shaped hair and matching dreary brown eyes.", 0],
                ["<i>His clothes, too, are plain, but considering the various stains and small patches rips it has" +
                " sustained, it can be assumed that this is a 'work pair' not to be valued greatly.", 0],
                ["[name]: Man, nothing ever happens here...", 0],
                ["<i>He looks up and notices you.", 0],
                ["[name]: Oh.", 0]
                ],
                action: ["flag", "f1_spoken_to_forest_craftsman", "true"],
                action2: ["waypoint", "loop"]

            }
        },
        "loop": {
            say: [["[name]: What's up?", 0]],
            options: {
                "help me craft some items": {
                    say: [["[name]: Sure, if you've got the gold.", 0]],
                    action: ["crafting", ["vine_wrapped_wooden_sword", "vine_wrapped_wooden_stave", "strong_vine_chestplate",
                            "wolfhide_armour", "wolfhide_cap", "wolfhide_leggings", "bladed_armour", "feathervine_sword",
                            "wolf_hermit_staff"], ["end"]]
                },
                "bored": {
                    say: [["[name]: Yeah. This settlement is a useful place to stay if you need to go into the forest often..", 0],
                        ["[name]: But nothing ever happens in this area. People say it can be dangerous but if you have any" +
                        " adventuring experience you'll be completely fine for the most part.", 0],
                        ["[name]: I settled here so that I could craft simple items for new adventurers and make an easy living" +
                        ", but it's gotten old way too fast. I might start adventuring again myself..", 0]],
                    action: ["waypoint", "loop"]
                },
                "cya": {
                    action: ["end"]
                }
            }
        },

        end: [["[name]: Cya around.", 0]]
    },

    f1_forest_cleric: { // Aina
        name: "Aina",
        say: [["<i>You approach the cleric.", 0]],
        conditional: {
            "flag: f1_spoken_to_aina": {
                action: ["waypoint", "loop"]
            },
            "level: 0": {
                say: [
                    ["<i>They seem fairly young, likely in their mid-late teens.</i>", 0],
                    ["<i>Her purple attentive eyes match well with her straight black hair that  seems to have" +
                    " been cut short just at her shoulders. Her outfit is a mostly dark one, with black" +
                    " bermuda shorts and a grey belt. Holstered at her side is a small curved dagger and a few knives.</i>", 0],
                    ["<i>Her shirt is similarly dark; what looks a bit like a military fatigues t-shirt of various grey hues" +
                    " is under a basic black military vest that has several unique potions and other items holstered across it.</i>", 0],
                    ["<i>Were it not for her cleric's tome (easily identifiable due to the large cross on the cover), it would" +
                    " probably be impossible to infer her role.</i>", 0],
                    ["<i>She smiles frendily at you as you approach her.</i>", 0]
                ],
                action: ["flag", "f1_spoken_to_aina", "true"],
                action2: ["waypoint", "loop"]
            }
        },
        "loop": {
            say: [["[name]: Hi, what's up?", 0]],
            options: {
                "can you heal me?": {
                    say: [["[name]: Sure! No problem. Just gimme a second...", 0],
                            ["<i>She must be a fairly competent healer, because she doesn't even remove the tome from" +
                            " where it is holstered at her waist. You feel your wounds disappear..", 0]],
                    action: ["heal"],
                    action2: ["waypoint", "loop"]

                },
                "ask about her outfit": {
                    say: [["[name]: Yeah, not very healer-like is it? Haha..", 0],
                            ["[name]: I wanted to wear something a little more pure-looking, but my brother told me" +
                            " that it would just get dirty in the forest, and he said I should wear something a little" +
                            " more practical..", 0],
                            ["[name]: But to be honest, this is nice too. It's comfortable and looks kinda cool!", 0],
                            ["<i>She removes the dagger from the holseter at her waist and twirls it around dangerously" +
                            " before seamlessly putting it back", 0]],
                    action: ["waypoint", "loop"]
                },
                "ask what she's doing here": {
                    say: [["[name]: You probably know this already, but I'm a cleric in practice-", 0],
                            ["<i>She slaps the cleric tome at her hip.</i>", 0],
                            ["[name]: My brother was helping me get some practice with support - since he's a mage" +
                            ", he would do most of the fighting and I would help out, as well as fight a little bit.", 0],
                            ["[name]: He's out right now, though... in the north of the forest I think. I've gone out" +
                            " on my own a bit but I don't want to go too far... so I'm here waiting for him.", 0]],
                    action: ["waypoint", "loop"]
                },
                "ask about teleprotation stones": {
                    say: [["[name]: Yeah! There's one that goes straight here.", 0],
                            ["[name]: It'll cost you a little, but it's really helpful to be able to come back whenever.", 0],
                            ["[name]: I've got a few, if you want some:", 0]],
                    action: ["shop", "f1_forest_cleric_shop", ["end"]]
                },
                "say goodbye": {
                    action: ["end"]
                }
            }
        },
        end: [["[name]: Alright, bye!", 0]]
    },

    f1_ninja_trainer: { // Sora 
        name: "Sora",
        say: [["<i>You approach the ninja. He is sat down leaning against a tree with one knee bent.", 0]],
        conditional: {
            "flag: f1_spoken_to_sora": {
                action: ["waypoint", "loop"]
            },
            "level: 0": {
                say: [
                    ["<i>You can't see his facial expression to the cloth covering most of his face, but his eyes" +
                    " look a little tired.</i>", 0],
                    ["<i>His clothes are at once conspicuous and innocuous; plain black trousers and a plain black shirt." +
                    " The fabric looks silky and the clothes light and loose, given how easily they sway in the wind.", 0],
                    ["<i>He has a physique which looks at once agile and muscular; lean yet strong. He tilts his head in your" +
                    " direction as you near him.", 0]
                ],
                action: ["flag", "f1_spoken_to_sora", "true"],
                action2: ["waypoint", "loop"]
            }
        },
        "loop": {
            say: [["[name]: ..?", 0]],
            options: {
                "ask about his outfit": {
                    say: [["[name]: ..Oh, this..? It's standard ninja, uhm.. attire.", 0],
                            ["[name]: It lets you move around quickly and silently, which is really helpful. You don't really" +
                            " need the headscarf thing unless you're doing something shady and to be honest it's a little" +
                            " inconvenient. But I wear it since I think it looks cool.", 0],
                            ["[name]: I have to take it off during missions, though.. it's just too inconvenient.", 0]],
                    action: ["waypoint", "loop"]
                },
                "ask about being a ninja": {
                    say: [["[name]: Being a ninja doesn't really mean much. It's just a battle style.", 0],
                            ["[name]: It's nice to have the ability to be stealthy because it means you can avoid fights.", 0],
                            ["[name]: I went out with a mage recently to do some hunting and it was just constant battling.." +
                            " I don't have the stamina for that sort of stuff.", 0]],
                    options: {
                        "ask for advice": {
                            say: [["[name]: Well, if you're a ninja, usually you use techniques that sorta combo into" +
                                    " eachother - that way you can get the best out of your actions.", 0],
                                    ["[name]: If you've learned a lot of techniques it can get kind of confusing," +
                                    " so it might be worth writing down on paper what techniques you have combo into" +
                                    " what other techniques - so you know what to do to achieve certain effects.", 0],
                                    ["[name]: I'd show you the ropes by sparring, but I'm just not in the mood right" +
                                    " now.. maybe another time.", 0]],
                            action: ["waypoint", "loop"]
                        },
                        "...": {
                            action: ["waypoint", "loop"]
                        }
                    }
                },
                "say goodbye": {
                    action: ["end"]
                }
            }
        },
        end: [["<i>Sora waves at you before tilting his head back to its original position.", 0]]
    },

    f1_forest_settlement_sign_north: {
        name: "Sign",
        action: ["end"],
        end: [["<i>You read the sign.</i>", 0],
                ["<i>It reads: Small forest settlement to the NORTH.", 0],
                ["<i>Nothing else to see here...</i>", 0]]
    },

    f1_forest_settlement_sign_east: {
        name: "Sign",
        action: ["end"],
        end: [["<i>You read the sign.</i>", 0],
                ["<i>It reads: Small forest settlement to the EAST.", 0],
                ["<i>Nothing else to see here...</i>", 0]]
    },

    f1_forest_settlement_sign_west: {
        name: "Sign",
        action: ["end"],
        end: [["<i>You read the sign.</i>", 0],
                ["<i>It reads: Small forest settlement to the WEST.", 0],
                ["<i>Nothing else to see here...</i>", 0]]
    },

    f1_forest_settlement_sign_south: {
        name: "Sign",
        action: ["end"],
        end: [["<i>You read the sign.</i>", 0],
                ["<i>It reads: Small forest settlement to the SOUTH.", 0],
                ["<i>Nothing else to see here...</i>", 0]]
    },

    f1_lesser_treant: {
        name: "Lesser treant",
        say: [["<i>You notice that there one of the trees in the area seems to have some kind of.. facial expression?</i>", 0],
                ["<i>Besides that, it looks just like the other trees.</i>", 0]],
        options: {
            "attack it": {
                conditional: {
                    "level: 5": {
                        say: [["<i>You strike the tree.</i>", 0],
                                ["<i>Very slowly, it begins to move - it's 'face' points in the same direction but you" +
                                    " can tell that it can see all around itself.</i>", 0],
                                ["<i>The ground trembles slightly as what looks like roots emerge from the ground..", 0],
                                ["<i>And fly in your direction!</i>", 0]],
                        action: ["battle", [["lesser_treant", { changeLevel: 7,
                         levelCap: false, addLevels: false }], ["waypoint", "afterBattle"]]]
                    },
                    "level: 0": {
                        say: [["<i>You strike the tree.</i>", 0],
                                ["<i>...the tree seems completely unfazed. Maybe if you were stronger..</i>", 0]],
                        action: ["end"]
                    }
                }
            },
            "leave it alone": {
                say: [["<i>You decide to leave the tree alone.</i>", 0]],
                action: ["end"]
            }
        },
        "afterBattle": {
            say: [["<i>The tree, clearly quite damaged, becomes still again. Perhaps it is repairing itself..", 0],
                    ["<i>Regardless, it no longer responds to your attacks. Best to leave it alone.</i>", 0]],
            action: ["end"]
        },
        end: [["", 0]]
    },

    f1_treant: {
        name: "Treant",
        say: [["<i>You notice that there one of the trees in the area seems to have some kind of.. facial expression?</i>", 0],
                ["<i>Besides that, it looks similar to the other trees - you notice that it has a greater girth and a greater" +
                " abundance of leaves.</i>", 0]],
        options: {
            "attack it": {
                conditional: {
                    "level: 10": {
                        say: [["<i>You strike the tree.</i>", 0],
                                ["<i>Very slowly, it begins to move - it's 'face' points in the same direction but you" +
                                    " can tell that it can see all around itself.</i>", 0],
                                ["<i>The ground trembles as what looks like roots emerge from the ground..", 0],
                                ["<i>And fly in your direction!</i>", 0]],
                        action: ["battle", [["treant", { changeLevel: 12,
                         levelCap: false, addLevels: false }], ["waypoint", "afterBattle"]]]
                    },
                    "level: 0": {
                        say: [["<i>You strike the tree.</i>", 0],
                            ["<i>...the tree seems completely unfazed. Maybe if you were stronger..</i>", 0]],
                        action: ["end"]
                    }
                }
            },
            "leave it alone": {
                say: [["<i>You decide to leave the tree alone.</i>", 0]],
                action: ["end"]
            }
        },
        "afterBattle": {
            say: [["<i>The tree, clearly quite damaged, becomes still again. Perhaps it is repairing itself..", 0],
                    ["<i>Regardless, it no longer responds to your attacks. Best to leave it alone.</i>", 0]],
            action: ["end"]
        },
        end: [["", 0]]
    },

    f1_lesser_ent: {
        name: "Lesser ent",
        say: [["<i>You notice that there one of the trees in the area seems to have some kind of.. facial expression?</i>", 0],
                ["<i>Besides that, it looks similar to the other trees - you notice that it has a greater girth and a greater" +
                " abundance of leaves. Furthermore, it radiates some kind of aura that demands both awe and veneration..</i>", 0],
                ["<i>You notice that creatures in the forest tend to steer clear of this tree somewhat. It's branches sway" +
                " as though the have lives of their own.", 0]],
        options: {
            "attack it": {
                conditional: {
                    "level: 17": {
                        say: [["<i>You strike the tree.</i>", 0],
                                ["<i>Very slowly, it begins to move - it's 'face' points in the same direction but you" +
                                    " can tell that it can see all around itself.</i>", 0],
                                ["<i>The ground quakes as what looks like roots emerge from the ground..", 0],
                                ["<i>And fly in your direction!</i>", 0]],
                        action: ["battle", [["lesser_ent", { changeLevel: 17,
                         levelCap: false, addLevels: false }], ["waypoint", "afterBattle"]]]
                    },
                    "level: 0": {
                        say: [["<i>You strike the tree.</i>", 0],
                            ["<i>...the tree seems completely unfazed. Maybe if you were stronger..</i>", 0]],
                        action: ["end"]
                    }
                }
            },
            "leave it alone": {
                say: [["<i>You decide to leave the tree alone.</i>", 0]],
                action: ["end"]
            }
        },
        "afterBattle": {
            say: [["<i>The tree, clearly quite damaged, becomes still again. Perhaps it is repairing itself..", 0],
                    ["<i>Regardless, it no longer responds to your attacks. Best to leave it alone.</i>", 0]],
            action: ["end"]
        },
        end: [["", 0]]
    },

    f1_travelling_hermit: {
        name: "Old traveller",
        say: [["<i>You approach the old traveller.</i>", 0],
                ["<i>One would assume he is in his seventies or eighties, given his fairly shrivelled skin and hunched" +
                " back. He uses a walking stick that is a little lighter than the trees surrounding the steady himself" +
                " as he walks.", 0],
                ["<i>His clothes are very plain; a grey top that seems a little large for his shrunken self, and plan" +
                " brown trousers that fit the same criteria. He doesn't react as you near him, but he emanates a friendly" +
                " aura.", 0],
                ["[name]: Hello there.", 0]],
        options: {
            "What are you doing?": {
                say: [["[name]: I'm looking for a statue. I think it is somewhere around the outskirts of this forest...", 0],
                        ["[name]: It is a statue of Lucia, the wandering Goddess. I am not a wanderer myself, but the statues" +
                        " are a centerpiece of their lifestyle. Somewhat of a spectacle to behold, in my opinion.", 0]],
                options: {
                    "wanderer?": {
                        say: [["[name]: Yes, wanderer. Maybe if you can meet a wanderer at the statue they will tell you" +
                                " a bit more. I'm no expert, unfortunately.", 0],
                            ["[name]: Anyways, I should be on my way. I'll never find the statue at this rate!", 0],
                            ["<i>The old man begins to walk away. You notice that he moves very quickly for someone who" +
                            " needs a walking stick. Very quickly, his image fades in between the trees.", 0]],
                        action: ["flag", "f1_spoken_to_hermit", "true"],
                        action2: ["end"]
                    },
                    "oh, ok. Bye": {
                        say: [["[name]: I think I'll rest around here for a little while, so perhaps I will see you around." +
                                " Until then, traveller!", 0]],
                        action: ["end"]
                    }
                }
            },
            "bye": {
                say: [["<i>The old man looks a little confused by your sudden approach and retreat.</i>", 0],
                        ["[name]: Ah, okay then.. I'm going to rest here for a little bit, so perhaps I will see you around." +
                        " Until then, traveller!", 0]],
                action: ["end"]
            }
        },
        end: [["", 0]]
    },

    f1_person_looking_for_settlement: { // rework?
        name: "Lost person", // call "random person" in extraOptions
        say: [["<i>You approach the random person. They seem a little lost.</i>", 1.25],
                ["[name]: Hello!! I know there is a settlement around here.. do you know where it is??", 0],
                ["[name]: Please!!! I'm running out of resources and I'm too scared to go without direction! Can you tell me??", 0]],
        options: {
            "north-east": {
                say: [["North east?? Got it!", 0],
                        ["<i>The person looks as thought they are getting ready to run. They tighten the straps on their" +
                        " wolfhide backpack and smile at you.", 0]],
                        action: ["flag", "f1_spoken_to_person_looking_for_settlement", "true"],
                        action2: ["end"]
            },
            "north-west": {
                say: [["North west?? Got it!", 0],
                        ["<i>The person looks as thought they are getting ready to run. They tighten the straps on their" +
                        " wolfhide backpack and smile at you.", 0]],
                        action: ["flag", "f1_spoken_to_person_looking_for_settlement", "true"],
                        action3: ["flag", "f1_helped_person_looking_for_settlement", "true"],
                        action2: ["end"]
            },
            "straight south": {
                say: [["Straight south?? Got it!", 0],
                        ["<i>The person looks as thought they are getting ready to run. They tighten the straps on their" +
                        " wolfhide backpack and smile at you.", 0]],
                        action: ["flag", "f1_spoken_to_person_looking_for_settlement", "true"],
                        action2: ["end"]
            },
            "south-east": {
                say: [["South east?? Got it!", 0],
                        ["<i>The person looks as thought they are getting ready to run. They tighten the straps on their" +
                        " wolfhide backpack and smile at you.", 0]],
                        action: ["flag", "f1_spoken_to_person_looking_for_settlement", "true"],
                        action2: ["end"]
            }
        },
        end: [["[name]: Thank you!! Bye!", 0],
                ["<i>The person runs off into the distance. Hopefully you told them the right direction..", 0]]
    },

    f1_owned_crafted_sword: {
        name: "Wolves",
        say: [["<i>You notice something interesting on the floor.", 0],
                ["<i>It's a sword; it looks quite elegantly-made and surprisingly pristine for something left on the floor.</i>", 0],
                ["<i>Will you take it?</i>", 0]],
        options: {
            "yes": {
                say: [["<i>You reach for the sword and pick it up.", 0],
                        ["<i>As you move to walk away, you can hear growling from all directions..", 0],
                        ["<i>Suddenly, a group of grey wolves emerge! Their hides are bristling with fury, their eyes" +
                        " fixated on the sword. They emerge from thickets in all directions, blocking off any escape.", 0],
                        ["<i>Before you can absorb the situation, they start to attack--", 0]],
                action: ["battle", [["grey_wolf", {
                    changeLevel: 10,
                    levelCap: false,
                    addLevels: false
                }], ["waypoint", "postBattleOne"]]]
            },
            "no": {
                say: [["You decide to leave the sword alone.", 0]],
                action: ["end"]
            }
        },
        "postBattleOne": {
            say: [["Another wolf attacks!", 0]],
            action: ["battle", [["grey_wolf", {
                changeLevel: 12,
                levelCap: false,
                addLevels: false
            }], ["waypoint", "postBattleTwo"]]],
        },
        "postBattleTwo": {
            say: [["Most of the wolves back down after seeing you defeat two in a row.", 0],
                    ["However, a few remain. A wolf whose claws are dripping with a dangerous-looking substance approaches..", 0]],
            action: ["battle", [["young_venomous_wolf", {
                changeLevel: 13,
                levelCap: false,
                addLevels: false
            }], ["waypoint", "postBattleThree"]]]
        },
        "postBattleThree": {
            say: [["By this point, all of the wolves have left. You take the sword and leave, feeling a little startled.", 0]],
            action: ["flag", "f1_taken_crafted_sword", "true"],
            action2: ["gold", 0],
            action3: ["exp", 0],
            action4: ["items", "crafted_blade", 1],
            action5: ["end"]
        },
        end: [["", 0]]
    },

    f1_explorer_woman: {
        name: "Explorer woman",
        say: [["<i>You approach the woman. She has a friendly smile, along with black hair and blue eyes.", 0],
                ["<i>Her clothes are clearly geared for exploration - a jacket, trousers and (somewhat long) boots" +
                " various hues of brown.", 0],
                ["<i>Two pouches holstered at her waist allow for easy storage without the compromise of maneouvrability" +
                " that comes with a large backpack.", 0],
            ["[name]: Hey! I'm currently exploring this area, looking for rare things.", 0],
            ["[name]: Sometimes brazen creatures attack me as I travel, but I think there are some creatures that won't" +
            " ambush you and that you'll only find if you go exploring looking for them. Usually, those are the rare ones!", 0],
            ["[name]: Did you know that? It shocked me when I found out!", 0]],
        options: {
            "yes": {
                say: [["[name]: Oh.. you did? I feel a little silly now, haha!", 0]],
                action: ["end"]
            },
            "no": {
                say: [["[name]: There you go then! Hopefully my info was helpful!!", 0]],
                action: ["end"]
            }
        },
        end: [["[name]: I'm going to stay here for a while. I've been running around exploring for so long, I need" +
        " a break! Seeya around!", 0]]
    },

    f1_person_on_toilet: {
        name: "Person 'using the toilet'",
        say: [["<i>You can see someone in the distance, covered by an outburst of leaves.</i>", 0],
                ["<i>It's difficult to see what they're doing. You move some leaves to get a closer look..</i>", 0],
                ["[name]: HEY!! What the hell are you doing?! Go away!!", 0],
                ["<i>The person throws some leaves in your direction, obviously to no avail. You decide it's best to leave" +
                " them alone.</i>", 0]],
        action: ["end"],
        end: [["", 0]]
    },

    f1_mage_trainer: { // Daryl?
        name: "Teenage mage",
        say: [["<i>You approach the mage. Physically, he isn't very powerful-looking, but perhaps that can be expected from his" +
                " profession.</i>", 0]],
        conditional: {
            "flag: f1_spoken_to_daryl": {
                say: [["[name]: Uh, hi. Do you need something?", 0]],
                action: ["waypoint", "opts"]
            },
            "level: 0": {
                say: [
                    ["<i>His clothes seem to be classic mage attire somewhat crudely cut and shaped to be suited to quick" +
                    " movement and close combat. His robes, a dark blue has been fashioned into an open jacket that shows" +
                    " the light grey shirt underneath, over which a strap carrying various potions is observed.</i>", 0],
                    ["<i>His pants are simple adventurer's wear; slightly baggy brown trousers with fairly long black boots.</i>", 0],
                    ["<i>The mage's hood, the same design as his jacket, is the giveaway of his discipline. He looks quite tired" +
                    ", and seems to be resting while leaning against a tree.", 0],
                    ["[name]: Uh, hi. Do you need something?", 0]
                ],
                action: ["flag", "f1_spoken_to_daryl", "true"],
                action2: ["waypoint", "opts"]
            }
        },
        "opts": {
            options: {
                "ask for advice about being a mage": {
                    say: [["[name]: Uhm, well..", 0],
                            ["<i>The mage thinks for a little.", 0],
                            ["[name]: Learning to cast spells is hard part. Everything else isn't too hard.", 0],
                            ["[name]: I guess sometimes you can combine spells for new effects, but that's more of a creativity" +
                            " thing..", 0],
                            ["[name]: Tell you what - I have this sheet of some magic combinations I found out. If you give me" +
                            " 500 gold, I'll give it to you; I've got them memorised anyways, and I need some gold to buy more" +
                            " potions.", 0]],
                    options: {
                        "'yes'": {
                            conditional: {
                                "gold: 500": {
                                    say: [["Alright! Here you go:", 0]],
                                    action: ["gold", -500],
                                    action2: ["items", "mage_cheat_sheet", 0],
                                    action3: ["waypoint", "afterSale"],
                                    action4: ["flag", "f1_bought_from_teenage_mage", "true"],
                                    "afterSale": {
                                        say: [["[name]: I guess now I can head back to the settlement. I won't get Aina mad after" +
                                                " I tell her I lost all our gold... <i>He mumbles to himself.</i>", 0],
                                                ["<i>The mage walks off.</i>", 0]],
                                        action: ["end"]
                                    }
                                },
                                "level: 0": {
                                    say: [["<i>You try to get the gold out but you don't have enough. You tell him that you can't" +
                                            " pay.", 0],
                                            ["[name]: Wh-", 0],
                                            ["[name]: *sigh*", 0],
                                            ["[name]: It's fine, just come back when you can pay.", 0],
                                            ["<i>The mage remains where he is. Maybe come back later.</i>"]],
                                    action: ["end"]
                                }
                            }
                        },
                        "'no'": {
                            say: [["[name]: Alright, that's fine. Come see me if you change your mind.", 0]],
                            action: ["end"]
                        }
                    }
                },  
                "nope": {
                    say: [["[name]: Um.. Ok.", 0],
                            ["<i>The mage stops looking at you. Maybe come and see him again another time.</i>", 0]],
                    action: ["end"]
    
                }
            },
        },
        end: [["", 0]]
    },

    f1_ora: {
        name: "Ora",

        say: [["You approach the man.", 0]],

        conditional: {
            "flag: f1_spoken_to_ora": {
                action: ["waypoint", "loop"]
            },
            "level: 0": {
                say: [
                    ["He's a man with fairly dark skin; you presume in his forties.", 0],
                    ["Despite his sleek figure, there is clearly considerably strength in his bones. He wears a dark green jacket made of a simple cloth, beneath which his skin, wrappd around a slim yet muscular frame can be observed.", 0],
                    ["His trousers are shorts, more likely trousers cut short given the frayed edges.", 0]
                ],
                action2: ["flag", "f1_spoken_to_ora", "true"],
                action: ["waypoint", "loop"]
            }
        },

        "loop": {
            say: [
                ["He acknowledges your presence, thereby encouraging you to speak.", 0]
            ],
                options: {
                    '"Help me craft some items"': {
                        say: [
                            ["Ora nods.", 0]
                        ],
                        action: ["crafting", ["geomancers_hood", "geomancers_lower_robes", "virulent_brawler_leg_guards", "virulent_brawler_helm", "earth_mage_staff", "virulent_bracers", "small_scaled_shield", "toxic_grenade"], ["end"]]
                    },
                    '"Help me craft some powerful items"': {
                        conditional: {
                            "flag: f1_defeated_ora": {
                                say: [
                                    ["Ora nods.", 0],
                                ],
                                action: ["crafting", ["earth_magus_staff", "virulent_brawler_plates", "geomancers_cloak", "living_virulent_bracers", "ailwarder_charm", "tectonic_charm", "virulent_charm"], ["end"]]
                            },
                            "level: 0": {
                                say: [
                                    ["Ora shakes his head.", 0],
                                    ["[name]: You are not prepared.", 0],
                                    ["[name]: I will spar with you. If you can defeat me, I will deem you prepared.", 0]
                                ],
                                options: {
                                    "Spar with Ora": {
                                        say: [
                                            ["Ora nods satisfactorily.", 0],
                                            ["[name]: Prepare yourself, adventurer--", 0],
                                            ["Ora approaches with surprising speed--", 0]
                                        ],
                                        action: ["battle", [["ora", { changeLevel: 12,
                                            levelCap: false, addLevels: false, battleMusic: "mechanical_rhythm$" }], ["waypoint", "afterBattle"]]]
                                    },  
                                    "Don't spar with Ora": {
                                        say: [
                                            ["[name]: I understand. Come back in the future.", 0]
                                        ],
                                        action: ["end"]
                                    }
                                }
                            }
                        }
                    },
                    "Ask him about his life": {
                        say: [
                            ["Ora thinks for a few seconds before speaking.", 0],
                            ["[name]: I was born elsewhere. I was a reticent child, I am told.", 0],
                            ["[name]: Many years ago, there was a disaster in this forest - Bacharat, the King of the Forest, cast a spell that allowed nobody to leave.", 0],
                            ["[name]: The forest needed sustenance and for reasons that I do not know, he was in a bad temper. He intended to wear out those in the forest until they eventually succumbed to it."],
                            ["[name]: Many attempted to escape and perished, some others attempted to wait out the spell. A small camp was made in the forest for this purpose, and probably other settlements that did not survive to this day.", 0],
                            ["[name]: I was raised to be a druid but was a warrior at heart. Putting faith in my attunement with nature, I seeked an audience with Bacharat, but was killed in the process.", 0],
                            ["[name]: As I was dying, he appeared and appealed to me; if I agreed to watch over the forest, he would spare my life.", 0],
                            ["[name]: My soul is now bound to this place. I cannot leave.", 0],
                            ["Ora's face adopts an unreadable expression.", 0],
                            ["[name]: I had many things I wanted to do with my life.. but I suppose it is not so bad here. I observe the balance of life in the forest and intervene when there is a significant disturbance.", 0],
                            ["[name]: Because of my help, Bacharat has not appeared in a long time. Even I have not seen him in over a century.", 0]
                        ],
                        action: ["waypoint", "loop"]
                    },
                    "Ask him about teleportation stones": {
                        say: [
                            ["[name]: I have many stones that lead to this place. If you have money, I can sell some to you.", 0]
                        ],
                        action: ["shop", "f1_ora_shop", ["end"]]
                    },
                    "Say goodbye": {
                        say: [
                            ["Ora looks at you as though to say goodbye, and then returns to whatever he was doing.", 0]
                        ],
                        action: ["end"]
                    }
                }
        },

        "afterBattle": {
            action4: ["music", "forest"],
            action: ["heal"],
            say: [
                ["Ora looks at you. You can tell he is happy, but he doesn't smile.", 0],
                ["[name]: ..You were stronger than I exptected.", 0],
                ["[name]: Most certainly prepared.. I will help you create stronger items now.", 0],
                ["It seems Ora is willing to help you craft stronger items if you speak to him now.", 0]
            ],
            action3: ["flag", "f1_defeated_ora", "true"],
            action2: ["end"]
        },

        end: [["", 0]]
    },

    f1_forest_merchant: {
        name: "Forest merchant",
        say: [
            ["You approach the forest merchant.", 0],
            ["He is dressed in basic adventurer's gear, with a large grey backpack. You presume that is where he keeps his wares.", 0],
            ["[name]: Hello! I sell items found in the outskirts of the forest. Would you like to buy any? All very affordable prices!", 0]
        ],
        options: {
            '"Yes"': {
                say: [
                    ["[name]: Great! Here, have a look!", 0]
                ],
                action: ["shop", "f1_forest_merchant", ["end"]]
            },
            '"No"': {
                say: [
                    ["The merchant looks a little downcast.", 0],
                    ["[name]: Oh...", 0],
                    ["[name]: okay! Well, I'll be here if you need me! Come back anytime!", 0]
                ],
                action: ["end"]
            }
        },
    
        end: [["", 0]]

    },

    f1_gold_on_floor: {
        say: [
            ["There's some gold on floor. You decide to pick it up and take it with you.", 0]
        ],
        action: ["gold", 200],
        action3: ["flag", "f1_picked_up_gold_1", "true"],
        action2: ["end"],
        end: [["", 0]]
    },

    f1_gold_on_floor_2: {
        say: [
            ["There's some gold on floor. You decide to pick it up and take it with you.", 0]
        ],
        action: ["gold", 300],
        action3: ["flag", "f1_picked_up_gold_2", "true"],
        action2: ["end"],
        end: [["", 0]]
    },

    f1_gold_on_floor_3: {
        say: [
            ["There's some gold on floor. You decide to pick it up and take it with you.", 0]
        ],
        action: ["gold", 400],
        action3: ["flag", "f1_picked_up_gold_3", "true"],
        action2: ["end"],
        end: [["", 0]]
    },

    f1_guarded_earthen_manasoul: {
        say: [
            ["Somewhere in the distance, you can feel a strong energy pulsating.", 0],
            ["It puts you at ease and draws you to it. However, you can tell that considerable danger lurks ahead...", 0]
        ],
        options: {
            "Proceed": {
                say: [
                    ["You move in the direction of the attraction.", 0],
                    ["...it is quite for a while, but you soon hear a rustling in the leaves nearby.", 0],
                    ["The rustling multiplies, and, as you advance (wary of your surroundings), it follow you; the source(s) never revealing themselves.", 0],
                    ["You can feel the source very close ahead, but suddenly, several creatures burst forth and block your path!--", 0],
                ],
                action: ["battle", [["lesser_forest_scourge", { changeLevel: 16,
                    levelCap: false, addLevels: false, battleMusic: "mechanical_rhythm$" }], ["waypoint", "afterBattle"]]]
            },
            "Don't proceed": {
                say: [
                    ["You decide to combat your insincts and stand your ground.", 0]
                ],
                action: ["end"]
            }
        },
        "afterBattle": {
            say: [["Battle 2/3", 0]],
            action: ["battle", [["mobile_lesser_ent", { changeLevel: 17,
                levelCap: false, addLevels: false, battleMusic: "mechanical_rhythm$", overlayMusic: true }], ["waypoint", "afterBattle2"]]]
        },
        "afterBattle2": {
            say: [["Battle 3/3", 0]],
            action: ["battle", [["young_venomous_wolf", { changeLevel: 18,
                levelCap: false, addLevels: false, battleMusic: "mechanical_rhythm$", overlayMusic: true }], ["waypoint", "afterBattle3"]]]
        },
        "afterBattle3": {
            action3: ["music", "forest"],
            say: [
                ["There are no more creatures blocking your path.", 0],
                ["You reach the source of the aura; it's a palm-sized green orb. It looks as though it should be an amorphous gas, but it retains its shape and some tangibility.", 0],
                ["You pick it up and take with you, before turning back.", 0]
            ],
            action: ["items", "earthen_manasoul", 1],
            action3: ["flag", "f1_found_guarded_earthen_manasoul", "true"],
            action2: ["end"]
        },

        end: [["", 0]]
    },

    f1_person_looking_for_cat: {
        name: "Bella",
        say: [
            ["You approach the girl. She is probably in her late teens, and she is walking about, looking around her in a panicked state.", 0]
        ],
        conditional: {
            "flag: -f1_spoken_to_person_looking_for_cat": {
                say: [
                    ["When she notices you, she sighs a small sigh of relief.", 0],
                    ["[name]: Hello? You're an adventurer right?", 0],
                    ["[name]: I lost my cat! Could you help me find her? Her name's Rayla, and I saw her go to the east..", 0],
                    ["[name]: I can't really go further out than this.. it's too dangerous for me.", 0],
                    ["[name]: Please! I'll give you gold, items, anything", 0]
                ],
                options: {
                    "Agree to help her": {
                        say: [
                            ["The girl beams.", 0],
                            ["[name]: Thank you so much!!", 0],
                            ["[name]: If you give her this treat, she should follow you. <i>*She hands you some cat treats</i>*", 0],
                            ["[name]: Um.. it's okay if you can't find her, I don't want to take too much of your time.", 0],
                            ["[name]: But if you do come across her, I'd be really grateful!!", 0]
                        ],
                        action3: ["items", "cat_food", 1],
                        action: ["flag", "f1_spoken_to_person_looking_for_cat", "true"],
                        action2: ["end"]
                    },
                    "Refuse": {
                        say: [
                            ["[name]: Oh-- well--", 0],
                            ["[name]: I understand.. you're probably very busy.", 0],
                            ["[name]: I'm going to keep looking. Please come back if you change your mind!", 0],
                            ["She resumes walking about, occasionally calling out 'Rayla' and making clicking noises.", 0]
                        ],
                        action: ["end"]
                    }
                },
            },
            "flag: f1_spoken_to_person_looking_for_cat": {
                conditional: {
                    "item: 1 bellas_cat": {
                        say: [
                            ["The cat runs towards Bella, who picks it up.", 0],
                            ["[name]: SKYLA!! Why did you run away?! You..", 0],
                            ["She snuggles the cat and keeps speaking to it for a while. Then, she looks at you and checks herself.", 0],
                            ["[name]: I can't thank you enough! I know it's not much, but please take this..", 0]
                        ],
                        action6: ["items", "bellas_cat", -1],
                        action: ["gold", 300],
                        action2: ["exp", 500],
                        action3: ["items", "cats_foot", 1],
                        action4: ["flag", "f1_helped_person_looking_for_cat", "true"],
                        action5: ["end"]
                    },
                    "level: 0": {
                        say: [
                            ["She's preoccupied looking for her cat, so she doesn't notice you. You should probably return when you've found it.", 0],
                        ],
                        action: ["end"]
                    }
                },
            }
        },
        end: [["", 0]]
    },

    f1_bellas_cat: {
        name: "Rayla",
        conditional: {
            "item: 1 cat_food": {
                say: [
                    ["[name]: Meow!", 0],
                    ["You shake the cat food in your palm in front of the cat and she walks towards you.", 0],
                    ["You let her eat some, and she begins following you..", 0],
                    ["..Best hold her so she doesn't walk off again.", 0]
                ],
                action: ["items", "bellas_cat", 1],
                action4: ["items", "cat_food", -1 ],
                action3: ["flag", "f1_found_bellas_cat", "true"],
                action2: ["end"]
            },
            "level: 0": {
                say: [
                    ["[name]: Meow!", 0],
                    ["The cat ignores you. You don't have any means of making it pay attention.", 0],
                ],
                action: ["end"]
            }
        },
        end: [["", 0]]
    },

    f1_chuuni: {
        name: "Chuuni",
        say: [
            ["You approach the girl. They are a little short, and not wearing clothes suited to adventuring in a forest; instead adorning what looks like an elaborate school outfit in black and red. They have an eyepatch, which you assume they don't really need.", 0],
            ["When they notice you, they strike a strange pose.", 0],
            ["[name]: The convergence of fate beckons an unspeakable chaos..", 0],
            ["[name]: Witness the realms of 8 conspire in an atramentous zenith..", 0],
            ["[name]: Witness the resurᚷᛖᚾᚲᛖ ᛟᚠ ᚺᛟᛗᛟ-ᚱᛖᛏᚱᛁᛒᚢᛏᛁᛟᚾ..", 0],
            ["???", 0],
            ["You can't understand what they are saying. You decide to leave them alone."]
        ],
        action: ["end"],
        end: [["", 0]]
    },

    f1_thanks_for_playing: {
        name: "",
        say: [
            ["Congratulations on reaching the settlement!", 0],
            ["This message is to inform you that this is pretty much the end of TRPG. I don't have any plans to continue this game.", 0],
            ["This place would have contained NPCs regarding the next area, but since that won't be added, this place will remain unoccupied.", 0],
            ["That said, if you enjoyed the game or have any feedback, please let me know via discord! You can join the game's discord using the invite link found by inputting the super command 'sc-discord'.", 0],
            ["If you'd like something more to do, there are some powerful enemies in the form of the 'Treant', 'Ora', and 'Lesser Ent'. See if you can beat them!", 0],
            ["I may consider continuing the game if enough people like it, but with quarantine ending, I will have other commitments coming up.", 0],
            ["Thanks for playing TRPG!", 0],
            ["Oh, and here's a small gift for making it this far.", 0]
        ],
        action2: ["items", "villageseeker_charm", 1],
        action: ["flag", "thanks_for_playing", "true"],
        action3: ["end"],
        end: [["", 0]]
    },
    //,

    gold_test: {
        say: [["hey", 1]],
        action: ["gold", 1000],
        end: [["bye", 1]]
    },

    // INTERESTING ITEMS ON FLOOR
    /* #region */
    f1_hydra_staff_on_floor: {
        interesting_item: ["f1_picked_up_hydra_staff", ["hydra_staff", 1]],
        end: [["", 0]]
    },

    f1_crown_of_darkness_on_floor: {
        interesting_item: ["f1_picked_up_crown_of_darkness", ["crown_of_darkness", 1]],
        end: [["", 0]]
    },

    f1_simple_sword_on_floor: {
        interesting_item: ["f1_picked_up_simple_sword", ["simple_sword", 1]],
        end: [["", 0]]
    },
    
    f1_damaged_helm_on_floor: {
        interesting_item: ["f1_picked_up_damaged_helm", ["damaged_helm", 1]],
        end: [["", 0]]
    },

    f1_metal_stave_on_floor: {
        interesting_item: ["f1_picked_up_metal_stave", ['metal_stave' , 1]],
        end: [["", 0]]
    },

    f1_silver_axe_on_floor: {
        interesting_item: ["f1_picked_up_silver_axe", ['silver_axe' , 1]],
        end: [["", 0]]
    },

    f1_silver_dagger_on_floor: {
        interesting_item: ["f1_picked_up_silver_dagger", ['silver_dagger' , 1]],
        end: [["", 0]]
    },

    f1_pickaxe_on_floor: {
        interesting_item: ["f1_picked_up_pickaxe", ['pickaxe' , 1]],
        end: [["", 0]]
    },

    f1_feathervine_sword_on_floor: {
        interesting_item: ["f1_picked_up_feathervine_sword", ['feathervine_sword' , 1]],
        end: [["", 0]]
    },

    f1_silver_helm_on_floor: {
        interesting_item: ["f1_picked_up_silver_helm", ['silver_helm' , 1]],
        end: [["", 0]]
    },

    f1_wolfhide_cap_on_floor: {
        interesting_item: ["f1_picked_up_wolfhide_cap", ['wolfhide_cap' , 1]],
        end: [["", 0]]
    },

    f1_vine_helmet_on_floor: {
        interesting_item: ["f1_picked_up_vine_helmet", ['vine_helmet' , 1]],
        end: [["", 0]]
    },

    f1_ninja_headcloak_on_floor: {
        interesting_item: ["f1_picked_up_ninja_headcloak", ['ninja_headcloak' , 1]],
        end: [["", 0]]
    },

    f1_makeshift_steel_armour_on_floor: {
        interesting_item: ["f1_picked_up_makeshift_steel_armour", ['makeshift_steel_armour' , 1]],
        end: [["", 0]]
    },

    f1_greater_mana_potion_on_floor: {
        interesting_item: ["f1_picked_up_greater_mana_potion", ['greater_mana_potion' , 1]],
        end: [["", 0]]
    },

    f1_vine_armour_on_floor: {
        interesting_item: ["f1_picked_up_vine_armour", ['vine_armour' , 1]],
        end: [["", 0]]
    },

    f1_vine_pantaloons_on_floor: {
        interesting_item: ["f1_picked_up_vine_pantaloons", ['vine_pantaloons' , 1]],
        end: [["", 0]]
    },

    f1_silver_legwear_on_floor: {
        interesting_item: ["f1_picked_up_silver_legwear", ['silver_legwear' , 1]],
        end: [["", 0]]
    },

    f1_slime_ball_on_floor: {
        interesting_item: ["f1_picked_up_slime_ball", ['slime_ball' , 8]],
        end: [["", 0]]
    },

    f1_weak_vine_on_floor: {
        interesting_item: ["f1_picked_up_weak_vine", ['weak_vine' , 6]],
        end: [["", 0]]
    },

    f1_hempweed_ligament_on_floor: {
        interesting_item: ["f1_picked_up_hempweed_ligament", ['hempweed_ligament' , 2]],
        end: [["", 0]]
    },

    f1_wood_on_floor: {
        interesting_item: ["f1_picked_up_wood", ['wood' , 4]],
        end: [["", 0]]
    },

    f1_steel_on_floor: {
        interesting_item: ["f1_picked_up_steel", ['steel' , 4]],
        end: [["", 0]]
    },

    f1_brown_pelt_on_floor: {
        interesting_item: ["f1_picked_up_brown_pelt", ['brown_fur' , 6]],
        end: [["", 0]]
    },

    f1_venomous_claw_on_floor: {
        interesting_item: ["f1_picked_up_venomous_claw", ['venomous_claw' , 1]],
        end: [["", 0]]
    },

    f1_earthen_shield_potion_on_floor: {
        interesting_item: ["f1_picked_up_earthen_shield_potion", ['earthen_shield_potion' , 2]],
        end: [["", 0]]
    },

    f1_health_potion_on_floor: {
        interesting_item: ["f1_picked_up_health_potion", ['health_potion' , 4]],
        end: [["", 0]]
    },

    f1_greater_health_potion_on_floor: {
        interesting_item: ["f1_picked_up_greater_health_potion", ['greater_health_potion' , 2]],
        end: [["", 0]]
    },

    f1_crafted_health_potion_on_floor: {
        interesting_item: ["f1_picked_up_crafted_health_potion", ['crafted_health_potion' , 1]],
        end: [["", 0]]
    },

    f1_mana_potion_on_floor: {
        interesting_item: ["f1_picked_up_mana_potion", ['mana_potion' , 4]],
        end: [["", 0]]
    },

    f1_crafted_mana_potion_on_floor: {
        interesting_item: ["f1_picked_up_crafted_mana_potion", ['crafted_mana_potion' , 2]],
        end: [["", 0]]
    },

    f1_forest_explorer_daggers_on_floor: {
        interesting_item: ["f1_picked_up_forest_explorer_daggers", ['forest_explorer_daggers' , 1]],
        end: [["", 0]]
    },

    f1_forest_explorer_cap_on_floor: {
        interesting_item: ["f1_picked_up_forest_explorer_cap", ['forest_explorer_cap' , 1]],
        end: [["", 0]]
    },

    f1_forest_explorer_armour_on_floor: {
        interesting_item: ["f1_picked_up_forest_explorer_armour", ['forest_explorer_armour' , 1]],
        end: [["", 0]]
    },

    f1_forest_explorer_pants_on_floor: {
        interesting_item: ["f1_picked_up_forest_explorer_pants", ['forest_explorer_pants' , 1]],
        end: [["", 0]]
    },

    f1_forest_explorer_pendant_on_floor: {
        interesting_item: ["f1_picked_up_forest_explorer_pendant", ['forest_explorer_pendant' , 1]],
        end: [["", 0]]
    },

    f1_forest_explorer_charm_on_floor: {
        interesting_item: ["f1_picked_up_forest_explorer_charm", ['forest_explorer_charm' , 1]],
        end: [["", 0]]
    },
    
    // --------------- DEEP FOREST ------------------------------ \\
    f1_crafted_mana_potion_on_floor_2: {
        interesting_item: ["f1_picked_up_crafted_mana_potion_2", ['crafted_mana_potion' , 2]],
        end: [["", 0]]
    },

    f1_greater_health_potion_on_floor_2: {
        interesting_item: ["f1_picked_up_greater_health_potion_2", ['greater_health_potion' , 3]],
        end: [["", 0]]
    },

    f1_greater_mana_potion_on_floor_2: {
        interesting_item: ["f1_picked_up_greater_mana_potion_2", ['greater_mana_potion' , 3]],
        end: [["", 0]]
    },

    f1_hempweed_ligament_on_floor_2: {
        interesting_item: ["f1_picked_up_hempweed_ligament_2", ['hempweed_ligament' , 4]],
        end: [["", 0]]
    },

    f1_makeshift_steel_legwear_on_floor: {
        interesting_item: ["f1_picked_up_makeshift_steel_legwear", ['makeshift_steel_legwear' , 1]],
        end: [["", 0]]
    },

    f1_runic_dagger_on_floor: {
        interesting_item: ["f1_picked_up_runic_dagger", ['runic_dagger' , 1]],
        end: [["", 0]]
    },

    f1_deep_forest_explorer_scythe_on_floor: {
        interesting_item: ["f1_picked_up_deep_forest_explorer_scythe", ['deep_forest_explorer_scythe' , 1]],
        end: [["", 0]]
    },

    f1_deep_forest_explorer_cap_on_floor: {
        interesting_item: ["f1_picked_up_deep_forest_explorer_cap", ['deep_forest_explorer_cap' , 1]],
        end: [["", 0]]
    },

    f1_deep_forest_explorer_armour_on_floor: {
        interesting_item: ["f1_picked_up_deep_forest_explorer_armour", ['deep_forest_explorer_armour' , 1]],
        end: [["", 0]]
    },

    f1_deep_forest_explorer_pants_on_floor: {
        interesting_item: ["f1_picked_up_deep_forest_explorer_pants", ['deep_forest_explorer_pants' , 1]],
        end: [["", 0]]
    },

    f1_deep_forest_explorer_necklace_on_floor: {
        interesting_item: ["f1_picked_up_deep_forest_explorer_necklace", ['deep_forest_explorer_necklace' , 1]],
        end: [["", 0]]
    },

    f1_deep_forest_explorer_bracelet_on_floor: {
        interesting_item: ["f1_picked_up_deep_forest_explorer_bracelet", ['deep_forest_explorer_bracelet' , 1]],
        end: [["", 0]]
    },

    f1_forest_scourge_scale_on_floor: {
        interesting_item: ["f1_picked_up_forest_scourge_scale", ['forest_scourge_scale' , 3]],
        end: [["", 0]]
    },

    f1_venomous_claw_on_floor_2: {
        interesting_item: ["f1_picked_up_venomous_claw_2", ['venomous_claw' , 2]],
        end: [["", 0]]
    },

    f1_magic_bark_on_floor: {
        interesting_item: ["f1_picked_up_magic_bark", ['magic_bark' , 2]],
        end: [["", 0]]
    },

    f1_sharp_claw_on_floor_2: {
        interesting_item: ["f1_picked_up_sharp_claw_2", ['sharp_claw' , 3]],
        end: [["", 0]]
    },

    f1_ailwarder_charm_on_floor: {
        interesting_item: ["f1_picked_up_ailwarder_charm", ['ailwarder_charm' , 1]],
        end: [["", 0]]
    },

    // add flags for

    /* #endregion */
}
//

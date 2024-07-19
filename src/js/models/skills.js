import * as mainView from '../views/mainView';
import { Combat } from './combat'; // only need endturn and getequips
import { settings } from './data'; // need messageDelay
import { elementColours } from '../views/baseView';
import { clamp, findAmount, updateDisplay, copy } from './baseModel';
import { items } from './items';
import { updateStatsCombat } from '../views/statView';

export const skills = {
    calcDamage(attacker, defendant, offence, defence, offenceElement, defenceElement, offenceMod, defenceMod, damageMod, additionalArgs = {
        canEvade: true, canCrit: true
    }) {
        if (offenceElement == "weapon") {
            offenceElement = skills.getWeaponElement(attacker);
        }
        if (defenceElement == "weapon") {
            defenceElement = skills.getWeaponElement(attacker);
        }
        const attackerElMod = Combat.calcElementBuffs(attacker);
        const defendantElMod = Combat.calcElementBuffs(defendant);

        const offElement = attacker.elemental.offence[offenceElement] + attackerElMod.offence[offenceElement];
        const defElement = defendant.elemental.defence[defenceElement] + defendantElMod.defence[defenceElement];
        const offStat = attacker[offence] * (1 + Combat.calcMod(offence, attacker));
        const defStat = defendant[defence] * (1 + Combat.calcMod(defence, defendant));
        var crit = Math.random() < (attacker.crit_chance + attacker.crit_chance_mod) ? (attacker.crit_damage + attacker.crit_damage_mod) : 1;
        var eva = Math.random() < (defendant.evasion + Combat.calcMod("evasion", defendant)) ? 0 : 1;
        var miti = (1 - clamp(Combat.calcMod("mitigation", defendant), 0, 0.8));
        
        const canEvade = additionalArgs.canEvade == undefined ? true : additionalArgs.canEvade;
        const canCrit = additionalArgs.canCrit == undefined ? true : additionalArgs.canCrit;

        if (canEvade == false) {
            eva = 1;
        }

        if (canCrit == false) {
            crit = 1;
        }

        //console.log(offElement);
        //console.log(defElement);
        //console.log(offStat);
        //console.log(defStat);
        //console.log(crit);
        //console.log(eva);
        //console.log(offStat * offenceMod - defStat * defenceMod);

        const numerator = (( (Math.pow(offStat, 2)) * offenceMod) + 250);
        const denominator = (defStat * defenceMod + 100);

        var damage = ((numerator / denominator) * (offElement / 100) * (defElement / 100) * crit * eva * miti * damageMod);
        var damage = Math.round(damage * (Math.random() * 0.1 + 0.9)); // adding the random aspect

        //var damage = Math.round( (offStat * offenceMod - defStat * defenceMod) * offElement * defElement / 10000 * crit * eva * miti * (Math.random() * 0.1 + 0.9));
        
        //console.log(damage);

        return {
            damage: clamp(damage, 0, 99999999),
            crit: crit !== 1 ? true : false,
            eva: eva == 0 ? true : false,
            element: offenceElement,
            offElement: offElement,
            defElement: defElement,
            mitigation: miti,
            type: (offence == 'atk' ? 'physical' : 'magical')
        }
    }, // damage = ((atk * offenceMod) -  (def * defenceMod) * offenceElement * defenceElement * crit)

    prepareAttackMessage(user, target, text, damage, mode = "unshift", lineBreak = false) {
        const damageMsg = `${damage.crit ? '<b>' : ''}<span style="color:${elementColours[damage.element]}">`+
        `${damage.damage} damage! (${(Math.round(damage.defElement * damage.offElement * damage.mitigation) / 100)}% ${damage.type}) [${damage.element}]</span>${damage.crit ? '</b>' : ''}`
        //console.log(`damage msg is ${damageMsg}`);
        const newMsg = `${lineBreak ? "[]" : ""}${text}${damage.crit ? '[]CRITICAL HIT!!' : ''}${damage.eva ? `[]${target} evaded the attack!` : ''}[]${damageMsg}`.split('[]'); // '[]' is used to split the message so that it can be used with the displaymessagesdelayed function
        /*var finalMsg = newMsg.map(item => {
            return [item, 1]
        });*/
        //console.log(newMsg);
        skills.pushMessagesToState(newMsg, true, mode);
    },

    pushMessagesToState(msgArr, preAttack = true, mode = "unshift") {
        const notation = preAttack ? "preAtkMsg" : "msg";
        // unshift in reverse so that the messages are pushed to the front of the array and in the correct order
        // messages will always have pauseBefore set to true
        if (mode == "unshift") {
            msgArr.slice().reverse().forEach(msg => {
                skills.skillStack.stack.unshift( [notation, () => { mainView.displayMessage(msg) }, true]);
            })
        } else {
            msgArr.slice().forEach(msg => {
                skills.skillStack.stack.push( [notation, () => { mainView.displayMessage(msg) }, true]);
            })   
        }
    },

    pushBeforeCombatMessage(item) {
        const skillStack = skills.skillStack.stack;
        // function incomplete, was never used
    },

    pushEffect(item, finish = false) {
        const skillStack = skills.skillStack.stack;
        skillStack.push(item);
        if (finish != false) {
            skills.skillStack.finalAdded = true;
            skillStack.push(finish);
            skills.runSkillStack();
        }
        // general function so that I have to edit less stuff YAHOO
    },

    pushToState(skill, damage, user) {
        Combat.state[Combat.state.length - 1][user].push({
            skill: skill,
            damage: damage,
            user: user
        })
    },

    getSkill(name) {
        //console.log(Object.keys(skills))
        var skill = -1;
        Object.keys(skills).forEach(cur => {
            if (skills[cur].hasOwnProperty("name")) { // since skill has properties that are not skills, like this method
                //console.log("logging skill being checked");
                //console.log(skills[cur]);
                if (skills[cur].name.toLowerCase() == name) {
                    skill = skills[cur];
                }
            }
        })
        //console.log("logging skill");
        //console.log(skill);
        return skill;
        
    },

    finish(skillName, damage, type) { // because two branches need it
        skills.pushToState(skillName, damage, type);
        //Combat.endTurn(type);
    },

    getWeaponElement(user) {
        var element = "physical";
        if (user.hasOwnProperty("equips")) {
            if (user.equips.weapon != undefined) {
                element = items[user.equips.weapon].element
            }
        }
        return element;
    },

    gainActions(type, number, target = "self", state = false, finish = false, plr, enemy, showMessage = true) {
        //  - State denotes whether or not we will add to the state. If true, pass in an array of the arguments for finish...
        // ...in the order [skillName, damage, type]
        //  - Finish denotes whether or not upon the completion of this skill we will end the turn. For all skills/items this...
        // ...should be set to true
        const trueTarget = skills.getTarget(type, target);
        var targetObject = trueTarget == "player" ? Combat.getPlayer() : Combat.getEnemy();
        var addActionsFunc = () => { targetObject.actions += number };
        var actionsMsgFunc = () => {};
        if (showMessage) {
            if (number > 0) {
                actionsMsgFunc = () => { mainView.displayMessage(`${targetObject.name} gained ${number} actions!`) };
            } else {
                actionsMsgFunc = () => { mainView.displayMessage(`${targetObject.name} lost ${Math.abs(number)} actions!`) };
            };
        }
        var finalFunc = false;
        if (state != false || finish == true) {
            var finalFunc = () => {
                if (state != false) {
                    skills.finish(state[0], state[1], state[2]);
                }
                if (finish == true) {
                    Combat.endTurn(type);
                }
            };
        }
        const effect = ["effect", () => {
            addActionsFunc();
            actionsMsgFunc();
        }, showMessage];
        if (finalFunc != false) {
            finalFunc = ["finish", finalFunc, true];
        };
        skills.pushEffect(effect, finalFunc);


    },

    gainHealth(type, number, target = "self", state = false, finish = false, plr, enemy, showMessage = true) {
        //  - State denotes whether or not we will add to the state. If true, pass in an array of the arguments for finish...
        // ...in the order [skillName, damage, type]
        //  - Finish denotes whether or not upon the completion of this skill we will end the turn. For all skills/items this...
        // ...should be set to true
        const trueTarget = skills.getTarget(type, target);
        var targetObject = trueTarget == "player" ? Combat.getPlayer() : Combat.getEnemy();
        var addHealthFunc = () => { targetObject.health += number; if (targetObject.health > targetObject.max_health) { targetObject.health = targetObject.max_health} };
        var healthMsgFunc = () => { };
        if (showMessage) {
            if (number > 0) {
                healthMsgFunc = () => { mainView.displayMessage(`${targetObject.name} gained ${number} HP!`) };
            } else {
                healthMsgFunc = () => { mainView.displayMessage(`${targetObject.name} lost ${Math.abs(number)} HP!`) };
            };
        }
        var finalFunc = false;
        if (state != false || finish == true) {
            var finalFunc = () => {
                if (state != false) {
                    skills.finish(state[0], state[1], state[2]);
                }
                if (finish == true) {
                    Combat.endTurn(type);
                }
            };
        }/*
        skills.skillStack.stack.push(() => {
            Combat.uploadChanges(plr, enemy);
        });*/
        const effect = ["effect", () => {
            addHealthFunc();
            healthMsgFunc();
        }, showMessage];
        if (finalFunc != false) {
            finalFunc = ["finish", finalFunc, true];
        };
        skills.pushEffect(effect, finalFunc);


    },

    dealDamage(type, number, target = "self", state = false, finish = false, plr, enemy) {
        //  - State denotes whether or not we will add to the state. If true, pass in an array of the arguments for finish...
        // ...in the order [skillName, damage, type]
        //  - Finish denotes whether or not upon the completion of this skill we will end the turn. For all skills/items this...
        // ...should be set to true
        //console.log(`DEAL DAMAGE CALLED. TYPE IS ${type}`);
        const trueTarget = skills.getTarget(type, target);
        var targetObject = trueTarget == "player" ? Combat.getPlayer() : Combat.getEnemy();
        var dealDamageFunc = () => { targetObject.health -= number; if (targetObject.health > targetObject.max_health) { targetObject.health = targetObject.max_health} };
        var pauseBefore = false; // cannot show message so will not bother chagning this 
        var finalFunc = false;
        if (state != false || finish == true) {
            var finalFunc = () => {
                //console.log("FINAL FUNC CALLED");
                //console.log(`state is ${state} and finish is ${finish}`)
                if (state != false) {
                    //console.log("STATE IS NOT FALSE");
                    skills.finish(state[0], state[1], state[2]);
                }
                if (finish == true) {
                    //console.log("FINISH IS NOT FALSE");
                    Combat.endTurn(type);
                }
            };
        }/*
        skills.skillStack.stack.push(() => {
            Combat.uploadChanges(plr, enemy);
        });*/
        const effect = ["effect", () => {
            dealDamageFunc();
        }, pauseBefore];
        if (finalFunc != false) {
            finalFunc = ["finish", finalFunc, true];
        };
        skills.pushEffect(effect, finalFunc);


    },

    gainMana(type, number, target = "self", state = false, finish = false, plr, enemy, showMessage = true) {
        //  - State denotes whether or not we will add to the state. If true, pass in an array of the arguments for finish...
        // ...in the order [skillName, damage, type]
        //  - Finish denotes whether or not upon the completion of this skill we will end the turn. For all skills/items this...
        // ...should be set to true
        const trueTarget = skills.getTarget(type, target);
        var targetObject = trueTarget == "player" ? Combat.getPlayer() : Combat.getEnemy();
        var addManaFunc = () => { targetObject.mana += number; if (targetObject.mana > targetObject.max_mana) { targetObject.mana = targetObject.max_mana} };
        var manaMsgFunc = () => {}
        if (showMessage) {
            if (number > 0) {
                manaMsgFunc = () => { mainView.displayMessage(`${targetObject.name} gained ${number} MP!`) };
            } else {
                manaMsgFunc = () => { mainView.displayMessage(`${targetObject.name} lost ${Math.abs(number)} MP!`) };
            };
        }
        var finalFunc = false;
        if (state != false || finish == true) {
            var finalFunc = () => {
                if (state != false) {
                    skills.finish(state[0], state[1], state[2]);
                }
                
                if (finish == true) {
                    Combat.endTurn(type);
                }
            };
        }/*
        skills.skillStack.stack.unshift(() => {
            Combat.uploadChanges(plr, enemy);
        });*/
        const effect = ["effect", () => {
            addManaFunc();
            manaMsgFunc();
        }, showMessage];
        if (finalFunc != false) {
            finalFunc = ["finish", finalFunc, true];
        };
        skills.pushEffect(effect, finalFunc);


    },

    gainSP(type, number, target = "self", state = false, finish = false, plr, enemy, showMessage = true) {
        //  - State denotes whether or not we will add to the state. If true, pass in an array of the arguments for finish...
        // ...in the order [skillName, damage, type]
        //  - Finish denotes whether or not upon the completion of this skill we will end the turn. For all skills/items this...
        // ...should be set to true
        const trueTarget = skills.getTarget(type, target);
        var targetObject = trueTarget == "player" ? Combat.getPlayer() : Combat.getEnemy();
        var addSPFunc = () => { targetObject.sp += number; if (targetObject.sp > targetObject.max_sp) { targetObject.sp = targetObject.max_sp} };
        var spMsgFunc = () => {};
        if (showMessage) {
            if (number > 0) {
                spMsgFunc = () => { mainView.displayMessage(`${targetObject.name} gained ${number} SP!`) };
            } else {
                spMsgFunc = () => { mainView.displayMessage(`${targetObject.name} lost ${Math.abs(number)} SP!`) };
            };
        }
        var finalFunc = false;
        if (state != false || finish == true) {
            var finalFunc = () => {
                if (state != false) {
                    skills.finish(state[0], state[1], state[2]);
                };
                if (finish == true) {
                    Combat.endTurn(type);
                }
            };
        }/*
        skills.skillStack.stack.unshift(() => {
            Combat.uploadChanges(plr, enemy);
        });*/
        const effect = ["effect", () => {
            addSPFunc();
            spMsgFunc();
        }, showMessage];
        if (finalFunc != false) {
            finalFunc = ["finish", finalFunc, true];
        };
        skills.pushEffect(effect, finalFunc);


    },

    gainStamina(type, number, target = "self", state = false, finish = false, plr, enemy, showMessage = true) {
        //  - State denotes whether or not we will add to the state. If true, pass in an array of the arguments for finish...
        // ...in the order [skillName, damage, type]
        //  - Finish denotes whether or not upon the completion of this skill we will end the turn. For all skills/items this...
        // ...should be set to true
        const trueTarget = skills.getTarget(type, target);
        var targetObject = trueTarget == "player" ? Combat.getPlayer() : Combat.getEnemy();
        var addStaminaFunc = () => { targetObject.stamina += number; if (targetObject.stamina > targetObject.max_stamina) { targetObject.stamina = targetObject.max_stamina} };
        var staminaMsgFunc = () => {};
        if (showMessage) {
            if (number > 0) {
                staminaMsgFunc = () => { mainView.displayMessage(`${targetObject.name} gained ${number} stamina!`) };
            } else {
                staminaMsgFunc = () => { mainView.displayMessage(`${targetObject.name} lost ${Math.abs(number)} stamina!`) };
            };
        }
        var finalFunc = false;
        if (state != false || finish == true) {
            var finalFunc = () => {
                if (state != false) {
                    skills.finish(state[0], state[1], state[2]);
                };
                if (finish == true) {
                    Combat.endTurn(type);
                }
            };
        }/*
        skills.skillStack.stack.unshift(() => {
            Combat.uploadChanges(plr, enemy);
        });*/
        const effect = ["effect", () => {
            addStaminaFunc();
            staminaMsgFunc();
        }, showMessage];
        if (finalFunc != false) {
            finalFunc = ["finish", finalFunc, true];
        };
        skills.pushEffect(effect, finalFunc);


    },

    pushCustomFunc(type, func, target = "self", state = false, finish = false, plr, enemy, pauseBefore = false) {
        //  - State denotes whether or not we will add to the state. If true, pass in an array of the arguments for finish...
        // ...in the order [skillName, damage, type]
        //  - Finish denotes whether or not upon the completion of this skill we will end the turn. For all skills/items this...
        // ...should be set to true

        var customFunc = func;
        var finalFunc = false;
        if (state != false || finish == true) {
            var finalFunc = () => {
                if (state != false) {
                    skills.finish(state[0], state[1], state[2]);
                }
                if (finish == true) {
                    Combat.endTurn(type);
                }
            };
        }/*
        skills.skillStack.stack.unshift(() => {
            Combat.uploadChanges(plr, enemy);
        });*/
        const effect = ["effect", () => {
            customFunc();
            //Combat.uploadChanges(plr, enemy);
        }, pauseBefore];
        if (finalFunc != false) {
            finalFunc = ["finish", finalFunc, true];
        };
        skills.pushEffect(effect, finalFunc);


    },

    pushWaitForInput(type, state, finish) {
        var finalFunc = false;
        if (state != false || finish == true) {
            var finalFunc = () => {
                if (state != false) {
                    skills.finish(state[0], state[1], state[2]);
                }
                if (finish == true) {
                    Combat.endTurn(type);
                }
            };
        }
        const effect = "waitForInput";
        if (finalFunc != false) {
            finalFunc = ["finish", finalFunc, true];
        };
        skills.pushEffect(effect, finalFunc);
    },

    applyBuff(type, buffFunction, target = "self", state = false, finish = false, plr, enemy) {
        //  - State denotes whether or not we will add to the state. If true, pass in an array of the arguments for finish...
        // ...in the order [skillName, damage, type]
        //  - Finish denotes whether or not upon the completion of this skill we will end the turn. For all skills/items this...
        // ...should be set to true
        const trueTarget = skills.getTarget(type, target);
        var targetObject = trueTarget == "player" ? Combat.getPlayer() : Combat.getEnemy();      
        var finalFunc = false;

        if (state != false || finish == true) {
            var finalFunc = () => {
                if (state != false) {
                    skills.finish(state[0], state[1], state[2]);
                }
                if (finish == true) {
                    Combat.endTurn(type);
                }
            };
        }/*
        skills.skillStack.stack.unshift(() => {
            Combat.uploadChanges(plr, enemy);
        });*/
        const effect = ["effect", buffFunction, true];
        if (finalFunc != false) {
            finalFunc = ["finish", finalFunc, true];
        };
        skills.pushEffect(effect, finalFunc);


    },

    stripBuff(type, stripbuffFunction, target = "self", state = false, finish = false, plr, enemy) {
        //  - State denotes whether or not we will add to the state. If true, pass in an array of the arguments for finish...
        // ...in the order [skillName, damage, type]
        //  - Finish denotes whether or not upon the completion of this skill we will end the turn. For all skills/items this...
        // ...should be set to true
        const trueTarget = skills.getTarget(type, target);
        var targetObject = trueTarget == "player" ? Combat.getPlayer() : Combat.getEnemy();
        var finalFunc = false;
        if (state != false || finish == true) {
            var finalFunc = () => {
                if (state != false) {
                    skills.finish(state[0], state[1], state[2]);
                }
                if (finish == true) {
                    Combat.endTurn(type);
                }
            };
        }/*
        skills.skillStack.stack.unshift(() => {
            Combat.uploadChanges(plr, enemy);
        });*/
        const effect = ["effect", stripbuffFunction, true];
        if (finalFunc != false) {
            finalFunc = ["finish", finalFunc, true];
        };
        skills.pushEffect(effect, finalFunc);


    },

    getTarget(type, target = "self") {
        var trueTarget = type;
        if (target != "self") {
            if (trueTarget == "player") {
                trueTarget = "enemy"
            } else {
                trueTarget = "player"
            }
        }
        return trueTarget;
    },

    skillStack: {
        stack: [],
        playing: false,
        finalAdded: false,
    },

    runSkillStack() {
        //console.log("LOGGING SKILL STACK");
        //console.log(skillStack);
        //console.log("RUN STACK CALLED");
        const skillStack = skills.skillStack;
        skillStack.playing = true;
        const plr = Combat.getPlayer();
        const enemy = Combat.getEnemy();

        const loop = () => {
           //console.log("loop called");
            if (skillStack.stack.length > 0 && skillStack.playing == true) {
                // for testing purposes
                const temp1 = {...skillStack.stack};
                //console.log(temp1);
                // ---------------
                //console.log("RECURSIVE CALLED; LOGGING SKILL STACK");
                //console.log(copy(skillStack.stack));
                //console.log(skillStack.stack[0]);
                if (skillStack.stack[0] == "waitForInput") {
                    mainView.displayMessage("<br><i>Input anything to continue...</i>");
                    skillStack.playing = false;
                    const inputContinue = () => {
                        mainView.removeInputResponse(inputContinue);
                        skillStack.playing = true;
                        loop();
                    }
                    skillStack.stack.splice(0, 1);
                    mainView.setInputResponse(inputContinue);
                } else {
                    const baseWait = settings.battleMessageDelay;
                    const temp = copy(skillStack.stack[0]);
                    skillStack.stack.splice(0, 1);
    
                    if (skillStack.stack.length > 0) { // ensure that the code stops once the stack reaches 0 length...
                        // ..by putting this before calling a function, which could add things..
                        // ..to the stack
                        var waitTime = 1000;
                        if (skillStack.stack[0][2] == false) { waitTime = 0 }; // if pausebefore of the next function is 0
                        setTimeout(loop, baseWait * waitTime);  
                    } else {
                        skillStack.playing = false;
                        skillStack.finalAdded = false;
                        //return true;
                    }
    
                    temp[1](); // must be in this order or we will never reach the end of skill stack
                    updateStatsCombat(Combat.getPlayerAdd(Combat.getPlayer()));
                }
            } else {
                skillStack.playing = false;
                if (skillStack.stack.length == 0) {
                    skillStack.finalAdded = false;
                }
                return true;
            }
        };
        loop();

    },

    pushBeforeFinish(item) {
        const skillStack = skills.skillStack;
        if (skillStack.finalAdded == true) {
            skillStack.stack.splice(-2, 0, item);
        } else {
            skillStack.stack.push(item);
        }
    },

    //** SKILLS */
    attack: {
        name: 'attack',
        description: "Strike the enemy, dealing moderate physical damage. Attack element is based on the element of the equipped weapon.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'weapon',
        def_element: 'weapon',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 1,
        use: (user, target, type) => {
            const skill = skills.attack // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} struck the enemy! [Attack]`, damage);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const stateDamage = {
                damage: damage,
                type: ["attack"],
                target: "opponent"
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, stateDamage, type], true, plr, enemy);

        },

        cost: (user, target) => {
            return true;
        }
    },

    guard: {
        name: 'guard',
        description: "Take a defensive stance, applying <u>Guard</u> [50% migiation, unstrippable] to the user, along with granting them 10 SP. This " +
        " can only be used as the first action of a turn, and will consume up to two actions when used.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const buff = {
                name: "guard",
                mitigation: 0.5,
                duration: 1,
                element: "physical",
                types: ["buff"],
                apply_text: " is guarding..",
                unstrippable: true,
                max_stacks: 1
            }

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            // if player is needed to apply buffs, instead of user/target use ** (type == 'player' ? Combat.getPlayer() : user) **
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };

            const state = ["guard", {
                damage: 0,
                additionalInfo: {
                    type: ["buff"],
                    target: "self"
                }
            }, type];
            skills.gainActions(type, -1, "self", false, false, plr, enemy, false);
            skills.gainSP(type, 10, "self", false, false, plr, enemy);
            skills.applyBuff(type, func, "self", state, true, plr, enemy);
            /* ^ ternary used to get playerFighter if the player is having the buff applied, since otherwise we are applying the buff
            to getPlayerAdd which is pointless */


        },

        cost: (user, target) => {
            if (user.actionsTaken > 0) {
                return "Cannot be used this turn!";
            } else {
                return true
            }
        }
    },

    // ------------------------------------------------ \\
    // ------------------------------------------------ \\

    // ** -- LORE DISCIPLINE (Tutorial) -- ** \\

    forgotten_haste: {
        name: 'forgotten haste',
        description: `<b>Cost: 20 Mana</b> - The user calls upon powerful magic to recover a fraction of their lost` +
        ` power. Applies <u>Forgotten Haste</u> [+50% SPD, +25% ATK, 6T duration] to the user.`,
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.forgotten_haste;

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainMana(type, -20, "self", false, false, plr, enemy, false);

            const state = [skill.name, {
                damage: 0,
                additionalInfo: {
                    type: ["buff"],
                    target: "self"
                }
            }, type];

            const buff = {
                name: "forgotten haste",
                speed: 0.5,
                atk: 0.25,
                duration: 6,
                element: "light",
                types: ["buff"],
                apply_text: " has unlocked a portion of their lost power!",
                max_stacks: 1
            }
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.applyBuff(type, func, "self", state, true, plr, enemy);

        },

        cost: (user, target) => {
            if (user.mana >= 20) { return true } else { return "Insufficient Mana!"};
        }
    },

    divine_protection: {
        name: 'divine protection',
        description: `<b>Cost: 20 Mana</b> - The user calls upon divine magic to protect them from curses. Applies` +
        ` <u>Divine Protection</u> [+100 Resistance, 3T duration] to the user.`,
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.divine_protection;

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainMana(type, -20, "self", false, false, plr, enemy, false);

            const state = [skill.name, {
                damage: 0,
                additionalInfo: {
                    type: ["buff"],
                    target: "self"
                }
            }, type];

            const buff = {
                name: "divine protection",
                resistance: 100,
                duration: 3,
                element: "light",
                types: ["buff"],
                apply_text: " is being protected by divine magic!",
                max_stacks: 1
            }
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.applyBuff(type, func, "self", state, true, plr, enemy);

        },

        cost: (user, target) => {
            if (user.mana >= 20) { return true } else { return "Insufficient Mana!"};
        }
    },

    guard_crush: {
        name: 'guard crush',
        description: "<b>Cost: 25 Stamina</b> - The user strikes the enemy targeting their defenses rather than their life." +
        " Deals fair physical damage and applies <u>Guard Crushed</u> [-25% DEF/MDEF/ATK, 6T duration, stacks to 3] to the enemy.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 0.9,
        def_mod: 1,
        dmg_mod: 0.95,
        use: (user, target, type) => {
            const skill = skills.guard_crush // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} crushes the enemy's defenses! [Guard Crush]`, damage);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -25, "self", false, false, plr, enemy, false);

            const debuff = {
                name: "guard crushed",
                duration: 6,
                def: -0.25,
                mdef: -0.25,
                atk: -0.25,
                element: "physical",
                types: ["debuff"],
                apply_text:"'s guard has been crushed!",
                max_stacks: 3
            };
            
            if (damage.eva == false) {
                const func = () => {
                    Combat.applyBuff(debuff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                };
                skills.applyBuff(type, func, "opponent", false, false, plr, enemy);
            }

            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["attack", "debuff"],
                    target: "opponent"
                }
            }
            
            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);

        },
        cost: (user, target) => {
            if (user.stamina >= 25) { return true } else { return "Insufficient Stamina!" };
        }
    },

    smite: {
        name: 'smite',
        description: "<b>Cost: 50 Stamina</b> - The user imbues their weapon with holy power and strikes their enemy. Deals" +
        ` high physical light damage.`,
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'light',
        def_element: 'light',
        off_mod: 1.2,
        def_mod: 0.9,
        dmg_mod: 1.34,
        use: (user, target, type) => {
            const skill = skills.smite // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} strikes with holy force! [Smite]`, damage);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -50, "self", false, false, plr, enemy, false);

            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["attack"],
                    target: "opponent"
                }
            }
            
            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);

        },
        cost: (user, target) => {
            if (user.stamina >= 50) { return true } else { return "Insufficient Stamina!" };
        }
    },

    // ** -- ADVENTURER SKILLS -- ** \\

    check: { 
        name: 'check',
        description: "Reveals the stats of an enemy upon use.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;
            const state = ["check", {
                damage: 0,
                additionalInfo: {
                    type: ["debuff"],
                    target: "opponent"
                }
            }, type];
            skills.pushMessagesToState(["Analysing..."]);
            skills.pushCustomFunc(type, () => {Combat.displayStats(target)}, target, false, false, plr, enemy);
            skills.pushWaitForInput(type, state, true);

        },

        cost: (user, target) => {
            return true;
        }
    },

    boost: {
        name: 'boost',
        description: "<b>Cost: 10 SP</b> - The user focuses their energy into granting them an extra spurt of power. Grants" +
        " two additional actions. Cannot be used more than twice in one turn.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'weapon',
        def_element: 'weapon',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 1,
        use: (user, target, type) => {
            const skill = skills.boost // need to change for each skill

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;
            
            skills.gainSP(type, -10, "self", false, false, plr, enemy, false);
            skills.pushMessagesToState([`<br>${user.name} is boosting!`], true, "unshift");
            const state = ["boost", {
                damage: 0,
                additionalInfo: {
                    type: ["buff"],
                    target: "self"
                }
            }, type]
            skills.gainActions(type, 2, "self", state, true, plr, enemy, true);

        },

        cost: (user, target) => {
            const type = user.hasOwnProperty("pouch") ? "player" : "enemy";
            if (findTimesUsed(type, "boost") < 2) {
                if (user.sp >= 10) {
                    return true;
                } else {
                    return "Insufficient SP!";
                }
            } else {
                return "This skill has already been used twice this turn!"
            }

        }
    },

    hex: {
        name: 'hex',
        description: "<b>Cost: 7 mana</b> - The user curses the enemy, applying <u>Hexed</u> [-30% Resistance, 3T duration]" +
        " to them. This skill ignores resistance.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'dark',
        def_element: 'dark',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.hex // need to change for each skill

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainMana(type, -7, "self", false, false, plr, enemy, false);

            skills.pushMessagesToState([`${user.name} attempts to curse their enemy! [Hex]`], true, "push");

            const stateDamage = {
                damage: 0,
                type: ["debuff"],
                target: "opponent"
            };
            const state = [skill.name, stateDamage, type];

            const buff = {
                name: "hexed",
                duration: 3,
                resistance: -30,
                element: "dark",
                types: ["debuff"],
                apply_text: " is hexed!",
                max_stacks: 1,
            };
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs", {
                    ignoreRes: true
                });
            };
            skills.applyBuff(type, func, "opponent", state, true, plr, enemy);

        },

        cost: (user, target) => {
            if (user.mana >= 7) { return true } else { return "insufficient mana!"};
        }
    },

    dagger_throw: { 
        name: 'dagger throw',
        description: "<b>Cost: 5 SP</b> - The user quickly throws a dagger at their enemy, dealing low physical damage and granting" +
        " themselves an extra action.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 1,
        def_mod: 1.2,
        dmg_mod: 0.59,
        use: (user, target, type) => {
            const skill = skills.dagger_throw // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainSP(type, -5, "self", false, false, plr, enemy, false);

            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} throws a dagger at their enemy! [Dagger Throw]`, damage);

            const stateDamage = {
                damage: damage,
                type: ["attack"],
                target: "opponent"
            }

            skills.dealDamage(type, damage.damage, "opponent", false, false, plr, enemy);
            skills.gainActions(type, 1, "self", [skill.name, stateDamage, type], true, plr, enemy, true);

        },

        cost: (user, target) => {
            if (user.sp >= 5) { return true } else { return "Insufficient SP!" };
        }
    },

    smokescreen: { 
        name: 'smokescreen',
        description: "<b>Cost: 10 mana</b> - The user throws up a smokescreen, making it hard to both hit and be hit by the" +
        " enemy. Applies <u>Smokescreen</u> [+30% evasion, unstrippable, 2T duration] to both the user and their opponent.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.smokescreen // need to change for each skill

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainMana(type, -10, "self", false, false, plr, enemy, false);

            const stateDamage = {
                damage: 0,
                type: ["buff"],
                target: "all"
            };
            const state = [skill.name, stateDamage, type];

            const buff = {
                name: "smokescreen",
                duration: 2,
                evasion: 0.3,
                element: "physical",
                types: ["buff"],
                apply_text: " is shrouded by smoke!",
                max_stacks: 1,
            };
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "buffs");
            };
            skills.applyBuff(type, func, "opponent", false, false, plr, enemy);

            const func2 = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : Combat.getEnemy()), "buffs");
            };
            skills.applyBuff(type, func2, "self", state, true, plr, enemy);

        },

        cost: (user, target) => {
            if (user.mana >= 10) { return true } else { return "Insufficient mana!" };
        }
    },

    piercing_dagger_throw: { 
        name: 'piercing dagger throw',
        description: "<b>Cost: 20 Stamina</b> - The user throws a particularly sharp dagger at their opponent. Deals low" +
        " physical damage that ignores the enemy's defence.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 0.75,
        def_mod: 0,
        dmg_mod: 0.89,
        use: (user, target, type) => {
            const skill = skills.piercing_dagger_throw // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
        
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} throws a piercing dagger at their enemy! [Piercing Dagger Throw]`, damage);
            
            skills.gainStamina(type, -20, "self", false, false, plr, enemy, false);

            const stateDamage = {
                damage: damage,
                type: ["attack"],
                target: "opponent"
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, stateDamage, type], true, plr, enemy);

        },

        cost: (user, target) => {
            if (user.stamina >= 20) { return true } else { return "Insufficient Stamina!" };
        }
    },

    brutal_swipe: {
        name: 'brutal swipe',
        description: "<b>Cost: 30 Stamina</b> - The user enhances their strength temporarily and attacks, dealing high weapon" +
        " element physical damage.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'weapon',
        def_element: 'weapon',
        off_mod: 1,
        def_mod: 0.9,
        dmg_mod: 1.54,
        use: (user, target, type) => {
            const skill = skills.brutal_swipe // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -30, "self", false, false, plr, enemy, false);

            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} swiped at the enemy brutally! [Brutal Swipe]`, damage);
            
            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["attack"],
                    target: "opponent"
                }
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);
        },

        cost: (user, target) => {
            if (user.stamina >= 30) { return true } else {return "Insufficient Stamina!"};
        }
    },

    crushing_blow: {
        name: 'crushing blow',
        description: "<b>Cost: 30 Stamina</b> - The user enhances their strength temporarily and attacks, dealing very high weapon" +
        " element physical damage.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'weapon',
        def_element: 'weapon',
        off_mod: 1.2,
        def_mod: 1,
        dmg_mod: 1.89,
        use: (user, target, type) => {
            const skill = skills.crushing_blow // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -30, "self", false, false, plr, enemy, false);

            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} attempted to crush the enemy! [Crushing Blow]`, damage);
            
            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["attack"],
                    target: "opponent"
                }
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);
        },

        cost: (user, target) => {
            if (user.stamina >= 30) { return true } else {return "Insufficient Stamina!"};
        }
    },
    

    // ------------------------------------------------ \\
    // ------------------------------------------------ \\

    // ** -- MAGE DISCIPLINE -- ** \\

    fireball: {
        name: 'fireball',
        description: `<b>Cost: 10 MP</b> - The user fires a fireball at the enemy, dealing below average magical fire damage. Applies ` +
        ` <u>Fire Charge</u> to the user, which may fuse with other charges upon casting to create different charges. Charges` +
        ` can be absorbed or used against the enemy.`,
        off_stat: 'matk',
        def_stat: 'mdef',
        off_element: 'fire',
        def_element: 'fire',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 0.8,
        use: (user, target, type) => {

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const skill = skills.fireball // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.gainMana(type, -10, "self", false, false, plr, enemy, false);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} shot a fireball at the enemy! [Fireball]`, damage);

            // find out what charges are applied
            const earthCharge = Combat.checkStacks(plr.buffs, "earth charge");
            const iceCharge = Combat.checkStacks(plr.buffs, "ice charge");
            const waterCharge = Combat.checkStacks(plr.buffs, "water charge");

            switch(1) {
                case earthCharge: {
                    skills.pushMessagesToState(["The earth charge and fire charge coalesced into a magma charge!"]);
                    const buff = {
                        name: "magma charge",
                        duration: 5,
                        element: "fire",
                        types: ["buff"],
                        apply_text: " is imbued with magma energy!",
                        desc: "Can be absorbed or used against the enemy for special effects.",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "earth charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    break;
                }

                case iceCharge: {
                    skills.pushMessagesToState(["The ice charge and fire charge coalesced into a water charge!"]);
                    const buff = {
                        name: "water charge",
                        duration: 5,
                        element: "fire",
                        types: ["buff"],
                        apply_text: " is imbued with water energy!",
                        desc: "Can be absorbed or used against the enemy for special effects.",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "ice charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    break;
                }

                case waterCharge: {
                    skills.pushMessagesToState(["The water charge and fire charge coalesced into a steam charge!"]);
                    const buff = {
                        name: "steam charge",
                        duration: 5,
                        element: "fire",
                        types: ["buff"],
                        apply_text: " is imbued with steam energy!",
                        desc: "Can be absorbed or used against the enemy for special effects.",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "water charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    break;
                }

                default: {
                    const buff = {
                        name: "fire charge",
                        duration: 5,
                        element: "fire",
                        types: ["buff"],
                        apply_text: " is imbued with fire energy!",
                        desc: "Can be absorbed or used against the enemy for special effects.",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                }
            }

            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["buff", "attack"],
                    target: "opponent"
                }
            }
            
            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);
            
        },
        cost: (user, target) => {
            if (user.mana >= 10) { return true } else { return "Insufficient mana!" };
        }
    },

    icebolt: {
        name: 'icebolt',
        description: `<b>Cost: 10 MP</b> - The user fires a bolt of ice at the enemy, dealing below average magical water damage. Applies ` +
        ` <u>Ice Charge</u> to the user, which may fuse with other charges upon casting to create different charges. Charges` +
        ` can be absorbed or used against the enemy.`,
        off_stat: 'matk',
        def_stat: 'mdef',
        off_element: 'water',
        def_element: 'water',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 0.8,
        use: (user, target, type) => {

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const skill = skills.icebolt // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} Fired a bolt of ice at the enemy! [Icebolt]`, damage);
            skills.gainMana(type, -10, "self", false, false, plr, enemy, false);
            
            // find out what charges are applied
            const fireCharge = Combat.checkStacks(plr.buffs, "fire charge");
            const earthCharge = Combat.checkStacks(plr.buffs, "earth charge");
            const magmaCharge = Combat.checkStacks(plr.buffs, "magma charge");

            switch(1) {
                case fireCharge: {
                    skills.pushMessagesToState(["The ice charge and fire charge coalesced into a water charge!"]);
                    const buff = {
                        name: "water charge",
                        duration: 5,
                        element: "water",
                        types: ["buff"],
                        apply_text: " is imbued with water energy!",
                        desc: "Can be absorbed or used against the enemy for special effects.",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "fire charge");
                    }
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    break;
                }

                case earthCharge: {
                    skills.pushMessagesToState(["The ice charge and earth charge coalesced into a frozen earth charge!"]);
                    const buff = {
                        name: "frozen earth charge",
                        duration: 5,
                        element: "water",
                        types: ["buff"],
                        apply_text: " is imbued with frozen earth energy!",
                        desc: "Can be absorbed or used against the enemy for special effects.",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "earth charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    break;
                }

                case magmaCharge: {
                    skills.pushMessagesToState(["The ice charge and magma charge coalesced into an obsidian charge!"]);
                    const buff = {
                        name: "obsidian charge",
                        duration: 5,
                        element: "water",
                        types: ["buff"],
                        apply_text: " is imbued with obsidian energy!",
                        desc: "Can be absorbed or used against the enemy for special effects.",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "magma charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    break;
                }

                default: {
                    const buff = {
                        name: "ice charge",
                        duration: 5,
                        element: "water",
                        types: ["buff"],
                        apply_text: " is imbued with ice energy!",
                        desc: "Can be absorbed or used against the enemy for special effects.",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                }
            }

            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["buff", "attack"],
                    target: "opponent"
                }
            }
            
            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);
            
        },
        cost: (user, target) => {
            if (user.mana >= 10) { return true } else { return "Insufficient mana!" };
        }
    },

    lesser_quake: {
        name: 'lesser quake',
        description: `<b>Cost: 10 MP</b> - The user causes the earth at the enemy to quake, dealing below average magical earth damage. Applies ` +
        ` <u>Earth Charge</u> to the user, which may fuse with other charges upon casting to create different charges. Charges` +
        ` can be absorbed or used against the enemy.`,
        off_stat: 'matk',
        def_stat: 'mdef',
        off_element: 'earth',
        def_element: 'earth',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 0.8,
        use: (user, target, type) => {

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const skill = skills.lesser_quake // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} caused the earth to quake! [Lesser Quake]`, damage);

            skills.gainMana(type, -10, "self", false, false, plr, enemy, false);
        
            // find out what charges are applied
            const fireCharge = Combat.checkStacks(plr.buffs, "fire charge");
            const iceCharge = Combat.checkStacks(plr.buffs, "ice charge");
            const magmaCharge = Combat.checkStacks(plr.buffs, "magma charge");
            const waterCharge = Combat.checkStacks(plr.buffs, "water charge");

            switch(1) {
                case fireCharge: {
                    skills.pushMessagesToState(["The earth charge and fire charge coalesced into a magma charge!"]);
                    const buff = {
                        name: "magma charge",
                        duration: 5,
                        element: "earth",
                        types: ["buff"],
                        apply_text: " is imbued with magma energy!",
                        desc: "Can be absorbed or used against the enemy for special effects.",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "fire charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    break;
                }

                case iceCharge: {
                    skills.pushMessagesToState(["The ice charge and earth charge coalesced into a frozen earth charge!"]);
                    const buff = {
                        name: "frozen earth charge",
                        duration: 5,
                        element: "water",
                        types: ["buff"],
                        apply_text: " is imbued with frozen earth energy!",
                        desc: "Can be absorbed or used against the enemy for special effects.",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "ice charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    break;
                }

                case magmaCharge: {
                    skills.pushMessagesToState(["The earth charge and magma charge coalesced into a volcano charge!"]);
                    const buff = {
                        name: "volcano charge",
                        duration: 5,
                        element: "earth",
                        types: ["buff"],
                        apply_text: " is imbued with volcano energy!",
                        desc: "Can be absorbed or used against the enemy for special effects.",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "magma charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    break;
                }

                case waterCharge: {
                    skills.pushMessagesToState(["The water charge and earth charge coalesced into a soil charge!"]);
                    const buff = {
                        name: "soil charge",
                        duration: 5,
                        element: "earth",
                        types: ["buff"],
                        apply_text: " is imbued with soil energy!",
                        desc: "Can be absorbed or used against the enemy for special effects.",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "water charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    break;
                }

                default: {
                    const buff = {
                        name: "earth charge",
                        duration: 5,
                        element: "earth",
                        types: ["buff"],
                        apply_text: " is imbued with earth energy!",
                        desc: "Can be absorbed or used against the enemy for special effects.",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                }
            }

            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["buff", "attack"],
                    target: "opponent"
                }
            }
            
            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);
            
        },
        cost: (user, target) => {
            if (user.mana >= 10) { return true } else { return "Insufficient mana!" };
        }
    },

    imbue_energy: {
        name: 'imbue energy',
        description: `<b>Cost: 20 stamina</b>. The user absorbs nearby energy into themselves fully. Consumes all elemental` +
        ` charges applied to the user and causes a positive effect (for the user) for each one. Also grants 5 SP` +
        ` for each charge absorbed. If at least one charge is absorbed, the user gains an extra action.`,
        off_stat: 'matk',
        def_stat: 'mdef',
        off_element: 'earth',
        def_element: 'earth',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -20, "self", false, false, plr, enemy, false);

            const skill = skills.imbue_energy // need to change for each skill
            
            skills.pushMessagesToState([`<br>${user.name} reabsorbed energy into themselves! [Imbue Energy]`], true, "push");

            var absorbed = false;

            // find out what charges are applied
            const fireCharge = Combat.checkStacks(plr.buffs, "fire charge");
            const iceCharge = Combat.checkStacks(plr.buffs, "ice charge");
            const earthCharge = Combat.checkStacks(plr.buffs, "earth charge");
            const volcanoCharge = Combat.checkStacks(plr.buffs, "volcano charge");
            const soilCharge = Combat.checkStacks(plr.buffs, "soil charge");
            const obsidianCharge = Combat.checkStacks(plr.buffs, "obsidian charge");
            const magmaCharge = Combat.checkStacks(plr.buffs, "magma charge");
            const waterCharge = Combat.checkStacks(plr.buffs, "water charge");
            const frozenEarthCharge = Combat.checkStacks(plr.buffs, "frozen earth charge");
            const steamCharge = Combat.checkStacks(plr.buffs, "steam charge");

            if (fireCharge == 1) {
                    skills.pushMessagesToState(["Fire charge absorbed!"], false);
                    const buff = {
                        name: "fire imbued",
                        atk: 0.2,
                        matk: 0.2,
                        elemental: {
                            offence: { fire: 20 },
                            defence: { }
                        },
                        duration: 3,
                        element: "fire",
                        types: ["buff"],
                        apply_text: " has fire energy within!",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "fire charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    skills.gainSP(type, 5, "self", false, false, plr, enemy);
                    absorbed = true;
            }

            if (iceCharge == 1) {
                    skills.pushMessagesToState(["Ice charge absorbed!"], false);
                    const buff = {
                        name: "ice imbued",
                        def: 0.25,
                        mdef: 0.52,
                        duration: 3,
                        element: "water",
                        types: ["buff"],
                        apply_text: " has ice energy within!",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "ice charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    skills.gainSP(type, 5, "self", false, false, plr, enemy);
                    absorbed = true;
            }

            if (earthCharge == 1) {
                    skills.pushMessagesToState(["earth charge absorbed!"], false);
                    const buff = {
                        name: "earth imbued",
                        mitigation: 0.5,
                        duration: 3,
                        element: "earth",
                        types: ["buff"],
                        apply_text: " has earth energy within!",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "earth charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    skills.gainActions(type, -1, "self", false, false, plr, enemy);
                    skills.gainSP(type, 5, "self", false, false, plr, enemy);
                    absorbed = true;
            }

            if (volcanoCharge == 1) {
                    skills.pushMessagesToState(["Volcano charge absorbed!"], false);
                    const buff = {
                        name: "volcano imbued",
                        atk: 0.35,
                        matk: 0.35,
                        duration: 2,
                        element: "fire",
                        types: ["buff"],
                        apply_text: " has volcano energy within!",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "volcano charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    skills.gainActions(type, 1, "self", false, false, plr, enemy);
                    skills.gainSP(type, 5, "self", false, false, plr, enemy);
                    absorbed = true;
            }

            if (soilCharge == 1) {
                    skills.pushMessagesToState(["Soil charge absorbed!"], false);
                    const buff = {
                        name: "soil imbued",
                        def: 0.15,
                        def: 0.15,
                        eva: 0.2,
                        duration: 3,
                        element: "earth",
                        types: ["buff"],
                        apply_text: " has soil energy within!",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "soil charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    skills.gainSP(type, 5, "self", false, false, plr, enemy);
                    absorbed = true;
            }

            if (obsidianCharge == 1) {
                    skills.pushMessagesToState(["Obsidian charge absorbed!"], false);
                    const buff = {
                        name: "obsidian imbued",
                        mitigation: 0.8,
                        duration: 1,
                        element: "earth",
                        types: ["buff"],
                        apply_text: " has obsidian energy within!",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "obsidian charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    skills.gainSP(type, 15, "self", false, false, plr, enemy);
                    skills.gainActions(type, -999, "self", false, false, plr, enemy);
                    skills.gainSP(type, 5, "self", false, false, plr, enemy);
                    absorbed = true;
            }

            if (magmaCharge == 1) {
                    skills.pushMessagesToState(["Magma charge absorbed!"], false);
                    const buff = {
                        name: "magma imbued",
                        atk: 0.2,
                        matk: 0.2,
                        elemental: {
                            offence: { fire: 15, earth: 15 },
                            defence: {}
                        },
                        duration: 4,
                        element: "earth",
                        types: ["buff"],
                        apply_text: " has magma energy within!",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "magma charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    skills.gainSP(type, 5, "self", false, false, plr, enemy);
                    absorbed = true;
            }

            if (waterCharge == 1) {
                    skills.pushMessagesToState(["Water charge absorbed!"], false);
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "water charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    const heal = skills.calcDamage(user, user, "mdef", "mdef", "none", "none", 0.45, 0, 1.3, { canEvade: false, canCrit: false});
                    skills.gainHealth(type, heal.damage, "self", false, false, plr, enemy);
                    skills.gainSP(type, 5, "self", false, false, plr, enemy);
                    absorbed = true;
            }

            if (frozenEarthCharge == 1) {
                    skills.pushMessagesToState(["Frozen earth charge absorbed!"], false);
                    const buff = {
                        name: "frozen earth imbued",
                        mitigation: 0.2,
                        def: 0.1,
                        mdef: 0.1,
                        duration: 3,
                        element: "water",
                        types: ["buff"],
                        apply_text: " has frozen earth energy within!",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    };
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "frozen earth charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    skills.applyBuff(type, func, "self", false, false, plr, enemy);
                    skills.gainSP(type, 5, "self", false, false, plr, enemy);
                    absorbed = true;
            }

            if (steamCharge == 1) {
                    skills.pushMessagesToState(["Steam charge absorbed!"], false);
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "steam charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    skills.gainActions(type, 2, "self", false, false, plr, enemy);
                    skills.gainSP(type, 5, "self", false, false, plr, enemy);
                    absorbed = true;
            }

            if (absorbed) {
                skills.gainActions(type, 1, "self", false, false, plr, enemy);
            }

            const state = ["imbue energy", {
                damage: 0,
                additionalInfo: {
                    type: ["buff", "debuff", "attack"],
                    target: "self"
                }
            }, type];
            
            skills.pushCustomFunc(type, () => {}, "self", state, true, plr, enemy);
            
            
        },
        cost: (user, target) => {
            if (user.stamina >= 20) { return true } else { return "Insufficient stamina" };
        }
    },

    enforce_energy: {
        name: 'enforce energy',
        description: `<b>Cost: 20 stamina</b>. The user uses nearby elemental energy to strike the opponent. Consumes all ` +
        `elemental charges and applies a negative effect to and/or damages the enemy for each one. Also grants 5 SP for each` +
        ` charge consumed. If at least one charge is consumed, also grants an extra action to the user.`,
        off_stat: 'matk',
        def_stat: 'mdef',
        off_element: 'earth',
        def_element: 'earth',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -20, "self", false, false, plr, enemy, false);

            const skill = skills.enforce_energy // need to change for each skill
            
            skills.pushMessagesToState([`<br>${user.name} fired elemental energy at the enemy! [Enforce Energy]`], true, "push");

            var enforced = false;

            // find out what charges are applied
            const fireCharge = Combat.checkStacks(plr.buffs, "fire charge");
            const iceCharge = Combat.checkStacks(plr.buffs, "ice charge");
            const earthCharge = Combat.checkStacks(plr.buffs, "earth charge");
            const volcanoCharge = Combat.checkStacks(plr.buffs, "volcano charge");
            const soilCharge = Combat.checkStacks(plr.buffs, "soil charge");
            const obsidianCharge = Combat.checkStacks(plr.buffs, "obsidian charge");
            const magmaCharge = Combat.checkStacks(plr.buffs, "magma charge");
            const waterCharge = Combat.checkStacks(plr.buffs, "water charge");
            const frozenEarthCharge = Combat.checkStacks(plr.buffs, "frozen earth charge");
            const steamCharge = Combat.checkStacks(plr.buffs, "steam charge");

            if (fireCharge == 1) {
                    skills.pushMessagesToState(["Fire energy enforced!"], false, "push");
                    const buff = {
                        name: "fire enforced",
                        elemental: {
                            offence: { },
                            defence: { fire: 20 }
                        },
                        duration: 3,
                        element: "fire",
                        types: ["debuff"],
                        apply_text: " has had fire energy forced upon them!",
                        max_stacks: 1,
                    };
                    const func = () => {
                        Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                    };
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "fire charge");
                    };
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    //
                    const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, "fire", "fire", 0.95, 1.05, 0.7, true);
                    skills.dealDamage(type, damage.damage, "opponent", false, false, plr, enemy);
                    skills.prepareAttackMessage(user, target, "", damage, "push");
                    //
                    skills.applyBuff(type, func, "opponent", false, false, plr, enemy);
                    skills.gainSP(type, 5, "self", false, false, plr, enemy);
                    enforced = true;
            }

            if (iceCharge == 1) {
                skills.pushMessagesToState(["Ice energy enforced!"], false, "push");
                const buff = {
                    name: "ice enforced",
                    speed: -0.2,
                    duration: 3,
                    element: "water",
                    types: ["debuff"],
                    apply_text: " has had ice energy forced upon them!",
                    max_stacks: 1,
                };
                const func = () => {
                    Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                };
                const func2 = () => {
                    Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "ice charge");
                };
                skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                //
                const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, "water", "water", 0.95, 1.05, 0.7, true);
                skills.dealDamage(type, damage.damage, "opponent", false, false, plr, enemy);
                skills.prepareAttackMessage(user, target, "", damage, "push");
                //
                skills.applyBuff(type, func, "opponent", false, false, plr, enemy);
                skills.gainSP(type, 5, "self", false, false, plr, enemy);
                enforced = true;
            }

            if (earthCharge == 1) {
            skills.pushMessagesToState(["Earth energy enforced!"], false, "push");
            const buff = {
                name: "earth enforced",
                atk: -0.2,
                duration: 3,
                element: "earth",
                types: ["debuff"],
                apply_text: " has had earth energy forced upon them!",
                max_stacks: 1,
            };
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
            };
            const func2 = () => {
                Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "earth charge");
            };
            skills.stripBuff(type, func2, "self", false, false, plr, enemy);
            //
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, "earth", "earth", 0.95, 1.05, 0.7, true);
            skills.dealDamage(type, damage.damage, "opponent", false, false, plr, enemy);
            skills.prepareAttackMessage(user, target, "", damage, "push");
            //
            skills.applyBuff(type, func, "opponent", false, false, plr, enemy);
            skills.gainSP(type, 5, "self", false, false, plr, enemy);
            enforced = true;
            }

            if (magmaCharge == 1) {
                skills.pushMessagesToState(["Magma energy enforced!"], false, "push");
                const DOTdamage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, "earth", "earth", 0.95, 1.05, 0.25, true);
                const buff = {
                    name: "magma enforced",
                    elemental: {
                        offence: {},
                        defence: { fire: 15, earth: 15 }
                    },
                    damage: ["flat", DOTdamage.damage],
                    duration: 3,
                    element: "earth",
                    types: ["debuff"],
                    apply_text: " has had magma energy forced upon them!",
                    max_stacks: 1,
                };
                const func = () => {
                    Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                };
                const func2 = () => {
                    Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "magma charge");
                };
                skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                //
                const damageEarth = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, "earth", "earth", 0.95, 1.05, 0.5, true);
                skills.dealDamage(type, damageEarth.damage, "opponent", false, false, plr, enemy);
                skills.prepareAttackMessage(user, target, "", damageEarth, "push");
                //
                const damageFire = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, "fire", "fire", 0.95, 1.05, 0.5, true);
                skills.dealDamage(type, damageFire.damage, "opponent", false, false, plr, enemy);
                skills.prepareAttackMessage(user, target, "", damageFire, "push");
                //
                skills.applyBuff(type, func, "opponent", false, false, plr, enemy);
                skills.gainSP(type, 5, "self", false, false, plr, enemy);
                enforced = true;
            }

            if (waterCharge == 1) {
                skills.pushMessagesToState(["Water energy enforced!"], false, "push");
                const buff = {
                    name: "water enforced",
                    elemental: {
                        offence: { },
                        defence: { water: 20 }
                    },
                    duration: 3,
                    element: "water",
                    types: ["debuff"],
                    apply_text: " has had water energy forced upon them!",
                    max_stacks: 1,
                };
                const func = () => {
                    Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                };
                const func2 = () => {
                    Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "water charge");
                };
                skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                //
                const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, "water", "water", 0.95, 1.05, 0.7, true);
                skills.dealDamage(type, damage.damage, "opponent", false, false, plr, enemy);
                skills.prepareAttackMessage(user, target, "", damage, "push");
                //
                const heal = skills.calcDamage(user, target, "mdef", "mdef", "none", "none", 1, 0, 0.5, { canCrit: false, canEvade: false });
                skills.gainHealth(type, heal.damage, "self", false, false, plr, enemy);
                //
                skills.applyBuff(type, func, "opponent", false, false, plr, enemy);
                skills.gainSP(type, 5, "self", false, false, plr, enemy);
                enforced = true;
            }

            if (frozenEarthCharge == 1) {
                skills.pushMessagesToState(["Frozen earth energy enforced!"], false, "push");
                const buff = {
                    name: "frozen earth enforced",
                    speed: -0.15,
                    atk: -0.15,
                    def: -0.15,
                    resistance: -10,
                    duration: 3,
                    element: "earth",
                    types: ["debuff"],
                    apply_text: " has had frozen earth energy forced upon them!",
                    max_stacks: 1,
                };
                const func = () => {
                    Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                };
                const func2 = () => {
                    Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "frozen earth charge");
                };
                skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                //
                const damageEarth = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, "earth", "earth", 0.95, 1.05, 0.6, true);
                skills.dealDamage(type, damageEarth.damage, "opponent", false, false, plr, enemy);
                skills.prepareAttackMessage(user, target, "", damageEarth, "push");
                //
                const damageWater = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, "water", "water", 0.95, 1.05, 0.6, true);
                skills.dealDamage(type, damageWater.damage, "opponent", false, false, plr, enemy);
                skills.prepareAttackMessage(user, target, "", damageWater, "push");
                //
                skills.applyBuff(type, func, "opponent", false, false, plr, enemy);
                skills.gainSP(type, 5, "self", false, false, plr, enemy);
                enforced = true;
            }

            if (volcanoCharge == 1) {
                skills.pushMessagesToState(["Volcano energy enforced!"], false, "push");
                const DOTdamage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, "fire", "fire", 0.95, 1.05, 0.9, true);
                const buff = {
                    name: "volcano enforced",
                    def: -0.25,
                    mdef: -0.25,
                    damage: ["flat", DOTdamage.damage],
                    duration: 2,
                    element: "fire",
                    types: ["debuff"],
                    apply_text: " has had volcano energy forced upon them!",
                    max_stacks: 1,
                };
                const func = () => {
                    Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                };
                const func2 = () => {
                    Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "volcano charge");
                };
                skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                //
                const damageEarth = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, "earth", "earth", 0.95, 1.05, 0.8, true);
                skills.dealDamage(type, damageEarth.damage, "opponent", false, false, plr, enemy);
                skills.prepareAttackMessage(user, target, "", damageEarth, "push");
                //
                const damageFire = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, "fire", "fire", 0.95, 1.05, 0.5, true);
                skills.dealDamage(type, damageFire.damage, "opponent", false, false, plr, enemy);
                skills.prepareAttackMessage(user, target, "", damageFire, "push");
                //
                skills.applyBuff(type, func, "opponent", false, false, plr, enemy);
                skills.gainSP(type, 5, "self", false, false, plr, enemy);
                enforced = true;
            }

            if (soilCharge == 1) {
                skills.pushMessagesToState(["Soil energy enforced!"], false, "push");
                const buff = {
                    name: "soil enforced",
                    speed: -0.4,
                    duration: 3,
                    element: "earth",
                    types: ["debuff"],
                    apply_text: " has had soil energy forced upon them!",
                    max_stacks: 1,
                };
                const func = () => {
                    Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                };
                const func2 = () => {
                    Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "soil charge");
                };
                skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                //
                const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, "physical", "physical", 0.95, 1.05, 0.7, true);
                skills.dealDamage(type, damage.damage, "opponent", false, false, plr, enemy);
                skills.prepareAttackMessage(user, target, "", damage, "push");
                //
                skills.applyBuff(type, func, "opponent", false, false, plr, enemy);
                skills.gainSP(type, 5, "self", false, false, plr, enemy);
                enforced = true;
            }

            if (obsidianCharge == 1) {
                skills.pushMessagesToState(["Obsidian energy enforced!"], false, "push");
                const buff = {
                    name: "obsidian enforced",
                    speed: -0.3,
                    atk: -0.3,
                    def: -0.3,
                    mitigation: 0.1,
                    duration: 3,
                    element: "earth",
                    types: ["debuff"],
                    apply_text: " has had obsidian energy forced upon them!",
                    max_stacks: 1,
                };
                const func = () => {
                    Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                };
                const func2 = () => {
                    Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "obsidian charge");
                };
                skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                //
                const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, "earth", "earth", 0.95, 1.05, 0.7, true);
                skills.dealDamage(type, damage.damage, "opponent", false, false, plr, enemy);
                skills.prepareAttackMessage(user, target, "", damage, "push");
                //
                skills.applyBuff(type, func, "opponent", false, false, plr, enemy);
                skills.gainSP(type, 5, "self", false, false, plr, enemy);
                enforced = true;
            }

            if (steamCharge == 1) {
                skills.pushMessagesToState(["Steam energy enforced!"], false, "push");
                const func2 = () => {
                    Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "steam charge");
                };
                skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                //
                const damageWater = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, "water", "water", 1.1, 1.05, 1.15, true);
                skills.dealDamage(type, damageWater.damage, "opponent", false, false, plr, enemy);
                skills.prepareAttackMessage(user, target, "", damageWater, "push");
                //
                const damageFire = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, "fire", "fire", 1.1, 1.05, 1.15, true);
                skills.dealDamage(type, damageFire.damage, "opponent", false, false, plr, enemy);
                skills.prepareAttackMessage(user, target, "", damageFire, "push");
                //
                skills.gainSP(type, 5, "self", false, false, plr, enemy);
                enforced = true;
            }

            if (enforced) {
                skills.gainActions(type, 1, "self", false, false, plr, enemy);
            }

            const state = ["enforce energy", {
                damage: 0,
                additionalInfo: {
                    type: ["buff", "debuff", "attack"],
                    target: "opponent"
                }
            }, type];

            skills.pushCustomFunc(type, () => {}, "self", state, true, plr, enemy);
            
            
        },
        cost: (user, target) => {
            if (user.stamina >= 20) { return true } else { return "Insufficient stamina" };
        }
    },

    blood_pact: {
        name: 'blood pact',
        description: "<b>Cost: 20 SP, 15% max health</b> - The user uses converts special energy and their own blood into" +
        " mana, gaining 20% of their mana in exchange for 20 SP and 15% of their max health.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.blood_pact;

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.pushMessagesToState([`${user.name} formed a blood pact! [Blood Pact]`]);
            skills.gainSP(type, -20, "self", false, false, plr, enemy, false);
            skills.gainHealth(type, user.max_health * (-15/100), "self", false, false, plr, enemy, true);

            const stateDamage = {
                damage: 0,
                additionalInfo: {
                    type: ["buff"],
                    target: "self"
                }
            }

            skills.gainMana(type, user.max_mana * (20/100), "self", [skill.name, stateDamage, type], true, plr, enemy, true);

        },

        cost: (user, target) => {
            if (user.sp >= 20) {
                if (user.health > user.max_health * (15/100)) {
                    return true;
                } else {
                    return "Insufficient HP!";
                }
            } else {
                return "Insufficient SP!";
            }
        }
    },

    // ------------------------------ \\
    // ------------------------------ \\

    // ** -- WARRIOR DISCIPLINE -- ** \\

    stalwart_strike: {
        name: 'stalwart strike',
        description: `<b>Cost: 35 stamina</b> - The user strikes the enemy while bolstering their defences. Deals low` +
        ` physical water damage and applies <u>Stalwart</u> [+20% DEF/MDEF, 3T duration]. Also removes one` +
        ` debuff at random from the user.`,
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'water',
        def_element: 'water',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 0.65,
        use: (user, target, type) => {

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const skill = skills.stalwart_strike // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.gainStamina(type, -35, "self", false, false, plr, enemy, false); // COST OF THE SKILL

            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} struck the enemy! [Stalwart Strike]`, damage);

            const buffs = JSON.parse(JSON.stringify(user.debuffs));
            var stripped = false;
            while (buffs.length > 0 && stripped == false) {
                var random = Math.round(Math.random() * buffs.length - 1);
                if (random < 0) { random = 0 };
                if (buffs[random].hasOwnProperty("unstrippable")) {
                    buffs.splice(random, 1);
                } else {
                    stripped = true;
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().debuffs : Combat.getEnemy().debuffs, buffs[random].name);
                    }
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                }
            };

            const buff = {
                name: "stalwart",
                duration: 3,
                def: 0.2,
                mdef: 0.2,
                element: "physical",
                types: ["buff"],
                apply_text: " is stalwart!",
                max_stacks: 1,
            };
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.applyBuff(type, func, "self", false, false, plr, enemy);

            const stateDamage = {
                damage: damage,
                additionalInfo: {
                    type: ["buff", "attack"],
                    target: "opponent"
                }
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, stateDamage, type], true, plr, enemy);

        },
        cost: (user, target) => {
            if (user.stamina >= 35) { return true } else { return "Insufficient stamina!" };
        }
    },

    debilitate: {
        name: 'debilitate',
        description: '<b>Cost: 25 SP</b> - The user strikes the enemy in a way that removes a portion of their power, dealing' +
        ' low physical thunder damage and removing one random buff from the enemy.',
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'thunder',
        def_element: 'thunder',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 0.5,
        use: (user, target, type) => {

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const skill = skills.debilitate // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.gainSP(type, -25, "self", false, false, plr, enemy, false); // COST OF THE SKILL

            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} struck the enemy! [Debilitate]`, damage);

            // buff strip
            if (damage.eva == false) {
                const buffs = JSON.parse(JSON.stringify(target.buffs));
                var stripped = false;
                while (buffs.length > 0 && stripped == false) {
                    var random = Math.round(Math.random() * buffs.length - 1);
                    if (buffs[random].hasOwnProperty("unstrippable")) {
                        buffs.splice(random, 1);
                    } else {
                        stripped = true;
                        const func2 = () => {
                            Combat.stripBuff(type == "player" ? Combat.getEnemy().buffs : Combat.getPlayer().buffs, buffs[random].name);
                        }
                        skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    }
                }
            };

            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["attack", "debuff"],
                    target: "opponent"
                }
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);

        },

        cost: (user, target) => {
            if (user.sp >= 25) { return true } else { return "Insufficient SP!"};
        }
    },

    enduring_fortress: {
        name: 'enduring fortress',
        description: `<b>Cost: 5 stamina</b> - The user grants a physical form to their endurance, applying the buff` +
        ` <u>Fortress</u> [+5% DEF/MDEF, 999T duration, stacks to 100], and granting the user an extra acition.` +
        `This skill can only be used once per turn.`,
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.enduring_fortress;

            const buff = {
                name: "fortress",
                def: 0.05,
                mdef: 0.05,
                duration: 999,
                element: "physical",
                types: ["buff"],
                apply_text: "strengthens their resolve!",
                max_stacks: 100
            }

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -5, "self", false, false, plr, enemy, false);

            const state = [skill.name, {
                damage: 0,
                additionalInfo: {
                    type: ["buff"],
                    target: "self"
                }
            }, type];

            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.applyBuff(type, func, "self", false, false, plr, enemy);
            skills.gainActions(type, 1, "self", state, true, plr, enemy, true);



        },

        cost: (user, target) => {
            const type = user.hasOwnProperty("pouch") ? "player" : "enemy" // finding skill 'type'
            const state = Combat.state;
            if (findTimesUsed(type, "enduring fortress") == 0) {
                if (user.stamina >= 5) {
                    return true;
                } else {
                    return "Insufficient stamina!";
                }
            } else {
                return "This skill has been used this turn!";
            }
        }
    },

    guard_conversion: {
        name: 'guard conversion',
        description: `<b>Cost: 10 stamina</b> - The user converts all defensive energy into pure energy. Removes all buffs" +
        " that increase DEF or MDEF from the user. For each one removed, the user gains SP equal to the DEF/MDEF (higher" +
        " one is taken) percentage increase. Then, grants an additional action if at least one buff was removed`,
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.guard_conversion;

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -10, "self", false, false, plr, enemy, false);

            const state = [skill.name, {
                damage: 0,
                additionalInfo: {
                    type: ["buff"],
                    target: "self"
                }
            }, type];

            var totalSPGain = 0;

            var stripped = false;
            const buffs = copy(user.buffs);
            while (buffs.length > 0) {
                var random = Math.round(Math.random() * buffs.length - 1);
                if (random < 0) { random = 0 };
                if (buffs[random].hasOwnProperty("unstrippable")) {
                    buffs.splice(random, 1);
                } else if (buffs[random].hasOwnProperty("def") || buffs[random].hasOwnProperty("mdef")) {
                    if (buffs[random]["def"] > 0 || buffs[random["mdef"] > 0]) {
                        var spGain = buffs[random]["def"] != undefined ? buffs[random]["def"] * 100 : 0;
                        var mdefBonus = buffs[random]["mdef"] != undefined ? buffs[random]["def"] * 100 : 0;
                        if (mdefBonus > spGain) { spGain = mdefBonus };
                        totalSPGain += spGain
                        const temp = buffs[random].name; // if standin variable isn't used, function refers to buffs[random], which..
                        // ..will be empty by the time the function is actually called.
                        const func2 = () => {
                            Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, temp);
                        }
                        skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                        buffs.splice(random, 1);
                        stripped = true;
                    }
                } else {
                    buffs.splice(random, 1);
                }
            }

            if (stripped) {
                skills.gainSP(type, totalSPGain, "self", false, false, plr, enemy, true);
                skills.gainActions(type, 1, "self", state, true, plr, enemy, true);
            } else {
                skills.pushCustomFunc(type, () => {}, "self", state, true, plr, enemy);
            }

        },

        cost: (user, target) => {
            if (user.stamina >= 10) { return true } else { return "Insufficient stamina!"};
        }
    },

    sacred_shield: {
        name: 'sacred shield',
        description: `<b>Cost: 10 SP</b> - The user condenses special energy such that it takes physical form and uses it` +
        ` as a shield. Consumes 999 actions (ending user turn) after applying <u>Sacred Shield</u> [+75% DEF/MDEF, 2T duration]` +
        ` to the user.`,
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.sacred_shield;

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainSP(type, -10, "self", false, false, plr, enemy, false);

            const state = [skill.name, {
                damage: 0,
                additionalInfo: {
                    type: ["buff"],
                    target: "self"
                }
            }, type];

            const buff = {
                name: "sacred shield",
                def: 0.75,
                mdef: 0.75,
                duration: 2,
                element: "physical",
                types: ["buff"],
                apply_text: " is protected by sacred energy!",
                max_stacks: 1
            }
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.gainActions(type, -999, "self", false, false, plr, enemy, true);
            skills.applyBuff(type, func, "self", state, true, plr, enemy);

        },

        cost: (user, target) => {
            if (user.sp >= 10) { return true } else { return "Insufficient SP!"};
        }
    },

    sentinel_blow: {
        name: 'sentinel blow',
        description: `<b>Cost: 25 stamina</b> - The user strikes in a way that utilises their defensive prowess. Deals` +
        ` considerable weapon element physical damage. Damage is based on the user's DEF stat.`,
        off_stat: 'def',
        def_stat: 'def',
        off_element: 'weapon',
        def_element: 'weapon',
        off_mod: 0.9,
        def_mod: 1,
        dmg_mod: 1.25,
        use: (user, target, type) => {
            const skill = skills.sentinel_blow // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -25, "self", false, false, plr, enemy, false);

            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} struck the enemy like a sentinel! [Sentinel Blow]`, damage);
            
            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["attack"],
                    target: "opponent"
                }
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);
        },

        cost: (user, target) => {
            if (user.stamina >= 25) {
                return true;
            } else {
                return "Insufficient stamina!";
            }
        }
    },



    // ------------------------------------------- \\
    // ------------------------------------------- \\

    // ** -- ROGUE DISCIPLINES -- ** \\

    swift_strike: {
        name: 'swift strike',
        description: "<b>Cost: 25 stamina</b> - The user strikes the enemy quickly, dealing below average physical wind damage. Applies" +
        " <u>Swift</u> [+20% SPD, 4T duration] to the user. Also, if <u>Feeble</u> is applied to the enemy, consumes it and" +
        " grants the user mana (5% max mana), and 5 SP. If <u>Stealth</u> is applied to the user and they have at least 5 SP, consumes both" +
        " <u>Stealth</u> and 5 SP in exchange for 2 extra actions.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'wind',
        def_element: 'wind',
        off_mod: 1.01,
        def_mod: 0.99,
        dmg_mod: 0.78,
        use: (user, target, type) => {
            const skill = skills.swift_strike // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} struck the enemy quickly! [Swift Strike]`, damage);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -25, "self", false, false, plr, enemy, false);

            const feebleStacks = Combat.checkStacks(target.debuffs, "feeble");
            const stealthStacks = Combat.checkStacks(user.buffs, "stealth");

            if (feebleStacks == 1) {
                const func2 = () => {
                    Combat.stripBuff(type == "player" ? Combat.getEnemy().debuffs : Combat.getPlayer().debuffs, "feeble");
                };
                skills.stripBuff(type, func2, "opponent", false, false, plr, enemy);
                skills.gainSP(type, 5, "self", false, false, plr, enemy, true);
                skills.gainMana(type, user.max_mana * (5/100), "self", false, false, plr, enemy);
            };

            if (stealthStacks == 1 && user.sp >= 5) {
                const func2 = () => {
                    Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "stealth");
                };
                skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                skills.gainSP(type, -5, "self", false, false, plr, enemy, true);
                skills.gainActions(type, 2, "self", false, false, plr, enemy, true);
            };

            const buff = {
                name: "swift",
                duration: 4,
                speed: 0.2,
                element: "physical",
                types: ["buff", "ninja"],
                apply_text: " is swift!",
                max_stacks: 1,
            };
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.applyBuff(type, func, "self", false, false, plr, enemy);

            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["attack", "buff", "mana_gain"],
                    target: "opponent"
                }
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);

        },

        cost: (user, target) => {
            if (user.stamina >= 25) { return true } else { return "Insufficient stamina!" };
        }
    },

    shinobi_strike: {
        name: 'shinobi strike',
        description: "<b>Cost: 10 mana</b> - The user strikes the enemy before immediately blending into the shadows. Deals" +
        " low weapon element physical damage and applies <u>Stealth</u> [+10% SPD, +10% crit rate, 4T duration] to the user." +
        " If <u>Weakened</u> is applied to the enemy, consumes it and grants the user stamina (5% max stamina), and 5 SP. If" +
        " <u>Swift</u> is applied to the user and they have at least 5 SP, consumes both <u>Swift</u> and 5 SP to grant" +
        " the player 2 additional actions.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'weapon',
        def_element: 'weapon',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 0.55,
        use: (user, target, type) => {
            const skill = skills.shinobi_strike // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} struck the enemy before blending into the shadows... [Shinobi Strike]`, damage);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainMana(type, -5, "self", false, false, plr, enemy, false);

            const weakenedStacks = Combat.checkStacks(target.debuffs, "weakened");
            const swiftStacks = Combat.checkStacks(user.buffs, "swift");

            if (weakenedStacks == 1) {
                const func2 = () => {
                    Combat.stripBuff(type == "player" ? Combat.getEnemy().debuffs : Combat.getPlayer().debuffs, "weakened");
                };
                skills.stripBuff(type, func2, "opponent", false, false, plr, enemy);
                skills.gainSP(type, 5, "self", false, false, plr, enemy, true);
                skills.gainStamina(type, user.max_stamina * (5/100), "self", false, false, plr, enemy);
            };

            if (swiftStacks == 1 && user.sp >= 5) {
                const func2 = () => {
                    Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "swift");
                };
                skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                skills.gainSP(type, -5, "self", false, false, plr, enemy, true);
                skills.gainActions(type, 2, "self", false, false, plr, enemy, true);
            };

            const buff = {
                name: "stealth",
                duration: 4,
                speed: 0.1,
                crit_chance: 0.1,
                element: "physical",
                types: ["buff", "ninja"],
                apply_text: " has blended into the shadows!",
                max_stacks: 1,
            };
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.applyBuff(type, func, "self", false, false, plr, enemy);

            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["attack", "buff", "stamina_gain"],
                    target: "opponent"
                }
            }
            
            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);

        },

        cost: (user, target) => {
            if (user.mana >= 10) { return true } else { return "Insufficient mana!" };
        }
    },

    crippling_blow: {
        name: 'crippling blow',
        description: "<b>Cost: 15 mana</b> - The user strikes the enemy with a special technique that cripples them somewhat." +
        " Deals moderate physical weapon element damage and applies <u>Weakened</u> [-20% DEF/MDEF, 4T duration] to the enemy." +
        " If <u>Stealth</u> is applied to the user, consumes it and applies <u>Footwork</u> [+10% evasion chance, 4T duration] to the user, and grant them 10 SP." +
        " If <u>Feeble</u> is applied to the enemy, consumes it and applies <u>Dull Soul</u> [-20 resistance, 4T duraton] to the enemy" +
        ", and grants the user 10 SP.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'weapon',
        def_element: 'weapon',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 0.95,
        use: (user, target, type) => {
            const skill = skills.crippling_blow // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} strikes the enemy with a special technique! [Crippling Blow]`, damage);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainMana(type, -15, "self", false, false, plr, enemy, false);

            const feebleStacks = Combat.checkStacks(target.debuffs, "feeble");
            const stealthStacks = Combat.checkStacks(user.buffs, "stealth");

            if (feebleStacks == 1) {
                const func2 = () => {
                    Combat.stripBuff(type == "player" ? Combat.getEnemy().debuffs : Combat.getPlayer().debuffs, "feeble");
                };
                skills.stripBuff(type, func2, "opponent", false, false, plr, enemy);
                const buff = {
                    name: "dull soul",
                    duration: 4,
                    element: "physical",
                    resistance: -20,
                    types: ["buff", "ninja"],
                    apply_text: "'s soul has been dulled!",
                    max_stacks: 1,
                };
                const func = () => {
                    Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : Combat.getEnemy()), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                };
                skills.gainSP(type, 10, "self", false, false, plr, enemy, true);
                skills.applyBuff(type, func, "opponent", false, false, plr, enemy);
            };

            if (stealthStacks == 1) {
                const func2 = () => {
                    Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "stealth");
                };
                skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                const buff = {
                    name: "footwork",
                    duration: 4,
                    evasion: 0.1,
                    element: "physical",
                    types: ["buff", "ninja"],
                    apply_text: " has enhanced footwork!",
                    max_stacks: 1,
                };
                const func = () => {
                    Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                };
                skills.gainSP(type, 10, "self", false, false, plr, enemy, true);
                skills.applyBuff(type, func, "self", false, false, plr, enemy);
            };

            const buff = {
                name: "weakened",
                def: -0.2,
                mdef: -0.2,
                duration: 4,
                element: "physical",
                types: ["debuff", "ninja"],
                apply_text: " is weakened!",
                max_stacks: 1,
            };
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
            };
            skills.applyBuff(type, func, "opponent", false, false, plr, enemy);

            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["attack", "buff", "debuff"],
                    target: "opponent"
                }
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);

        },

        cost: (user, target) => {
            if (user.mana >= 15) { return true } else { return "Insufficient mana!" };
        }
    },

    enfeebling_blow: {
        name: 'enfeebling blow',
        description: "<b>Cost: 25 stamina</b> - The user strikes with a special technique that worsens the target's offensive" +
        " capabilities. Deals moderate physical damage and applies <u>Feeble</u> [-20% ATK/MATK] to the enemy. If" +
        " <u>Swift</u> is applied to the user, consumes it and applies <u>Sharp Mind</u> [+10% crit chance] to the user, and grants them 10 SP" +
        " If <u>Weakened</u> is applied to the enemy, consumes it and applies <u>Dull Mind</u> [-10% crit chance] to the enemy," +
        " and grants the user 10 SP.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'weapon',
        def_element: 'weapon',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 0.95,
        use: (user, target, type) => {
            const skill = skills.enfeebling_blow // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} strikes the enemy with a special technique! [Enfeebling Blow]`, damage);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -25, "self", false, false, plr, enemy, false); // skill cost

            const weakenedStacks = Combat.checkStacks(target.debuffs, "weakened");
            const swiftStacks = Combat.checkStacks(user.buffs, "swift");

            if (weakenedStacks == 1) {
                const func2 = () => {
                    Combat.stripBuff(type == "player" ? Combat.getEnemy().debuffs : Combat.getPlayer().debuffs, "weakened");
                };
                skills.stripBuff(type, func2, "opponent", false, false, plr, enemy);
                const buff = {
                    name: "dull mind",
                    duration: 4,
                    element: "physical",
                    crit_chance: -0.1,
                    types: ["buff", "ninja"],
                    apply_text: "'s mind has been dulled!",
                    max_stacks: 1,
                };
                const func = () => {
                    Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : Combat.getEnemy()), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                };
                skills.gainSP(type, 10, "self", false, false, plr, enemy, true);
                skills.applyBuff(type, func, "opponent", false, false, plr, enemy);
            };

            if (swiftStacks == 1) {
                const func2 = () => {
                    Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, "swift");
                };
                skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                const buff = {
                    name: "sharp mind",
                    duration: 4,
                    crit_chance: 0.1,
                    element: "physical",
                    types: ["buff", "ninja"],
                    apply_text: "'s mind is sharp!",
                    max_stacks: 1,
                };
                const func = () => {
                    Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                };
                skills.gainSP(type, 10, "self", false, false, plr, enemy, true);
                skills.applyBuff(type, func, "self", false, false, plr, enemy);
            };

            const buff = {
                name: "feeble",
                atk: -0.2,
                matk: -0.2,
                duration: 4,
                element: "physical",
                types: ["debuff", "ninja"],
                apply_text: " is feeble!",
                max_stacks: 1,
            };
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
            };
            skills.applyBuff(type, func, "opponent", false, false, plr, enemy);

            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["attack", "buff", "debuff"],
                    target: "opponent"
                }
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);

        },

        cost: (user, target) => {
            if (user.stamina >= 25) { return true } else { return "Insufficient stamina!" };
        }
    },

    imbue_infliction: {
        name: 'imbue infliction',
        description: "<b>Cost: 20 Stamina</b>- The user focuses all their strength into one point, fusing all buffs from the" +
        " <b><u>NINJA</b></u> discipline into one buff (this will not interfere with the stacking limits of these buffs from"+ 
        " their origin skills). Up to three of these fusion buffs can be applied at one time. If this occurs, also grants"+ 
        " the user an additional action.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'weapon',
        def_element: 'weapon',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 1,
        use: (user, target, type) => {
            const skill = skills.imbue_infliction // need to change for each skill

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -20, "self" ,false, false, plr, enemy, false);

            skills.pushMessagesToState([`${user.name} is focusing their energy.. [Imbue Infliction]`])
        

            var imbued = false;

            const plrBuffs = JSON.parse(JSON.stringify(user.buffs));
            var buffName = "";
            if (Combat.checkStacks(plrBuffs, "imbued infliction I") == 0) {
                buffName = "imbued infliction I";
            } else if (Combat.checkStacks(plrBuffs, "imbued infliction II") == 0) {
                buffName = "imbued infliction II";
            } else {
                buffName = "imbued infliction III";
            }
            const buffToApply = {
                name: buffName,
                element: "physical",
                types: ["buff", "ninja"],
                apply_text: " has focused their energy!",
                max_stacks: 1,
                duration: 0
            };
            const statsToGet = ["atk", "matk", "def", "mdef", "speed", "crit_chance", "crit_damage", "resistance", "effectiveness",
            "evasion"];
            for (var i = 0; i < plrBuffs.length; i++) {
                if (plrBuffs[i].types.indexOf("ninja") != -1) {
                    imbued = true;
                    const buff = plrBuffs[i];
                    if (buff.duration > buffToApply.duration) {
                        buffToApply.duration = buff.duration;
                    } 
                    Object.keys(plrBuffs[i]).forEach(property => {
                        if (statsToGet.indexOf(property) != -1) {
                            if (buffToApply.hasOwnProperty(property)) {
                                buffToApply[property] += buff[property];
                            } else { buffToApply[property] = buff[property] }
                        }
                    });
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs, buff.name);
                    }
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                }
            };

            const state = ["imbue infliction", {
                damage: 0,
                additionalInfo: {
                    type: ["buff"],
                    target: "self"
                }
            }, type]

            if (imbued) {
                const func = () => {
                    Combat.applyBuff(buffToApply, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                };
                skills.gainActions(type, 1, "self", false, false, plr, enemy, true);
                skills.applyBuff(type, func, "self", state, true, plr, enemy);
            } else {
                skills.pushMessagesToState(["No buffs to fuse!"], false, "push");
                skills.pushCustomFunc(type, () => {}, "self", state, true, plr, enemy);
            };



        },

        cost: (user, target) => {
            if (user.stamina >= 20) {
                if (Combat.checkStacks(user.buffs, "imbued infliction I") == 0 || Combat.checkStacks(user.buffs, "imbued infliction II") == 0 || Combat.checkStacks(user.buffs, "imbued infliction III") == 0) {
                    return true
                } else {
                    return "Imbue limit reached!"
                }
            } else { return "Insufficient Stamina!" }
        }
    },

    enforce_infliction: {
        name: 'enforce infliction',
        description: "<b>Cost: 20 Stamina</b>- The user focuses all of the enemie's ailments into one point, fusing all debuffs from the" +
        " <b><u>NINJA</b></u> discipline into one buff (this will not interfere with the stacking limits of these debuffs from"+ 
        " their origin skills). Up to three of these fusion debuffs can be applied at one time. If this occurs, also grants"+ 
        " the user an additional action.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'weapon',
        def_element: 'weapon',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 1,
        use: (user, target, type) => {
            const skill = skills.enforce_infliction // need to change for each skill

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -20, "self" ,false, false, plr, enemy, false);

            skills.pushMessagesToState([`${user.name} is focusing inflictions applied to the enemy! [Enforce Infliction]`])
        

            var enforced = false;

            const plrBuffs = JSON.parse(JSON.stringify(target.debuffs));
            var buffName = "";
            if (Combat.checkStacks(plrBuffs, "enforced infliction I") == 0) {
                buffName = "enforced infliction I";
            } else if (Combat.checkStacks(plrBuffs, "enforced infliction II") == 0) {
                buffName = "enforced infliction II";
            } else {
                buffName = "enforced infliction III";
            }
            const buffToApply = {
                name: buffName,
                element: "physical",
                types: ["buff", "ninja"],
                apply_text: " has been afflicted with 'Enforced infliction!'",
                max_stacks: 1,
                duration: 0
            };
            const statsToGet = ["atk", "matk", "def", "mdef", "speed", "crit_chance", "crit_damage", "resistance", "effectiveness",
            "evasion"];
            for (var i = 0; i < plrBuffs.length; i++) {
                if (plrBuffs[i].types.indexOf("ninja") != -1) {
                    enforced = true;
                    const buff = plrBuffs[i];
                    if (buff.duration > buffToApply.duration) {
                        buffToApply.duration = buff.duration;
                    } 
                    Object.keys(plrBuffs[i]).forEach(property => {
                        if (statsToGet.indexOf(property) != -1) {
                            if (buffToApply.hasOwnProperty(property)) {
                                buffToApply[property] += buff[property];
                            } else { buffToApply[property] = buff[property] }
                        }
                    });
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getEnemy().debuffs : Combat.getPlayer().debuffs, buff.name);
                    }
                    skills.stripBuff(type, func2, "opponent", false, false, plr, enemy);
                }
            };

            const state = ["enforce infliction", {
                damage: 0,
                additionalInfo: {
                    type: ["debuff"],
                    target: "opponent"
                }
            }, type]

            if (enforced) {
                const func = () => {
                    Combat.applyBuff(buffToApply, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs", { ignoreRes: true});
                };
                skills.gainActions(type, 1, "self", false, false, plr, enemy, true);
                skills.applyBuff(type, func, "self", state, true, plr, enemy);
            } else {
                skills.pushMessagesToState(["No debuffs to fuse!"], false, "push");
                skills.pushCustomFunc(type, () => {}, "self", state, true, plr, enemy);
            };



        },

        cost: (user, target) => {
            if (user.stamina >= 20) {
                if (Combat.checkStacks(target.debuffs, "enforced infliction I") == 0 || Combat.checkStacks(target.debuffs, "enforced infliction II") == 0 || Combat.checkStacks(target.debuffs, "enforced infliction III") == 0) {
                    return true
                } else {
                    return "Enforce limit reached!"
                }
            } else { return "Insufficient Stamina!" }
        }
    },

    shadow_strike: {
        name: 'shadow strike',
        description: "<b>Cost: 50 stamina</b> - The user strikes the enemy from an indetectable angle, dealing high " +
        " physical dark damage and causing the following effects:" +
        "<br>If <u>Swift</u> is applied to the user, grants the user some mana (10% max mana), 10 SP and an additional action." +
        "<br>If <u>Stealth</u> is applied to the user, grants the user some stamina (10% max stamina), 10 SP and an additional action" +
        "<br>If <u>Feeble</u> is applied to the enemy, applies <u>Emboldened</u> [+25% DEF/MDEF, 4T duration] to the user, then grants 10 SP and an additional action." +
        "<br>If <u>Weakened</u> is applied to the enemy, applies <u>Strengthened</u> [+25% ATK/MATK, 4T duration] to the user, then grants 10 SP and an additional action." +
        "<br>Otherwise, grants the user two additional actions." ,
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'dark',
        def_element: 'dark',
        off_mod: 1.1,
        def_mod: 0.9,
        dmg_mod: 1.6,
        use: (user, target, type) => {
            const skill = skills.shadow_strike // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -50, "self", false, false, plr, enemy, false);
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} emerged from shadows and struck the enemy! [Shadow Strike]`, damage);
            
            var effectProc = false;

            const swiftStacks = Combat.checkStacks(user.buffs, "swift");
            const stealthStacks = Combat.checkStacks(user.buffs, "stealth");
            const feebleStacks = Combat.checkStacks(target.debuffs, "feeble");
            const weakenedStacks = Combat.checkStacks(target.debuffs, "weakened");

            if (swiftStacks == 1) {
                effectProc = true;
                skills.gainMana(type, user.max_mana / 10, "self", false, false, plr, enemy, true);
                skills.gainSP(type, 10, "self", false, false, plr, enemy, true);
                skills.gainActions(type, 1, "self", false, false, plr, enemy, true);
            }
            if (stealthStacks == 1) {
                effectProc = true;
                skills.gainStamina(type, user.max_stamina / 10, "self", false, false, plr, enemy, true);
                skills.gainSP(type, 10, "self", false, false, plr, enemy, true);
                skills.gainActions(type, 1, "self", false, false, plr, enemy, true);
            }
            if (feebleStacks == 1) {
                effectProc = true;
                const buff = {
                    name: "emboldened",
                    def: 0.25,
                    mdef: 0.25,
                    element: "physical",
                    types: ["buff", "ninja"],
                    apply_text: " is emboldened!",
                    max_stacks: 1,
                };
                const func = () => {
                    Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                };
                skills.applyBuff(type, func, "self", false, false, plr, enemy);
                skills.gainSP(type, 10, "self", false, false, plr, enemy, true);
                skills.gainActions(type, 1, "self", false, false, plr, enemy, true);
            }
            if (weakenedStacks == 1) {
                effectProc = true;
                const buff = {
                    name: "strengthened",
                    atk: 0.25,
                    matk: 0.25,
                    duration: 4,
                    element: "physical",
                    types: ["buff", "ninja"],
                    apply_text: " is strengthened!",
                    max_stacks: 1,
                };
                const func = () => {
                    Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                };
                skills.applyBuff(type, func, "self", false, false, plr, enemy);
                skills.gainSP(type, 10, "self", false, false, plr, enemy, true);
                skills.gainActions(type, 1, "self", false, false, plr, enemy, true);
            }

            if (!effectProc) {
                skills.gainActions(type, 2, "self", false, false, plr, enemy, true);
            }

            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["attack", "buff", "stamina_gain", "mana_gain"],
                    target: "opponent"
                }
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);
        },

        cost: (user, target) => {
            if (user.stamina >= 50) {
                return true;
            } else {
                return "Insufficient mana!"
            }
        }
    },


    // ------------------------------------------------------------------- \\
    // ------------------------------------------------------------------- \\

    // REWORKED
    //
    // REWORKED
    splash: {
        name: 'splash',
        description: 'The user splashes at the enemy with high-pressure liquid, dealing low physical water damage.',
        off_stat: 'matk',
        def_stat: 'mdef',
        off_element: 'water',
        def_element: 'water',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 0.8,
        use: (user, target, type) => {
            const skill = skills.splash // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} splashed the enemy! [Splash]`, damage);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["attack"],
                    target: "opponent"
                }
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);

        },
        cost: (user, target) => {
            return true;
        }
    },

    monster_soul: {
        name: 'monster soul',
        description: "The user's monster soul allows them to constantly regenerate special energy. Applies <u>Monster Soul</u>," +
        " an unstrippable 5 SP regen buff that does not fade with time. Also grants the user an additional action.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.monster_soul;

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const state = [skill.name, {
                damage: 0,
                additionalInfo: {
                    type: ["buff", "soul"],
                    target: "self"
                }
            }, type];

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
                max_stacks: 1,
                desc: "The soul of a monster resides within this creature. Grants continuous SP regen."
            }
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.applyBuff(type, func, "self", false, false, plr, enemy);
            skills.gainActions(type, 1, "self", state, true, plr, enemy, true);

        },

        cost: (user, target) => {
            return true
        }
    },

    wolven_soul: {
        name: 'wolven soul',
        description: "The user's monster soul allows them to constantly regenerate special energy. Applies <u>Wolven Soul</u>," +
        " an unstrippable 5 SP regen buff that does not fade with time, and grants actions to the afflicted depending on" +
        " how low their health is. Use of this skill grants an additional action.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.wolven_soul;

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const state = [skill.name, {
                damage: 0,
                additionalInfo: {
                    type: ["buff", "soul"],
                    target: "self"
                }
            }, type];

            const buff = {
                name: "wolven soul",
                duration: 999,
                element: "none",
                types: ["buff"],
                fade: false,
                unstrippable: true,
                onTick: (type, user, plr, enemy) => {
                    skills.pushMessagesToState(["<br>The afflicted's wolven soul radiates energy!"], true, "push");
                    skills.gainSP(type, 5, "self", false, false, plr, enemy, true);
                    if (user.health / user.max_health < 0.2) {
                        skills.gainActions(type, 2, "self", false, false, plr, enemy, true);
                    }
                    else if (user.health / user.max_health < 0.5) {
                        skills.gainActions(type, 1, "self", false, false, plr, enemy, true);
                    };
                },
                apply_text: "'s wolven soul radiates energy!",
                max_stacks: 1,
                desc: "The soul of a wolf resides within this creature. Grants continuous SP regen, and strengthens the creature"+
                " as their situation grows dire."
            }
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.applyBuff(type, func, "self", false, false, plr, enemy);
            skills.gainActions(type, 1, "self", state, true, plr, enemy, true);

        },

        cost: (user, target) => {
            return true
        }
    },

    kindred_soul: {
        name: 'kindred soul',
        description: "The user's kindred soul allows them to constantly regenerate health. Applies <u>Kindred Soul</u>," +
        " an unstrippable 3% HP regen buff that does not fade with time. Use of this skill grants an additional action.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.kindred_soul;

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const state = [skill.name, {
                damage: 0,
                additionalInfo: {
                    type: ["buff", "soul"],
                    target: "self"
                }
            }, type];

            const buff = {
                name: "kindred soul",
                duration: 999,
                element: "earth",
                types: ["buff"],
                fade: false,
                unstrippable: true,
                onTick: (type, target, plr, enemy) => {
                   //console.log(target);
                    skills.pushMessagesToState(["<br>The afflicted's kindred soul radiates energy!"], true, "push");
                    skills.gainHealth(type, Math.round(user.max_health * (3/100)), "self", false, false, plr, enemy, true);
                },
                apply_text: "'s kindred soul radiates energy!",
                max_stacks: 1,
                desc: "A kindred soul resides within this creature. Grants continuous HP regen."
            }
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.applyBuff(type, func, "self", false, false, plr, enemy);
            skills.gainActions(type, 1, "self", state, true, plr, enemy, true);

        },

        cost: (user, target) => {
            return true;
        }
    },

    anima_soul: {
        name: 'anima soul',
        description: "The user's kindred soul allows them to constantly regenerate health and energy. Applies <u>Anima Soul</u>," +
        " an unstrippable 5% HP regen/5 SP regen buff that does not fade with time. Use of this skill grants an additional action.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.anima_soul;

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const state = [skill.name, {
                damage: 0,
                additionalInfo: {
                    type: ["buff", "soul"],
                    target: "self"
                }
            }, type];

            const buff = {
                name: "anima soul",
                duration: 999,
                element: "earth",
                types: ["buff"],
                fade: false,
                unstrippable: true,
                onTick: (type, target, plr, enemy) => {
                   //console.log(target);
                    skills.pushMessagesToState(["<br>The afflicted's anima soul radiates energy!"], true, "push");
                    skills.gainHealth(type, Math.round(user.max_health * (5/100)), "self", false, false, plr, enemy, true);
                    skills.gainSP(type, 5, "self", false, false, plr, enemy, true);
                },
                apply_text: "'s anima soul radiates energy!",
                max_stacks: 1,
                desc: "An anima soul resides within this creature. Grants continuous HP and SP regen."
            }
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.applyBuff(type, func, "self", false, false, plr, enemy);
            skills.gainActions(type, 1, "self", state, true, plr, enemy, true);

        },

        cost: (user, target) => {
            return true;
        }
    },

    rend: {
        name: 'rend',
        description: '<b>Cost: 20 stamina</b> -  The user slashes at the enemy viciously, dealing moderate physical damage and possibly (50%) applying <u>Bleed</u>'
        + " [-10% ATK, 5% HP DOT, 3T duration] to the enemy.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 1.1,
        use: (user, target, type) => {
            const skill = skills.rend // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} claws at the enemy viciously! [Rend]`, damage);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -20, "self", false, false, plr, enemy, false);

            const buff = {
                name: "bleed",
                atk: -0.1,
                duration: 3,
                element: "physical",
                types: ["debuff"],
                apply_text: " is bleeding!",
                max_stacks: 1,
                damage: ["percentile", 5]
            }
            
            if (damage.eva == false) {
                const func = () => {
                    Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                };
                skills.applyBuff(type, func, "opponent", false, false, plr, enemy);
            }

            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["attack", "debuff"],
                    target: "opponent"
                }
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);

        },
        cost: (user, target) => {
            if (user.stamina >= 20) { return true } else { return "Insufficient stamina!" };
        }
    },

    /*
    brutal_swipe: {
        name: 'brutal swipe',
        description: "<b>Cost: 30 Stamina</b> - The user enhances their strength temporarily and attacks, dealing high weapon" +
        " element damage.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'weapon',
        def_element: 'weapon',
        off_mod: 1,
        def_mod: 0.9,
        dmg_mod: 1.54,
        use: (user, target, type) => {
            const skill = skills.brutal_swipe // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -30, "self", false, false, plr, enemy, false);

            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} swiped at the enemy brutally!`, damage);
            
            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["attack"],
                    target: "opponent"
                }
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);
        },

        cost: (user, target) => {
            if (user.stamina >= 30) { return true } else {return "Insufficient Stamina!"};
        }
    },
    */

    constrict: {
        name: 'contstrict',
        description: "<b>Cost: 40 stamina</b> - The user uses vines to constrict the opponent. Deals moderate physical earth damage" +
        " and applies <u>Constricted</u> [-10% SPD/ATK/MATK, 4T duration, 5% HP DOT, stacks to 3] to the enemy.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'earth',
        def_element: 'earth',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 1.12,
        use: (user, target, type) => {
            const skill = skills.constrict // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} attempts to constrict the enemy with vines! [Constrict]`, damage);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -40, "self", false, false, plr, enemy, false);

            const debuff = {
                name: "constricted",
                duration: 4,
                matk: -0.1,
                atk: -0.1,
                speed: -0.1,
                element: "earth",
                types: ["debuff"],
                damage: ["percentile", 5],
                apply_text:" is constricted!",
                max_stacks: 3
            };
            
            if (damage.eva == false) {
                const func = () => {
                    Combat.applyBuff(debuff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                };
                skills.applyBuff(type, func, "opponent", false, false, plr, enemy);
            }

            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["attack", "debuff"],
                    target: "opponent"
                }
            }
            
            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);

        },
        cost: (user, target) => {
            if (user.stamina >= 40) { return true } else { return "Insufficient stamina!" };
        }
    },

    nature_healing: {
        name: 'nature healing',
        description: "<b>Cost: 25 MP</b> - The user employs simple healing magic to recover from damage. Heals the user" +
        " slightly based on their MDEF.",
        off_stat: 'mdef',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0.7,
        def_mod: 0,
        dmg_mod: 1.2,
        use: (user, target, type) => {
            const skill = skills.nature_healing // need to change for each skill
            const damage = skills.calcDamage(user, user, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod, {
                canCrit: false, canEvade: false
            });
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.pushMessagesToState([`${user.name} enveloped themselves in healing magic! [Nature Healing]`], true, "unshift");
            
            skills.gainMana(type, -25, "self", false, false, plr, enemy, false);

            const state = [skill.name, {
                damage: damage,
                additionalInfo: {
                    type: ["heal"],
                    target: "self"
                }
            }, type]

            skills.gainHealth(type, damage.damage, "self", state, true, plr, enemy, true);

        },

        cost: (user, target) => {
            if (user.mana >= 25) { return true } else { return "Insufficient Mana!" };
        }
    },

    lesser_anima_healing: {
        name: 'lesser anima healing',
        description: "<b>Cost: 15 MP</b> - The user employs fairly powerful healing magic to recover from damage. Heals the user" +
        " slightly based on their MDEF, and applies <u>Lower Anima</u> [+20% ATK/DEF/MATK/MDEF, stacks to 3, 3T duration] to the user.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0.62,
        def_mod: 0,
        dmg_mod: 1,
        use: (user, target, type) => {
            const skill = skills.lesser_anima_healing // need to change for each skill
            const damage = skills.calcDamage(user, user, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod, {
                canCrit: false, canEvade: false
            });
            
            skills.pushMessagesToState([`${user.name} enveloped themselves in healing magic! [Lesser Anima Healing]`], true, "unshift");
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const buff = {
                name: "lower anima",
                duration: 3,
                def: 0.2,
                mdef: 0.2,
                matk: 0.2,
                mdef: 0.2,
                element: "earth",
                types: ["buff"],
                apply_text: " is blessed by healing magic!",
                max_stacks: 2,
            };
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.applyBuff(type, func, "self", false, false, plr, enemy);

            const state = [skill.name, {
                damage: damage,
                additionalInfo: {
                    type: ["heal"],
                    target: "self"
                }
            }, type]

            skills.gainHealth(type, damage.damage, "self", state, true, plr, enemy, true);

        },

        cost: (user, target) => {
            return true;
        }
    },

    forest_curse: {
        name: 'forest curse',
        description: "<b>Cost: 40 Stamina</b> - " +
        "The user turns the mystic energy of the forest against their enemy and uses it to strike them while" +
        " afflicting them with several curses. Deals moderate magical dark damage and attemps to apply <u>Forest Curse</u>" +
        " [-10% ATK/MATK/DEF/MDEF/SPD, stacks to 10, 5T duration] five times at a 25% chance each attempt. This skill cannot miss.",
        off_stat: 'matk',
        def_stat: 'mdef',
        off_element: 'dark',
        def_element: 'dark',
        off_mod: 1.093,
        def_mod: 1.02,
        dmg_mod: 0.98,
        use: (user, target, type) => {
            const skill = skills.forest_curse // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod, {
                canEvade: false
            });
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} afflicts the enemy with the curse of the forest! [Forest Curse]`, damage);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const debuff = {
                name: "forest curse",
                duration: 5,
                matk: -0.1,
                atk: -0.1,
                speed: -0.1,
                def: -0.1,
                mdef: -0.1,
                element: "dark",
                types: ["debuff"],
                apply_text:" has been cursed by the forest!",
                max_stacks: 10
            };
            
            if (damage.eva == false) {
                for (var i = 0; i < 5; i++) {
                    const func = () => {
                        Combat.applyBuff(debuff, 25, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                    };
                    skills.applyBuff(type, func, "opponent", false, false, plr, enemy);
                }

            }

            const stateDamage = {
                damage: damage,
                type: ["attack", "debuff"],
                target: "opponent"
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, stateDamage, type], true, plr, enemy);

        },

        cost: (user, target) => {
            return true;
        }
    },

    anima_bark: {
        name: 'anima bark',
        description: "The user enforces their body with mystical energy, applying <u>Anima Bark</u> [+30% DEF/MDEF, -10 all"+
        " elemental defences, unstrippable and does not fade with time, 999T duraton] to themselves. Also grants an" +
        " additional action.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.anima_bark;

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const state = [skill.name, {
                damage: 0,
                additionalInfo: {
                    target: "self",
                    type: ["buff"]
                }
            }, type];

            const buff = {
                name: "anima bark",
                def: 0.3,
                mdef: 0.3,
                duration: 999,
                fade: false,
                unstrippable: true,
                element: "earth",
                elemental: {
                    offence: {},
                    defence: { fire: -10, earth: -10, water: -10, wind: -10, tunder: -10, light: -10, dark: -10, physical: -10}
                },
                types: ["buff"],
                apply_text: "'s bark is reinforced mystically!'",
                max_stacks: 1
            }
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.gainActions(type, 1, "self", false, false, plr, enemy, true);
            skills.applyBuff(type, func, "self", state, true, plr, enemy);

        },

        cost: (user, target) => {
            return true;
        }
    },

    greater_anima_bark: {
        name: 'greater anima bark',
        description: "The user enforces their body with mystical energy, applying <u>Greater Anima Bark</u> [+65% DEF/MDEF, -15 all"+
        " elemental defences, unstrippable and does not fade with time, 999T duraton] to themselves. Also grants an" +
        " additional action.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.greater_anima_bark;

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const state = [skill.name, {
                damage: 0,
                additionalInfo: {
                    target: "self",
                    type: ["buff"]
                }
            }, type];

            const buff = {
                name: "greater anima bark",
                def: 0.65,
                mdef: 0.65,
                duration: 999,
                fade: false,
                unstrippable: true,
                element: "earth",
                elemental: {
                    offence: {},
                    defence: { fire: -15, earth: -15, water: -15, wind: -15, tunder: -15, light: -15, dark: -15, physical: -15}
                },
                types: ["buff"],
                apply_text: "'s bark is reinforced mystically!'",
                max_stacks: 1
            }
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.gainActions(type, 1, "self", false, false, plr, enemy, true);
            skills.applyBuff(type, func, "self", state, true, plr, enemy);

        },

        cost: (user, target) => {
            return true;
        }
    },

    absolute_purge: {
        name: 'absolute purge',
        description: "<b>Cost: 10 mana</b> - The user attempts to purge all power from the enemy, removing all strippable" +
        " buffs from them.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.absolute_purge;

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainMana(type, -10, "self", false, false, plr, enemy, false);

            const state = [skill.name, {
                damage: 0,
                additionalInfo: {
                    type: ["debuff"],
                    target: "opponent"
                }
            }, type];

            const buffs = JSON.parse(JSON.stringify(target.buffs)); // generating a copy to remove buffs from
            while (buffs.length > 0) {
                var random = Math.round(Math.random() * buffs.length) - 1;
                if (random < 0) { random = 0 } // dont want negative index
                if (buffs[random].hasOwnProperty("unstrippable")) {
                    buffs.splice(random, 1);
                } else {
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getEnemy().buffs : Combat.getPlayer().buffs, buffs[random].name);
                    }
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    buffs.splice(random, 1);
                }
            }

            skills.pushCustomFunc(type, () => { }, "self", state, true, plr, enemy);
        },

        cost: (user, target) => {
            if (user.mana >= 10) { return true } else { return false }
        }
    },

    absolute_cleanse: {
        name: 'absolute cleanse',
        description: "<b>Cost: 10 mana</b> - The user attempts to purge all weaknesses from themselves, removing from" +
        " themselves all strippable debuffs.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.absolute_cleanse;

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainMana(type, -10, "self", false, false, plr, enemy, false);

            const state = [skill.name, {
                damage: 0,
                additionalInfo: {
                    type: ["debuff"],
                    target: "opponent"
                }
            }, type];

            const buffs = JSON.parse(JSON.stringify(user.debuffs)); // generating a copy to remove buffs from
            while (buffs.length > 0) {
                var random = Math.round(Math.random() * buffs.length) - 1;
                if (random < 0) { random = 0 } // dont want negative index
                if (buffs[random].hasOwnProperty("unstrippable")) {
                    buffs.splice(random, 1);
                } else {
                    const func2 = () => {
                        Combat.stripBuff(type == "player" ? Combat.getPlayer().debuffs : Combat.getEnemy().debuffs, buffs[random].name);
                    }
                    skills.stripBuff(type, func2, "self", false, false, plr, enemy);
                    buffs.splice(random, 1);
                }
            };

            skills.pushCustomFunc(type, () => { }, "self", state, true, plr, enemy);

        },

        cost: (user, target) => {
            if (user.mana >= 10) { return true } else { return false }
        }
    },

    forest_rupture: {
        name: 'forest rupture',
        description: "The user calls upon the forest to destroy the enemy, dealing very high physical earth damage.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'earth',
        def_element: 'earth',
        off_mod: 1.12,
        def_mod: 0.87,
        dmg_mod: 1.9,
        use: (user, target, type) => {
            const skill = skills.forest_rupture // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} called upon the forest to destroy their enemy! [Forest Rupture]`, damage);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const stateDamage = {
                damage: damage,
                type: ["attack"],
                target: "opponent"
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, stateDamage, type], true, plr, enemy);

        },

        cost: (user, target) => {
            return true;
        }
    },

    poison_claws: {
        name: 'poison claws',
        description: "<b>Cost: 12 mana</b> - The user creates a wound with sharp poisonous claws. The poison seeps into the enemy, applying" +
        " <u>Viridian Toxin</u> [-15% SPD, 5% HP DOT, 3T duration, stacks to 3]",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 1.1,
        use: (user, target, type) => {
            const skill = skills.poison_claws // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} lashes out with poisonous claws! [Poison Claws]`, damage);
            


            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const stateDamage = {
                damage: damage,
                type: ["attack"],
                target: "opponent"
            }

            skills.dealDamage(type, damage.damage, "opponent", false, false, true, plr, enemy);

            const buff = {
                name: "viridian toxin",
                speed: -0.15,
                duration: 3,
                element: "earth",
                types: ["debuff"],
                apply_text: " is envenomed!",
                max_stacks: 3,
                damage: ["percentile", 5]
            }

            if (damage.eva == false) {
                const func = () => {
                    Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                };
                skills.applyBuff(type, func, "opponent", [skill.name, stateDamage, type], true, plr, enemy);
            }

        },
        cost: (user, target) => {
            if (user.mana >= 12) { return true } else { return "Insufficient mana!" };
        }
    },

    deep_envenom: {
        name: 'deep_envenom',
        description: "<b>Cost: 7 mana</b> - The user uses a special liquid to enhance the potency of venoms in the body of the" +
        " target. Deals moderate physical damage and applies an additional stack of any DOT debuffs the enemy has applied" +
        " (where possible) and extends their duration by 3 turns (buff copy application has base 999% apply chance). Also" +
        " applies <u>Prepared</u> [+25% ATK, 3T duration] to the user.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 0.7,
        use: (user, target, type) => {
            const skill = skills.deep_envenom // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} attempts to deeply envenom their enemy! [Deep Envenom]`, damage);
            


            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const stateDamage = {
                damage: damage,
                type: ["attack", "debuff"],
                target: "opponent"
            }

            skills.dealDamage(type, damage.damage, "opponent", false, false, true, plr, enemy);

            if (damage.eva == false) {
                const buffs = target.debuffs;
                buffs.forEach(buff => {
                    if (buff.hasOwnProperty("damage")) {
                        if (buff.damage[1] > 0) {
                            // then extend duration by 3 and apply a new stack
                            const customFunc = () => { buff.duration += 3; };
                            skills.pushMessagesToState([`Debuff ${buff.name} extended by 3 turns!`], false, "push");
                            skills.pushCustomFunc(type, customFunc, "opponent", false, false, plr, enemy, false);

                            const buffCopy = copy(buff);
                            const func = () => {
                                Combat.applyBuff(buffCopy, 999, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                            };
                            skills.applyBuff(type, func, "opponent", false, false, plr, enemy);
                        }
                    }
                })
            }

            const buff = {
                name: "prepared",
                duration: 3,
                atk: 0.25,
                element: "physical",
                types: ["buff"],
                apply_text: " is prepared!",
                max_stacks: 1,
            };
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.applyBuff(type, func, "self", false, false, plr, enemy);

            skills.pushCustomFunc(type, () => {}, "self", [skill.name, stateDamage, type], true, plr, enemy, false);

        },
        
        cost: (user, target) => {
            if (user.mana >= 7) { return true } else { return "Insufficient mana!" };
        }
    },

    killing_blow: {
        name: 'killing blow',
        description: "Having completed preparations, the user strikes to finish their target. Deals very high physical damage.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 1.01,
        def_mod: 0.83,
        dmg_mod: 2.56,
        use: (user, target, type) => {
            const skill = skills.killing_blow // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} attempts to finish off their enemy! [Killing Blow]`, damage);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const stateDamage = {
                damage: damage,
                type: ["attack"],
                target: "opponent"
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, stateDamage, type], true, plr, enemy);

        },

        cost: (user, target) => {
            return true;
        }
    },

    malice: {
        name: 'malice',
        description: "<b>Cost: 50 Stamina</b> - The user transforms their malice into a curse that afflicts the enemy." +
        " Deals low magical dark damage and inflicts <u>Malice</u> [-200% ATK/DEF/MATK/MDEF/SPEED, 20T duration] upon the enemy.",
        off_stat: 'matk',
        def_stat: 'mdef',
        off_element: 'dark',
        def_element: 'dark',
        off_mod: 0.9,
        def_mod: 1,
        dmg_mod: 0.423,
        use: (user, target, type) => {
            const skill = skills.malice // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} curses the enemy with their malice! [Malice]`, damage);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -50, "self", false, false, plr, enemy, false);

            const debuff = {
                name: "malice",
                duration: 20,
                atk: -2,
                def: -2,
                mdef: -2,
                matk: -2,
                mdef: -2,
                speed: -2,
                element: "dark",
                elemental: {
                    offence: {},
                    defence: {
                        all: 100
                    }
                },
                types: ["debuff"],
                apply_text:" is afflicted with a crushing despair...",
                max_stacks: 1
            };
            
            if (damage.eva == false) {
                const func = () => {
                    Combat.applyBuff(debuff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                };
                skills.applyBuff(type, func, "opponent", false, false, plr, enemy);
            }

            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["attack", "debuff"],
                    target: "opponent"
                }
            }
            
            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);

        },
        cost: (user, target) => {
            if (user.stamina >= 50) { return true } else { return "Insufficient Stamina!" };
        }
    },

    empoison: {
        name: 'empoison',
        description: "<b>Cost: 10 Stamina</b> - The user uses a small bomb to infect the target with a slow-acting, but potent poison. Deals very low physical damage and applies <u>Empoisoned</u> [1% HP DOT, 50T duration, unstrippable] to the enemy. Cannot crit or be evaded.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 0.25,
        def_mod: 1.15,
        dmg_mod: 0.5,
        use: (user, target, type) => {
            const skill = skills.empoison // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod, { canEvade: false, canCrit: false});
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} empoisons the enemy! [Empoison]`, damage);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -10, "self", false, false, plr, enemy, false);

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
            skills.applyBuff(type, func, "opponent", false, false, plr, enemy);

            const damageState = {
                damage: damage,
                additionalInfo: {
                    type: ["attack", "debuff"],
                    target: "opponent"
                }
            }
            
            skills.dealDamage(type, damage.damage, "opponent", [skill.name, damageState, type], true, plr, enemy);

        },
        cost: (user, target) => {
            if (user.stamina >= 10) { return true } else { return "Insufficient Stamina!" };
        }
    },

    soul_drain: {
        name: 'soul drain',
        description: "The user attempts to drain their enemy of all willpower. Removes all SP from the target and gives it all to the user.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'weapon',
        def_element: 'weapon',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.soul_drain // need to change for each skill
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.pushMessagesToState([`${user.name} drains the soul of the enemy!`], true, "unshift");

            const state = [
                skill.name, {
                damage: 0,
                additionalInfo: {
                    type: ["special"],
                    target: "opponent" 
                }
            }, type];


            const spAmount = target.sp;
            skills.gainSP(type, spAmount * -1, "opponent", false, false, plr, enemy, true);
            skills.gainSP(type, spAmount, "self", state, true, plr, enemy, true);


        },

        cost: (user, target) => {
            return true;
        }
    },

    halycon_enchantment: {
        name: 'halycon enchantment',
        description: `<b>Cost: 10 Mana</b> - The user enchants themselves strongly with defensive magic, applying <u>Halycon Enchantment</u> [-20 all defence, +25% DEF/MDEF, 3T duration] to themselves.`,
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.halycon_enchantment;

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainMana(type, -10, "self", false, false, plr, enemy, false);

            const state = [skill.name, {
                damage: 0,
                additionalInfo: {
                    type: ["buff"],
                    target: "self"
                }
            }, type];

            const buff = {
                name: "halycon enchantment",
                def: 0.25,
                mdef: 0.25,
                elemental:  { offence: {}, defence: { all: -20 } },
                duration: 4,
                element: "light",
                types: ["buff"],
                apply_text: " is protected by a halycon enchantment!",
                max_stacks: 1
            }
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.applyBuff(type, func, "self", state, true, plr, enemy);

        },

        cost: (user, target) => {
            if (user.mana >= 10) { return true } else { return "Insufficient Mana!"};
        }
    },

    final_haste: {
        name: 'final haste',
        description: `The user grants themselves a final burst of energy. Applies <u>Final Haste</u> [+1 action at the start of every turn, unstrippable and does not fade with time] to the user.`,
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const skill = skills.final_haste;

            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const state = [skill.name, {
                damage: 0,
                additionalInfo: {
                    type: ["buff"],
                    target: "self"
                }
            }, type];

            const buff = {
                name: "final haste",
                duration: 999,
                element: "physical",
                types: ["buff"],
                apply_text: " is suddenly bursting with energy!",
                unstrippable: true,
                fade: false,
                max_stacks: 1,
                onTick: (type, user, plr, enemy) => {
                    skills.pushMessagesToState(["<br>[Final Haste]"], true, "push");
                    skills.gainActions(type, 1, "self", false, false, plr, enemy, true);
                },
            }
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.applyBuff(type, func, "self", state, true, plr, enemy);

        },

        cost: (user, target) => {
            if (user.mana >= 10) { return true } else { return "Insufficient Mana!"};
        }
    },

    invoke_cataclysm: { // don't know if works, haven't tested. Skill for wanderer
        name: 'invoke cataclsym',
        description: "<b>Cost: 40 Stamina</b> - " +
        "The user calls upon the power of the Demon sword, Cataclysm to strike their enemies. Deals one hit of high" +
        " physical fire damage and one hit of high magical dark damage before applying <u>Catalysis</u> [-50% DEF/MDEF, 3T" +
        " duration] to the enemy.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'dark',
        def_element: 'dark',
        off_mod: 1.123,
        def_mod: 1.06,
        dmg_mod: 1.78,
        use: (user, target, type) => {
            const skill = skills.invoke_cataclysm // need to change for each skill
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} calls upon the power of Cataclysm!`, damage);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;


            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            skills.prepareAttackMessage(user.name, target.name, ``, damage);
            skills.dealDamage(type, damage.damage, false, false, plr, enemy);
            const damage2 = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, "fire", "fire", skill.off_mod, skill.def_mod, skill.dmg_mod);
            skills.prepareAttackMessage(user.name, target.name, ``, damage);
            skills.dealDamage(type, damage2.damage, "opponent", false, false, plr, enemy);

            const debuff = {
                name: "catalysis",
                duration: 3,
                def: -0.5,
                mdef: -0.5,
                element: "dark",
                types: ["debuff"],
                apply_text:" has been afflicted by the power of Cataclysm!",
                max_stacks: 1
            };
            
            if (damage.eva == false || damage2.eva == false) {
                const func = () => {
                    Combat.applyBuff(debuff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                };
                skills.applyBuff(type, func, "opponent", false, false, plr, enemy);

            }

            const stateDamage = {
                damage: damage,
                type: ["attack", "debuff"],
                target: "opponent"
            }


        },

        cost: (user, target) => {
            return true;
        }
    },
    
    // NOT REWORKED
    //
    // NOT REWORKED

    guard_break: {
        name: 'guard break',
        description: '<b>Cost: 35 stamina</b> - The user strikes the enemy with a blunt edge, dealing low physical weapon' 
        + ' element damage but possibly with a 75% chance to apply <u>Guard Broken</u> [-10% DEF, 5T duration, stacks to 3].',
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'weapon',
        def_element: 'weapon',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 1,
        use: (user, target, type) => {
            user.stamina = user.stamina - 35; // COST OF USING THE SKILL
            const skill = skills.guard_break // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            const message = skills.prepareAttackMessage(user.name, target.name, `<Br>${user.name} struck the enemy with a blunt edge!`, damage);
            mainView.displayMessagesDelayed(message, "battle", () => {
                target.health -= damage.damage;
                
                const buff = {
                    name: "guard broken",
                    def: -0.1,
                    duration: 5,
                    element: "physical",
                    types: ["debuff"],
                    apply_text: "'s guard has been broken!",
                    max_stacks: 3,
                    elemental: {
                        offence: {

                        },
                        defence: {
                            
                        }
                    }
                }
                // if player is needed to apply buffs, instead of user/target use ** (type == 'player' ? Combat.getPlayer() : user) **
                if (damage.eva == false) {
                    Combat.applyBuff(buff, 75, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                }
                
                
                /* ^ ternary used to get playerFighter if the player is having the buff applied, since otherwise we are applying the buff
                to getPlayerAdd which is pointless */
                
                const plr = type == "enemy" ? target : user;
                const enemy = type == "enemy" ? user : target;
                Combat.uploadChanges(plr, enemy); // this funtion is needed because we are attacking a copy of playerFighter when we use skills.
               
                skills.finish("guard_break", damage, type);
               
            })
        },
        cost: (user, target) => {
            if (user.stamina >= 35) { return true } else { return "Insufficient stamina!" };
        }
    },

    rush_attack: {
        name: 'rush attack',
        description: '<b>Cost: 10 stamina</b> - The user strikes the enemy several times, dealing 3 hits of low physical weapon element damage.',
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'weapon',
        def_element: 'weapon',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 0.5,
        use: (user, target, type) => {
            const skill = skills.rush_attack // need to change for each skill
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            skills.gainStamina(type, -10, "self", false, false, plr, enemy, false);

            skills.pushMessagesToState([`${user.name} lashed out at their enemy!<br>`], true, "unshift");

            const stateDamage = {
                damage: [],
                type: ["attack", "multihit"],
                target: "opponent"
            }

            for (var i = 0; i < 3; i++) {
                const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
                skills.prepareAttackMessage(user, target, "", damage, "push", false);
                skills.dealDamage(type, damage.damage, "opponent", false, false, plr, enemy);
                stateDamage.damage.push(damage);
                
            }

            skills.pushCustomFunc(type, () => {}, "self", [skill.name, stateDamage, type], true, plr, enemy);

        },
        cost: (user, target) => {
            if (user.stamina >= 10) { return true } else { return "Insufficient stamina!" };
        }
    },

    health_potion: {
        name: 'health potion',
        description: "Drink a health potion, recovering 20% of one's health.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            user.mana -= 30; // cost of using the skill
            const skill = skills.attack // need to change for each skill
            const damage = {
                crit: false,
                eva: false,
                damage: Math.round(user.health / 4) * -1
            }
            const message = [[`${user.name} Drank a health potion!`, 1],[`recovered ${damage.damage} HP!`, 1]]
            mainView.displayMessagesDelayed(message, "battle", () => {
                user.health -= damage.damage;
                if (user.health > user.max_health) { user.health = user.max_health};

                const plr = type == "enemy" ? target : user;
                const enemy = type == "enemy" ? user : target;
                Combat.uploadChanges(plr, enemy); // this funtion is needed because we are attacking a copy of playerFighter when we use skills.
        
                skills.finish("health_potion", damage, type);
            })

        },

        cost: (user, target) => {
            if (user.mana >= 30) { return true } else {return 'Insufficient mana!'};
        }
    },

    camoflague: {
        name: 'camoflague',
        description: "<b>Cost: 12 mana</b> - The user envelops themselves in a camoflague that makes them hard to see and react to. Applies" +
        " <u>Camoflague</u> [+30% evasion, +70% resistance, +30% SPD, 2T duration].",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            user.mana -= 12;
            const damage = {
                damage: 0,
                crit: false,
                eva: false
            }
            const message = [[`<br>${user.name} camoflagues themselves.`, 1]];
            mainView.displayMessagesDelayed(message, "battle", () => {
                target.health -= damage.damage;

                const plr = type == "enemy" ? target : user;
                const enemy = type == "enemy" ? user : target;
                Combat.uploadChanges(plr, enemy); // this funtion is needed because we are attacking a copy of playerFighter when we use skills.

                const buff = {
                    name: "camoflague",
                    evasion: 0.3,
                    resistance: 70,
                    speed: 0.3,
                    duration: 2,
                    element: "physical",
                    types: ["buff"],
                    apply_text: " is camoflagued!",
                    max_stacks: 1
                }
                // if player is needed to apply buffs, instead of user/target use ** (type == 'player' ? Combat.getPlayer() : user) **
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                /* ^ ternary used to get playerFighter if the player is having the buff applied, since otherwise we are applying the buff
                to getPlayerAdd which is pointless */


                skills.finish("camoflague", damage, type);

            })

        },

        cost: (user, target) => {
            if (user.mana >= 12) { return true } else { return "Insufficient mana!"}
        }
    },

    engulf: {
        name: 'engulf',
        description: "<b>Cost: 10 mana</b> - Absorb the enemy's power. Deals low physical damage and removes all buffs from the enemy. For each buff"+
        " removed, applies <u>Empowered</u> [+10% ATK/DEF/MATK/MDEF/SPD, 2T duration] to the user.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 0.5,
        use: (user, target, type) => {
            const skill = skills.engulf // need to change for each skill
            user.mana -= 10;
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            const message = skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} engulfs the enemy!`, damage);
            mainView.displayMessagesDelayed(message, "battle", () => {
                target.health -= damage.damage;

                const buff = {
                    name: "empowered",
                    atk: 0.1,
                    matk: 0.1,
                    mdef: 0.1,
                    def: 0.1,
                    speed: 0.1,
                    duration: 2,
                    element: "dark",
                    types: ["buff"],
                    apply_text: " is empowered!",
                    max_stacks: 99,
                }

                // buff strip
                if (damage.eva == false) {
                    const buffs = JSON.parse(JSON.stringify(target.buffs)); // generating a copy to remove buffs from
                    while (buffs.length > 0) {
                        var random = Math.round(Math.random() * buffs.length) - 1;
                        if (random < 0) { random = 0 } // dont want negative index
                        if (buffs[random].hasOwnProperty("unstrippable")) {
                            buffs.splice(random, 1);
                        } else {
                            Combat.stripBuff((type == "player" ? Combat.getEnemy().buffs : Combat.getPlayer().buffs), buffs[random].name);
                            Combat.applyBuff(buff, 100, (type == 'player' ? user : Combat.getPlayer()), (type == 'player' ? Combat.getPlayer() : Combat.getEnemy()), "buffs");
                            buffs.splice(random, 1);
                        }
                    }
                }


                const plr = type == "enemy" ? target : user;
                const enemy = type == "enemy" ? user : target;
                Combat.uploadChanges(plr, enemy); // this funtion is needed because we are attacking a copy of playerFighter when we use skills.
        
                skills.finish("engulf", damage, type);
            })

        },

        cost: (user, target) => {
            if (user.mana >= 10) { return true } else { return "Insufficient SP!"};
        }
    },

    dark_pact: {
        name: 'dark pact',
        description: "<b>Cost: 18 mana</b> - The user calls upon their pact with the dark forest to strengthen them. At the cost of" +
        " 5% HP, applies three stacks each of standard ATK/MATK/SPEED buff with increased duration [+10% ATK/MATK/SPEED, 5+3T duration] to the user.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            //user.hp -= Math.round(user.max_health / 10);
            const damage = {
                damage: user.max_health / 20,
                crit: false,
                eva: false,
                note: "self-inflicted damage"
            }
            const message = [[`<br>${user.name} forms a covenant with darkness..`, 1],
                            [`<br>${user.name} took damage! (${user.max_health / 20})`]];
            mainView.displayMessagesDelayed(message, "battle", () => {
                user.health -= damage.damage;

                const plr = type == "enemy" ? target : user;
                const enemy = type == "enemy" ? user : target;
                Combat.uploadChanges(plr, enemy); // this funtion is needed because we are attacking a copy of playerFighter when we use skills.

                const buff = {...commonBuffs.matkup};
                buff.duration = 6;
                const buff2 = {...commonBuffs.atkup};
                buff2.duration = 6;
                const buff3 = {...commonBuffs.spdup};
                buff3.duration = 6;


                // if player is needed to apply buffs, instead of user/target use ** (type == 'player' ? Combat.getPlayer() : user) **
                for (var i = 0; i < 3; i++) {
                    Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    Combat.applyBuff(buff2, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                    Combat.applyBuff(buff3, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                }

                /* ^ ternary used to get playerFighter if the player is having the buff applied, since otherwise we are applying the buff
                to getPlayerAdd which is pointless */


                skills.finish("dark_pact", damage, type);

            })

        },

        cost: (user, target) => {
            if (user.health > user.max_health / 20 && user.mana >= 18) { return true } else { return "Insufficient health/mana!"}
        }
    },

    dark_howl: {
        name: 'dark howl',
        description: "<b>Cost: 15 mana</b> - The user lets out a howl imbued with malevolent magic. Deals low magical dark damage and has a 40% chance each to apply" +
        " <u>Fear</u> [-100% evasion, -20% SPD, -10% ATK/DEF/MATK/MDEF], <u>Dark Curse</u> [+70% dark defence], and <u>Elemental Weaken</u>" +
        " [-10% all elemental offences]. Each debuff lasts 2 turns and stacks twice.",
        off_stat: 'matk',
        def_stat: 'mdef',
        off_element: 'dark',
        def_element: 'dark',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 0.6,
        use: (user, target, type) => {
            user.mana = user.mana - 15; // COST OF USING THE SKILL
            const skill = skills.dark_howl// need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            const message = skills.prepareAttackMessage(user.name, target.name, `<Br>${user.name} lets out a dark howl!`, damage);
            mainView.displayMessagesDelayed(message, "battle", () => {
                target.health -= damage.damage;
                
                const debuff = {
                    name: "fear",
                    duration: 2,
                    def: -0.1,
                    mdef: -0.1,
                    matk: -0.1,
                    atk: -0.1,
                    speed: -0.2,
                    evasion: -1,
                    element: "dark",
                    types: ["debuff"],
                    apply_text:" is rapt with fear!",
                    max_stacks: 2
                }

                const debuff2 = {
                    name: "dark curse",
                    element: "dark",
                    types: ["debuff"],
                    apply_text:" is cursed by darkness!",
                    elemental: {
                        defence: {
                            dark: 70
                        },
                        offence: {}
                    },
                    duration: 2,
                    max_stacks: 2
                }

                const debuff3 = {
                    name: "elemental weaken",
                    element: "dark",
                    types: ["debuff"],
                    apply_text:"'s elemental strength has decreased!'",
                    elemental: {
                        defence: {},
                        offence: {
                            physical: -10,
                            fire: -10,
                            water: -10,
                            earth: -10,
                            wind: -10,
                            thunder: -10,
                            dark: -10,
                            light: -10
                        }
                    },
                    duration: 2,
                    max_stacks: 2
                }

                // if player is needed to apply buffs, instead of user/target use ** (type == 'player' ? Combat.getPlayer() : user) **
                if (damage.eva == false) {
                    Combat.applyBuff(debuff, 40, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                    Combat.applyBuff(debuff2, 40, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                    Combat.applyBuff(debuff3, 40, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                }
                /* ^ ternary used to get playerFighter if the player is having the buff applied, since otherwise we are applying the buff
                to getPlayerAdd which is pointless */
                
                const plr = type == "enemy" ? target : user;
                const enemy = type == "enemy" ? user : target;
                Combat.uploadChanges(plr, enemy); // this funtion is needed because we are attacking a copy of playerFighter when we use skills.
               
                skills.finish("dark_howl", damage, type);
               
            })
        },
        cost: (user, target) => {
            if (user.mana >= 15) { return true } else { return "Insufficient mana!" };
        }
    },

    nox_curse: {
        name: 'nox curse',
        description: "<b>Cost: 20 mana</b> - The user curses the opponent, dealing moderate dark magical damage and removing all debuffs. For each debuff" +
        " previously applied, applies a stack of <u>Nox Curse</u> to the enemy [15% HP DOT, 2T duration, stacks to 99]." +
        " <u>Nox Curse</u> has a base 300% apply chance. This skill's effects will proc even if the skill misses.",
        off_stat: 'matk',
        def_stat: 'mdef',
        off_element: 'dark',
        def_element: 'dark',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 1.15,
        use: (user, target, type) => {
            user.mana = user.mana - 10; // COST OF USING THE SKILL
            const skill = skills.nox_curse // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            const message = skills.prepareAttackMessage(user.name, target.name, `<Br>${user.name} curses the opponent!`, damage);
            mainView.displayMessagesDelayed(message, "battle", () => {
                target.health -= damage.damage;
                
                const debuff = {
                    name: "nox curse",
                    duration: 2,
                    damage: ["percentile", 15],
                    element: "dark",
                    types: ["debuff"],
                    apply_text:" is cursed by the shadows...",
                    max_stacks: 99
                }

                const debuffs = JSON.parse(JSON.stringify(target.debuffs)); // generating a copy to remove buffs from
                while (debuffs.length > 0) {
                    var random = Math.round(Math.random() * debuffs.length) - 1;
                    if (random < 0) { random = 0 } // dont want negative index
                    if (debuffs[random].hasOwnProperty("unstrippable")) {
                        debuffs.splice(random, 1);
                    } else {
                        Combat.stripBuff((type == "player" ? Combat.getEnemy().debuffs : Combat.getPlayer().debuffs), debuffs[random].name);
                        Combat.applyBuff(debuff, 100, (type == 'player' ? Combat.getPlayer() : Combat.getEnemy()), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                        debuffs.splice(random, 1);
                    }
                }
                
                const plr = type == "enemy" ? target : user;
                const enemy = type == "enemy" ? user : target;
                Combat.uploadChanges(plr, enemy); // this funtion is needed because we are attacking a copy of playerFighter when we use skills.
               
                skills.finish("nox curse", damage, type);
               
            })
        },
        cost: (user, target) => {
            if (user.mana >= 20) { return true } else { return "Insufficient mana!" };
        }
    },
 // ---

    boar_rush: {
        name: 'boar rush',
        description: 'The user rushes at the enemy and strikes them powerfully. Deals notable physical damage and applies' +
        ' <u>Boar Rush</u> [+10% SPD, 4T duration, stacks to 3] to the user.',
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 1.2,
        use: (user, target, type) => {
            const skill = skills.boar_rush // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            const message = skills.prepareAttackMessage(user.name, target.name, `<Br>${user.name} rushed at the enemy!`, damage);
            mainView.displayMessagesDelayed(message, "battle", () => {
                target.health -= damage.damage;

                const buff = {
                    name: "boar rush",
                    duration: 4,
                    speed: 0.1,
                    element: "physical",
                    types: ["buff"],
                    apply_text:"'s speed increased!",
                    max_stacks: 3
                }

                Combat.applyBuff(buff, 100, (type == 'player' ? user : Combat.getPlayer()), (type == 'player' ? Combat.getPlayer() : Combat.getEnemy()), "buffs");

                if (type == 'player') {
                    Combat.getPlayer().sp += 5;
                    if (Combat.getPlayer().sp > Combat.getPlayer().max_sp) { Combat.getPlayer().sp > Combat.getPlayer().max_sp };
                    mainView.displayMessage(`${user.name} gained 5 SP!`)
                } else {
                    Combat.getEnemy().sp += 5;
                    if (Combat.getEnemy().sp > Combat.getEnemy().max_sp) { Combat.getEnemy().sp > Combat.getEnemy().max_sp };
                    mainView.displayMessage(`${user.name} gained 5 SP!`) 
                }
                
                const plr = type == "enemy" ? target : user;
                const enemy = type == "enemy" ? user : target;
                Combat.uploadChanges(plr, enemy); // this funtion is needed because we are attacking a copy of playerFighter when we use skills.
            
                skills.finish("boar_rush", damage, type);
            
            })
        },
        cost: (user, target) => {
            { return true }
        }
    },

    boar_strike: {
        name: 'boar strike',
        description: 'The user strikes the enemy with their axe. Deals above average physical damage and applies <u>Boar Strike</u>' +
        ' [+10% ATK, 4T duration, stacks to 3] to the user.',
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 1.4,
        use: (user, target, type) => {
            const skill = skills.boar_strike // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            const message = skills.prepareAttackMessage(user.name, target.name, `<Br>${user.name} crashed their axe into the enemy!`, damage);
            mainView.displayMessagesDelayed(message, "battle", () => {
                target.health -= damage.damage;

                const buff = {
                    name: "boar strike",
                    duration: 4,
                    atk: 0.1,
                    element: "physical",
                    types: ["buff"],
                    apply_text:"'s attack increased!",
                    max_stacks: 3
                }

                Combat.applyBuff(buff, 100, (type == 'player' ? user : Combat.getPlayer()), (type == 'player' ? Combat.getPlayer() : Combat.getEnemy()), "buffs");

                if (type == 'player') {
                    Combat.getPlayer().sp += 5;
                    if (Combat.getPlayer().sp > Combat.getPlayer().max_sp) { Combat.getPlayer().sp > Combat.getPlayer().max_sp };
                    mainView.displayMessage(`${user.name} gained 5 SP!`)
                } else {
                    Combat.getEnemy().sp += 5;
                    if (Combat.getEnemy().sp > Combat.getEnemy().max_sp) { Combat.getEnemy().sp > Combat.getEnemy().max_sp };
                    mainView.displayMessage(`${user.name} gained 5 SP!`) 
                }
                
                const plr = type == "enemy" ? target : user;
                const enemy = type == "enemy" ? user : target;
                Combat.uploadChanges(plr, enemy); // this funtion is needed because we are attacking a copy of playerFighter when we use skills.
            
                skills.finish("boar_strike", damage, type);
            
            })
        },
        cost: (user, target) => {
            { return true }
        }
    },
    
    flare_impact: {
        name: 'flare impact',
        description: '<b>Cost: 20 SP</b> - The user ignites their axe and smashes the enemy, dealing high physical fire damage' +
        ' and applying <u>Burning</u> [3% HP DOT, 5T duration] to the enemy.',
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'fire',
        def_element: 'fire',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 2.1,
        use: (user, target, type) => {
            user.sp = user.sp - 20; // COST OF USING THE SKILL
            const skill = skills.flare_impact // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            const message = skills.prepareAttackMessage(user.name, target.name, `<Br>${user.name} ignited their axe and smashed the enemy!`, damage);
            mainView.displayMessagesDelayed(message, "battle", () => {
                target.health -= damage.damage;
                
                const buff = {
                    name: "burning",
                    duration: 5,
                    element: "fire",
                    types: ["debuff"],
                    apply_text: " is burning!",
                    damage: ["percentile", 3],
                    max_stacks: 1,
                }
                // if player is needed to apply buffs, instead of user/target use ** (type == 'player' ? Combat.getPlayer() : user) **
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                
                
                /* ^ ternary used to get playerFighter if the player is having the buff applied, since otherwise we are applying the buff
                to getPlayerAdd which is pointless */
                
                const plr = type == "enemy" ? target : user;
                const enemy = type == "enemy" ? user : target;
                Combat.uploadChanges(plr, enemy); // this funtion is needed because we are attacking a copy of playerFighter when we use skills.
               
                skills.finish("flare_impact", damage, type);
               
            })
        },
        cost: (user, target) => {
            if (user.sp >= 20) { return true } else { return "Insufficient mana!" };
        }
    },

    ignis_destroyer: {
        name: 'ignis destroyer',
        description: 'The user strikes the enemy with a great fireball and a flaming axe simulatenously, dealing massive fire' +
        ' physical damage.',
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'fire',
        def_element: 'fire',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 3.2,
        use: (user, target, type) => {
            const skill = skills.ignis_destroyer // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod, false);
            const message = skills.prepareAttackMessage(user.name, target.name, `<Br>${user.name} attempts to obliterate the enemy with flames!`, damage);
            mainView.displayMessagesDelayed(message, "battle", () => {
                target.health -= damage.damage;

                
                const plr = type == "enemy" ? target : user;
                const enemy = type == "enemy" ? user : target;
                Combat.uploadChanges(plr, enemy); // this funtion is needed because we are attacking a copy of playerFighter when we use skills.
               
                skills.finish("ignis_destroyer", damage, type);
               
            })
        },
        cost: (user, target) => { return true }
    },

    boar_haste: {
        name: 'boar haste',
        description: 'The user enchants their speed with powerful magic, applying <u>Boar Haste</u> [+50% SPD, unstrippable, 999T duration] ' +
        ' to themselves.',
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const damage = {
                damage: 0,
                crit: false,
                eva: false
            }
            const message = [[`<br>${user.name} enchants themselves with powerful magic!`, 1]];
            mainView.displayMessagesDelayed(message, "battle", () => {
                target.health -= damage.damage;

                const plr = type == "enemy" ? target : user;
                const enemy = type == "enemy" ? user : target;
                Combat.uploadChanges(plr, enemy); // this funtion is needed because we are attacking a copy of playerFighter when we use skills.

                const buff = {
                    name: "boar haste",
                    speed: 0.5,
                    element: "physical",
                    types: ["buff"],
                    apply_text: "'s speed increased greatly!",
                    max_stacks: 1,
                    unstrippable: true,
                    duration: 999
                }
                // if player is needed to apply buffs, instead of user/target use ** (type == 'player' ? Combat.getPlayer() : user) **
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
                /* ^ ternary used to get playerFighter if the player is having the buff applied, since otherwise we are applying the buff
                to getPlayerAdd which is pointless */


                skills.finish("camoflague", damage, type);

            })

        },

        cost: (user, target) => {
            if (user.mana >= 12) { return true } else { return "Insufficient mana!"}
        }
    },

    true_cleanse: {
        name: 'true cleanse',
        description: '<b>Cost: 10 SP</b> - The user cleanses their spirit completely. Removes all buffs and debuffs from the user.',
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'none',
        def_element: 'none',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            user.sp = user.sp - 10;
            const damage = {
                damage: 0,
                crit: false,
                eva: false
            }
            const message = [[`<br>${user.name} cleanses themselves completely.`, 1]];
            mainView.displayMessagesDelayed(message, "battle", () => {
                target.health -= damage.damage;

                var buffs;
                var debuffs;
                if (type == 'player') {
                    buffs = Combat.getPlayer().buffs;
                    debuffs = Combat.getEnemy().debuffs;
                } else {
                    buffs = Combat.getEnemy().buffs;
                    debuffs = Combat.getEnemy().debuffs;
                }
                for (var i = 0; i < buffs.length; i++) {
                    const buff = buffs[i];
                    if (Combat.stripBuff((type == "player" ? Combat.getPlayer().buffs : Combat.getEnemy().buffs), buff.name) == true) {
                        i--;
                    }
                }
                for (var i = 0; i < debuffs.length; i++) {
                    const buff = debuffs[i];
                    if (Combat.stripBuff((type == "player" ? Combat.getPlayer().debuffs : Combat.getEnemy().debuffs), buff.name) == true) {
                        i--;
                    }
                }
                const plr = type == "enemy" ? target : user;
                const enemy = type == "enemy" ? user : target;
                Combat.uploadChanges(plr, enemy); // this funtion is needed because we are attacking a copy of playerFighter when we use skills.

                skills.finish("true_cleanse", damage, type);

            })

        },

        cost: (user, target) => { if (user.sp >= 10) { return true } else { return "Insufficient SP!"} }
    },

    
    

}


// -- COMMON BUFFS/DEBUFFS -- \\
const commonBuffs = {
    defdown: {
        name: "DEF down",
        def: -0.1,
        duration: 5,
        element: "none",
        types: ["debuff"],
        apply_text: "'s defence was decreased!",
        max_stacks: 5,
    },
    
    defup: {
        name: "DEF up",
        def: 0.1,
        duration: 5,
        element: "none",
        types: ["buff"],
        apply_text: "'s defence was increased!",
        max_stacks: 5,
    },
    
    mdefdown: {
        name: "MDEF down",
        mdef: -0.1,
        duration: 5,
        types: ["debuff"],
        apply_text: "'s magical defence was decreased!",
        max_stacks: 5
    },
    
    mdefup: {
        name: "MDEF up",
        mdef: 0.1,
        duration: 5,
        apply_text: "'s magical defence was increased!",
        max_stacks: 5
    },

    atkup: {
        name: "ATK up",
        atk: 0.1,
        duration: 5,
        types: ["buff"],
        apply_text: "'s attack was increased!",
        max_stacks: 5
    },

    matkup: {
        name: "MATK up",
        matk: 0.1,
        duration: 5,
        types: ["buff"],
        apply_text: "'s magical attack was increased!",
        max_stacks: 5
    },

    spdup: {
        name: "SPEED up",
        speed: 0.1,
        duration: 5,
        element: "none",
        types: ["buff"],
        apply_text: "'s speed was increased!",
        max_stacks: 5
    },


}


// ~~~MODE UTILITIES~~~ //

// Pass in state[turn][player/enemy]
export const getSkill = (actions, skillName) => {
    var counter = 0;
    actions.forEach(action => {
        if (action.skill == skillName) { counter++ };
    })
    return counter;
}

// Pass in state[turn][player/enemy]
// Returns an array of all the damage dealt that turn by selected user
export const getDamage = actions => {
    var counter = [];
    actions.forEach(action => {
        counter.push(action.damage.damage);
    })
    return counter;
}

export const buffCount = buffs => {
    var buffsCopy = JSON.parse(JSON.stringify(buffs));
    //console.log("PRINTING BUFFS COPY");
    //console.log(buffsCopy);
    //console.log(buffs);
    var counter = 0;
    for (var y = 0; y < buffsCopy.length; y++) {
        if (y < 0) { y = 0 };
        if (buffsCopy.length == 0) { break };
        //console.log(`Y IS ${y}`)
        //console.log(buffsCopy.length);
        var buffName = buffsCopy[y].name; // get name of buff
        counter += 1 // increment counter
        for (var x = 0; x < buffsCopy.length; x++) { // remove all other instances of that buff so they are not counted
            //console.log(`buffscopy[x].name = ${buffsCopy[x].name}, bfuffanem ${buffName}`)
            if (buffsCopy[x].name == buffName) {
                buffsCopy.splice(x, 1)
                x -= 1; // so we don't miss any buffs
                y -= 1;
            }
        }
    }
    return counter;
}   

export const stackCount = buffs => { // like above (counts buff count) but counts all stacks. Sorry i am lazy :(
    var buffsCopy = JSON.parse(JSON.stringify(buffs));
    var counter = 0;
    buffsCopy.forEach(buff => {
        var buffName = buff.name;
        counter += buff.stacks; 
        for (var x = 0; x < buffsCopy.length; x++) {
            //console.log(`buffscopy[x].name = ${buffsCopy[x].name}, bfuffanem ${buffName}`)
            if (buffsCopy[x].name == buffName) {
                buffsCopy.splice(x, 1)
                x -= 1 // so we only count one stack
                break;
            }
        }
    })
    return counter;
}

export const findTimesUsed = (type, skillName) => {
    //console.log(`find times used called`);
    const state = Combat.state;
    var counter = 0;
    //console.log(state);
    //console.log(state[Combat.turn - 1][type])
    state[Combat.turn - 1][type].forEach(cur => {
        //console.log(`cur name is ${cur.skill}`)
        if (cur.skill == skillName) {
            counter += 1;
        }
    });
    return counter;
}


// Use a random skill
export const useRandom = (enemy, skillsAvailable) => {
    var canUse = false;
    while (canUse == false) {
        //console.log("USE RANDOM LOOP RUNNING");
        var random = Math.floor(Math.random() * skillsAvailable.length);
        if (skills[skillsAvailable[random]].cost(enemy) == true) {
            canUse = true;
            skills[skillsAvailable[random]].use(Combat.getEnemy(), Combat.getPlayer(), "enemy");
        }
    } 
}



// EXTRA STUFF
/*

BUFF APPLY SCRIPT

            const buff = {
                name: "lower anima",
                duration: 3,
                def: 0.2,
                mdef: 0.2,
                matk: 0.2,
                mdef: 0.2,
                element: "earth",
                types: ["buff"],
                apply_text: " is blessed by healing magic!",
                max_stacks: 2,
            };
            const func = () => {
                Combat.applyBuff(buff, 100, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getPlayer() : user), "buffs");
            };
            skills.applyBuff(type, func, "self", false, false, plr, enemy);

------------------------------------

ATTACK SKILL
    attack: {
        name: 'attack',
        description: "Strike the enemy, dealing moderate physical damage. Attack element is based on the element of the equipped weapon.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'weapon',
        def_element: 'weapon',
        off_mod: 1,
        def_mod: 1,
        dmg_mod: 1,
        use: (user, target, type) => {
            const skill = skills.attack // need to change for each skill
            const damage = skills.calcDamage(user, target, skill.off_stat, skill.def_stat, skill.off_element, skill.def_element, skill.off_mod, skill.def_mod, skill.dmg_mod);
            
            skills.prepareAttackMessage(user.name, target.name, `<br>${user.name} struck the enemy!`, damage);
            
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;

            const stateDamage = {
                damage: damage,
                type: ["attack"],
                target: "opponent"
            }

            skills.dealDamage(type, damage.damage, "opponent", [skill.name, stateDamage, type], true, plr, enemy);

        },

        cost: (user, target) => {
            return true;
        }
    },


-----------------------------------------------------------

OLD ANALYSE
--
    check: { 
        name: 'check',
        description: "Reveals the stats of an enemy upon use.",
        off_stat: 'atk',
        def_stat: 'def',
        off_element: 'physical',
        def_element: 'physical',
        off_mod: 0,
        def_mod: 0,
        dmg_mod: 0,
        use: (user, target, type) => {
            const plr = type == "enemy" ? target : user;
            const enemy = type == "enemy" ? user : target;
            const state = ["guard", {
                damage: 0,
                additionalInfo: {
                    type: ["debuff"],
                    target: "opponent"
                }
            }, type];
            if (Combat.checkStacks(target.debuffs, "analysed") > 0) {
                skills.pushMessagesToState(["Analysing..."]);
                skills.pushCustomFunc(type, () => {Combat.displayStats(target)}, target, false, false, plr, enemy);
                skills.pushWaitForInput(type, state, true);
            } else {
                skills.pushMessagesToState([`<br>${user.name} attempts to analyse the enemy... [Check]`]);

                const buff = {
                        name: "analysed",
                        duration: 2,
                        element: "physical",
                        types: ["debuff"],
                        apply_text: " has been analysed!",
                        max_stacks: 1,
                        desc: "Allows for analysis of an enemy."
                };

                const func = () => {
                    Combat.applyBuff(buff, 150, (type == 'player' ? Combat.getPlayer() : user), (type == 'player' ? Combat.getEnemy() : Combat.getPlayer()), "debuffs");
                }
                skills.applyBuff(type, func, target, state, true, plr, enemy);
                
            }

        },

        cost: (user, target) => {
            return true;
        }
    },
*/

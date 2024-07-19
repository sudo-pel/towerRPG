import * as mainView from '../views/mainView';
import * as statView from '../views/statView';
import { skills } from './skills';
import * as gameData from './data';
import { settings } from './data';
import { elementColours, tutorialMessages, separator } from '../views/baseView';
import { clamp } from './baseModel';
import { updateDisplay, tutorialMessage } from './baseModel';
import { basename } from 'path';
import { mainLoop } from '../index';
import { ai, mode } from './enemies';
import { addItem, displayDetails, removeItem, getItemIdentfierByName } from './items';
import { items } from './items';
import { getNpcDetails } from './npc';
import { musicHandler } from './music';
import { saveGame } from './settings';

// NOTE TO SELF: FIX DAMAGE SCALING, BUFFS ARE TOO POWERFUL

export const Combat = {

    battleProcessing(player, enemy, endFunction, additionalArgs = {
        changeLevel: true, levelCap: false, addLevels: false
    }) {
        mainView.displayMessage("<br>---------------------------------------")
        mainView.displayMessage(`<br>Battle between ${player.name} and ${enemy.stats.name} has begun!`)
        // initialise player and enemy object (add buff/debuffs, add stat modifiers to objects)
        const playerCopy = JSON.parse(JSON.stringify(player)); // see below about enemy copy
        this.playerFighter = this.addCombatStats(playerCopy.stats, playerCopy.name, "player", additionalArgs); // redundant but left for consistency
        const enemyCopy = JSON.parse(JSON.stringify(enemy)); // making a deep copy of the enemy so we don't modify its stats..
        //console.log(enemyCopy);// in enemies.js. 
        this.enemy = this.addCombatStats(enemyCopy.stats, enemyCopy.stats.name, "enemy", additionalArgs);
        this.turn = 0;
        this.state = []; // state holds several info about turns such as the attacks used and the such.

        this.endFunction = endFunction // save the function to run at the end of the battle to the object

        statView.updateStatsCombat(Combat.getPlayerAdd(Combat.playerFighter)); // doesn't seem to work here, don't know y

        // -- MUSIC -- \\
        var battleMusic = "battle$"
        if (additionalArgs.battleMusic != undefined) { battleMusic = additionalArgs.battleMusic };
        if (getNpcDetails().music != undefined && additionalArgs.overlayMusic == true) {
        } else {
            musicHandler.playMusic(battleMusic);
        }

        // -- TUTORIAL(s) -- \\
        /* #region */
        const tutorials = gameData.data.tutorials;
        if (tutorials.includes('battle_1') == false && gameData.data.special.doingTutorial == true) {
            gameData.data.tutorials.push('battle_1');
            saveGame();
            mainView.displayWaitForInput(tutorialMessages.battle_1, Combat.combatLoop)
        }
        else if (tutorials.includes('battle_2') == false && enemy.stats.name == "Young Wolf" && gameData.data.special.doingTutorial == true) {
            gameData.data.tutorials.push('battle_2');
            saveGame();
            mainView.displayWaitForInput(tutorialMessages.battle_2, Combat.combatLoop)
        }
        else if (tutorials.includes('battle_3') == false && enemy.stats.name == "Dreadful Wolf" && gameData.data.special.doingTutorial == true) {
            gameData.data.tutorials.push('battle_3');
            saveGame();
            mainView.displayWaitForInput(tutorialMessages.battle_3, Combat.combatLoop)
        }
        else if (tutorials.includes('battle_4') == false && enemy.stats.name == "???" && gameData.data.special.doingTutorial == true) {
            gameData.data.tutorials.push('battle_4');
            saveGame();
            mainView.displayWaitForInput(tutorialMessages.battle_4, Combat.combatLoop)
        }
        else {
            this.combatLoop();
        }
        /* #endregion */
    },

    addCombatStats(object, name, type, additionalArgs = {
        changeLevel: true, levelCap: false, addLevels: false
    }) {
        object.name = name;
        object.health_mod = 0;
        object.atk_mod = 0;
        object.def_mod = 0;
        object.matk_mod = 0;
        object.mdef_mod = 0;
        object.crit_chance_mod = 0;
        object.crit_damage_mod = 0;
        object.effectiveness_mod = 0;
        object.resistance_mod = 0;
        object.evasion_mod = 0;
        object.speed_mod = 0;
        object.actions = 0;
        object.buffs = [];
        object.debuffs = [];
        object.mitigation = 0;

        // only run if entity is a player
        if (type == "player") {
            //object.max_mana = object.max_mana + Combat.getEquipStat(object, "max_mana");
            object.mana = object.current_mana;
            //object.max_sp = object.max_sp + Combat.getEquipStat(object, "max_sp");
            object.sp = 0;
            //object.max_stamina = object.max_stamina + Combat.getEquipStat(object, "max_stamina");
            object.stamina = object.current_stamina;
            object.max_health = this.getMaxHealth(object);
            object.health = object.current_health; // prevent healing inbetween battles
            object.actionsTaken = 0;
           //console.log("LOGGING SKILLS");
           //console.log(object.skills);
            object.skillsList = object.skills.map(skillCode => {
                if (skillCode != "guard" && skillCode != "attack") {
                    var skillCodeParsed = skillCode.split('-') // splits into an array of the discipline and index
                    var discipline = skillCodeParsed[0];
                    var index = skillCodeParsed[1];
                    return gameData.disciplines[discipline].skills[index].name;
                } else {
                    return skillCode;
                }
            });
            object.type = "player";
           //console.log(object.skillsList);
            //console.log("logging skillslist");
            //console.log(object.skillsList);
        } else {
            object.modeBattle = "normal";
            object.mana = object.max_mana;
            object.stamina = object.max_stamina;
            object.health = object.max_health;
            object.sp = 0;
            object.level = object.base_level;
            object.actionsTaken = 0;
            object.type = "enemy";

            if (additionalArgs.hasOwnProperty("modifyEnemy")) {
                const keysArr = Object.keys(additionalArgs.modifyEnemy);
                for (var i  = 0; i < keysArr.length; i++) {
                    const property = keysArr[i];
                    object[property] = additionalArgs.modifyEnemy[property];
                }
            }

            // we need to increase the enemy's stats based on level
            // -- LEVEL SCALING -- \\
            // Each enemy has a base level, the level they are designed to be at.
            // If the player is a higher level, the enemy stats will increase accordingly:
            // 10 HP/level
            // 3 in all other stats/level
            // To prevent the player from becoming overpowered too quickly.
            // EXP will increase by 10 per level
            const enemyBaseLevel = object.base_level;
            const playerLevel = gameData.data.player.level;
            var intendedLevel;
            //console.log(`changelveel is ${changeLevel}`)

            const changeLevel = additionalArgs.changeLevel == undefined ? true : additionalArgs.changeLevel;
            const levelCap = additionalArgs.levelCap == undefined ? false : additionalArgs.levelCap;
            const addLevels = additionalArgs.addLevels == undefined ? false : additionalArgs.addLevels;

            if (changeLevel == false) { intendedLevel = enemyBaseLevel } else {
                if (changeLevel == true) {
                    intendedLevel = playerLevel;
                } else {
                    intendedLevel = changeLevel;
                }
            };
            if (addLevels != false) {
                if (intendedLevel < playerLevel + addLevels) { intendedLevel = playerLevel + addLevels };
            }
            if (levelCap != false) { // cap enemy level
                if (intendedLevel > levelCap) { intendedLevel = levelCap };
            }
            //console.log(`indetened ${intendedLevel}`)
            if (intendedLevel > enemyBaseLevel) {
                const difference = intendedLevel - enemyBaseLevel;
                object.level = object.level + difference;
                object.health = object.health + (difference * 10);
                object.max_health = object.health; // otherwise health becomes > max health
                object.atk = object.atk + (difference * 3);
                object.def = object.def + (difference * 3);
                object.matk = object.matk + (difference * 3);
                object.mdef = object.mdef + (difference * 3);
                object.speed = object.speed + (difference * 3);
                object.exp = object.exp + (difference * 10);

            }

            delete object.base_level; // so it doesn't come up when displaying stats of enemy

        }

        return object;

    },

    getEquips(player) {
        const stats = {
            atk: 0,
            def: 0,
            matk: 0,
            mdef: 0,
            crit_chance: 0,
            crit_damage: 0,
            effectiveness: 0,
            resistance: 0,
            evasion: 0,
            speed: 0,
            mitigation: 0,
            max_mana: 0,
            max_sp: 0,
            max_stamina: 0
        }
        Object.keys(player.equips).forEach(cur => {
            if (player.equips[cur] != undefined) {
                Object.keys(items[player.equips[cur]]).forEach(stat => { 
                    if (stats.hasOwnProperty(stat)) {
                        stats[stat] += items[player.equips[cur]][stat]
                    }
                })
            }

        })
        return stats
    },

    getEquipStat(player, param) {
        var sum = 0;
        Object.keys(player.equips).forEach(cur => {
            if (player.equips[cur] != undefined) {
                Object.keys(items[player.equips[cur]]).forEach(stat => {
                    if (stat == param) {
                        sum += items[player.equips[cur]][param]
                    }
                })
            }

        })

        return sum;
    },

    getMaxHealth(player) { // this needs to be separate because health is collected at different times to the other stats
        const stats = {
            health: 0
        }

        stats.health += this.getEquipStat(gameData.data.player.stats, "health"); // don't like accessing player like this but no choice

        stats.health += gameData.data.player.sp_investment.health * 20;

        stats.health += ( gameData.data.player.level - 1 ) * 20

        return player.health + stats.health;
        

    },

    getEquipsElements(player) {
        const stats = {
            offence: {
                physical: 0,
                fire: 0,
                water: 0,
                earth: 0,
                wind: 0,
                thunder: 0,
                dark: 0,
                light: 0
            },
            defence: {
                physical: 0,
                fire: 0,
                water: 0,
                earth: 0,
                wind: 0,
                thunder: 0,
                dark: 0,
                light: 0
            }
        };

        const equips = player.equips;

        Object.keys(equips).forEach(equip => {
            if (equips[equip] != undefined) {
                const item = items[equips[equip]];
                Object.keys(item.elemental.offence).forEach(element => {
                    if (element != "all") {
                        stats.offence[element] += item.elemental.offence[element];
                    } else {
                        for (var ele in stats.offence) { stats.offence[ele] += item.elemental.offence[element]} // adding 'all'
                    }
                    stats.offence[element] = clamp(stats.offence[element], gameData.constants.minElementMod, gameData.constants.maxElementMod);
                });
                Object.keys(item.elemental.defence).forEach(element => {
                    if (element != "all") {
                        stats.defence[element] += item.elemental.defence[element];
                    } else {
                        for (var ele in stats.defence) { stats.defence[ele] += item.elemental.defence[element]};
                    }
                    stats.defence[element] = clamp(stats.defence[element], gameData.constants.minElementMod, gameData.constants.maxElementMod);
                });
            }
        })

        return stats;
    },

    healthCheck() { // check if any combatants are dead and end the battle if true
        if (Combat.playerFighter.health <= 0) {
            //console.log('fight over');
            statView.updateStatsCombat(Combat.getPlayerAdd(Combat.playerFighter));
            return "enemy";
        } else if (Combat.enemy.health <= 0) {
            //console.log('fight over');
            statView.updateStatsCombat(Combat.getPlayerAdd(Combat.playerFighter));
            return "player";
        }
        //console.log('fight not over');
        return false;
    },

    uploadChanges(plr, enemy) {
       //console.log({...Combat.playerFighter});

        Combat.playerFighter.health = plr.health;
        Combat.enemy.health = enemy.health;

        Combat.playerFighter.mana = plr.mana;
        Combat.playerFighter.sp = plr.sp;
        Combat.playerFighter.stamina = plr.stamina;

       //console.log({...Combat.playerFighter});
    },

    calcBuffs(stat, object) {
        var sum = 0;
        const buffs = object.buffs;
        if (buffs.length > 0) {
            Object.keys(buffs).forEach(buff => {
                if (buffs[buff].hasOwnProperty(stat)) {
                    sum += buffs[buff][stat] * buffs[buff].stacks;
                }
            })
        }
        return sum
    },

    calcDebuffs(stat, object) {
        var sum = 0;
        const debuffs = object.debuffs;
        Object.keys(debuffs).forEach(debuff => {
            if (debuffs[debuff].hasOwnProperty(stat)) {
                sum += debuffs[debuff][stat] * debuffs[debuff].stacks;
            }
        })
        return sum
    },

    calcMod(stat, object) {
        const constants = gameData.constants;
        var sum = 0;
        sum += Combat.calcBuffs(stat, object);
        sum += Combat.calcDebuffs(stat, object);
        if (["resistance", "effectiveness"].includes(stat)) {
        } else {
            sum = clamp(sum, constants.minBuffMod - 1, constants.maxBuffMod);
        }
        return sum;
    },

    calcElementBuffs(object) {
        const sum = {
            offence: {
                none: 0,
                physical: 0,
                fire: 0,
                water: 0,
                earth: 0,
                wind: 0,
                thunder: 0,
                dark: 0,
                light: 0
            },
            defence: {
                none: 0,
                physical: 0,
                fire: 0,
                water: 0,
                earth: 0,
                wind: 0,
                thunder: 0,
                dark: 0,
                light: 0
            }
        };

        const buffs = object.buffs;

        buffs.forEach(cur => {
            if (cur.hasOwnProperty('elemental')) {
                if (cur.elemental.hasOwnProperty('offence')) {
                    Object.keys(cur.elemental.offence).forEach(el => {
                        if (el != "all") {
                            sum.offence[el] += cur.elemental.offence[el] * cur.stacks;
                        } else {
                            for (var ele in sum.offence) { sum.offence[ele] += cur.elemental.offence[el] * cur.stacks };
                        }
                        sum.offence[el] = clamp(sum.offence[el], gameData.constants.minElementMod, gameData.constants.maxElementMod);
                        //console.log(`offensive elemental sum is ${sum.offence[el]}`);
                    })
                }
                if (cur.elemental.hasOwnProperty('defence')) {
                    Object.keys(cur.elemental.defence).forEach(el => {
                        if (el != "all") {
                            sum.defence[el] += cur.elemental.defence[el] * cur.stacks;
                        } else {
                            for (var ele in sum.defence) { sum.defence[ele] += cur.elemental.defence[el] * cur.stacks };
                        }
                        sum.defence[el] =clamp(sum.defence[el], gameData.constants.minElementMod, gameData.constants.maxElementMod);
                        //console.log(`defensive elemental sum is ${sum.defence[el]}`);
                    })
                }
            }
        })

        const debuffs = object.debuffs;

        debuffs.forEach(cur => {
            if (cur.hasOwnProperty('elemental')) {
                if (cur.elemental.hasOwnProperty('offence')) {
                    Object.keys(cur.elemental.offence).forEach(el => {
                        if (el != "all") {
                            sum.offence[el] += cur.elemental.offence[el] * cur.stacks;
                        } else {
                            for (var ele in sum.offence) { sum.offence[ele] += cur.elemental.offence[el] * cur.stacks };
                        }
                        sum.offence[el] = clamp(sum.offence[el], gameData.constants.minElementMod, gameData.constants.maxElementMod);
                    })
                }
                if (cur.elemental.hasOwnProperty('defence')) {
                    Object.keys(cur.elemental.defence).forEach(el => {
                        if (el != "all") {
                            sum.defence[el] += cur.elemental.defence[el] * cur.stacks;
                        } else {
                            for (var ele in sum.defence) { sum.defence[ele] += cur.elemental.defence[el] * cur.stacks };
                        }
                        sum.defence[el] = clamp(sum.defence[el], gameData.constants.minElementMod, gameData.constants.maxElementMod);
                    })
                }
            }
        })
        return sum;
    },

    applyBuff(buff, chance, user, target, type, additionalArgs = {}) {

        //console.log("appl ");
        ///console.log(user);
        //console.log(target)

        // initialising additionalArgs variables
        var ignoreRes = false;
        
        if (additionalArgs.ignoreRes != undefined) {
            ignoreRes = additionalArgs.ignoreRes;
        }

        var eff, res;
        if (target == user || type == "buffs") {
            eff = 0;
            res = 0;
        }
        else {
            var user2 = user;
            var target2 = target;
            if (user.type == "player") {
                user2 = Combat.getPlayerAdd(user);
            }
            if (target.type == "player") {
                target2 = Combat.getPlayerAdd(target);
            }
            //console.log(user2);
            //console.log(target2);
            eff = clamp((user2.effectiveness + Combat.calcBuffs("effectiveness", user2) + Combat.calcDebuffs("effectiveness", user2)), 0, 999);
            res = clamp((target2.resistance + Combat.calcBuffs("resistance", target2) + Combat.calcDebuffs("resistance", target2)), 0, 999);
        };

        // ignore res skills
        if (ignoreRes == true) {
            res = 0;
        }

        chance = clamp(chance + eff, 0, 100);
        const roll = Math.round((Math.random() * 100)) + 1;
        const actualChance = chance - res;
        //console.log("Trying to applf:");
        //console.log(buff.name);
        //console.log(roll);
        //console.log(chance);
        //console.log(res);
        //console.log(actualChance);
        //console.log(roll <= chance);
        if (roll <= actualChance) {

            if (!buff.hasOwnProperty("stacks")) { buff.stacks = 1 }; // needed for applying the buff

            if (Combat.checkStacks(target[type], buff.name) == 0) {

                mainView.displayMessage(`${target.name}${buff.apply_text}`)
                if (type == 'buffs') {
                    target.buffs.push({...buff});
                } else {
                    target.debuffs.push({...buff});
                }
                statView.updateStatsCombat(Combat.getPlayerAdd(Combat.playerFighter));

            }
            else {
                const alreadyAppliedBuff = Combat.getBuff(target, buff.name);
                mainView.displayMessage(`${target.name}${buff.apply_text}`)
                alreadyAppliedBuff.stacks += buff.stacks;
                if (alreadyAppliedBuff.stacks > alreadyAppliedBuff.max_stacks) { alreadyAppliedBuff.stacks = alreadyAppliedBuff.max_stacks};
                if (alreadyAppliedBuff.duration < buff.duration) { alreadyAppliedBuff.duration = buff.duration};
            }
        } else if (roll <= chance) {
            //console.log("effect resisted");
            mainView.displayMessage('<span style="color:#9500D6">Effect resisted!</span>');
        } else {
            mainView.displayMessage('Effect not applied.');
        }

    },

    getBuff(object, buffName) {
        var buff;
        const buffsets = [object.buffs, object.debuffs];
        for (var index in buffsets) {
            const buffset = buffsets[index];
            for (var i = 0; i < buffset.length; i++) {
                if (buffset[i].name == buffName) { return buffset[i] };
            }
        }
    },

    stripBuff(object, buff) { // removes all stacks of a buff
        var stripped = false;
        for (var i = 0; i < object.length; i++) {
            const buff_i = object[i];
            if (buff_i.name == buff) {
                if (buff_i.hasOwnProperty("unstrippable")) {
                    return false;
                } else {
                    object.splice(i, 1);
                    stripped = true;
                    mainView.displayMessage(`${buff_i.name} removed.`)
                    i--;
                }
            }
        }
        return stripped;
    },

    buffCheck(object, afterwards) { // note - used for buffs AND debuffs. Checks buffs, debuffs and removes ones that have expired
        // tick any HOT/DOT
        const total = object.buffs.concat(object.debuffs);
        //console.log(`logging total`);
        //console.log(total)
       //console.log("buffcheck called");

        for (var index = total.length - 1; index >= 0; index--) { // just copied below code no reason to itr. backwards
            const buff = total[index];
            //console.log(`buffdamage ${buff.damage}`);
            if (buff.hasOwnProperty("damage")) {
                // do the DOT
                //console.log(`dot ${buff.damage}`)
                const dot = buff.damage;
                var damage;
                if (dot[0] == "percentile") {
                    damage = Math.round(object.max_health * (dot[1] / 100)) * buff.stacks;
                }
                if (dot[0] == "flat") {
                    damage = dot[1] * buff.stacks;
                }

                const msg1 = `<br>(${buff.name}) ${object.name} ${damage > 0 ? "lost" : "gained "} health! <span style="color:${elementColours[dot[2]]}">[${Math.abs(damage)}, ${dot[0]}]</span>`;
                //const msg2 = `${object.name}'s health remaining: ${object.health - damage}/${object.max_health}`; doesnt show right hp
                
                skills.pushMessagesToState([msg1], true, "push");
                skills.dealDamage(object.type, damage, "self", false, false, Combat.getPlayer(), Combat.getEnemy());
            }
            
            if (buff.hasOwnProperty("heal")) {
                // TBA
            }

            if (buff.hasOwnProperty("onTick")) {
                for (var i = 0; i < buff.stacks; i++) {
                    buff.onTick(object.type, object, Combat.getPlayer(), Combat.getEnemy());
                }
            }

        }
        
        for (var index = object.buffs.length - 1; index >= 0; index--) {
            const cur = object.buffs[index];
            if (cur.fade != false) {
                cur.duration -= 1;
            }
            if (cur.duration <= 0) {
                skills.pushMessagesToState([`<br>${cur.name} faded. (${object.name})`], true, "push");
                object.buffs.splice(index, 1);
            }
        }
        for (var index = object.debuffs.length - 1; index >= 0; index--) {
            //console.log(`index is ${index}`);
            //console.log(`object.buffs is ${object.debuffs}`);
            const cur = object.debuffs[index];
            if (cur.fade != false) {
                cur.duration -= 1;
            }
            if (cur.duration <= 0) {
                skills.pushMessagesToState([`<br>${cur.name} faded. (${object.name})`], true, "push");
                object.debuffs.splice(index, 1);
            }
        }

        skills.skillStack.stack.push(["continue", afterwards, true]); // so it runs last
        skills.runSkillStack();

    },

    turnReset(object) {
        object.actions -= 1;
        if (object == Combat.playerFighter) { statView.updateStatsCombat(Combat.getPlayerAdd(Combat.playerFighter)); };
    },

    combatLoop() {

        statView.updateStatsCombat(Combat.getPlayer());

        var combatEnd = Combat.healthCheck();
        Combat.turn += 1;
        Combat.state.push({
            player: [],
            enemy: []
        });
        //console.log("PRINTING STATE");
        //console.log(Combat.state);
        mainView.displayMessage(`<br>TURN ${Combat.turn}`);

        if (combatEnd == false) {
            //this.consecutiveActions = 1; // need to be put here as well as turn reset so that it is noted at the start of the battle
            Combat.playerFighter.actions = Combat.calcActions(Combat.getPlayerAdd(Combat.playerFighter), Combat.getEnemy());
            statView.updateStatsCombat(Combat.getPlayerAdd(Combat.playerFighter));
            Combat.combatMessage().forEach(message => {
                mainView.displayMessage(message);
            });
            Combat.initShortcuts();
            mainView.setInputResponse(Combat.selectAttack);
        } else {
            Combat.endBattle(Combat.healthCheck()); // end the fight if one combatant is dead. healthcheck will pass the victor.
        }

    },

    combatMessage() {
        return [
            `<br>Health: ${Combat.playerFighter.health}/${Combat.playerFighter.max_health}`,
            `${Combat.getEnemy().name} (LV${Combat.getEnemy().level}) Health: ${Combat.enemy.health}/${Combat.enemy.max_health}`,
            `Actions: ${Combat.playerFighter.actions}`,
            `Please select an action`
        ]
    },
    /*
    endPlayerTurn() {
        //console.log('ending player turn');
        const playerFighter = Combat.playerFighter;
        const enemy = Combat.enemy;
        var turnMod;
        if (this.healthCheck() == false) {
            switch (this.consecutiveActions) {
                case 1:
                    turnMod = 0.4
                    break;
                case 2:
                    turnMod = 1.75
                    break;
                case 3:
                    turnMod = 4
                    break;
                default:
                    turnMod = 999
                    break;
            }
            if (playerFighter.speed > .enemy..speed * turnMod) {
                this.consecutiveActions += 1;
                mainView.displayMessage('<br>Your speed has allowed you to attack again!');
                mainView.displayMessagesDelayed(Combat.combatMessage(), 0, () => '');
                mainView.setInputResponse(this.selectAttack);
            } else {
                mainView.displayMessage('Player turn end');
                mainView.displayMessage('');
                // run end of turn code here
                enemy.ai();
            }
        }
    },
    */
    /*
    endEnemyTurn() {
        //console.log('ending enemy turn');
        const playerFighter = Combat.playerFighter;
        const enemy = Combat.enemy;
        var turnMod;
        if (this.healthCheck() == false) {
            switch (this.consecutiveActions) {
                case 1:
                    turnMod = 0.4
                    break;
                case 2:
                    turnMod = 1.75
                    break;
                case 3:
                    turnMod = 4
                    break;
                default:
                    turnMod = 999
                    break;
            }
            if (.enemy..speed > playerFighter.speed * turnMod) {
                this.consecutiveActions += 1;
                mainView.displayMessage('<br>The speed of the enemy has allowed them to attack again!<br>');
                enemy.ai();
            } else {
                mainView.displayMessage('Enemy turn end');
                mainView.displayMessage('');
                // run end of turn code here
                this.combatLoop();
            }
        }
    },
    */
    endTurn(type) {
        const entity = (type == 'player' ? Combat.playerFighter : Combat.enemy);
        const other = (type == 'player' ? Combat.enemy : Combat.playerFighter);
        var turnMod;
        if (this.healthCheck() == false) { // don't really need to end the turn if the fight is over
            /*switch (this.consecutiveActions) {
                case 1:
                    turnMod = 0.4
                    break;
                case 2:
                    turnMod = 1.75
                    break;
                case 3:
                    turnMod = 4
                    break;
                default:
                    turnMod = 999
                    break;
            }*/
            statView.updateStatsCombat(Combat.getPlayerAdd(Combat.playerFighter)); // so mana and stuff updated inbetween turns
            //console.log(`MIGHT END TURN... CURRENT ACTIONS OF ENTITY ARE ${entity.actions}; TYPE IS ${type}`);
            if (entity.actions > 1) { // get an extra turn
                entity.actions -= 1
                if (type == 'player') {
                    //mainView.displayMessage('<br>Your speed has allowed you to attack again!');
                    mainView.displayMessage("<br>-------<br><span style='color:#ff9900'><b>Additional Action!</b></span><br>-------<br>");
                    entity.actionsTaken += 1;
                    Combat.combatMessage().forEach(message => {
                        mainView.displayMessage(message);
                    })
                    Combat.initShortcuts();
                    mainView.setInputResponse(this.selectAttack);
                } else {
                    mainView.displayMessage("<br>-------<br><span style='color:#ff9900'><b>Additional Action!</b></span><br>-------<br>");
                    entity.actionsTaken += 1
                    //mainView.displayMessage('<br>The speed of the enemy has allowed them to attack again!');
                    // re-evaluate enemy mode after each action
                    mode[Combat.enemy.mode].call(undefined, Combat.state, Combat.getPlayerAdd(Combat.playerFighter), Combat.enemy, () => {
                        ai[Combat.enemy.ai].call(); // so that we can get the small pause after showing enemy mode
                    })
                }
            } else { // end turn
                if (type == 'player') {

                    // reset actions taken
                    entity.actionsTaken = 0;

                    // stamina regen
                    var staminaRegen = Math.round(Combat.getPlayerAdd(Combat.playerFighter).max_stamina / 10);
                    Combat.playerFighter.stamina += staminaRegen;
                    Combat.playerFighter.stamina = clamp(Combat.playerFighter.stamina, 0, Combat.playerFighter.max_stamina);
                    mainView.displayMessage(`<br>Regenerated ${staminaRegen} stamina!`);

                    mainView.displayMessage('<br>Player turn end');
                    Combat.turnReset(Combat.playerFighter);
                    mainView.displayMessage('<br>---------------------------------------');
                    Combat.enemy.actions = Combat.calcActions(Combat.getEnemy(), Combat.getPlayerAdd(Combat.playerFighter));
                     // this will cause buffs to tick for the enemy at the start of their next turn
                    //console.l("logging state");
                    //console.l(Combat.state);
                    Combat.buffCheck(Combat.enemy, () => {
                        mode[Combat.enemy.mode].call(undefined, Combat.state, Combat.getPlayerAdd(Combat.playerFighter), Combat.enemy, () => {
                            ai[Combat.enemy.ai].call(); // so that we can get the small pause after showing enemy mode
                        })
                    });
                } else {
                    mainView.displayMessage('<br>Enemy turn end');

                    // reset actionsTaken
                    entity.actionsTaken = 0;

                    // stamina regen
                    var staminaRegen = Math.round(Combat.enemy.max_stamina / 10);
                    Combat.enemy.stamina += staminaRegen;
                    Combat.enemy.stamina = clamp(Combat.enemy.stamina, 0, Combat.enemy.max_stamina);
                    mainView.displayMessage(`<br>${Combat.enemy.name} regenned ${staminaRegen} stamina!`);

                    Combat.turnReset(Combat.enemy);
                    //Combat.state[Combat.state.length - 1].push({ ...Combat.getPlayer() });
                    //Combat.state[Combat.state.length - 1].push({ ...Combat.getEnemy() });

                    // this will cause buffs to tick for the plr at the start of their next turn
                    mainView.displayMessage('<br>---------------------------------------');
                    Combat.buffCheck(Combat.playerFighter, () => {
                        // run end of turn FUNCTION here
                        this.combatLoop();
                    });

                }
            }

        } else {
            this.endBattle(this.healthCheck()); // end the fight if one combatant is dead. healthcheck will pass the victor.
        }


    },

    displayStatus(object) {

        // before displaying the buffs, I'm going to sort them so that all the buffs w/ same name are grouped together...
        // this will prevent "extra stack"s from displaying under the wrong thing
        const compare = (a,b) => {
            if (a.name > b.name) {
                return 1;
            } else if (a.name < b.name) {
                return -1;
            } else { return 0 };
        };
        object.buffs.sort(compare);
        object.debuffs.sort(compare);
        // --------------- \\

        mainView.displayMessage(`${separator}Displaying status...`);

        // displaying hp, mana, stamina, sp
        mainView.displayMessage(`HP: ${object.health}/${object.max_health}`);
        mainView.displayMessage(`Mana: ${object.mana}/${object.max_mana}`);
        mainView.displayMessage(`Stamina: ${object.stamina}/${object.max_stamina}`);
        mainView.displayMessage(`SP: ${object.sp}/${object.max_sp}`);

        if (object.type == "enemy") {
            mainView.displayMessage('<br><b>Total Stat Modifiers</b>');
            const allStats = ["atk", "def", "matk", "mdef", "speed", "effectiveness",
            "resistance", "evasion", "mitigation"];
            var modFound = false;
            allStats.forEach(stat => {
                const mod = Combat.calcMod(stat, object);
                //console.log(`for ${stat} mod is ${mod}`)
                if (mod != 0) {
                    modFound = true;
                    mainView.displayMessage(` - ${stat}: ${["effectiveness", "resistance"].includes(stat) ? mod : mod * 100}%`)
                }
            });
            if (!modFound) { mainView.displayMessage("--")}
        }

        mainView.displayMessage('<br><b>BUFFS</b>'); // we have to format the buff for display

        const displayedBuffs = [];

        if (object.buffs.length == 0) {
            mainView.displayMessage("<br>None");
        }

        Combat.displayBuffs(object.buffs);

        mainView.displayMessage('<br><b>DEBUFFS</b>'); // we have to format the buff for display

        if (object.debuffs.length == 0) {
            mainView.displayMessage("<br>None");
        }

        Combat.displayBuffs(object.debuffs);

        mainView.displayMessage(`${separator}Please select an action`)
    },

    displayBuffs(buffs) {
    
        const displayedBuffs = [];
        buffs.forEach(cur => { // for each buff in buffs...
            var currentBuff = {... cur} // create a copy of the buff
            var name = currentBuff.name; // remove the things we don't want to display
            //delete currentBuff.name; we cannot do this as we need this variable
            delete currentBuff.types;
            delete currentBuff.apply_text;

            // buff duration
            const buffDuration = `<br> ➢ ${currentBuff.duration} turns remaining`;
            delete currentBuff.duration;

            // buff element
            const element = `<br><span style="color:${elementColours[currentBuff.element]}">${currentBuff.element}</span>`
            delete currentBuff.element;

            // number of stacks (may need to change)
            const stacksNo = Combat.checkStacks(buffs, currentBuff.name);
            const stacks = `<br>${stacksNo} stack${stacksNo > 1 ? 's' : ''}<b>/</b>${currentBuff.max_stacks} max`;
            delete currentBuff.max_stacks;
            
            // buff description
            var desc;
            if (currentBuff.hasOwnProperty("desc")) { // add desc to the thing if the buff has one
                desc = `<br> - ${currentBuff.desc}`
                delete currentBuff.desc;
            } else { desc = `` };

            // dot (if the thing has one)
            var damage = '';
            if (currentBuff.hasOwnProperty("damage")) {
                if (currentBuff.damage[0] == "percentile") {
                    damage = `<br> ➢ ${Math.abs(currentBuff.damage[1])}% ${currentBuff.damage[1] > 0 ? 'DoT' : 'HoT'}`;
                } else if (currentBuff.damage[0] == "flat") {
                    damage = `<br> ➢ ${Math.abs(currentBuff.damage[1])}DMG ${currentBuff.damage[1] > 0 ? 'DoT' : 'HoT'}`;
                };
            }

            if (currentBuff.hasOwnProperty('elemental')) { // if the buff augments elemental stats...
                var BuffOffensive = Object.keys(currentBuff.elemental.offence).map(cur => { // for each offensive stat create a string in format "element: value"
                    const value = currentBuff.elemental.offence[cur];
                    return `<br> ➢ ${value > 0 ? '+' : ''}${value} ${cur} attack`;
                }) 
                var BuffDefensive = Object.keys(currentBuff.elemental.defence).map(cur => { // same as above for defensive
                    const value = currentBuff.elemental.defence[cur];
                    return `<br> ➢ ${value > 0 ? '+' : ''}${value} ${cur} defence`;
                });
                //BuffOffensive.split('-');
                //BuffDefensive.split('-');
            } else { var BuffOffensive = [];
            var BuffDefensive = [] }; // if there is no elemental component define anyway so as to not throw error

            delete currentBuff.elemental; // delete actual element component since we have formated arrays to display with

            var buffComponents = Object.keys(currentBuff).map(cur => { // iterate over all normal buff properties and format them in an array
                const value = currentBuff[cur];
                if (!["name", "damage", "onTick", "stacks"].includes(cur)) { // don't want to display name, see above as to why it wasn't deleted
                    if (["resistance", "effectiveness"].includes(cur)) {
                        return `<br> ➢ ${value > 0 ? '+' : ''}${value} ${cur}`
                    }
                    else if (cur == "fade") {
                        if (currentBuff.fade == false) { return `<br> ➢ Does not fade with time`};
                    }
                    else if (cur == "unstrippable") {
                        if (currentBuff.unstrippable == true) { return `<br> ➢ Unstrippable`};
                    }
                    else {
                        return `<br> ➢ ${value > 0 ? '+' : ''}${value * 100}% ${cur}`
                    }
                }
            });

            // okay now display the buff jesus that was long.
            var fullBuff;
            if (displayedBuffs.includes(currentBuff.name)) { // this should never come into play but I'll leave it here 
                fullBuff = `FURTHER STACK: ${buffDuration}`;
            } else {
                fullBuff = `<br>${name.toUpperCase()}${element}${stacks}${buffDuration}${buffComponents.join('')}
                ` + `${BuffOffensive.join('')}${BuffDefensive.join('')}${desc}${damage}`;
            }
            
            
            mainView.displayMessage(fullBuff);

            // Add the buff to a list of already displayed buffs. If a buff is here, we will skip displaying most of the details
            displayedBuffs.push(currentBuff.name);
            //console.l(`showing displayed buffs`);
        })
    },

    displayStats(object) {
        // need to display: atk, def, matk, mdef, speed, cchance, cdmg, eff, res, elementals
        const displayText = {
            atk: "attack",
            def: "defence",
            matk: "magic attack",
            mdef: "magic defence",
            speed: "speed",
            crit_chance: "critical chance",
            crit_damage: "critical damage",
            effectiveness: "effectiveness",
            resistance: "resistance"
        };

        const statsToGet = ["atk", "matk", "def", "matk", "mdef", "speed", "crit_chance", "crit_damage", "effectiveness", "resistance"];

        var displayString = ``;

        statsToGet.forEach(stat => { // get all the "main stats"
            var value = object[stat];

            if (stat == "crit_chance" || stat == "crit_damage") {
                value = (value * 100).toString() + "%"
            }

            displayString += `<br> - ${displayText[stat]}: ${value}`;
        });

        // now get the elemenetal stats
        Object.keys(object.elemental.offence).forEach(element => {
            displayString += `<br> - ${object.elemental.offence[element]} ${element} attack`
        });

        Object.keys(object.elemental.defence).forEach(element => {
            displayString += `<br> - ${object.elemental.defence[element]} ${element} defence`
        });

        // get description
        displayString += `<br><br><b>Observations: </b>${object.desc}`;

        mainView.displayMessage(displayString);


    },

    initShortcuts() {

        // display the turn here
        mainView.displayMessage(`(Turn ${Combat.turn})`);

        const player = gameData.data.player;
        const playerSkills = Combat.getPlayer().skillsList;

        const temp = ['skills', 'status', 'enemy', 'pouch', 'flee'];

        /*
        playerSkills.forEach(skill => {
            temp.unshift(skills[skill].name)
        });
        */

        //console.log(playerSkills);
        for (var i = playerSkills.length - 1; i > -1; i--) { // iterating backwards gives the desired order
            //console.log(`current is ${playerSkills[i]}`)
            temp.unshift(skills[playerSkills[i]].name)
        }

        //console.l("showing temp");
        //console.l(temp);

        mainView.initInputShortcuts(temp, { combat: true });

    },

    selectAttack() {
        // getting fighters from the Combat object
        const playerFighter = Combat.playerFighter;
        const enemy = Combat.enemy;

        mainView.removeInputResponse(Combat.selectAttack); // remove event listener
        const choice = mainView.getInput();

        Combat.getEquips(playerFighter); // FOR TESTING PURPOSES

        // react to decision
        if (choice == 'skills') { // if they typed 'skills', show them their skills
            mainView.displayMessage(`<br> ${Combat.getPlayer().skillsList.map(cur => {
                return `${skills[cur].name}: ${skills[cur].description}`
            }).join('<br><br>')}`)
            Combat.initShortcuts();
            mainView.setInputResponse(Combat.selectAttack);

        }

        else if (choice == 'status') { // if they typed 'status', show them their buffs and debuffs'

            Combat.displayStatus(playerFighter);

            const func = () => {
                Combat.combatMessage().forEach(message => {
                    mainView.displayMessage(message);
                })
                Combat.initShortcuts();
                mainView.setInputResponse(Combat.selectAttack);
            }

            mainView.displayWaitForInput(["Input anything to continue..."], func, false);
    
        }

        else if (choice == 'enemy') { // if they typed 'enemy', show the enemy's buffs and debuffs

            Combat.displayStatus(enemy);
            
            const func = () => {
                Combat.combatMessage().forEach(message => {
                    mainView.displayMessage(message);
                })
                Combat.initShortcuts();
                mainView.setInputResponse(Combat.selectAttack);
            }

            mainView.displayWaitForInput(["Input anything to continue..."], func, false);

        }

        else if (choice == 'flee') {

            Combat.flee();

        }
            
        else if (playerFighter.skillsList.findIndex(cur => { return cur.replace(/_/g, " ") == choice }) !== -1) { // if they typed a skill name, use the skill
            //console.l(`${choice} used`)

            // get the index of the skill, as it will be the same as in skillsList - idk if this is needed actually
            //const skillIndex = skillsList.findIndex(cur => { return skillsList[cur] == choice });


            // use the skill

            if (skills.getSkill(choice).cost(playerFighter, enemy) == true) { // if the player can use the skill..
                skills.getSkill(choice).use(Combat.getPlayerAdd(playerFighter), enemy, 'player'); // enemy.stats has to be passed in since the battle-ready enemy object has exp, gold etc.
                // ^ also we get the stats of the player's equips and pass those in too obvi <3
            } else {
                mainView.displayMessage(`<br> ${skills.getSkill(choice).cost(playerFighter, enemy)}`);
                Combat.initShortcuts();
                mainView.setInputResponse(Combat.selectAttack);
            }

        }
        
        else if (choice == "p" || choice == "pouch") {
            const pouch = gameData.data.player.stats.pouch; // access actual thing not a copy since we..
            // ..are consuming actual items
            if (pouch.length == 0) {
                mainView.displayMessage("Your pouch is empty!");
                mainView.setInputResponse(Combat.selectAttack);
                Combat.initShortcuts();
            } else {
                Combat.pouchMenuLoop();
            }
        }
        
        else {

            mainView.displayMessage("<br>Invalid Input");
            mainView.setInputResponse(Combat.selectAttack);
            Combat.initShortcuts();
        }
    },

    pouchMenuLoop() {
        const player = gameData.data.player;

        mainView.displayMessage("Currently in the pouch menu. Options:");
        mainView.displayMessage("<br> - Type the name of an item to use it.");
        mainView.displayMessage(" - b/back (to return)");
        mainView.displayMessage("<br>Items currently in pouch:<br>");
        player.stats.pouch.forEach(item => {
            mainView.displayMessage(`${item[1]} ${items[item[0]].name} - ${items[item[0]].desc}`);
        });
        mainView.setInputResponse(Combat.pouchMenuResponse);
    },

    pouchMenuResponse() { // REFACTOR
        mainView.removeInputResponse(Combat.pouchMenuResponse);
        const input = mainView.getInput().toLowerCase();
        const player = gameData.data.player;

        if (player.stats.pouch.findIndex(item => getItemIdentfierByName(input) == item[0]) != -1) {
            // if they inputted an item in the pouch, remove it
            const itemIndex = player.stats.pouch.findIndex(item => getItemIdentfierByName(input) == item[0]);
            const itemIdentifier = player.stats.pouch[itemIndex][0]; // "health_potion"
            const itemName = items[itemIdentifier].name; // health potion
            const itemEffect = items[itemIdentifier].use.battleEffect; // self explanatory
            player.stats.pouch[itemIndex][1] -= 1; // consume one item
            if (player.stats.pouch[itemIndex][1] == 0) { // if there are 0 of the item left, remove it entirely
                player.stats.pouch.splice(itemIndex, 1);
            };
            itemEffect(); // invoke item effect
        }

        else if (input == "b" || input == "back") {
            // return
            mainView.displayMessage("Returning..");
            Combat.combatMessage().forEach(message => {
                mainView.displayMessage(message);
            })
            mainView.setInputResponse(Combat.selectAttack);
            Combat.initShortcuts();
        }

        else {
            mainView.displayMessage("Invalid input");
            mainView.setInputResponse(Combat.pouchMenuResponse);
        }
    }, 

    getEnemy() {
        return Combat.enemy;
    },

    getPlayerAdd(player) { // for getting player + equips + sp allocations + stats from levelling up
        //console.log("getplayeradd called");
        const stats = Combat.getEquips(gameData.data.player.stats); // getting equips
        const elemental = Combat.getEquipsElements(gameData.data.player.stats);
        const offence = elemental.offence;
        const defence = elemental.defence;
        //const sp = 
        const playerTemp = JSON.parse(JSON.stringify(player)); /* this is needed to create a 'deep copy' of the object, 
        wherein reference variables are not copied like nested objects */

        //console.log(playerTemp);

        Object.keys(gameData.data.player.sp_investment).forEach(stat => {
            if (stat != "health" && stat != "mana") {
                stats[stat] += gameData.data.player.sp_investment[stat] * 2 // getting sp investment
            } if (stat == "mana") {
                stats.max_mana += gameData.data.player.sp_investment[stat] * 15; // mana is a little different
            }
        })

        Object.keys(playerTemp).forEach(cur => { // adding stats found to playerTemp
            if (stats.hasOwnProperty(cur)) {
                playerTemp[cur] += stats[cur]
            }
        })

        // ADDING LEVEL STATS TO PLAYER
        const levelUps = gameData.data.player.level - 1;
        playerTemp.atk += levelUps * 2;
        playerTemp.def += levelUps * 2;
        playerTemp.matk += levelUps * 2;
        playerTemp.mdef += levelUps * 2;
        playerTemp.speed += levelUps * 2;

        Object.keys(offence).forEach(cur => { // elemental offence
            playerTemp.elemental.offence[cur] += offence[cur];
        })

        Object.keys(defence).forEach(cur => { // elemental defence
            playerTemp.elemental.defence[cur] += defence[cur];
        })


        //console.log(playerTemp);
        return playerTemp
    },

    getPlayer() {
        return Combat.playerFighter;
    },

    checkStacks(buffs, buffToFind) {
        var counter = 0;
        var buff;
        for (buff in buffs) {
            //console.log(buff);
            if (buffs[buff].name == buffToFind) {
                counter += buffs[buff].stacks;
            }
        }
        return counter;
    },

    calcActions(object, object2) {

        //console.log("printing object, followed by object2");
        //console.log(object);
        //console.log(object2);


        if (object.speed * (1 + Combat.calcMod("speed" ,object)) > object2.speed * (2 +  Combat.calcMod("speed", object2))) {
            mainView.displayMessage("<br>The superior speed of the caster grants them an extra action!");
            return 2;
        } else if (object.speed * (1 + Combat.calcMod("speed", object)) < object2.speed * (0.25 + Combat.calcMod("speed", object2))) {
            //mainView.displayMessage("<br>The lesser speed of the caster causes them to struggle to keep up..");
            return 1;
        } else { return 1 };
    },

    endBattle(victor) {

        // reset the display
        updateDisplay(gameData.data.player);
        //console.log("update display called");
        

        //console.log(this.enemy);
        if (victor == "enemy") { // if the enemy won...
            mainView.displayMessage(`${Combat.playerFighter.name} has been defeated!`);
            const msgArr = [["The defeat in battle leaves you disoriented...<br>", 1],
                    ["Fortuately, you awake in familiar surroundings...", 1]]
            gameData.data.player.stats.current_health = gameData.data.player.max_health;
            gameData.data.player.stats.current_mana = gameData.data.player.stats.max_mana;
            gameData.data.player.stats.current_stamina = gameData.data.player.stats.max_stamina;
            mainView.displayMessagesDelayed(msgArr, "battle", mainLoop);

        } else {
            mainView.displayMessage(`<br>${Combat.playerFighter.name} emerged victorious!`);

            // carry over hp and mana
            //console.log(`playerfighter hp/mana ${Combat.playerFighter.health}/${Combat.playerFighter.mana}`)
            gameData.data.player.stats.current_health = Combat.getPlayer().health;
            gameData.data.player.stats.current_mana = Combat.getPlayer().mana;
            gameData.data.player.stats.current_stamina = Combat.getPlayer().stamina;
            //console.log(`data hp/mana = ${gameData.data.player.stats.current_health}/${gameData.data.player.stats.current_mana}`)

            // reward gold and exp
            gameData.data.player.gold += this.enemy.gold;
            gameData.data.player.exp += this.enemy.exp;

            mainView.displayMessage(`<br>Gained ${this.enemy.gold} gold!`);
            mainView.displayMessage(`<br>Gained ${this.enemy.exp} exp!`);

            const drops = this.enemy.drops;


            var index = 0; 
            for (index in drops) { // for each possible drop..
                const random = Math.round((Math.random() * 1000)); // we use 1000 so that drop chances like 0.5% are possible
                const item = drops[index];
                if (item[1] >= random) {
                    if (item[3] != undefined) { // only reagents have this property
                        addItem(item[0], item[2], item[3])
                    } else { addItem(item[0]) };
                }
            }

            // Call level up function
            checkLevel();
            // ---

            this.endFunction.call(); // call endfunctio


        } // if the player won (yippe!)

        updateDisplay(gameData.data.player);

    },

    flee() {
        mainView.displayMessage(`${Combat.playerFighter.name} has fled!`);
        const msgArr = [["You just barely manage to escape, but lose your way as you run.<br>", 1],
                ["Fortuately, you find yourself in familiar surroundings...", 1]]
        gameData.data.player.stats.current_health = gameData.data.player.max_health;
        gameData.data.player.stats.current_mana = gameData.data.player.stats.max_mana;
        gameData.data.player.stats.current_stamina = gameData.data.player.stats.max_stamina;
        mainView.displayMessagesDelayed(msgArr, "battle", mainLoop);
    },

    heal(player) {
        player.current_health = Combat.getMaxHealth(player);
        player.current_mana = Combat.getPlayerAdd(player).max_mana;
        player.current_stamina = Combat.getPlayerAdd(player).max_stamina;
    }

}


// LEVEL UP //
export const checkLevel = () => {
    if (gameData.data.player.level < gameData.level_cap) { // do first otherwise accessing a too high level will give an error
        if (gameData.data.player.exp >= gameData.exp_requirements[gameData.data.player.level]) { // if the player has enough exp..
                       
            const msgArr = (`<b><br>You can feel yourself becoming stronger...</b>` + "<br>" +
            (`Levelled up to level ${gameData.data.player.level + 1}`) + "<br>" +
            (`+2 SP!`) + "<br>" +
            (`+2 AP!`) + "<br>" +
            (`+20 health!`) + "<br>" +
            (`+2 all stats!<br>`))

            mainView.displayMessage(msgArr);
            processLevelUp();
                        
        };
    
    }
    
    
}

const processLevelUp = () => {
    const player = gameData.data.player; // should've done this eariler in the function, haha...
    const plrstats = player.stats;

    // CORRECTING LEVEL, EXP, ECT.
    player.exp -= gameData.exp_requirements[player.level];
    player.level += 1;
    player.sp += 2;
    player.ap += 2;

    // EDITING STATS //
    /*
    plrstats.health += 20;
    plrstats.current_health += 20;
    plrstats.atk += 2;
    plrstats.def += 2;
    plrstats.matk += 2;
    plrstats.mdef += 2;
    plrstats.speed += 2;
    */

    updateDisplay(player);

    checkLevel();
}
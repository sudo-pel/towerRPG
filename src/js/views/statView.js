import { elements } from './baseView';
import { Combat } from '../models/combat';

export const updateStats = player => {
   //console.log("UPDATE STATS CALLED");
    const playerStats = player.stats;
    const playerElOffence = player.stats.elemental.offence;
    const playerElDefence = player.stats.elemental.defence;

    const markupLeft = `
    ${player.name}'s stats <br>
    health: ${playerStats.current_health}/${Combat.getMaxHealth(player.stats)} <br>
    attack: ${Math.round(playerStats.atk)}<br>
    defence: ${Math.round(playerStats.def)} <br>
    magic attack: ${Math.round(playerStats.matk)}<br>
    magic defense: ${Math.round(playerStats.mdef)}<br>
    speed: ${Math.round(playerStats.speed)}<br>
    critical chance: ${Math.round(playerStats.crit_chance * 100)}%<br>
    critical damage: ${Math.round(playerStats.crit_damage * 100)}%<br>
    effectiveness: ${Math.round(playerStats.effectiveness)}%<br>
    resistance: ${Math.round(playerStats.resistance)}%<br>
    evasion: ${Math.round(playerStats.evasion * 100)}%<br>
    mana: ${playerStats.current_mana}/${playerStats.max_mana}<br>
    stamina: ${playerStats.current_stamina}/${playerStats.max_stamina}<br>
    max sp: ${playerStats.max_sp}
    `

    const markupRight = `
    ELEMENTAL OFFENCE: <br>
    physical: ${playerElOffence.physical}<br>
    fire: ${playerElOffence.fire}<br>
    water: ${playerElOffence.water}<br>
    wind: ${playerElOffence.wind}<br>
    earth: ${playerElOffence.earth}<br>
    thunder: ${playerElOffence.thunder}<br>
    light: ${playerElOffence.light} <br>
    dark: ${playerElOffence.dark}<br><br>
    ELEMENTAL DEFENCE:<br>
    physical: ${playerElDefence.physical}<br>
    fire: ${playerElDefence.fire}<br>
    water: ${playerElDefence.water}<br>
    wind: ${playerElDefence.wind}<br>
    earth: ${playerElDefence.earth}<br>
    thunder: ${playerElDefence.thunder}<br>
    light: ${playerElDefence.light}<br>
    dark: ${playerElDefence.dark}<br>
    `

    elements.mainStats.innerHTML = markupLeft;
    elements.elementalStats.innerHTML = markupRight;
}

export const updateStatsCombat = player => {
   //console.log ("UPDATE STATS COMBAT CALLED");
    const playerElOffence = player.elemental.offence;
    const playerElDefence = player.elemental.defence;

    const elementalMods = Combat.calcElementBuffs(player);
    const elModOffence = elementalMods.offence;
    const elModDefence = elementalMods.defence;

    const atk_mod = Combat.calcMod("atk", player);
    const def_mod = Combat.calcMod("def", player);
    const matk_mod = Combat.calcMod("matk", player);
    const mdef_mod = Combat.calcMod("mdef", player);
    const speed_mod = Combat.calcMod("speed", player);
    const crit_chance_mod = Combat.calcMod("crit_chance", player);
    const crit_damage_mod = Combat.calcMod("crit_damage", player);
    const effectiveness_mod = Combat.calcMod("effectiveness", player);
    const resistance_mod = Combat.calcMod("resistance", player);
    const evasion_mod = Combat.calcMod("evasion", player);

    const markupLeft = ` 
    ${player.name}'s stats <br>
    health: ${player.health} (${Math.round((player.health / player.max_health) * 100)}%)<br>
    attack: ${Math.round(player.atk * (atk_mod + 1))} (${Math.round(100 + atk_mod * 100)}%)<br>
    defence: ${Math.round(player.def * (def_mod + 1))} (${Math.round(100 + def_mod * 100)}%)<br>
    magic attack: ${Math.round(player.matk * (matk_mod + 1))} (${Math.round(100 + matk_mod * 100)}%)<br>
    magic defense: ${Math.round(player.mdef * (mdef_mod + 1))} (${Math.round(100 + mdef_mod * 100)}%)<br>
    speed: ${Math.round(player.speed * (speed_mod + 1))} (${Math.round(100 + speed_mod * 100)}%)<br>
    critical chance: ${((player.crit_chance + crit_chance_mod) * 100)}% (${crit_chance_mod < 0 ? '' : '+'}${Math.round(crit_chance_mod * 100)}%)<br>
    critical damage: ${((player.crit_damage + crit_damage_mod) * 100)}% (${crit_damage_mod < 0 ? '' : '+'}${Math.round(crit_damage_mod * 100)}%)<br>
    effectiveness: ${((player.effectiveness + effectiveness_mod))}% (${effectiveness_mod < 0 ? '' : '+'}${Math.round(effectiveness_mod)}%)<br>
    resistance: ${((player.resistance + resistance_mod))}% (${resistance_mod < 0 ? '' : '+'}${Math.round(resistance_mod)}%)<br>
    evasion: ${((player.evasion + evasion_mod) * 100)}% (${evasion_mod < 0 ? '' : '+'}${Math.round(evasion_mod * 100)}%)<br>
    mitigation: ${Math.round(Combat.calcMod("mitigation", player) * 100)}%<br>
    mana: ${player.mana}/${player.max_mana}<br>
    stamina: ${player.stamina}/${player.max_stamina}<br>
    sp: ${player.sp}/${player.max_sp}
    
    ` // result: attack: 10 (100%) [if not buffed]

    const markupRight = `
    ELEMENTAL OFFENCE: <br>
    physical: ${playerElOffence.physical + elModOffence.physical} (${elModOffence.physical < 0 ? '' : '+'}${elModOffence.physical})<br>
    fire: ${playerElOffence.fire + elModOffence.fire} (${elModOffence.fire < 0 ? '' : '+'}${elModOffence.fire})<br>
    water: ${playerElOffence.water + elModOffence.water} (${elModOffence.water < 0 ? '' : '+'}${elModOffence.water})<br>
    wind: ${playerElOffence.wind + elModOffence.wind} (${elModOffence.wind < 0 ? '' : '+'}${elModOffence.wind})<br>
    earth: ${playerElOffence.earth + elModOffence.earth} (${elModOffence.earth < 0 ? '' : '+'}${elModOffence.earth})<br>
    thunder: ${playerElOffence.thunder + elModOffence.thunder} (${elModOffence.thunder < 0 ? '' : '+'}${elModOffence.thunder})<br>
    light: ${playerElOffence.light + elModOffence.light} (${elModOffence.light < 0 ? '' : '+'}${elModOffence.light})<br>
    dark: ${playerElOffence.dark + elModOffence.dark} (${elModOffence.dark < 0 ? '' : '+'}${elModOffence.dark})<br><br>
    ELEMENTAL DEFENCE:<br>
    physical: ${playerElDefence.physical + elModDefence.physical} (${elModDefence.physical < 0 ? '' : '+'}${elModDefence.physical})<br>
    fire: ${playerElDefence.fire + elModDefence.fire} (${elModDefence.fire < 0 ? '' : '+'}${elModDefence.fire})<br>
    water: ${playerElDefence.water + elModDefence.water} (${elModDefence.water < 0 ? '' : '+'}${elModDefence.water})<br>
    wind: ${playerElDefence.wind + elModDefence.wind} (${elModDefence.wind < 0 ? '' : '+'}${elModDefence.wind})<br>
    earth: ${playerElDefence.earth + elModDefence.earth} (${elModDefence.earth < 0 ? '' : '+'}${elModDefence.earth})<br>
    thunder: ${playerElDefence.thunder + elModDefence.thunder} (${elModDefence.thunder < 0 ? '' : '+'}${elModDefence.thunder})<br>
    light: ${playerElDefence.light + elModDefence.light} (${elModDefence.light < 0 ? '' : '+'}${elModDefence.light})<br>
    dark: ${playerElDefence.dark + elModDefence.dark} (${elModDefence.dark < 0 ? '' : '+'}${elModDefence.dark})<br>
    ` // result: fire: 80 (-20%) [if fire was 100 and is -20% for whatever reason]

    elements.mainStats.innerHTML = markupLeft;
    elements.elementalStats.innerHTML = markupRight;
}
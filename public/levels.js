//Converted from Plancke's php conversion script https://github.com/Plancke/hypixel-php
const easyLevels = 4;
const easyLevelsXp = 7000;
const xpPerPrestige = 96 * 5000 + easyLevelsXp;
const levelsPerPrestige = 100;
const highestPrestige = 10;

function getPrestigeForExp(exp) {
    return getPrestigeForLevel(getLevelForExp(exp));
}

function getPrestigeForLevel(level) {
    let prestige = Math.floor(level / levelsPerPrestige);

    switch (prestige) {
        case 0:
            return 'None';
        case 1:
            return 'Iron';
        case 2:
            return 'Gold';
        case 3:
            return 'Diamond';
        case 4:
            return 'Emerald';
        case 5:
            return 'Sapphire';
        case 6:
            return 'Ruby';
        case 7:
            return 'Crystal';
        case 8:
            return 'Opal';
        case 9:
            return 'Amethyst';
        case 10:
        default:
            return 'Rainbow';
    }
}

//Calculate level for given bedwars experience

function getLevelForExp(exp) {
    let prestiges = Math.floor(exp / xpPerPrestige);

    let level = prestiges * levelsPerPrestige;

    let expWithoutPrestiges = exp - (prestiges * xpPerPrestige);
    for (let i = 1; i <= easyLevels; ++i) {
        let expForEasyLevel = getExpForLevel(i);
        if (expWithoutPrestiges < expForEasyLevel) {
            break;
        }
        level++;
        expWithoutPrestiges -= expForEasyLevel;
    }
    level += Math.floor(expWithoutPrestiges / 5000);

    return level;
}

function getExpForLevel(level) {
    if (level === 0) return 0;

    let respectedLevel = getLevelRespectingPrestige(level);
    if (respectedLevel > easyLevels) {
        return 5000;
    }

    switch (respectedLevel) {
        case 1:
            return 500;
        case 2:
            return 1000;
        case 3:
            return 2000;
        case 4:
            return 3500;
    }
    return 5000;
}

//Returns "2" instead of "102" if prestiges happen every 100 levels e.g.

function getLevelRespectingPrestige(level) {
    if (level > highestPrestige * levelsPerPrestige) {
        return level - highestPrestige * levelsPerPrestige;
    } else {
        return level % levelsPerPrestige;
    }
}

export {getPrestigeForExp, getPrestigeForLevel, getLevelForExp, getExpForLevel, getLevelRespectingPrestige};
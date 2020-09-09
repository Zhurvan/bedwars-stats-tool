const EASY_LEVELS = 4;
const EASY_LEVELS_XP = 7000;
const XP_PER_PRESTIGE = 96 * 5000 + EASY_LEVELS_XP;
const LEVELS_PER_PRESTIGE = 100;
const HIGHEST_PRESTIGE = 10;

function getExpForLevel(level) {
  if (level == 0) return 0;

  var respectedLevel = getLevelRespectingPrestige(level);
  if (respectedLevel > EASY_LEVELS) {
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

function getLevelRespectingPrestige(level) {
  if (level > HIGHEST_PRESTIGE * LEVELS_PER_PRESTIGE) {
    return level - HIGHEST_PRESTIGE * LEVELS_PER_PRESTIGE;
  } else {
    return level % LEVELS_PER_PRESTIGE;
  }
}

function getLevelForExp(exp) {
  var prestiges = Math.floor(exp / XP_PER_PRESTIGE);
  var level = prestiges * LEVELS_PER_PRESTIGE;
  var expWithoutPrestiges = exp - (prestiges * XP_PER_PRESTIGE);

  for (let i = 1; i <= EASY_LEVELS; ++i) {
    var expForEasyLevel = getExpForLevel(i);
    if (expWithoutPrestiges < expForEasyLevel) {
      break;
    }
    level++;
    expWithoutPrestiges -= expForEasyLevel;
  }
  //returns players bedwars level, remove the Math.floor if you want the exact bedwars level returned
  return level + Math.floor(expWithoutPrestiges / 5000);
}

function pressedEnter(e) {
  if ((e && e.keyCode == 13) || e == 0) {
    submitted();
  }
}

function submitted() {
  const request = require('request')
  const mojangjs = require('mojangjs');
  var text = document.getElementById("level");
  text.innerHTML = "";
  mojangjs.getUUID(document.getElementById("uNameInput").value).then(uuid => {
    request({
      json: true,
      uri: 'https://api.hypixel.net/player?key=f0b44d7c-4168-456a-8fe7-2322dacd662e&uuid=' + uuid
    }, (err, res, body) => {
      if (body.player) {
        if (body.player.stats) {
          if (body.player.stats.Bedwars) {
            var deaths = body.player.stats.Bedwars.eight_one_final_deaths_bedwars + body.player.stats.Bedwars.eight_two_final_deaths_bedwars + body.player.stats.Bedwars.four_four_final_deaths_bedwars + body.player.stats.Bedwars.four_three_final_deaths_bedwars + body.player.stats.Bedwars.two_four_final_deaths_bedwars
            if (isNaN(deaths)) {
              deaths = 1;
            }
            if (isNaN(body.player.stats.Bedwars.eight_one_final_kills_bedwars)) {
              body.player.stats.Bedwars.eight_one_final_kills_bedwars = 0;
            }
            if (isNaN(body.player.stats.Bedwars.eight_two_final_kills_bedwars)) {
              body.player.stats.Bedwars.eight_two_final_kills_bedwars = 0
            }
            if (isNaN(body.player.stats.Bedwars.four_four_final_kills_bedwars)) {
              body.player.stats.Bedwars.four_four_final_kills_bedwars = 0
            }
            if (isNaN(body.player.stats.Bedwars.four_three_final_kills_bedwars)) {
              body.player.stats.Bedwars.four_three_final_kills_bedwars = 0
            }
            if (isNaN(body.player.stats.Bedwars.two_four_final_kills_bedwars)) {
              body.player.stats.Bedwars.two_four_final_kills_bedwars = 0
            }
                        var finals = body.player.stats.Bedwars.eight_one_final_kills_bedwars + body.player.stats.Bedwars.eight_two_final_kills_bedwars + body.player.stats.Bedwars.four_four_final_kills_bedwars + body.player.stats.Bedwars.four_three_final_kills_bedwars + body.player.stats.Bedwars.two_four_final_kills_bedwars
            text.innerHTML = "Level: " + getLevelForExp(body.player.stats.Bedwars.Experience) + '</br> Beds Broken: ' + body.player.stats.Bedwars.beds_broken_bedwars + '</br> Final Kills: ' + finals + '</br> Fkdr: ' + Math.round(finals / deaths * 100) / 100 + '</br> Winstreak: ' + body.player.stats.Bedwars.winstreak;
          } else {
            text.innerHTML = "This account does not have any Bedwars stats."
          }
        } else {
          text.innerHTML = "This account doesn't have any stats on Hypixel.";
        }
      } else {
        text.innerHTML = "This account does not exist on Hypixel.";
      }
    })
  }).catch(err => {
    console.error(err)
    text.innerHTML = "This Minecraft account does not exist."; // Insert text});
  });
}

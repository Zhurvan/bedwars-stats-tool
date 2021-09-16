import {getLevelForExp, getPrestigeForExp} from "./levels.js";

let apiKey;

let enableButtons = () => {
    Array.prototype.forEach.call(document.getElementsByClassName("modeButtons"), function (el) {
        el.disabled = false;
    });
}

let disableButtons = () => {
    Array.prototype.forEach.call(document.getElementsByClassName("modeButtons"), function (el) {
        el.disabled = true;
    });
}

let infoTemplate = (n) => {
    document.getElementById('infoBox').innerHTML =
        `<div id="box${n}">
            Level: <span id="level${n}"></span>
            <br/>
            Prestige: <span id="prestige${n}"></span>
            <br/>
            Wins: <span id="wins${n}"></span>
            <br/>
            Winrate: <span id="winRate${n}"></span>
            <br/>
            Deaths: <span id="deaths${n}"></span>
            <br/>
            Final Kills: <span id="finals${n}"></span>
            <br/>
            Fkdr: <span id="fkdr${n}"></span>
            <br/>
            Winstreak: <span id="winstreak${n}"></span>
        </div>`
    return new Promise((success) => {
        success([]);
    })
}

let writeStats = (n, wins, winRate, deaths, finals, fkdr, winstreak, level, prestige) => {
    document.getElementById(`wins${n}`).innerText = wins.toString();
    document.getElementById(`winRate${n}`).innerText = winRate.toString();
    document.getElementById(`deaths${n}`).innerText = deaths.toString();
    document.getElementById(`finals${n}`).innerText = finals.toString();
    document.getElementById(`fkdr${n}`).innerText = fkdr.toString();
    document.getElementById(`winstreak${n}`).innerText = winstreak.toString();
    document.getElementById(`level${n}`).innerText = level.toString();
    document.getElementById(`prestige${n}`).innerText = prestige.toString();

}

let getCoreStats = (stats) => {
    let deaths = (stats.eight_one_final_deaths_bedwars || 0) + (stats.eight_two_final_deaths_bedwars || 0) + (stats.four_four_final_deaths_bedwars || 0) + (stats.four_three_final_deaths_bedwars || 0);
    let finals = (stats.eight_one_final_kills_bedwars || 0) + (stats.eight_two_final_kills_bedwars || 0) + (stats.four_four_final_kills_bedwars || 0) + (stats.four_three_final_kills_bedwars || 0);
    let fkdr = Math.round(finals / (deaths || 1) * 100) / 100;
    let wins = (stats.eight_one_wins_bedwars || 0) + (stats.eight_two_wins_bedwars || 0) + (stats.four_four_wins_bedwars || 0) + (stats.four_three_wins_bedwars || 0);
    let losses = (stats.eight_one_losses_bedwars || 0) + (stats.eight_two_losses_bedwars || 0) + (stats.four_four_losses_bedwars || 0) + (stats.four_three_losses_bedwars || 0);
    let winRate = Math.round(wins / (losses || 1) * 100) / 100;
    let winstreak = stats.winstreak;
    let level = getLevelForExp(stats.Experience);
    let prestige = getPrestigeForExp(stats.Experience);
    infoTemplate(0).then((res) => {
        writeStats(0, wins, winRate, deaths, finals, fkdr, winstreak, level, prestige);
    });
    // solo
    let soloDeaths = stats.eight_one_final_deaths_bedwars;
    let soloFinals = stats.eight_one_final_kills_bedwars;
    let soloFkdr = Math.round(soloFinals / (soloDeaths || 1) * 100) / 100;
    let soloWins = stats.eight_one_wins_bedwars;
    let soloLosses = stats.eight_one_losses_bedwars;
    let soloWinRate = Math.round(soloWins / (soloLosses || 1) * 100) / 100;
    infoTemplate(1).then((res) => {
        writeStats(1, wins, winRate, deaths, finals, fkdr, winstreak, level, prestige);
    });
}

window.onload = () => {
    if (localStorage.getItem('key')) {
        apiKey = localStorage.getItem('key');
        document.getElementById("apiInput").value = apiKey;
    }
}

let notifBox = document.getElementById("notifBox");
const notify = (message) => notifBox.innerText = message;

document.getElementById("apiForm").addEventListener("submit", (event) => {
    event.preventDefault();
    let inputForm = document.getElementById("apiInput");
    if (!inputForm.value) {
        notify('Field is empty');
    } else {
        notify('Verifying Api key...');
        fetch(`https://api.hypixel.net/key?key=${inputForm.value}`)
            .then(data => {
                console.log(data);
                if (data.status === 200) {
                    return data.json();
                } else if (data.status === 403) {
                    return null
                } else if (data.status === 429) {
                    return 429
                }
            }).then(res => {
            if (!res) {
                notify('Api key is invalid');
            } else if (+res === 429) {
                notify('Key throttle')
            } else {
                localStorage.setItem('key', inputForm.value);
                apiKey = inputForm.value;
                notify('Api key set');
            }
        });
    }
});

document.getElementById("mainForm").addEventListener("submit", (event) => {
    event.preventDefault();
    let inputForm = document.getElementById("searchInput");
    if (!inputForm.value) {
        notify('Field is empty');
    } else {
        if (!apiKey) {
            notify('You must set an Api key before searching. Use /api on Hypixel to obtain one');
        } else {
            notify('Searching...');
            fetch(`https://api.mojang.com/users/profiles/minecraft/${inputForm.value}`)
                .then(data => {
                    if (data.status === 200) {
                        return data.json();
                    } else if (data.status === 403) {
                        return null
                    } else if (data.status === 429) {
                        return 429
                    }
                }).then(res => {
                if (!res) {
                    notify('Username not found');
                } else if (+res === 429) {
                    notify('Key throttle');
                } else {
                    fetch(`https://api.hypixel.net/player?key=${apiKey}&uuid=${res.id}`)
                        .then(data => {
                            return data.json();
                        }).then(res => {
                        if (!res.player) {
                            notify('This account does not exist on Hypixel');
                        } else if (!res.player.stats) {
                            notify('This account does not have any stats on Hypixel');
                        } else if (!res.player.stats.Bedwars) {
                            notify('This account does not have any Bedwars stats');
                        } else {
                            notify('Stats found');
                            console.log(res.player.stats.Bedwars);
                            let stats = res.player.stats.Bedwars;
                            getCoreStats(stats);
                            enableButtons();
                        }
                    });
                }
            });
        }
    }
});
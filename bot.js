const Discord = require("discord.js");
const client = new Discord.Client();
const Client = require('node-rest-client').Client;
const twitch = require('twitch.tv');
const jsonfile = require('jsonfile');
const schedule = require('node-schedule');
const configFile = "config.json";
const restClient = new Client();
const ms = require("ms");
const queue = new Map();
var webhook = process.env.WEBHOOK;

var admin = ["Owner", "Admin", "Bunker Support"];
var roles = ["Owner", "Admin", "Bunker Support","Mods"];



const randomWord = require('random-spanish-words');
const hangman = require("./hangman.js");
const prefix = "!jugar"

const figure = [`
 +---+
 |   |      wordHere
     |
     |      numerOfLives
     |      missC
     |
 =========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
     |      numerOfLives
     |      missC
     |
 =========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
 |   |      numerOfLives
     |      missC
     |
 =========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
/|   |      numerOfLives
     |      missC
     |
 =========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
/|\\  |      numerOfLives
     |      missC
     |
 =========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
/|\\  |      numerOfLives
/    |      missC
     |
 =========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
/|\\  |      numerOfLives
/ \\  |      missC
     |
 =========  gameStatus
`];

/*
const helpEmbed = new Discord.RichEmbed()
    .addField("Start new game", "`" + prefix + " start [custom | random]`. By default is custom. Custom means one"
        + " of the players choose the word. With random, the word is choose randomly.")
    .addField("Joining the game", "Just react with the 📒 emoji or send a message with \"join\".")
    .addField("Playing the game", "When the game has started and a hangman shows up in the text channel, you have"
        + " to guess the word. If you send one character, you are asking if the character is in the word. If you"
        + " send more than one character (a word) you are guessing the whole word and if you fail, you are eliminated"
        + " from the game.")
    .setColor("#99AAB5");
*/
const runningGames = new Set();

function gatherPlayersFromMessage(channel) {
    return new Promise((resolve, reject) => {
        let players = [];
        const filter = (msg) => (msg.content.toLowerCase().includes("join") && !msg.author.bot);
        const collector = channel.createMessageCollector(filter, { time: 10000 });
        collector.on('collect', msg => {
            players.push(msg.author);
            msg.delete();
        });
        collector.on('end', async (collected) => {
            resolve(players);
        });
    });
}

async function gatherPlayersFromReaction(message, emoji) {

    await message.react(emoji);

    return new Promise(async (resolve, reject) => {
        let players = [];
        const filter = (r) => (r.emoji.name == emoji);
        //const filter = (r) => { return true; };
        await message.awaitReactions(filter, { time: 10000 })
            .then(collected => {
               

collected.first().users.forEach(function (key){
     if (!user.bot) {
                        players.push(user);
                    }
});




             



            })
            .catch(err => reject(err));

        resolve(players);
    });
}

async function gatherPlayers(channel) {
    const msg = await channel.send("Write \"join\" or react with 📒 to participate in this game! You have 10 seconds.");
    let p1 = gatherPlayersFromMessage(channel);
    let p2 = gatherPlayersFromReaction(msg, '📒');
    let aPlayers = await Promise.all([p1, p2]);
    msg.delete();
    let players = [];
    // join both arrays of players into one of unique players.
    aPlayers.forEach(ps => ps.forEach(p => {
        if (!players.find(pOther => pOther.id == p.id)) {
            players.push(p);
        }
    }));
    return players;
}

async function getNextMessage(channel, maxTime) {
    return await channel.awaitMessages((m) => !m.author.bot, { max: 1, time: maxTime, errors: ['time'] })
        .catch((collected) => { throw collected });
}

async function getWordFromPlayers(players, channel) {
    let word;
    let chosenOne;
    while (!word && players.length > 1) {
        let index = Math.floor((Math.random() * 1000) % players.length);
        chosenOne = players[index];
        players.splice(index, 1);

        const dm = await chosenOne.createDM();

        await dm.send("You are the chosen one!! Just write the word of your choice. You have 30 seconds. And remember, you can't participate in the game");
        let finish = false;
        let tries = 0;
        let msgCollection;
        while (!finish && tries < 3) {
            try {
                msgCollection = await getNextMessage(dm, 30000);
            } catch (collected) {
                await dm.send("Time's up sorry, you are disqualified.");
                await channel.send("The chosen one didn't answser... selecting ANOTHER ONE");
                finish = true;
                continue;
            }

            const msg = msgCollection.first().content;
            if (msg.match(/^[A-Za-zÀ-ú]{3,}$/)) {
                word = msg.toLowerCase();
                finish = true;
                dm.send("Nice word! Going back to the server.");
            } else {
                await dm.send("Thats not a valid word. No spaces, at least 3 characters.");
                ++tries;
                if (tries == 3) {
                    await dm.send("Sorry, too many invalid words, try again next game. You are disqualified.");
                }
            }
        }
    }

    if (!word && players.length <= 1) {
        channel.send("We ran out of players... try again, I'm sure you can do it better.");
        return;
    }

    return { word: word, selector: chosenOne }
}

async function showProgress(channel, game, gameMessage, gameOver) {
    const figureStep = figure[6 - game.lives];
    let progress = game.progress;
    let lives = "";
    for (let i = 0; i < 6; ++i) {
        if (i < game.lives) {
            lives += "❤️";
        } else {
            lives += "🖤";
        }
    }
    let misses = "Misses: ";
    for (let i = 0; i < game.misses.length; ++i) {
        misses += (game.misses[i] + " ");
    }

    let screen = figureStep.replace(/wordHere/, progress)
        .replace(/numerOfLives/, lives)
        .replace(/missC/, misses);

    const embed = new Discord.RichEmbed();
    if (gameOver) {
        if (game.status === "won") {
            embed.setColor("#00CC00");
            screen = screen.replace(/gameStatus/, "You won");
        } else {
            embed.setColor("#E50000");
            screen = screen.replace(/gameStatus/, "Game over");
        }
    } else {
        screen = screen.replace(/gameStatus/, " ");
        embed.setColor("#FFD700");
    }
    embed.setDescription("```\n" + screen + "```");

    if (gameMessage) {
        await gameMessage.edit({ embed: embed });
    } else {
        return await channel.send({ embed: embed });
    }
}

async function startGame(channel, gameType) {
    const players = await gatherPlayers(channel);
    if (players.length == 0) {
        channel.send("Maybe in another moment... no one joined the game");
        return;
    }
    if (gameType === "custom" && players.length < 2) {
        channel.send("For a custom word game, there has to be at least 2 players...");
        return;
    }

    let word;
    let selector;
    switch (gameType) {
        case "random":
            // get a random word;
            word = randomWord();
            break;
        case "custom":
            await channel.send(players.length + " players have joined. Selecting a player to choose the word. Waiting for one of you to respond. Check your DMs!!");
            let userSelection = await getWordFromPlayers(players, channel);
            if (userSelection) {
                word = userSelection.word;
                selector = userSelection.selector;
            } else {
                return;
            }
            break;
    }

    const game = new hangman(word);

    return { game, players, selector };
}

async function runGame(channel, game, players) {
    const gameMessage = await showProgress(channel, game);
    const filter = ((m) =>
        players.find((p) => (p.id == m.author.id)));

    const collector = channel.createMessageCollector(filter, { time: 900000 }); // max of 15 minutes per game

    return new Promise((resolve, reject) => {
        collector.on('collect', async (m) => {
            const c = m.content.toLowerCase();
            m.delete();
            if (m.content.match(/^[A-Za-zÀ-ú]{2,}$/)) {
                if (game.guessAll(c) == false) {
                    players.splice(players.find(p => m.author.id == p.id), 1);
                }
            } else if (m.content.match(/^[A-Za-zÀ-ú]{1}$/)) {
                game.guess(c);
            } else {
                return;
            }
            await showProgress(channel, game, gameMessage);

            if (game.status !== "in progress") {
                collector.stop();
            } else if (players.length < 1) {
                collector.stop();
                game.status = "lost";
            }
        });
        collector.on('end', async (collected) => {
            await showProgress(channel, game, gameMessage, true);
            resolve();
        });
    });
}

async function showResult(channel, game, selector) {
    if (game.status === "won") {
        if (selector) {
            channel.send(`You won!! You guessed the word. ${selector.username}... you need to suggest a more difficult word next time`);
        } else {
            channel.send("You win this time...");
        }
    } else if (game.status === "lost") {
        if (selector) {
            channel.send(`${selector.username} has won all of you!!. Try harder nest time. The word was ${game.word}.`);
        } else {
            channel.send(`I win!! Machines will rise and will kill all the wumpuses. The word was ${game.word}.`);
        }
    } else {
        channel.send("The game ended, the 15 minutes time limit was reached.");
    }
}

client.on('message', async (msg) => {
    if (!msg.author.bot && msg.content.startsWith(prefix) && msg.channel.type === "text") {
        const args = msg.content.slice(prefix.length).trim().split(' ').filter(word => word.trim().length > 0);
        switch (args[0]) {
            case "start":
                if (!runningGames.has(msg.guild)) {
                    let gameType = "custom";
                    if (args[1]) switch (args[1]) {
                        case "random":
                            gameType = "random";
                            break;
                        case "custom":
                            gameType = "custom";
                            break;
                        default:
                            msg.reply("Games can be \"custom\" or \"random\"");
                            return;
                    }

                    runningGames.add(msg.channel.guild);

                    let game, players, selector;
                    const gameInfo = await startGame(msg.channel, gameType);
                    if (gameInfo) {
                        game = gameInfo.game;
                        players = gameInfo.players;
                        selector = gameInfo.selector;
                        await runGame(msg.channel, game, players);
                        await showResult(msg.channel, game, selector);
                    }

                    runningGames.delete(msg.channel.guild);
                } else {
                    msg.reply("There's already a game running on this server.");
                }
                break;
                /*
            case "help":
                msg.channel.send({ embed: helpEmbed });
                break;
                */
        }
    }
});



//  sSTART  //  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  


client.login(process.env.BOT_TOKEN);

client.on("ready", () => {
    console.log("Bot iniciado");


    client.user.setActivity(process.env.GAME, { type: 'WATCHING' })
    .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
    .catch(console.error);
});





client.on("guildCreate", guild => {
    console.log(`Nuevo guild: ${guild.name} (id: ${guild.id}). Este guild tiene ${guild.memberCount} miembros.`);

    client.user.setActivity(process.env.GAME, { type: 'WATCHING' })
    .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
    .catch(console.error);

});




//  TWITCH  //  TWITCH  //  TWITCH  //  TWITCH  //  TWITCH  //  TWITCH  //  TWITCH  //  TWITCH  //  TWITCH  //  TWITCH  //  TWITCH  




const job = schedule.scheduleJob('/1 * * * * *', () => {
    jsonfile.readFile(configFile, (err, config) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Config cargada, chequeo de streams...");
        for (const stream of config.streams) {
           // console.log(`Check de ${stream.nickname}`);
            twitch(`streams/${stream.id}`, config.twitchAuth, (err, twitchResponse) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (!twitchResponse.stream) {
                    console.log(`Twitch ID ${stream.nickname} (${stream.id}) está off.`);
                    return;
                }
                if (stream.latestStream === twitchResponse.stream._id) {
                    console.log(`Stream ya posteado. Twitch ID ${stream.nickname} (${stream.id})`);
                    return;
                }
                console.log(`Twitch ID ${stream.id} (${stream.nickname}) está stremeando!`);
                stream.latestStream = twitchResponse.stream._id;
                jsonfile.writeFile(configFile, config, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                if (!twitchResponse.stream.game) {
                    twitchResponse.stream.game = "Not Playing";
                }
                stream.receivers.forEach((receiver) => {
                    const args = buildWebHook(twitchResponse, receiver);
                    restClient.post(webhook, args, function (data, webhookResponse) {
                        console.log(`Webhook enviado a ${receiver.nickname}`);
                    });
                });
            });
        }
    });
});

function buildWebHook(twitchResponse, receiver) {
	
	
	//Seteo el estado del bot al stream.
	client.user.setPresence({ game: { name: receiver.nickname, type: "streaming", url: receiver.url}});
	
    return {
        data: {
            "username": `${twitchResponse.stream.channel.display_name}`,
            "avatar_url": `${twitchResponse.stream.channel.logo}`,
            "content": `${receiver.customMessage}`,
            "embeds": [{
                "author": {
                    "name": `${twitchResponse.stream.channel.display_name}`,
                    "icon_url": `${twitchResponse.stream.channel.logo}`
                },
                "title": `EN VIVO: ${twitchResponse.stream.channel.status}`,
                "url": `${twitchResponse.stream.channel.url}`,
                "color": 6570404,
                "fields": [{
                    "name": "Juego",
                    "value": `${twitchResponse.stream.game}`,
                    "inline": true
                },
                {
                    "name": "Viewers",
                    "value": `${twitchResponse.stream.viewers}`,
                    "inline": true
                }
                ],
                "image": {
                    "url": `${twitchResponse.stream.preview.large}`
                },
                "thumbnail": {
                    "url": `${twitchResponse.stream.channel.logo}`
                },
                "footer": {
                    "text": `/${twitchResponse.stream.channel.name}`,
                    "icon_url": `https://cdn.discordapp.com/attachments/250501026958934020/313483431088619520/GlitchBadge_Purple_256px.png`
                }
            }]
        },
        headers: {
            "Content-Type": "application/json"
        }
    };
}







//   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   




client.on("message", async message => {
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const argsM = message.content.split(' ');
    const searchString = argsM.slice(1).join(' ');
    const url = argsM[1] ? argsM[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(message.guild.id);

    if (message.content.includes("huevo")) {
       message.react("537716624296378399");
    }



    if (message.content.startsWith("&ping")){
        const m = await message.channel.send("Ping?");
        m.edit(`Tu ping es de ${m.createdTimestamp - message.createdTimestamp}ms. API ping: ${Math.round(client.ping)}ms`);
    }




    if (message.content.startsWith("&say")){
     if (!message.member.hasPermission("BAN_MEMBERS"))
        return 0;
    const sayMessage = args.join(" ");
    message.delete().catch(O_o => {
    });
    message.channel.send(sayMessage);
}




	// BIG 

	function isSpace(aChar){ 
      myCharCode = aChar.charCodeAt(0);

      if(((myCharCode >  8) && (myCharCode < 14)) ||
       (myCharCode == 32))
      {
       return true;
   }
   
   return false;
}

function isNumber(input) {
    return !isNaN(input);
}


if (message.content.startsWith("&big")){
  if (!message.member.hasPermission("BAN_MEMBERS"))
    return 0;
const sayMessage = args.join(" ");
let arr = Array.from(sayMessage.toLowerCase());
var salida = "";
var tam = arr.length;
var i;
for (i = 0; i < tam; i++) {
    if(isSpace(arr[i])){
      salida = salida + "   ";	        
  }else{
  }if(isNumber(arr[i])){

   if(arr[i]=="0") salida= salida + ":zero:";
   if(arr[i]=="1") salida= salida + ":one:";
   if(arr[i]=="2") salida= salida + ":two:";
   if(arr[i]=="3") salida= salida + ":three:";
   if(arr[i]=="4") salida= salida + ":four:";
   if(arr[i]=="5") salida= salida + ":five:";
   if(arr[i]=="6") salida= salida + ":six:";
   if(arr[i]=="7") salida= salida + ":seven:";
   if(arr[i]=="8") salida= salida + ":eight:";
   if(arr[i]=="9") salida= salida + ":nine:";


}else{
	salida= salida + ":regional_indicator_"+arr[i]+":";   
	
}


}	 
message.delete().catch(O_o => {
});
message.channel.send(salida.toString());
}



	if (message.content.startsWith("&uptime")){
        if (!message.member.hasPermission("BAN_MEMBERS"))
            return 0;
        message.delete();

        var days = client.uptime / 8.64e7 | 0;
        var hrs  = (client.uptime % 8.64e7)/ 3.6e6 | 0;
        var mins = Math.round((client.uptime % 3.6e6) / 6e4);	
        message.channel.send(`__**BOT UPTIME:**__ ${days} DIAS ${hrs} HS ${mins} MINS`); 	
    }






});








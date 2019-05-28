const Discord = require("discord.js");
const client = new Discord.Client();
const Client = require('node-rest-client').Client;
const ytdl = require('ytdl-core-discord');
const twitch = require('twitch.tv');
const jsonfile = require('jsonfile');
const schedule = require('node-schedule');
const configFile = "config.json";
const restClient = new Client();
const ms = require("ms");
const Util = require('discord.js');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YT_API);
const queue = new Map();
var webhook = process.env.WEBHOOK;

//mixer
const fetch = require('node-fetch');
const Carina = require('carina').Carina;
const ws = require('ws');
const merge = require('merge');
Carina.WebSocket = ws;


class MixerDiscordBot{

const messageStart = (channelInfo) => {
    return `Benex está en vivo en Mixer! https://mixer.com/6998977!`
};



const defaultOptions = {
    messageStart: messageStart
};

  function  ready(fn){
        this.readyFn = fn;
    }

  function  start() {
        this.ca = new Carina({ isBot: true }).open();
        this.loadInfo().then(this.subscibe);
    }

   function loadInfo(){
        const infourl = `https://mixer.com/api/v1/channels/6998977`;
	    //const infourl = `https://mixer.com/api/v1/channels/${this.config.channelId}`;
        return fetch(infourl).then((data) => {
            return data.json()
        }).then((data) => {
            this.channelInfo = data;
            this.readyFn();
        });
    }
    function subscribe() {
        this.ca.subscribe(`channel:6998977:update`, data => {
            if(data.online){
                this.notifyOnStart();
            } else {
                this.notifyOnEnd();
            }
        });

    }

  function  postToDiscord(message){
        const body = {'content': message};
        fetch(webhook, {
            method: 'POST', headers: {
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    }

  function  notifyOnStart(){
       
            const message = this.options.messageStart(this.channelInfo);
            this.postToDiscord(message);
        
    }


}


//mixer



var admin = ["Owner", "Admin", "Bunker Support"];
var roles = ["Owner", "Admin", "Bunker Support","Mods"];






//  sSTART  //  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  




client.on("ready", () => {
    console.log(`Bot iniciado ${client.users.size} usuarios en ${client.channels.size} canales.`);
	var channel = client.channels.get('555060758485008396');
  channel.send("Reiniciado.");
	client.user.setActivity(process.env.GAME, { type: 'WATCHING' })
  .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
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
	var mixer = new MixerDiscordBot();
	mixer.subscribe();
    console.log("Twitch iniciado.");
    jsonfile.readFile(configFile, (err, config) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Config Loaded, checking streams...");
        for (const stream of config.streams) {
            console.log(`Check de ID ${stream.nickname}`);
            twitch(`streams/${stream.id}`, config.twitchAuth, (err, twitchResponse) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (!twitchResponse.stream) {
                    console.log(`Twitch ID ${stream.id} (${stream.nickname}) está off.`);
                    return;
                }
                if (stream.latestStream === twitchResponse.stream._id) {
                    console.log(`Stream ya posteado. Twitch ID ${stream.id} (${stream.nickname})`);
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
                        console.log(`Sent webhook to ${receiver.nickname}`);
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



//  YOUTUBE  //  YOUTUBE  //  YOUTUBE  //  YOUTUBE  //  YOUTUBE  //  YOUTUBE  //  YOUTUBE  //  YOUTUBE  //  YOUTUBE  //  YOUTUBE  




async function handleVideo(video, message, voiceChannel, playlist = false) {
    const serverQueue = queue.get(message.guild.id);
    console.log(video);
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            queue.delete(message.guild.id);
            return message.channel.send(`No puedo entrar al canal de voz: ${error}`);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        if (playlist)
            return undefined;
        else
            return message.channel.send(`**${song.title}** agregado a la cola!`);
    }
    return undefined;
}
async function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    console.log(serverQueue.songs);
    const dispatcher = serverQueue.connection.playOpusStream(await ytdl(song.url))
            .on('end', reason => {
                if (reason === 'Stream is not generating quickly enough.')
                    console.log('Song ended.');
                else
                    console.log(reason);
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Reproduciendo: **${song.title}**`);
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
        message.react(client.emojis.get("537716624296378399"));
    }
	

 
 if (message.content.startsWith("&ping")){
        const m = await message.channel.send("Ping?");
        m.edit(`Tu ping es de ${m.createdTimestamp - message.createdTimestamp}ms. API ping: ${Math.round(client.ping)}ms`);
    }
	
	
	
  
    if (message.content.startsWith("&say")){
        if (!message.member.roles.some(r => admin.includes(r.name)))
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
	
	
	 if (message.content.startsWith("!big")){
        if (!message.member.roles.some(r => admin.includes(r.name)))
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
	
	
	
	//BIG
	
	
	
	
	
	
	

	//Si se buggea el bot, para sacarlo del canal de voz.
	if (message.content.startsWith("&quit")){
        message.member.voiceChannel.leave();
	message.delete();
	}
		
   
	
	
	
    if (message.content.startsWith("&play")){
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel)
            return message.channel.send('Metete en en canal de voz, crack!');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) {
            return message.channel.send('No tengo permisos para entrar a este canal.');
        }
        if (!permissions.has('SPEAK')) {
            return message.channel.send('No tengo permisos para hablar en este canal.');
        }
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id); 
                await handleVideo(video2, message, voiceChannel, true); 
            }
            return message.channel.send(`? Playlist: **${playlist.title}** ha sido agregado a la cola!`);
        } else {
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    message.channel.send(`
__**Selecciona el temaiken:**__ \n
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Pone un numero de 1-10.
					`);
                 
                    try {
                        var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                            maxMatches: 1,
                            time: 10000,
                            errors: ['time']
                        });
                    } catch (err) {
                        console.error(err);
                        return message.channel.send('Ingresa un valor valido, busqueda cancelada.');
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return message.channel.send('No hay resultados.');
                }
            }
            return handleVideo(video, message, voiceChannel);
        }
    }
   if (message.content.startsWith("&skip")){
        if (!message.member.voiceChannel)
            return message.channel.send('Ingresa en un canal de voz!');
        if (!serverQueue)
            return message.channel.send('No hay nada reproduciendose.');
        serverQueue.connection.dispatcher.end('Skipea3');
        return undefined;
    }
	 
    if (message.content.startsWith("&stop")){
        if (!message.member.voiceChannel)
            return message.channel.send('Ingresa en un canal de voz!');
        if (!serverQueue)
            return message.channel.send('No hay nada reproduciendose.');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end('Reproducción detenida.');
        return undefined;
    }
    if (message.content.startsWith("&vol")){
        if (!message.member.voiceChannel)
            return message.channel.send('Ingresa en un canal de voz!');
        if (!serverQueue)
            return message.channel.send('No hay nada reproduciendose.');
        if (!argsM[1])
            return message.channel.send(`Volumen actual: **${serverQueue.volume}**`);
        serverQueue.volume = argsM[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(argsM[1] / 5);
        return message.channel.send(`Volumen actual: **${argsM[1]}**`);
    }
    if (message.content.startsWith("&song")){
        if (!serverQueue)
            return message.channel.send('No hay nada reproduciendose.');
        return message.channel.send(`Reproduciendo: **${serverQueue.songs[0].title}**`);
    }
   if (message.content.startsWith("&list")){
        if (!serverQueue)
            return message.channel.send('No hay nada reproduciendose.');
        return message.channel.send(`
__**Lista de reproducción:**__\n
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
		`);
    }
    if (message.content.startsWith("&pause")){
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return message.channel.send('Pausa3!');
        }
        return message.channel.send('No hay nada reproduciendose.');
    }
    if (message.content.startsWith("&resume")){
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return message.channel.send('Resumiending!');
        }
        return message.channel.send('No hay nada reproduciendose.');
    }
    if (message.content.startsWith("&music")){
        return message.reply("\n!play (nombre/link/playlist) - reproduce o agrega a la lista\n!skip - salta la cancion\n!stop - para la musica\n!vol (1-10) - cambia el volumen\n!song - nombre de la cancion\n!list - muestra la lista de reproduccion\n!pause - pausa la reproduccion\n!resume - reanuda la reproduccion\n!quit - saca al bot del canal (en caso de bug)");
    }
	
	
	 
	 
	if (message.content.startsWith("&uptime")){
	 if (!message.member.roles.some(r => roles.admin(r.name)))
            return 0;
message.delete();
		
    var days = client.uptime / 8.64e7 | 0;
  var hrs  = (client.uptime % 8.64e7)/ 3.6e6 | 0;
  var mins = Math.round((client.uptime % 3.6e6) / 6e4);	
message.channel.send(`__**BOT UPTIME:**__ ${days} DIAS ${hrs} HS ${mins} MINS`); 	
	}
	 
	
	

	
	
});
client.login(process.env.BOT_TOKEN);

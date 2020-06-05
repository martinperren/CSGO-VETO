const Discord = require("discord.js");
const client = new Discord.Client();
const Client = require('node-rest-client').Client;
const twitch = require('twitch.tv');
const jsonfile = require('jsonfile');
const schedule = require('node-schedule');
const configFile = "config.json";
const restClient = new Client();
const ms = require("ms");
var webhook = process.env.WEBHOOK;
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
                    twitchResponse.stream.game = "Ninguno";
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
                "title": `${twitchResponse.stream.channel.status}`,
                "url": `${twitchResponse.stream.channel.url}`,
                "color": 6570404,
                "fields": [{
                    "name": "Juego",
                    "value": `${twitchResponse.stream.game}`,
                    "inline": true
                },
                {
                    "name": "Espectadores",
                    "value": `${twitchResponse.stream.viewers}`,
                    "inline": true
                }
                ],
                "image": {
                    "url": `${twitchResponse.stream.preview.medium}`
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
const sayMessage = args.join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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








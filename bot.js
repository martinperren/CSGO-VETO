const Discord = require('discord.js');
const client = new Discord.Client();
var maps;
var mapsLeft;
var allowBan = false;

var items = ['dust2','cache','mirage','nuke','overpass','train','inferno'];
var picked = [];
var banned = [];



client.on('ready', () => {
    console.log('I am ready!');
     console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
client.user.setGame(`Counter-Strike`);	
});
client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
client.user.setGame(`Counter-Strike`);	
});
client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
 client.user.setGame(`Counter-Strike`);		
});






///////////////////////////////////////////////////


client.on('message', message => {
    if (message.content.toLowerCase() === '!mapsleft') {
        message.reply("Mapas disponibles: "+maps + " ("+(mapsLeft - 1)+")");
    }
});



client.on('message', message => {
    if (message.content.toLowerCase() === '!bo1') {
        maps = 'dust2, cache, inferno, mirage, nuke, overpass, train';
        message.reply('Veto iniciado. Usa !veto (mapa) para banear uno de los siguientes: ' + maps);
        mapsLeft = maps.split(",").length;
        allowBan=true;
    }
});



client.on('message', message => {
    if (message.content.toLowerCase() === '!veto dust2' && maps.indexOf('dust2')!= -1 && allowBan) {
        maps = maps.replace('dust2, ', '');
        mapsLeft = maps.split(",").length;
         message.reply('Dust 2 eliminado. Mapas disponibles: ' + maps);
        if(mapsLeft==2)
        {
       message.channel.sendEmbed({ color: 3447003, description: `**Mapa:** ${maps}` });
        }
    }
});



client.on('message', message => {
    if (message.content.toLowerCase() === '!veto cache' && maps.indexOf('cache')!= -1 && allowBan) {
        maps = maps.replace('cache, ', '');
        mapsLeft = maps.split(",").length;
        message.reply('Cache eliminado. Mapas disponibles: ' + maps);
        if(mapsLeft==2)
        {
          message.channel.sendEmbed({ color: 3447003, description: `**Mapa:** ${maps}` });
        }
    }
});

client.on('message', message => {
    if (message.content.toLowerCase() === '!veto mirage' && maps.indexOf('mirage')!= -1 && allowBan) {
        maps = maps.replace('mirage, ', '');
        mapsLeft = maps.split(",").length;
         message.reply('Mirage eliminado. Mapas disponibles: ' + maps);
        if(mapsLeft==2)
        {
            message.channel.sendEmbed({ color: 3447003, description: `**Mapa:** ${maps}` });
        }
    }
});


client.on('message', message => {
    if (message.content.toLowerCase() === '!veto nuke' && maps.indexOf('nuke')!= -1 && allowBan) {
        maps = maps.replace('nuke, ', '');
         message.reply('Nuke eliminado. Mapas disponibles: ' + maps);
        mapsLeft = maps.split(",").length;
        if(mapsLeft==2)
        {
             message.channel.sendEmbed({ color: 3447003, description: `**Mapa:** ${maps}` });
        }
    }
});



client.on('message', message => {
    if (message.content.toLowerCase() === '!veto overpass' && maps.indexOf('overpass')!= -1 && allowBan) {
        maps = maps.replace('overpass, ', '');
         message.reply('Overpass eliminado. Mapas disponibles: ' + maps);
        mapsLeft = maps.split(",").length;
        if(mapsLeft==2)
        {
            message.channel.sendEmbed({ color: 3447003, description: `**Mapa:** ${maps}` });
        }
    }
});


client.on('message', message => {
    if (message.content.toLowerCase() === '!veto train' && maps.indexOf('train')!= -1 && allowBan) {
        maps = maps.replace('train', '');
         message.reply('Train eliminado. Mapas disponibles: ' + maps);
        mapsLeft = maps.split(",").length;
        if(mapsLeft==2)
        {
             message.channel.sendEmbed({ color: 3447003, description: `**Mapa:** ${maps}` });
        }
    }
});


client.on('message', message => {
    if (message.content.toLowerCase() === '!veto inferno' && maps.indexOf('inferno')!= -1 && allowBan ) {
        maps = maps.replace('inferno, ', '');
        message.reply('Inferno eliminado. Mapas disponibles: ' + maps);
        mapsLeft = maps.split(",").length;
        if(mapsLeft==2)
        {
             message.channel.sendEmbed({ color: 3447003, description: `**Mapa:** ${maps}` });
        }
    }
});




client.on('message',message=> {
    if(message.content.toLowerCase() === '!randommap' || message.content.toLowerCase() === '!random map' ) {
     message.reply( items[Math.floor(Math.random()*items.length)] );
    }
});


client.on('message', message => {
    if (message.content.startsWith("!cc")){
        // Let's delete the command message, so it doesn't interfere with the messages we are going to delete.
        // Now, we want to check if the user has the `bot-commander` role, you can change this to whatever you want.
        if (!message.member.roles.some(r => ["OWNER", "Admins"].includes(r.name)))
            return 0;
        async function purge() {
            message.delete(); // Let's delete the command message, so it doesn't interfere with the messages we are going to delete.
            // Now, we want to check if the user has the `bot-commander` role, you can change this to whatever you want.
            // We want to check if the argument is a number
            if (isNaN(args[0])) {
                // Sends a message to the channel.
                message.channel.send('Pone un número despues del comando.'); //\n means new line.
                // Cancels out of the script, so the rest doesn't run.
                return;
            }
            const fetched = await message.channel.fetchMessages({limit: args[0]}); // This grabs the last number(args) of messages in the channel.
            console.log(fetched.size + ' messages found, deleting...'); // Lets post into console how many messages we are deleting
            // Deleting the messages
            message.channel.bulkDelete(fetched);
        }
        // We want to make sure we call the function whenever the purge command is run.
        purge(); // Make sure this is inside the if(msg.startsWith)
        // We want to make sure we call the function whenever the purge command is run.
    }

});



client.login(process.env.BOT_TOKEN);

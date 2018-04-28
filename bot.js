const Discord = require('discord.js');
const client = new Discord.Client();
var maps;
var mapsLeft;
var allowBan = false;

var items = ['cache','dust2','inferno','mirage','nuke','overpass','train'];
var PFitems = ['cache','dust2','inferno','mirage','nuke','overpass','train','subzero','dust2','canals'];


client.on('ready', () => {
    console.log('I am ready!');
     console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
client.user.setGame(`Counter-Strike Global Offensive`);	
});
client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setGame(`Counter-Strike Global Offensive`);	
});
client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
 client.user.setGame(`Counter-Strike Global Offensive`);	
});
});

client.on('message', message => {
    if (message.content.toLowerCase() === '!mapveto' || message.content.toLowerCase() === '!map veto') {
        message.reply('Enter !ActiveDutyVeto  OR  !PopflashVeto');
        mapsLeft = 50;
    }
});


client.on('message', message => {
    if (message.content.toLowerCase() === '!mapsleft') {
        message.reply("Maps left: "+maps + " ("+(mapsLeft - 1)+")");
    }
});



client.on('message', message => {
    if (message.content.toLowerCase() === '!activedutyveto') {
        maps = 'dust2, cache, inferno, mirage, nuke, overpass, train';
        message.reply('Active Duty Map Veto starting: Type !veto MapName to ban any of the following maps: ' + maps);
        mapsLeft = maps.split(",").length;
        allowBan=true;
    }
});

client.on('message', message => {
    if (message.content.toLowerCase() === '!popflashveto') {
        maps = 'subzero, dust2, canals, cobble, cache, inferno, mirage, nuke, overpass, train';
        message.reply('Popflash Map Veto starting: Type !veto MapName to ban any of the following maps: ' + maps);
        mapsLeft = maps.split(",").length;
        allowBan=true;
    }
});

client.on('message', message => {
    if (message.content.toLowerCase() === '!veto dust2' && maps.indexOf('dust2')!= -1 && allowBan) {
        maps = maps.replace('dust2, ', '');
        message.reply('Dust 2 removed. Maps left: ' + maps);
        mapsLeft = maps.split(",").length;
        if(mapsLeft==2)
        {
            message.reply("Map left: " + maps);
        }
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





client.on('message', message => {
    if (message.content.toLowerCase() === '!veto cache' && maps.indexOf('cache')!= -1 && allowBan) {
        maps = maps.replace('cache, ', '');
        mapsLeft = maps.split(",").length;
        message.reply('Cache removed. Maps left: ' + maps);
        if(mapsLeft==2)
        {
            message.reply("Map left: " + maps);
        }
    }
});

client.on('message', message => {
    if (message.content.toLowerCase() === '!veto mirage' && maps.indexOf('mirage')!= -1 && allowBan) {
        maps = maps.replace('mirage, ', '');
        mapsLeft = maps.split(",").length;
        message.reply('Mirage removed. Maps left: ' + maps);
        if(mapsLeft==2)
        {
            message.reply("Map left: " + maps);
        }
    }
});


client.on('message', message => {
    if (message.content.toLowerCase() === '!veto nuke' && maps.indexOf('nuke')!= -1 && allowBan) {
        maps = maps.replace('nuke, ', '');
        message.reply('Nuke removed. Maps left: ' + maps);
        mapsLeft = maps.split(",").length;
        if(mapsLeft==2)
        {
            message.reply("Map left: " + maps);
        }
    }
});



client.on('message', message => {
    if (message.content.toLowerCase() === '!veto overpass' && maps.indexOf('overpass')!= -1 && allowBan) {
        maps = maps.replace('overpass, ', '');
        message.reply('Overpass removed. Maps left: ' + maps);
        mapsLeft = maps.split(",").length;
        if(mapsLeft==2)
        {
            message.reply("Map left: " + maps);
        }
    }
});


client.on('message', message => {
    if (message.content.toLowerCase() === '!veto train' && maps.indexOf('train')!= -1 && allowBan) {
        maps = maps.replace('train', '');
        message.reply('Train removed. Maps left: ' + maps);
        mapsLeft = maps.split(",").length;
        if(mapsLeft==2)
        {
            message.reply("Map left: " + maps);
        }
    }
});


client.on('message', message => {
    if (message.content.toLowerCase() === '!veto inferno' && maps.indexOf('inferno')!= -1 && allowBan ) {
        maps = maps.replace('inferno, ', '');
        message.reply('Inferno removed. Maps left: ' + maps);
        mapsLeft = maps.split(",").length;
        if(mapsLeft==2)
        {
            message.reply("Map left: " + maps);
        }
    }
});


client.on('message', message => {
    if (message.content.toLowerCase() === '!veto canals' && maps.indexOf('canals')!= -1 &&allowBan) {
        maps = maps.replace('canals, ', '');
        message.reply('Canals removed. Maps left: ' + maps);
        mapsLeft = maps.split(",").length;
        if(mapsLeft==2)
        {
            message.reply("Map left: " + maps);
        }
    }
});

client.on('message', message => {
    if (message.content.toLowerCase() === '!veto subzero' && maps.indexOf('subzero')!= -1 &&allowBan) {
        maps = maps.replace('subzero, ', '');
        message.reply('Subzero removed. Maps left: ' + maps);
        mapsLeft = maps.split(",").length;
        if(mapsLeft==2)
        {
            message.reply("Map left: " + maps);
        }
        
    }
});

client.on('message', message => {
    if (message.content.toLowerCase() === '!veto dust2' && maps.indexOf('dust2')!= -1 &&allowBan) {
        maps = maps.replace('dust2, ', '');
        message.reply('Dust 2 removed. Maps left: ' + maps);
        mapsLeft = maps.split(",").length;
        if(mapsLeft==2)
        {
            message.reply("Map left: " + maps);
        }
    }
});
client.on('message', message => {
    if (message.content.toLowerCase() === '!veto dust 2' && maps.indexOf('dust2')!= -1 &&allowBan) {
        maps = maps.replace('dust2, ', '');
        message.reply('Dust 2 removed. Maps left: ' + maps);
        mapsLeft = maps.split(",").length;
        if(mapsLeft==2)
        {
            message.reply("Map left: " + maps);
        }
       
    }
});


client.on('message',message=> {
    if(message.content.toLowerCase() === '!randommap' || message.content.toLowerCase() === '!random map' ) {
     message.reply( items[Math.floor(Math.random()*items.length)] );
    }
});



client.on('message',message=> {
    if(message.content.toLowerCase() === '!randompopflashmap' || message.content.toLowerCase() === '!random popflash map' ) {
     message.reply( PFitems[Math.floor(Math.random()*PFitems.length)] );
    }
});


client.login(process.env.BOT_TOKEN);

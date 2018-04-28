const Discord = require('discord.js');
const client = new Discord.Client();
var maps;
var mapsLeft;
var allowBan = false;

var items = ['cache','dust2','inferno','mirage','nuke','overpass','train'];
var PFitems = ['cache','dust2','inferno','mirage','nuke','overpass','train','subzero','dust2','canals'];


client.on('ready', () => {
    console.log('I am ready!');
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

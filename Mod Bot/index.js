const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const ms = require("ms");
const fs = require("fs");


bot.on("ready", async () => {
    console.log(`${bot.user.username} is online and protecting ${bot.guilds.size} servers!`);
    bot.user.setActivity(`over the lil mods`, {type: "WATCHING"});


});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    let prefix = "#"
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(cmd === `${prefix}ban`){
        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!bUser) return message.channel.send("Can't find user!");
        let bReason = args.join(" ").slice(22);
        if(!bReason) return message.channel.send("You didn't log a reason!")
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("No can do pal!");
        if(bUser.hasPermission("BAN_MEMBERS")) return message.channel.send("That person can't be banned!");
        let banEmbed = new Discord.RichEmbed()
        .setDescription("__Ban__")
        .setColor("#bc0000")
        .addField("Banned User", `${bUser}`)
        .addField("Banned By", `<@${message.author.id}>`)
        .addField("Banned In", message.channel)
        .addField("Time", message.createdAt)
        .addField("Reason", bReason);
        let incidentchannel = message.guild.channels.find(`name`, "mod-log");
        if(!incidentchannel) return message.channel.send("Can't find incidents channel.");
        message.guild.member(bUser).ban(bReason);
        incidentchannel.send(banEmbed);
    }
    
    if(cmd === `${prefix}kick`){
        let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!kUser) return message.channel.send("Can't find user!");
        let kReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("No can do pal!");
        if(kUser.hasPermission("KICK_MEMBERS")) return message.channel.send("That person can't be kicked!");
        let kickEmbed = new Discord.RichEmbed()
        .setDescription("~Kick~")
        .setColor("#e56b00")
        .addField("Kicked User", `${kUser}`)
        .addField("Kicked By", `<@${message.author.id}>`)
        .addField("Kicked In", message.channel)
        .addField("Tiime", message.createdAt)
        .addField("Reason", kReason);
        let kickChannel = message.guild.channels.find(`name`, "mod-log");
        if(!kickChannel) return message.channel.send("Can't find incidents channel.");
        message.guild.member(kUser).kick(kReason);
        kickChannel.send(kickEmbed);
    }

    if(cmd === `${prefix}mute`){
        let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tomute) return message.channel.send("Couldn't find user.");
        if(tomute.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Can't mute them!");
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("No can do pal!");
        let muterole = message.guild.roles.find(`name`, "Muted - Mod Bot Role");
        let mutetime = args[1];
        //Start of logging embed
        let muteLog = new Discord.RichEmbed()
        .setDescription("Mute")
        .setColor("#1ff230")
        .addField("Muted By", `<@${message.author.id}>`)
        .addField("Muted User", tomute)
        .addField("Time Muted", mutetime);
        //End of Logging embed
        let muteChannel = message.guild.channels.find(`name`, "mod-log");
        muteChannel.send(muteLog);
        //start of create role
        if(!muterole){
          try{
            muterole = await message.guild.createRole({
              name: "Muted - Mod Bot Role",
              color: "#000000",
              permissions:[]
            })
            message.guild.channels.forEach(async (channel, id) => {
              await channel.overwritePermissions(muterole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false  
              });
            });
          }catch(e){
            console.log(e.stack);
          }
        }
        //end of create role
        if(!mutetime) return message.reply("You didn't specify a time!");
        await(tomute.addRole(muterole.id));
        setTimeout(function(){
          tomute.removeRole(muterole.id);
        }, ms(mutetime));
      }

      if(cmd === `${prefix}report`){
        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!rUser) return message.channel.send("Couldn't find user.");
        let rreason = args.join(" ").slice(22);
    
        let reportEmbed = new Discord.RichEmbed()
        .setDescription("Reports")
        .setColor("#1fb6f1")
        .addField("Reported User", `${rUser}`)
        .addField("Reported By", `${message.author}`)
        .addField("Channel", message.channel)
        .addField("Time", message.createdAt)
        .addField("Reason", rreason);
    
        let reportschannel = message.guild.channels.find(`name`, "reports");
        if(!reportschannel) return message.channel.send("Couldn't find reports channel.");
    
    
        message.delete().catch(O_o=>{});
        reportschannel.send(reportEmbed);
    
    }
});

bot.login("NTc1Njc2NzExMzAwMjM1Mjg0.XRyQ7w.FWWE-yz9m2brNhXIoTOEebrwt8E");
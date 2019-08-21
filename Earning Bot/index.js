var Discord = require('discord.js');
var auth = require('./auth.json');
const fetch = require('node-fetch');
require('http').createServer().listen(3000)
require('dotenv').config()

const API = `${process.env.API}`

var bot = new Discord.Client({
   token: process.env.TOKEN,
   autorun: true
});  

bot.login(auth.token);

bot.on("ready", async () => {
    await console.log(`${bot.user.username} is online and serving ${bot.guilds.size} servers!`);
    bot.user.setActivity(`Salad Chef Earnings`, {type: "WATCHING"});
});
  

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (cmd === '!Earnings') {
        const reqGpus = await fetch(API + '/gpus').then(response => response.json());

        let gpuArray = []

        reqGpus.forEach(element => {
            gpuArray.push(`${element.name}: ${element.earningRate}`)
        })
    
        message.channel.send(gpuArray);
    }
});
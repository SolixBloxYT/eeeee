const { Client, Intents } = require('discord.js');
const keepAliveServer = require('./keep_alive.js');

const bot = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]
});

const startTime = Date.now(); // Store the bot's start time

bot.on('guildMemberAdd', (member) => {
    const channelId = '1196738471843340320'; // The Channel ID you just copied
    const welcomeMessage = `Hey <@${member.id}>! Welcome to my server!`;
    member.guild.channels.fetch(channelId).then(channel => {
        channel.send(welcomeMessage);
    });
});

bot.on('messageCreate', (message) => {
    if (message.author.bot) return; // Ignore messages from other bots

    // !ping command
    if (message.content.toLowerCase() === '!ping') {
        const apiLatency = Math.round(bot.ws.ping);
        const botLatency = Date.now() - message.createdTimestamp;
        message.reply(`Pong! API Latency: ${apiLatency}ms, Bot Latency: ${botLatency}ms`);
    }

    // !uptime command
    if (message.content.toLowerCase() === '!uptime') {
        const uptime = Date.now() - startTime;
        const formattedUptime = formatUptime(uptime);
        message.reply(`Bot Uptime: ${formattedUptime}`);
    }

    // !botinfo command
    if (message.content.toLowerCase() === '!botinfo') {
        const botInfo = `Bot Tag: ${bot.user.tag}\nBot ID: ${bot.user.id}`;
        message.reply(botInfo);
    }

    // !userinfo command
    if (message.content.toLowerCase() === '!userinfo') {
        const userInfo = `Your Tag: ${message.author.tag}\nYour ID: ${message.author.id}`;
        message.reply(userInfo);
    }

    // !serverinfo command
    if (message.content.toLowerCase() === '!serverinfo') {
        const serverInfo = `Server Name: ${message.guild.name}\nServer ID: ${message.guild.id}`;
        message.reply(serverInfo);
    }

    // Greeting
    if (message.content.toLowerCase().includes('hey bot') || message.content.toLowerCase().includes('solixblox')) {
        message.channel.send('Hello there!');
    }
});

bot.on('ready', () => {
    console.log(`Bot ${bot.user.tag} is logged in!`);
    bot.user.setPresence({ activities: [{ name: 'Subscribe', type: 'PLAYING' }], status: 'online' });
});

bot.login(process.env.token);

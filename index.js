const {
    Client,
    Intents
} = require('discord.js');
const keepAliveServer = require('./keep_alive.js');

const bot = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]
});

const startTime = Date.now(); // Store the bot's start time

bot.on('guildMemberAdd', (member) => {
    const channelId = '1197950988057845910'; // The Channel ID you just copied
    const welcomeMessage = `Hey <@${member.id}>! Welcome to my server!`;
    member.guild.channels.fetch(channelId).then(channel => {
        channel.send(welcomeMessage)
    });
});

bot.on('messageCreate', (message) => {
    if (message.content.toLowerCase() === '!ping') {
        const apiLatency = Math.round(bot.ws.ping);
        const botLatency = Date.now() - message.createdTimestamp;
        message.reply(`Pong! API Latency: ${apiLatency}ms, Bot Latency: ${botLatency}ms`);
    }

    if (message.content.toLowerCase() === '!uptime') {
        const uptime = Date.now() - startTime;
        const formattedUptime = formatUptime(uptime);
        message.reply(`Bot Uptime: ${formattedUptime}`);
    }
});

bot.on('messageCreate', (message) => {
    if (message.content.toLowerCase().includes('hey bot') || message.content.toLowerCase().includes('solixblox')) {
        message.channel.send('Hello there!');
    }
});

bot.on('ready', () => {
    console.log(`Bot ${bot.user.tag} is logged in!`);
});

bot.login(process.env.token).then(() => {
    bot.user.setPresence({ activities: [{ name: 'Subscribe', type: 'PLAYING' }], status: 'online' });
});

// Function to format uptime in a human-readable way
function formatUptime(uptime) {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
}

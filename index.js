const { Client, Intents, MessageEmbed } = require('discord.js');
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
        const botInfoEmbed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle('Bot Information')
            .addField('Bot Tag', bot.user.tag, true)
            .addField('Bot ID', bot.user.id, true);

        message.reply({ embeds: [botInfoEmbed] });
    }

    // !userinfo command
    if (message.content.toLowerCase().startsWith('!userinfo')) {
        const targetUser = message.mentions.users.first() || message.author;

        const userInfoEmbed = new MessageEmbed()
            .setColor('#2ecc71')
            .setTitle('User Information')
            .addField('User Tag', targetUser.tag, true)
            .addField('User ID', targetUser.id, true);

        message.reply({ embeds: [userInfoEmbed] });
        return; // Do not send additional messages
    }

    // !serverinfo command
    if (message.content.toLowerCase() === '!serverinfo') {
        const serverInfoEmbed = new MessageEmbed()
            .setColor('#e74c3c')
            .setTitle('Server Information')
            .addField('Server Name', message.guild.name, true)
            .addField('Server ID', message.guild.id, true);

        message.reply({ embeds: [serverInfoEmbed] });
    }
});

bot.on('ready', () => {
    console.log(`Bot ${bot.user.tag} is logged in!`);
    bot.user.setPresence({ activities: [{ name: 'Subscribe', type: 'PLAYING' }], status: 'online' });
});

bot.login(process.env.token);

// Function to format uptime in a human-readable way
function formatUptime(uptime) {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
}

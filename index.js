const { Client, Intents, MessageEmbed } = require('discord.js');
const keepAliveServer = require('./keep_alive.js');

const bot = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]
});

const startTime = Date.now(); // Store the bot's start time

// Simulate a simple economy system (for demonstration purposes)
const userBalances = new Map();

bot.on('guildMemberAdd', (member) => {
    const channelId = '1196738471843340320'; // The Channel ID you just copied
    const welcomeMessage = `Hey <@${member.id}>! Welcome to my server!`;
    member.guild.channels.fetch(channelId).then(channel => {
        channel.send(welcomeMessage);
    });

    // Initialize balance for the new member
    userBalances.set(member.id, 1000);
});

bot.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignore messages from other bots

    // !ping command
if (message.content.toLowerCase() === ';ping') {
    const apiLatency = Math.round(bot.ws.ping);
    const botLatency = Date.now() - message.createdTimestamp;

    const pingEmbed = new MessageEmbed()
        .setColor('#3498db')
        .setTitle('Ping Information')
        .addField('API Latency', `${apiLatency}ms`, true)
        .addField('Bot Latency', `${botLatency}ms`, true);

    message.reply({ embeds: [pingEmbed] });
}

    // !uptime command
if (message.content.toLowerCase() === ';uptime') {
    const uptime = Date.now() - startTime;
    const formattedUptime = formatUptime(uptime);

    const uptimeEmbed = new MessageEmbed()
        .setColor('#3498db')
        .setTitle('Uptime Information')
        .addField('Bot Uptime', formattedUptime);

    message.reply({ embeds: [uptimeEmbed] });
}

    // !botinfo command
    if (message.content.toLowerCase() === ';botinfo') {
        const botInfoEmbed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle('Bot Information')
            .addField('Bot Tag', bot.user.tag, true)
            .addField('Bot ID', bot.user.id, true);

        message.reply({ embeds: [botInfoEmbed] });
    }

    // !userinfo command
    if (message.content.toLowerCase().startsWith(';userinfo')) {
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
    if (message.content.toLowerCase() === ';serverinfo') {
        const serverInfoEmbed = new MessageEmbed()
            .setColor('#e74c3c')
            .setTitle('Server Information')
            .addField('Server Name', message.guild.name, true)
            .addField('Server ID', message.guild.id, true);

        message.reply({ embeds: [serverInfoEmbed] });
    }

    // !avatar command
    if (message.content.toLowerCase().startsWith(';avatar')) {
        const targetUser = message.mentions.users.first() || message.author;
        const avatarEmbed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle(`${targetUser.tag}'s Avatar`)
            .setImage(targetUser.displayAvatarURL({ dynamic: true, size: 4096 }));

        message.reply({ embeds: [avatarEmbed] });
    }

    // !balance command
    if (message.content.toLowerCase() === ';balance') {
        const userBalance = userBalances.get(message.author.id) || 0;

        const balanceEmbed = new MessageEmbed()
            .setColor('#f39c12')
            .setTitle('Wallet Balance')
            .setDescription(`Your current balance is ${userBalance} coins.`);

        message.reply({ embeds: [balanceEmbed] });
    }

    // !work command
    if (message.content.toLowerCase() === ';work') {
        const earnings = Math.floor(Math.random() * 200) + 1; // Random earnings between 1 and 200 coins

        // Update user balance
        const userBalance = (userBalances.get(message.author.id) || 0) + earnings;
        userBalances.set(message.author.id, userBalance);

        const workEmbed = new MessageEmbed()
            .setColor('#27ae60')
            .setTitle('Work Complete!')
            .setDescription(`You earned ${earnings} coins for your hard work. Your new balance is ${userBalance} coins.`);

        message.reply({ embeds: [workEmbed] });
    }

    // !rob command
    if (message.content.toLowerCase().startsWith(';rob')) {
        const targetUser = message.mentions.users.first();

        if (!targetUser) {
            message.reply('Please mention a user to rob.');
            return;
        }

        // Calculate a chance of success for the robbery
        const successChance = Math.random();

        if (successChance < 0.5) {
            // Robbery failed
            message.reply(`Oops! You tried to rob ${targetUser.tag} but failed. Better luck next time!`);
        } else {
            // Robbery successful
            const stolenAmount = Math.floor(Math.random() * 200) + 1; // Random amount between 1 and 200 coins

            // Update balances for both the robber and the target
            const robberBalance = (userBalances.get(message.author.id) || 0) + stolenAmount;
            const targetBalance = (userBalances.get(targetUser.id) || 0) - stolenAmount;

            userBalances.set(message.author.id, robberBalance);
            userBalances.set(targetUser.id, targetBalance);

            const robEmbed = new MessageEmbed()
                .setColor('#e74c3c')
                .setTitle('Robbery Success!')
                .setDescription(`You successfully robbed ${targetUser.tag} and stole ${stolenAmount} coins. Your new balance is ${robberBalance} coins.`);

            message.reply({ embeds: [robEmbed] });
        }
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

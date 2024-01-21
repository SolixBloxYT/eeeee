const { Client, Intents, MessageEmbed } = require('discord.js');
const keepAliveServer = require('./keep_alive.js');

const bot = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]
});

const defaultPrefix = ';';
const serverPrefixes = new Map();
const startTime = Date.now();
const userBalances = new Map();

function getNumberOfCommands() {
    // Replace this with the actual logic to get the count of commands
    return yourArrayOfCommands.length; // or yourCommandCountVariable
}

bot.on('guildMemberAdd', (member) => {
    const channelId = '1196738471843340320';
    const welcomeMessage = `Hey <@${member.id}>! Welcome to my server!`;
    member.guild.channels.fetch(channelId).then(channel => {
        channel.send(welcomeMessage);
    });

    userBalances.set(member.id, 1000);
});

bot.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.mentions.has(bot.user)) {
        const mentionEmbed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle('Mention Information')
            .setDescription(`Hey ${message.author.username}! Why did you ping me? Do ;ping & ;uptime to try me out!`);

        message.reply({ embeds: [mentionEmbed] });
        return;
    }

    const prefix = serverPrefixes.get(message.guild.id) || defaultPrefix;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        const apiLatency = Math.round(bot.ws.ping);
        const botLatency = Date.now() - message.createdTimestamp;

        const pingEmbed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle('Ping Information')
            .addField('API Latency', `${apiLatency}ms`, true)
            .addField('Bot Latency', `${botLatency}ms`, true);

        message.reply({ embeds: [pingEmbed] });
    }

    if (command === 'uptime') {
        const uptime = Date.now() - startTime;
        const formattedUptime = formatUptime(uptime);

        const uptimeEmbed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle('Uptime Information')
            .addField('Bot Uptime', formattedUptime);

        message.reply({ embeds: [uptimeEmbed] });
    }

    if (command === 'botinfo') {
        const { heapUsed, heapTotal } = process.memoryUsage();
        const cpuUsage = process.cpuUsage();

        const cpuUsagePercentage = ((cpuUsage.user + cpuUsage.system) / 1000000) * 100;

        const botInfoEmbed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle('Bot Information')
            .addField('Ping', `${bot.ws.ping}ms`, true)
            .addField('CPU', `${cpuUsagePercentage.toFixed(2)}%`, true)
            .addField('Memory', `${(heapUsed / 1024 / 1024).toFixed(2)}MB / ${(heapTotal / 1024 / 1024).toFixed(2)}MB`, true)
            .addField('Commands', getNumberOfCommands(), true)
            .addField('Guilds', bot.guilds.cache.size, true)
            .addField('Users', bot.users.cache.size, true);

        message.reply({ embeds: [botInfoEmbed] });
    }

    if (command === 'userinfo') {
        const targetUser = message.mentions.users.first() || message.author;

        const userInfoEmbed = new MessageEmbed()
            .setColor('#2ecc71')
            .setTitle('User Information')
            .addField('User Tag', targetUser.tag, true)
            .addField('User ID', targetUser.id, true);

        message.reply({ embeds: [userInfoEmbed] });
        return;
    }

    if (command === 'serverinfo') {
        const serverInfoEmbed = new MessageEmbed()
            .setColor('#e74c3c')
            .setTitle('Server Information')
            .addField('Server Name', message.guild.name, true)
            .addField('Server ID', message.guild.id, true);

        message.reply({ embeds: [serverInfoEmbed] });
    }

    if (command === 'avatar') {
        const targetUser = message.mentions.users.first() || message.author;
        const avatarEmbed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle(`${targetUser.tag}'s Avatar`)
            .setImage(targetUser.displayAvatarURL({ dynamic: true, size: 4096 }));

        message.reply({ embeds: [avatarEmbed] });
    }

    if (command === 'balance') {
        const targetUser = message.mentions.users.first();

        if (!targetUser) {
            const userBalance = userBalances.get(message.author.id) || 0;

            const balanceEmbed = new MessageEmbed()
                .setColor('#f39c12')
                .setTitle('Wallet Balance')
                .setDescription(`Your current balance is ${userBalance} coins.`);

            message.reply({ embeds: [balanceEmbed] });
        } else {
            const targetBalance = userBalances.get(targetUser.id) || 0;

            const targetBalanceEmbed = new MessageEmbed()
                .setColor('#f39c12')
                .setTitle(`${targetUser.tag}'s Wallet Balance`)
                .setDescription(`${targetUser.tag}'s current balance is ${targetBalance} coins.`);

            message.reply({ embeds: [targetBalanceEmbed] });
        }
    }

    if (command === 'work') {
        const earnings = Math.floor(Math.random() * 200) + 1;

        const userBalance = (userBalances.get(message.author.id) || 0) + earnings;
        userBalances.set(message.author.id, userBalance);

        const workEmbed = new MessageEmbed()
            .setColor('#27ae60')
            .setTitle('Work Complete!')
            .setDescription(`You earned ${earnings} coins for your hard work. Your new balance is ${userBalance} coins.`);

        message.reply({ embeds: [workEmbed] });
    }

    if (command === 'rob') {
        const targetUser = message.mentions.users.first();

        if (!targetUser) {
            message.reply('Please mention a user to rob.');
            return;
        }

        const successChance = Math.random();

        if (successChance < 0.5) {
            message.reply(`Oops! You tried to rob ${targetUser.tag} but failed. Better luck next time!`);
        } else {
            const stolenAmount = Math.floor(Math.random() * 200) + 1;

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

    if (command === 'prefix') {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            message.reply('You do not have permission to change the prefix.');
            return;
        }

        const newPrefix = args[0];

        if (!newPrefix) {
            message.reply(`The current prefix is \`${prefix}\`. To change it, use \`${prefix} prefix <new-prefix>\`.`);
            return;
        }

        serverPrefixes.set(message.guild.id, newPrefix);
        message.reply(`Prefix updated to \`${newPrefix}\`.`);
    }

    if (command === 'banner') {
        const targetUser = message.mentions.users.first() || message.author;

        const bannerURL = targetUser.bannerURL({
            size: 4096,
            format: 'png',
            dynamic: true,
        });

        if (bannerURL) {
            const bannerEmbed = new MessageEmbed()
                .setColor('#3498db')
                .setTitle(`${targetUser.tag}'s Banner`)
                .setImage(bannerURL);

            message.reply({ embeds: [bannerEmbed] });
        } else {
            message.reply(`${targetUser.tag} does not have a banner.`);
        }
    }

    if (command === 'servers') {
        const serversEmbed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle('Server Count')
            .setDescription(`I am in ${bot.guilds.cache.size} servers.`);

        message.reply({ embeds: [serversEmbed] });
    }

    if (command === 'invite') {
        const inviteLink = `https://discord.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=YOUR_PERMISSIONS`;

        const inviteEmbed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle('Invite the Bot')
            .setDescription(`You can invite the bot to your server using the following link:\n[${inviteLink}](${inviteLink})`);

        message.reply({ embeds: [inviteEmbed] });
    }

    await bot.process_commands(message);
});

bot.login(process.env.token);

function formatUptime(uptime) {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
}

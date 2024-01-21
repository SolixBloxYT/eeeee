const { Client, Intents, MessageEmbed } = require('discord.js');
const keepAliveServer = require('./keep_alive.js');

const bot = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]
});

const defaultPrefix = ';'; // Default prefix

// A map to store custom prefixes for each server
const serverPrefixes = new Map();

const startTime = Date.now(); // Store the bot's start time

// Simulate a simple economy system (for demonstration purposes)
const userBalances = new Map();

// Replace this function with the actual method to get the number of commands
function getNumberOfCommands() {
    // Replace this with your logic to get the count of commands
    return yourArrayOfCommands.length; // or yourCommandCountVariable
}

bot.on('guildMemberAdd', (member) => {
    const channelId = '1196738471843340320'; // The Channel ID you just copied
    const welcomeMessage = `Hey <@${member.id}>! Welcome to my server!`;
    member.guild.channels.fetch(channelId).then(channel => {
        channel.send(welcomeMessage);
    });

    // Initialize balance for the new member
    userBalances.set(member.id, 1000);
});

});

bot.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignore messages from other bots

    // Your existing command handling code here...

    // Example command to change bot's status
    if (message.content.toLowerCase() === ';setstatus') {
        // Assuming the desired status is 'Watching Hello World!'
        setBotStatus('WATCHING', 'Hello World!');
        message.reply('Bot status updated!');
    }
});

bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    // Respond to mentions of the bot
    if (interaction.mentions.has(bot.user)) {
        const mentionEmbed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle('Mention Information')
            .setDescription(`Hey ${interaction.user.username}! Why did you ping me? Do ;ping & ;uptime to try me out!`);

        interaction.reply({ embeds: [mentionEmbed] });
        return;
    }

    // Parse the custom prefix or use the default prefix
    const prefix = serverPrefixes.get(interaction.guild.id) || defaultPrefix;

    // Check if the message starts with the bot's prefix
    if (!interaction.content.startsWith(prefix)) return;

    // Extract the command and arguments
    const args = interaction.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // ;ping command
    if (command === 'ping') {
        const apiLatency = Math.round(bot.ws.ping);
        const botLatency = Date.now() - interaction.createdTimestamp;

        const pingEmbed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle('Ping Information')
            .addField('API Latency', `${apiLatency}ms`, true)
            .addField('Bot Latency', `${botLatency}ms`, true);

        interaction.reply({ embeds: [pingEmbed] });
    }
    
    // ;uptime command
    if (command === 'uptime') {
        const uptime = Date.now() - startTime;
        const formattedUptime = formatUptime(uptime);

        const uptimeEmbed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle('Uptime Information')
            .addField('Bot Uptime', formattedUptime)

        message.reply({ embeds: [uptimeEmbed] });
    }

        // ;botinfo command
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
        .addField('Commands', getNumberOfCommands(14), true)
        .addField('Guilds', bot.guilds.cache.size, true)
        .addField('Users', bot.users.cache.size, true);

    message.reply({ embeds: [botInfoEmbed] });
}

    // ;userinfo command
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

    // ;serverinfo command
    if (command === 'serverinfo') {
    const server_info_embed = new MessageEmbed()
        .setColor(0xe74c3c)
        .setTitle('Server Information')
        .addFields(
            { name: 'Server Name', value: message.guild.name, inline: true },
            { name: 'Server ID', value: message.guild.id, inline: true }
        );

    await message.reply({ embeds: [server_info_embed] });
}
    // ;avatar command
    if (command === 'avatar') {
        const targetUser = message.mentions.users.first() || message.author;
        const avatarEmbed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle(`${targetUser.tag}'s Avatar`)
            .setImage(targetUser.displayAvatarURL({ dynamic: true, size: 4096 }));

        message.reply({ embeds: [avatarEmbed] });
    }

    // ;balance command
if (command === 'balance') {
    // Check if a user is mentioned
    const targetUser = message.mentions.users.first();

    if (!targetUser) {
        // If no user mentioned, show balance of the message author
        const userBalance = userBalances.get(message.author.id) || 0;

        const balanceEmbed = new MessageEmbed()
            .setColor('#f39c12')
            .setTitle('Wallet Balance')
            .setDescription(`Your current balance is ${userBalance} coins.`);

        message.reply({ embeds: [balanceEmbed] });
    } else {
        // If user mentioned, show balance of the mentioned user
        const targetBalance = userBalances.get(targetUser.id) || 0;

        const targetBalanceEmbed = new MessageEmbed()
            .setColor('#f39c12')
            .setTitle(`${targetUser.tag}'s Wallet Balance`)
            .setDescription(`${targetUser.tag}'s current balance is ${targetBalance} coins.`);

        message.reply({ embeds: [targetBalanceEmbed] });
    }
}
    
    // ;work command
    if (command === 'work') {
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

    // ;rob command
    if (command === 'rob') {
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

    // ;prefix command
    if (command === 'prefix') {
        // Check if the user has permission to change the prefix (e.g., server admin)
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            message.reply('You do not have permission to change the prefix.');
            return;
        }

        const newPrefix = args[0];

        // Check if a new prefix is provided
        if (!newPrefix) {
            message.reply(`The current prefix is \`${prefix}\`. To change it, use \`${prefix}prefix <new-prefix>\`.`);
            return;
        }

        // Update the server's custom prefix
        serverPrefixes.set(message.guild.id, newPrefix);
        message.reply(`Prefix updated to \`${newPrefix}\`.`);
    }

   // ;banner command
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


    // ;servers command
    if (command === 'servers') {
    const serversEmbed = new MessageEmbed()
        .setColor('#3498db')
        .setTitle('Server Count')
        .setDescription(`I am in ${bot.guilds.cache.size} servers.`);

    message.reply({ embeds: [serversEmbed] });
}


// Replace 'YOUR_CLIENT_ID' with your bot's client ID
const clientId = '1148609650334371852';

// ;invite command
if (command === 'invite') {
    const invite_link = `https://discord.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=8&scope=bot`;

    const invite_embed = new MessageEmbed()
        .setColor(0x3498db)
        .setTitle('Invite the Bot')
        .setDescription(`You can invite the bot to your server using the following link:\n[${invite_link}](${invite_link})`);

    await message.reply({ embeds: [invite_embed] });
} else {
    await bot.process_commands(message);
}

// Example command to change bot's status
    if (message.content.toLowerCase() === ';setstatus') {
        // Assuming the desired status is 'Watching Hello World!'
        setBotStatus('WATCHING', 'Hello World!');
        message.reply('Bot status updated!');
    }
});

function setBotStatus(type = 'PLAYING', status = ';ping | @Testing Bot') {
    bot.user.setActivity(status, { type: type });
}

bot.login(process.env.token);

// Function to format uptime in a human-readable way
function formatUptime(uptime) {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
}

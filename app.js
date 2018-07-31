const Discord = require("discord.js");
const config = require("./config.json");

const completemsg = "Thanks for verifying! You now have full access to our server."
const shortcode = (n) => {
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
		let text = ''
		for (var i = 0; i < n + 1; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
		return text;
}
const token = shortcode(8)

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

bot.on("ready", async () => {
	console.log("----------------------------------")
	console.log("| Eagle is watching from above.. |")
	console.log("----------------------------------")
	console.log(new Date())
	bot.user.setActivity(`From Above`, { type: 'WATCHING' });
});

const db = require('quick.db');

bot.on("message", async message => {
	if(message.author.bot) return;
	if(message.channel.type === "dm") return;

	let prefix = config.prefix;
	let messageArray = message.content.split(" ");
	let cmd = messageArray [0];
	let args = messageArray.slice(1);

	let blacklisted = ['discord.gg', 'nigger', 'nig', 'nigga', 'nazi', 'fag', 'faggot']
	let foundInText = false;
	for (var i in blacklisted) {
		if (message.content.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;
	}

	if(foundInText) {
		message.delete()
		message.reply("please refrain from saying that.")
	}

	if(cmd === `${prefix}ping`){
		message.channel.send(`:stopwatch: ${bot.ping}ms`)
	}

	if(cmd === `${prefix}update`){
		if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply ("you don't have permission to use that command.");

		var commandud = message.content.split(" ")[0].slice(prefix.length);
		var params = message.content.split(" ").slice(1);

		let embed = new Discord.RichEmbed()
		.setTimestamp(timestamp = new Date())
		.setTitle(args.join(" ").split("|").slice(0,1))
		.setDescription(args.join(" ").split("|").slice(1))
		.setColor("#7742f4")
		.setTimestamp()
		.setFooter(`Issued by ${message.author.username}`);

		message.guild.channels.find('name', 'announcements').send(embed);
		message.channel.send("Update posted <:success:463539522475655172>");
	}

	if(cmd === `${prefix}verify`){
		if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply ("you don't have permission to use that command.");

		let toverify = message.mentions.users.first();
		//change to Members
		let verifyrole = message.guild.roles.find('name', "Members");

		let vUser = message.guild.member(message.mentions.users.first());

		let embed = new Discord.RichEmbed()
		.setTimestamp(timestamp = new Date())
		.setDescription(`${vUser} was manually verified by ${message.author.username}`)
		.setColor(0x00ff00)
		.setTimestamp();

		message.channel.send(embed);
		vUser.addRole(verifyrole);
	}

	if(cmd === `Buyer`){
		//change to Buyers
		let buyer = message.guild.roles.find('name', "Buyers");
		message.member.addRole(buyer);

		let embed = new Discord.RichEmbed()
		.setDescription(`${message.author}, the buyer role has been added.`)
		.setColor(0x00ff00)

		message.channel.send(embed);
	}
});

bot.on("guildMemberAdd", member => {
	const welcome = `Welcome to Prodigy Services, ${member}! To access our server, reply with the following token: \`\`\` \nTK-${token}\n \`\`\` Note: the token is case-sensitive.`
	member.send(welcome);
	member.user.token = token
	const channel = member.guild.channels.find('name', 'verify');
	if (!channel) return;
	channel.send(`Welcome to Prodigy Services, ${member}! Please complete the verification sent to your DM's. If you're having trouble verifying, DM Prodigy or Vixro.`);
});

const verifymsg = `TK-${token}`

bot.on("message", (message) => {
	if (message.author.bot || !message.author.token || message.channel.type !== `dm`) return
	if (message.content !== (verifymsg.replace(`${token}`, message.author.token))) return
	message.channel.send({
		embed: {
				color: 0x00ff00,
				description: completemsg,
				timestamp: new Date(),
				footer: {
						text: 'Verification Successful!'
				}
		}
	})
	bot.guilds.get('470801632712720394').member(message.author).addRole('470850421531869190')
		.then(console.log(`TOKEN: ${message.author.token} :: Role 'Members' added to user ${message.author.username}#${message.author.discriminator}`))
		.catch(console.error)
});

bot.login(config.token);
const Discord = require("discord.js");
const client = new Discord.Client();
const fetch = require('node-fetch');
const config = require('./config/cfg.json');

try{

client.on('message', async message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;
	const args = message.content.slice(config.prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

if (command === 'activity') {
	if (!message.member.voice.channel) return message.reply("Вы должны находиться в голосовом канале!")
	if(!message.guild.me.permissionsIn(message.member.voice.channel).has('CREATE_INSTANT_INVITE')) return message.reply(`У меня (бота) нет права на создание приглашений в канале ${message.member.voice.channel}`)
	if(message.member.presence.status == 'offline') return message.reply("Вы должны быть онлайн, чтобы в Вашу Activity могли присоединиться другие пользователи!")
	if(!args[0]) return message.reply(`Вы не выбрали activity!\nДоступные activity:\n${Object.keys(config.activities).join('\n')}`)
	if(!Object.keys(config.activities).includes(args[0])) return message.reply(`Неверно введен activity!\nДоступные activity:\n${Object.keys(config.activities).join('\n')}`)
	  fetch(`https://discord.com/api/v8/channels/${message.member.voice.channelID}/invites`, {
		method: "POST",
		body: JSON.stringify({
			max_age: 86400,
			max_uses: 0,
			target_application_id: config.activities[args[0]], 
			target_type: 2,
			temporary: false,
			validate: null
		}),
		headers: {
			"Authorization": `Bot ${client.token}`,
			"Content-Type": "application/json"
		}
	}).then(response => response.json()).then(data => {
		message.channel.send(`
		✅ **Лобби создано!**\nДля старта нажмите на ссылку -> https://discord.gg/${data.code}
		`);
	}).catch(e => {
		message.channel.send("❌ | Невозможно создать лобби!");
	})
}

if (command === 'invite') {
	message.reply('https://discord.com/api/oauth2/authorize?client_id=848567219309772860&permissions=3073&scope=bot')
}

});
client.login(config.token);
client.on('ready', () => {
	console.log(`Я родился!`);
});
} catch (err) {
console.log("Произошла ошибка: " + err);
}
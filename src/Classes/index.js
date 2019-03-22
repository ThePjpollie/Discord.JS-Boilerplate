const Discord = require('discord.js');

Discord.Structures.extend('TextChannel', require('./TextChannel'));
Discord.Structures.extend('GuildMember', require('./GuildMember'));

module.exports = Discord;

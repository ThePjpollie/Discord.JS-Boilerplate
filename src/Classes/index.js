const Discord = require('discord.js');

Discord.Structures.extend('TextChannel', require('./TextChannel'));

module.exports = Discord;

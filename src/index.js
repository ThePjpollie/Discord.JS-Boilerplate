async function start() {
  const Discord = await require('./Classes');
  const {promisify} = require("util");
  const readdir = promisify(require("fs").readdir);
  const chalk = require('chalk');
  const log = console.log;

  class DiscordBot extends Discord.Client {
    constructor() {
      super();

      this.config = require('../config');
      this.loadLogs();
      this.loadEvents();
      this.loadCommands();
      this.loadModels();
      this.login(this.config.bot_token)
    }

    async loadEvents() {
      const events = await readdir("./src/Events/");
      events.forEach(f => {
        if (!f.endsWith(".js"))
          return;

        try {
          const eventName = f.split(".")[0];
          const event = require(`./Events/${eventName}`);
          this.on(eventName, event.bind(null, this));
        } catch (e) {
          this.logError(`Unable to load event ${f}: ${e}`)
        }
      });
    }

    async loadCommands() {
      this.commands = [];

      const commands = await readdir("./src/Commands/");
      commands.forEach(f => {
        if (!f.endsWith(".js"))
          return;

        try {
          const file = require(`./Commands/${f}`);
          file.commands.forEach(cmd =>
            this.commands[cmd.command] = file
          )
        } catch (e) {
          this.logError(`Unable to load command ${f}: ${e}`);
        }
      });
    }

    async loadModels() {
      this.models = await require('./Models');
    }

    loadLogs() {
      this.log = (msg) =>
        log(chalk.bgBlue.whiteBright(`ℹ ${msg}`));

      this.logSuccess = (msg) =>
        log(chalk.bgGreen.whiteBright(`✅ ${msg}`));

      this.logWarning = (msg) =>
        log(chalk.bgYellow.whiteBright(`⚠ ${msg}`));

      this.logError = (msg) =>
        log(chalk.bgRed.whiteBright(`❌ ${msg}`));
    }
  }

  module.exports = new DiscordBot();
  require('./validation');

}

start();

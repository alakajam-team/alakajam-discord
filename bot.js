const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, { colorize: true });
logger.level = 'debug';

const bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

const commands = [
    help(),
    require('./commands/hello'),
    require('./commands/hype'),
    require('./commands/random'),
    require('./commands/theme'),
    require('./commands/timeleft')
];

/**
 * Handle an error.
 *
 * @param {Error} err the error.
 * @param {Object} [extra] any extra info to be logged.
 */
const onError = (err, extra) => {
    console.error('Error:', {message: err.message, stack: err.stack, ...extra});
    return "Hmm, something's not quite right...";
};

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, _userID, channelID, message, _evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        let args = message.substring(1).split(' ');
        const commandName = args[0].toLowerCase();

        const command = commands.find(command => command.name === commandName)
        if (command) {
            command.run(bot, channelID, user, onError, args.slice(1));
        } else {
            bot.sendMessage({
                to: channelID,
                message: 'The spell fizzles. Type !help for help.'
            });
        }
    }
});

Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
};

function help() {
    return {
        name: 'help',
        description: undefined,
        argsInfo: [],
        run: function(bot, channelID, user, onError, _args) {
            const message = commands
                .filter(command => command.description)    
                .map(command =>  `**!${command.name}**: ${command.description}`)
                .join('\n');
            bot.sendMessage({
                to: channelID,
                message: 'Available spells:\n' + message
            });
        }
    }
}
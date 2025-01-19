const { Client, IntentsBitField, Events, GatewayIntentBits, Partials, Message } = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, { colorize: true });
logger.level = 'debug';


const commands = [
    help(),
    require('./commands/hello'),
    require('./commands/hype'),
    require('./commands/random'),
    require('./commands/theme'),
    require('./commands/themestats'),
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

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
      Partials.Channel,
      Partials.Message
    ]
});

client.once(Events.ClientReady, readyClient => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(readyClient.user.username + ' - (' + readyClient.user.id + ')');
});

client.on('error', onError);

client.on(Events.MessageCreate, function (message) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.content.substring(0, 1) == '!') {
        let args = message.content.substring(1).split(' ');
        const commandName = args[0].toLowerCase();

        const command = commands.find(command => command.name === commandName)
        if (command) {
            command.run(message, args.slice(1), onError);
        } else {
            message.channel.send('The spell fizzles. Type `!help` for help.');
        }
    }
});

client.login(auth.token)

Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
};

function help() {
    return {
        name: 'help',
        description: undefined,
        argsInfo: [],
        /**
         * @param {Message<boolean>} request 
         */
        run: async function help(request, args, onError) {
            const message = commands
                .filter(command => command.description)    
                .map(command => {
                    const formattedCommand = ('!' + command.name + formatArgsInfo(command.argsInfo)).padStart(20);
                    return `\`${formattedCommand}\`   ${command.description}`
                })
                .join('\n');
            request.channel.send('Available spells:\n' + message);
        }
    }
}
function formatArgsInfo(argsInfo) {
    const formatted = argsInfo
        .map(argInfo => '[' + argInfo.name + (argInfo.optional?'?':'') + ']')
        .join(' ');
    return formatted ? ' ' + formatted : '';
}
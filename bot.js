const request = require('request-promise-native');
var Discord = require('discord.io');
var logger = require('winston');
const get = require('lodash/get');
var auth = require('./auth.json');


var api = require('./api');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, { colorize: true });
logger.level = 'debug';

var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

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

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            case 'help': help();
                break;
            case 'timeleft': timeleft();
                break;
            case 'hello': hello();
                break;
            case 'hype': hype();
                break;
            case 'theme': theme();
                break;
            case 'random': random();
                break;
         }
    }

    function help() {
        let message =
            '**!timeleft:** Time left for the current event \n' +
            '**!hype:** Info on current and upcoming events \n' +
            '**!theme:** Theme of the current event \n' +
            '**!random:** Get a random game from the current event!';
            bot.sendMessage({
            to: channelID,
            message: message
        });
    }

    function hello() {
        var responses = ["Hello $!", "Hi $!", "Hello there $!", "Hi there $!"]
        bot.sendMessage({
            to: channelID,
            message: responses.sample().replace("$", user)
        });
    };

    async function theme() {
        try {
            const result = await request({uri: api.featuredEvent, json: true});
            switch (result.status_theme) {
                case 'disabled':
                    message = 'Themes are disabled!';
                    break;
                case 'off':
                    message = 'Themes are off!';
                    break;
                case 'voting':
                    message = 'Theme voting is still open. Go vote!';
                    break;
                case 'shortlist':
                    message = 'The theme shortlist is out! See www.alakajam.com' +
                        result.countdown_config.link;
                    break;
                case 'closed':
                    message = 'Cheeky! Themes will be announced soon.';
                    break;
                case 'results':
                    message = `The theme is: ${result.display_theme}`;
                    break;
            }
        }
        catch (err) {
            message = onError(err, {args, command: 'theme'});
        }

        bot.sendMessage({
            to: channelID,
            message: message
        });
    };

    async function hype() {
        let message = '';
        try {
            const now = (new Date()).toISOString();
            // The API sorts events by publication date.
            const events = await request({uri: api.events, json: true});
            let next = null;
            for (let i = events.length - 1; 0 <= i; --i) {
                if (events[i].countdown_config.date > now) {
                    next = events[i];
                    break;
                }
            }

            if (next === null) {
                message = 'There are no events coming up!';
            }
            else {
                message = `**${next.title}** \n\ttakes place on ${next.display_dates}`;
            }
        }
        catch (err) {
            message = onError(err, {args, command: 'hype'});
        }
        bot.sendMessage({
            to: channelID,
            message: message
        });
    };

    async function timeleft() {
        let message = '';
        try {
            const result = await request({uri: api.featuredEvent, json: true});
            message = result.countdown_formatted ||
                "Couldn't get countdown; is there even an event?";
        }
        catch (err) {
            message = onError(err, {args, command: 'timeleft'});
        }
        bot.sendMessage({
            to: channelID,
            message: message
        });
    }

    async function random() {
        let message = '';
        try {
            const result = await request({uri: api.featuredEvent, json: true});
            if (result.status === 'pending') {
                message = `${result.title} has not started yet`;
            }
            else if (result.entries && result.entries.length > 0) {
                const entry = result.entries.sample();
                message = `Random entry for ${result.title}: \n` +
                `**${entry.title}**\n` +
                `https://alakajam.com/${entry.event_name}/${entry.id}`;
            } else if (result.entries && result.entries.length === 0) {
                const template = `No entries for ${result.title}`;
            }
        }
        catch (err) {
            message = onError(err, {args, command: 'random'});
        }
        bot.sendMessage({
            to: channelID,
            message: message
        });
    }

});



Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
};

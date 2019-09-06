const request = require('request-promise-native');
const api = require('../api');

module.exports = {
  name: 'hype',
  description: 'Info on current and upcoming events',
  argsInfo: [],
  run: async function hype(bot, channelID, user, onError, _args) {
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
            message = `**${next.title}** takes place on ${next.display_dates}`;
        }
    }
    catch (err) {
        message = onError(err, {args, command: 'hype'});
    }
    bot.sendMessage({
        to: channelID,
        message: message
    });
  }
}

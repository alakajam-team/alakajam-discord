const request = require('request-promise-native');
const api = require('../api');

module.exports = {
  name: 'timeleft',
  description: 'Time left for the current event',
  argsInfo: [],
  run: async function timeleft(bot, channelID, user, onError, _args) {
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
}

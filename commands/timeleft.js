const fetch = require('request-promise-native');
const api = require('../api');
const { Message } = require('discord.js');

module.exports = {
  name: 'timeleft',
  description: 'Time left for the current event',
  argsInfo: [],

  /**
   * @param {Message<boolean>} request 
   */
  run: async function timeleft(request, args, onError) {
    let message = '';
    try {
        const result = await fetch({uri: api.featuredEvent, json: true});
        message = result.countdown_formatted ||
            "Couldn't get countdown; is there even an event?";
    }
    catch (err) {
        message = onError(err, {args, command: 'timeleft'});
    }
    request.channel.send(message);
  }
}

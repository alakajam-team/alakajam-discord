const request = require('request-promise-native');
const api = require('../api');
const { Message } = require('discord.js');

module.exports = {
  name: 'hype',
  description: 'Info on current and upcoming events',
  argsInfo: [],

  /**
   * @param {Message<boolean>} request 
   */
  run: async function hype(request, args, onError) {
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
    request.channel.send(message);
  }
}

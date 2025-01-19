const fetch = require('request-promise-native');
const ordinal = require('ordinal');
const api = require('../api');
const { Message } = require('discord.js');

module.exports = {
  name: 'themestats',
  description: 'Get stats about how well a theme has been doing in past events',
  argsInfo: [
      {name: 'name', optional: false}
  ],

  /**
   * @param {Message<boolean>} request 
   */
  run: async function theme(request, args, onError) {
    let message = 'hello'
    try {
        const themeName = args.join(' ');
        const uri = api.theme.replace(':name', args.join(' '));
        const result = await fetch({uri, json: true});
        if (result.length > 0) {
            message = `**${themeName}** has been submitted ${result.length} times:\n`
                + result.map(line => `*${line.eventTitle}*    ${ordinal(line.ranking)} place`)
                        .join('\n')
        } else {
            message = `**${themeName}** has never been submitted.`
        }
    }
    catch (err) {
        message = onError(err, {args, command: 'theme'});
    }
    request.channel.send(message);
  }
}

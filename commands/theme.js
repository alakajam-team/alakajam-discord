const fetch = require('request-promise-native');
const api = require('../api');
const { Message } = require('discord.js');

module.exports = {
  name: 'theme',
  description: 'Theme of the current event',
  argsInfo: [],

  /**
   * @param {Message<boolean>} request 
   */
  run: async function theme(request, args, onError) {
    try {
        const result = await fetch({uri: api.featuredEvent, json: true});
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
    request.channel.send(message);
  }
}

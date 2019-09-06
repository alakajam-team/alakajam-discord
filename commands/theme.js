const request = require('request-promise-native');
const api = require('../api');

module.exports = {
  name: 'theme',
  description: 'Theme of the current event.',
  argsInfo: [],
  run: async function theme(bot, channelID, user, onError, args) {
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
  }
}

const fetch = require('request-promise-native');
const api = require('../api');
const { Message } = require('discord.js');

module.exports = {
    name: 'random',
    description: 'Get a random game from the current event!',
    argsInfo: [],

    /**
     * @param {Message<boolean>} request 
     */
    run: async function random(request, args, onError) {
        let message = '';
        try {
            const result = await fetch({ uri: api.featuredEvent, json: true });
            if (result.status === 'pending') {
                message = `${result.title} has not started yet`;
            }
            else if (result.entries && result.entries.length > 0) {
                const entry = result.entries.sample();
                message = `Random entry for ${result.title}: \n` +
                    `**${entry.title}**\n` +
                    `https://alakajam.com/${entry.event_name}/${entry.id}`;
            } else if (result.entries && result.entries.length === 0) {
                message = `No entries for ${result.title}`;
            }
        }
        catch (err) {
            message = onError(err, { args, command: 'random' });
        }
        request.channel.send(message);
    }
}

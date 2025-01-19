const { Message } = require("discord.js");

module.exports = {
  name: 'hello',
  description: undefined,
  argsInfo: [],

  /**
   * @param {Message<boolean>} message 
   */
  run: function hello(request, args, onError) {
    const responses = ["Hello $!", "Hi $!", "Hello there $!", "Hi there $!"]
    const response = responses.sample().replace("$", request.author.displayName);
    request.channel.send(response);
  }
}

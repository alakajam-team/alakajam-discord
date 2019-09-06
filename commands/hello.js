module.exports = {
  name: 'hello',
  description: undefined,
  argsInfo: [],
  run: function hello(bot, channelID, user, onError, _args) {
    var responses = ["Hello $!", "Hi $!", "Hello there $!", "Hi there $!"]
    bot.sendMessage({
        to: channelID,
        message: responses.sample().replace("$", user)
    });
  }
}

# alakajam-discord

Discord jamician bot

The Discord version of the bot in IRC!

## Setup

Create an `auth.json` file with the following contents:

```
{
  "token": "YOUR_BOT_TOKEN"
}
```

To get a bot token, [follow these instructions](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token). Then invite the bot to your server by calling the following URL: `https://discordapp.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot&permissions=83968` ([source](https://discordapp.com/developers/docs/topics/oauth2#bots)).

## Launch

To run the bot, simply do:

```
node bot.js
```

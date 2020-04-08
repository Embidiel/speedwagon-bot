const {Client, MessageAttachment} = require('discord.js');
const {Observable, of} = require('rxjs');
const {
  READY,
  GUILD_MEMBER_ADD,
  MESSAGE
} = require('../reference/discord-events');

exports.createDiscordBot$ = () => {
  return new Observable(subscriber => {
    const bot = new Client();
    subscriber.next(bot);
  })
};

exports.loginBot = (token) => (bot) => {
  bot.login(token);
};

exports.botReady = (bot) => {
  bot.on(READY, () => {
    console.log(`${bot.user.tag} is now online`);
  })
};

exports.listenToMessages$ = (bot) => {
  return new Observable(subscriber => {
    bot.on(MESSAGE, message => {
      subscriber.next({bot, message});
    })
  })
};

exports.sendBotMessage$ = (message) => ({payload, type}) => {
  switch (type) {
    case 'REGULAR':
      message.channel.send(payload);
      return of(message);
    case 'FILE':
      const attachment = new MessageAttachment(payload);
      message.channel.send(attachment);
      return of(message);
  }
};

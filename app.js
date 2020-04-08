require('dotenv').config();
const {from, of} = require('rxjs');
const {tap, mergeMap, catchError} = require('rxjs/operators')
const {
  BOT_TOKEN
} = require('./config');

const {
  isValidCommander
} = require('./utils/speedwagon-validator');

const {
  createDiscordBot$,
  loginBot,
  botReady,
  listenToMessages$
} = require('./utils/rx-discord');

const {
  startProcess
} = require('./utils/speedwagon-core');

createDiscordBot$().pipe(
  tap(loginBot(BOT_TOKEN)),
  tap(botReady),
  mergeMap(listenToMessages$, 5),
  mergeMap(({bot, message}) => isValidCommander(message.author.id) ? startProcess(message) : '', 5)
).subscribe();


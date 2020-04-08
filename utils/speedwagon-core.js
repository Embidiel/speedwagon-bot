const {Observable, from, of, zip} = require('rxjs');
const {map, mergeMap, pluck, tap, catchError} = require('rxjs/operators');

const {
  convertYoutubeToMP3,
  convertYoutubeToMP3Batch,
  generateWords
} = require('./speedwagon-modules');

const CONVERT_YT_LINK_TO_MP3 = '!sw-ymp3';
const CONVERT_YT_LINK_TO_MP3_BATCH = '!sw-ymp3b';
const GEN_WORDS = '!sw-genw';
const COMMANDS = {
  [CONVERT_YT_LINK_TO_MP3]: convertYoutubeToMP3,
  [CONVERT_YT_LINK_TO_MP3_BATCH]: convertYoutubeToMP3Batch,
  [GEN_WORDS]: generateWords
};

const {
  sendBotMessage$
} = require('./rx-discord')

const runCommand = ([command, ...params]) => {
  const command$ = COMMANDS[command];
  return command$ ? command$(params) : of(false);
};

const splitter = (content) => content.split(' ');

exports.startProcess = (message) => of(message).pipe(
  pluck('content'),
  map(splitter),
  mergeMap(runCommand, 5),
  mergeMap(sendBotMessage$(message), 5),
  catchError(err => of(`Error @ startProcess : ${err}`))
);

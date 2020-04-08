const {Observable, of, from} = require('rxjs');
const {mergeMap, tap, map, reduce, repeat} = require('rxjs/operators');
const puppeteer = require('puppeteer');

const convertYoutubeToMP3 = ([YT_LINK]) => {
  return new Observable(async subscriber => {
    try {
      const YTMP3_URL = `https://ytmp3.cc/en13/`;
      const browser = await puppeteer.launch({headless: true});
      const YTTOMP3_PAGE = await browser.newPage();
      await YTTOMP3_PAGE.goto(YTMP3_URL, {waitUntil: 'networkidle2'});
      await YTTOMP3_PAGE.$eval('input[name=video]', (el, YT_LINK) => el.value = YT_LINK, YT_LINK);
      await YTTOMP3_PAGE.click('input[type="submit"]');
      await YTTOMP3_PAGE.waitForSelector('#buttons', {visible: true});
      const MP3_LINK = await YTTOMP3_PAGE.$$eval('a', links => links.map(a => a.href)[5]);
      const MP3_TITLE = await YTTOMP3_PAGE.$eval('#title', title => title.textContent);
      await browser.close();
      subscriber.next({payload: `DL Link [${MP3_TITLE}] : ${MP3_LINK}`, type: 'REGULAR'});
      subscriber.complete();
    } catch (err) {
      subscriber.error(err);
    }
  });
};
exports.convertYoutubeToMP3 = convertYoutubeToMP3;

exports.convertYoutubeToMP3Batch = ([YT_LINKS]) => of(YT_LINKS).pipe(
  mergeMap(ytLinks => from(ytLinks.split(','))),
  mergeMap(convertYoutubeToMP3, 5),
  map(result => `${result.payload}  \r\n`),
  reduce((acc, result) => acc + result, ""),
  map(links => ({payload: links, type: 'REGULAR'}))
);

exports.generateWords = ([retries]) => {
  const word$ = new Observable(async subscriber => {
    try {
      const CHARADE_URL = 'http://www.getcharadesideas.com/';
      const browser = await puppeteer.launch({headless: true});
      const CHARADE_PAGE = await browser.newPage();
      await CHARADE_PAGE.goto(CHARADE_URL);
      let wordList = [];
      for (let x = 0; x < retries; x++) {
        await CHARADE_PAGE.click('button');
        await CHARADE_PAGE.waitForFunction('document.getElementById("charadeIdea").value != "No Value"');
        const word = await CHARADE_PAGE.$eval('#charadeIdea', el => el.textContent);
        wordList.push(word);
      }
      await browser.close();
      subscriber.next(wordList.reduce((acc, word) => acc + `${word},`, "").substring(0, 1999));
      subscriber.complete();
    } catch (err) {
      subscriber.error(err);
    }
  });

  return word$.pipe(
    map(wordList => ({payload: wordList, type: 'REGULAR'}))
  )
}

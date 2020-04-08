const rp = require('request-promise');
const {from, of} = require('rxjs');
const {catchError} = require('rxjs/operators');

exports.makeGETRequest$ = (uri, isFullResponse) => {
  const OPTS = {
    uri,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true,
    resolveWithFullResponse: isFullResponse ? true : false
  };
  return from(rp(OPTS)).pipe(
    catchError(err => of(`Error makeGETRequest$ : ${err}`))
  );
};

exports.makePOSTRequest$ = (uri) => (body) => {
  // console.log('PAYLOAD', body);
  const RP_OPTIONS = {
    method: 'POST',
    uri,
    body,
    encoding: null,
    json: true
  };
  return from(rp(RP_OPTIONS)).pipe(
    catchError(err => of(`Error makePOSTRequest$ : ${err}`))
  );
}


import express from 'express';
import cookieParser from 'cookie-parser';
import moment from 'moment';

const CRASH_EVERY_X_CALLS = 0;

export default (data) => {
  const server = express();

  server.use(cookieParser());

  server.get('/', (req, res) => {

    const currentCall = req.cookies.call || 0;

    if (!CRASH_EVERY_X_CALLS || (currentCall && currentCall % CRASH_EVERY_X_CALLS !== 0)) {
      const {
        limit,
        from,
        to,
      } = req.query;

      const _from = from ? moment(from, 'DD/MM/YYYY') : moment().subtract(1, 'year');
      const _to = to ? moment(to, 'DD/MM/YYYY') : moment().add(1, 'year');

      const json = data
        .filter(row => moment(row.date, 'DD/MM/YYYY').isSameOrAfter(_from))
        .filter(row => moment(row.date, 'DD/MM/YYYY').isSameOrBefore(_to))
        .filter((row, i) => !limit || i < limit);

      res
        .status(200)
        .cookie('call', parseInt(currentCall, 10) + 1)
        .json(json);
    } else {
      res
        .status(400)
        .cookie('call', parseInt(currentCall, 10) + 1)
        .end('Something terribad happened :(');
    }

  })
  ;

  return server;
};

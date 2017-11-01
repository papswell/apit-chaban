import express from 'express';
import cookieParser from 'cookie-parser';
import moment from 'moment';
import cors from './cors';

const CRASH_EVERY_X_CALLS = 0;
const DATE_FORMAT = 'DD/MM/YYYY';

export default (data) => {
  const server = express();

  server.use(cors);
  server.use(cookieParser());

  server.get('/', (req, res) => {

    const currentCall = req.cookies.call || 0;
    const cookieValue = parseInt(currentCall, 10) + 1;

    if (
      !CRASH_EVERY_X_CALLS ||
      (currentCall && currentCall % CRASH_EVERY_X_CALLS !== 0)
    ) {
      const {
        limit,
        from,
        to,
      } = req.query;

      const _from = from ? moment(from, DATE_FORMAT) : moment().subtract(1, 'year');
      const _to = to ? moment(to, DATE_FORMAT) : moment().add(1, 'year');

      const json = data
        .filter(row => moment(row.date, DATE_FORMAT).isSameOrAfter(_from))
        .filter(row => moment(row.date, DATE_FORMAT).isSameOrBefore(_to))
        .filter((row, i) => !limit || i < limit);

      res
        .status(200)
        .cookie('call', cookieValue)
        .json(json);
    } else {
      res
        .status(400)
        .cookie('call', cookieValue)
        .end('Something terribad happened :(');
    }
  });

  return server;
};

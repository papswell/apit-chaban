import { CRASH_EVERY_X_CALLS } from './../constants';
export default (req, res, next) => {


  const rand = Math.floor(Math.random() * 10) + 1;

  const currentCall = req.cookies.call || 0;
  const cookieValue = parseInt(currentCall, 10) + 1;

  res.cookie('call', cookieValue);

  if (
    true ||
    rand > 5
  ) {
    next();
  } else {
    res
      .status(500)
      .end('Something terribad happened :(');
  }
}

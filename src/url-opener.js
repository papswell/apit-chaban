import phantom from 'phantom';

/**
 * Open the page aat the specified url
 * @param  {String} url
 * @return {[type]}     [description]
 */
export default (url, parse) => {
  let phInstance;
  let sitepage;

  const shutdown = () => {
    if (sitepage) sitepage.close();
    if (phInstance) {
      phInstance.exit();
      phInstance = null;
    }
  };

  return phantom
    .create()
    .then(pha => {
      phInstance = pha;
      return pha.createPage();
    })
    .then(page => {
      sitepage = page;
    })
    .then(() => sitepage.open(url))
    .then(() => sitepage.evaluate(() => {
      return document.body && document.body.innerHTML ? document.body.innerHTML : "";
    }))
    .then(parse)
    // .then(_waitFor)
    .catch(e => {
      if (e.name === WAIT_FOR_TIMED_OUT) {
        return Promise.resolve();
      }
      return Promise.reject(e);
    })
    .then(r => {
      shutdown();
      return Promise.resolve(r);
    })
    .catch(e => {
      console.error('Unable to open url', e);
      shutdown();
      return Promise.reject(e);
    });
};

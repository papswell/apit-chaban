import openUrl from './url-opener';

const REGEX = /<a href="(.*)">(.*)<\/a><\/p>\s*<\/td>\s*<td style="text-align: center;">\s*<p>([\d]{2}\/[\d]{2}\/[\d]{2})<\/p>\s*<\/td>\s*<td style="text-align: center;">\s*<p>([\d]{2}:[\d]{2})<\/p>\s*<\/td>\s*<td style="text-align: center;">\s*<p>([\d]{2}:[\d]{2})<\/p>\s*<\/td>\s*<td style="text-align: center;">\s*<p>(.*)<\/p>\s*<\/td>/g;


export default (url) => {
  return openUrl(url, (html) => {
    const results = [];

    let result;
    while ((result = REGEX.exec(html)) !== null) {
      results.push(result.slice(1, result.length));
    }
    return Promise.resolve(results);
  })
  .then(results => {
    return Promise.all(results.map(row => {
      return ({
        date: row[2],
        start: row[3],
        end: row[4],
        totale: row[5].toLowerCase().indexOf('totale') >= 0,
        reason: row[1],
        link: `http://sedeplacer.bordeaux-metropole.fr${row[0]}`,
      });
    }));
  });

};

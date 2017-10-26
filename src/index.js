import server from './server';
import getData from './get-data';
const URL = 'http://sedeplacer.bordeaux-metropole.fr/Toutes-les-infos-circulation/Pont-Chaban-Delmas-Fermetures';


getData(URL)
  .then((data) => {
    server(data)
    .listen(3000, () => {
      console.log('Api running on port 3000');
    });
  })
  .catch(e => {
    console.log(e);
  })

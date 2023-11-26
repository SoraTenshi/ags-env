import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

/** @type {import('types/utils.js').GetFetchOptions} */
const options = {
  method: 'GET',
  headers: {},
};

Utils.fetch('http://wttr.in/?format=3', options)
  .then(res => {
    res = "[redacted]" + res.substring(res.indexOf(':'));
    console.log(res);
  })
  .catch(err => console.error(err));


export default (await import('./bar/bar.js')).default;

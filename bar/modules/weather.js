import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { Icon } from '../../widgets/icons.js';

import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

const thirtyMinutes = 1000 * 60 * 30;

/** @type {import('types/utils.js').GetFetchOptions} */
const options = {
  method: 'GET',
  headers: {},
};

export const Weather = () => Widget.Box({
  class_name: 'weather',
  children: [Widget.Label({
      class_name: 'weather-icon',
      css: "font-family: 'Material Symbols Sharp'",
    }), Widget.Label({
      class_name: 'weather-temp',
    }),
  ],
  connections: [[thirtyMinutes, self => {
    Utils.fetch('http://wttr.in/?format=j1', options)
      .then(res => {
        const weather = JSON.parse(res);

        /** @type {string} */
        const icon = Icon.weather[weather['current_condition'][0]['weatherCode']];

        /** @type {string} */
        const temp = weather['current_condition'][0]['temp_C'];
        self.children[0]['label'] = icon;
        self.children[1]['label'] = ` ${temp.replaceAll('+', '')}°C`;
      })
      .catch(err => console.error(err));
  }]]
});

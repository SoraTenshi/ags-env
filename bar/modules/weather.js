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
  has_tooltip: true,
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
        let weather = JSON.parse(res);
        let weatherCondition = weather['current_condition'][0];

        /** @type {string} */
        const icon = Icon.weather[weatherCondition['weatherCode']];

        /** @type {string} */
        const temp = weatherCondition['temp_C'];
        self.children[0]['label'] = icon;
        self.children[1]['label'] = `${temp.replaceAll('+', '')}°C`;

        const location = weather['nearest_area'][0];
        const city = location['areaName'][0]['value'];
        const country = location['country'][0]['value'];
        self.tooltip_markup = `Location: ${city}, ${country}` + '\n' +
          `FeelsLike: ${weatherCondition['FeelsLikeC'].replaceAll('+', '')}°C` + '\n' +
          `Humidity: ${weatherCondition['humidity']}%`;
      })
      .catch(err => console.error(err));
  }]]
});

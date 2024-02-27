import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { battery } from 'resource:///com/github/Aylur/ags/service/battery.js';

import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

import { Icon } from '../../widgets/icons.js';

export const Battery = () => Widget.Box({
  class_name: 'battery',
  tooltip_markup: battery.bind('percent').as(p => `Current: ${p}%`),
  children: [
    Widget.Label({
      class_name: 'battery-icon',
      label: Utils.merge([battery.bind('percent'), battery.bind('charging')], (percent, charging) => {
        const percentile = percent - (percent % 10) ?? 0;
        return charging ? Icon.battery.charging[`${percentile}`] : Icon.battery[`${percentile}`];
      }),
    }),
    Widget.Label({
      class_name: 'battery-val',
      label: battery.bind('percent').as((/** @type {number} */ p) => {
        return `${p}%`;
      }),
    })
  ]
});

import { Icon } from 'widgets/icons';

const battery = await Service.import('battery');

export const Battery = () => Widget.Box({
  class_name: 'battery',
  visible: battery.bind('available'),
  tooltip_markup: battery.bind('percent').as(p => `Current: ${p}%`),
  children: [
    Widget.Label({
      class_name: 'battery-icon',
      label: Utils.merge([battery.bind('percent'), battery.bind('charging')], (percent, charging) => {
        const percentile = percent - (percent % 10);
        return charging ? Icon.battery.charging[`${percentile}`] : Icon.battery[`${percentile}`];
      }),
    }),
    Widget.Label({
      class_name: 'battery-val',
      label: battery.bind('percent').as((p: number) => {
        return `${p}%`;
      }),
    })
  ]
});

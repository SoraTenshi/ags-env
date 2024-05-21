import { Icon } from 'widgets/icons.js';

const battery = await Service.import('battery');

const tooltip = Variable<string>("");

const format_seconds = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const fmt_hrs = hrs.toString().padStart(2, '0');
  const fmt_mins = mins.toString().padStart(2, '0');
  const fmt_secs = secs.toString().padStart(2, '0');

  return `${fmt_hrs}h:${fmt_mins}m:${fmt_secs}s`;
}

export const Battery = () => Widget.Box({
  setup: () => {
    Utils.interval(5000, () => {
      const percent = battery.percent;
      const charging = battery.charging;
      const time_left = battery.time_remaining;
      tooltip.value = `Current: ${percent}%\nIs Charging: ${charging ? 'yes' : 'no'}\nTime left: ${format_seconds(time_left)}`;
    });
  },
  class_name: 'battery',
  visible: battery.bind('available'),
  tooltip_markup: tooltip.bind(),
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

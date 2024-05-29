import { Icon } from 'widgets/icons.js';

const network = await Service.import('network');

const WifiIndicator = () => Widget.Box({
  children: [
    Widget.Label({
      css: "font-family: 'Material Symbols Sharp'; font-size: 1.4rem;",
      has_tooltip: true,
      tooltip_markup: Utils.merge([network.wifi.bind('ssid'), network.wifi.bind('strength')], (ssid: string, strength: number) => `SSID: ${network.wifi.ssid + '\n'}Strength: ${network.wifi.strength}%`),
      label: network.wifi.bind("strength").as((strength: number) => {
        if (strength < 10) return Icon.wifi.none;
        if (strength < 26) return Icon.wifi.bad;
        if (strength < 51) return Icon.wifi.low;
        if (strength < 76) return Icon.wifi.normal;
        if (strength < 110) return Icon.wifi.good;
        else return Icon.wifi.none;
      })
    }),
  ],
});

const WiredIndicator = () => Widget.Label({
  css: "font-family: 'Material Symbols Sharp'; font-size: 1.4rem;",
  label: network.wired.bind("internet").as((state: string) => {
    if (state === "connected") return Icon.wired.power;
    if (state === "connecting") return Icon.wired.poweroff;
    if (state === "disconnected") return Icon.wired.poweroff;
    return Icon.wired.poweroff;
  }),
  tooltip_markup: network.wired.bind('internet').as((state: string) => `Connection: ${state}`),
});

export const Connection = () => Widget.Box({
  class_name: 'network',
  children: [
    Widget.Stack({
      children: {
        'wifi': WifiIndicator(),
        'wired': WiredIndicator(),
      },
      shown: network.bind('primary'),
    }),
  ],
});

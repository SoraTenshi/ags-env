import { Icon } from 'widgets/icons';

const network = await Service.import('network');

const WifiIndicator = () => Widget.Box({
  children: [
    Widget.Label({
      css: "font-family: 'Material Symbols Sharp'; font-size: 1.4rem;",
      has_tooltip: true,
      setup: self => {
        self.bind('label', network.wifi, "strength", (strength: number) => {
          if (strength < 10) return Icon.wifi.none;
          if (strength < 26) return Icon.wifi.bad;
          if (strength < 51) return Icon.wifi.low;
          if (strength < 76) return Icon.wifi.normal;
          if (strength < 110) return Icon.wifi.good;
          else return Icon.wifi.none;
        })
          .hook(network.wifi, self => self.tooltip_markup = `SSID: ${network.wifi.ssid + '\n'}Strength: ${network.wifi.strength}%`);
      },
    }),
  ],
});

const WiredIndicator = () => Widget.Label({
  css: "font-family: 'Material Symbols Sharp'; font-size: 1.4rem;",
  setup: self => {
    self.bind('label', network.wired, 'internet', internet => {
      if (internet === "connected") return Icon.wired.power;
      if (internet === "connecting") return Icon.wired.poweroff;
      if (internet === "disconnected") return Icon.wired.poweroff;
      return Icon.wired.poweroff;
    }).hook(network.wired, self => self.tooltip_markup = `Connection: ${network.wired.internet}`);
  },
});

export const Connection = () => Widget.Box({
  class_name: 'network',
  children: [
    Widget.Stack({
      children: {
        'wifi': WifiIndicator(),
        'wired': WiredIndicator(),
      },
      setup: self => self.bind('shown', network, 'primary', p => p || 'wifi'),
    }),
  ],
});

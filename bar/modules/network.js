import { Icon } from '../../widgets/icons.js';

import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Network from 'resource:///com/github/Aylur/ags/service/network.js';

const WifiIndicator = () => Widget.Box({
  children: [
    Widget.Label({
      css: "font-family: 'Material Symbols Sharp'; font-size: 1.4rem;",
      has_tooltip: true,
      setup: self => {
        self.bind('label', Network.wifi, "strength", (/** @type {number} */ strength) => {
          if (strength < 10) return Icon.wifi.none;
          if (strength < 26) return Icon.wifi.bad;
          if (strength < 51) return Icon.wifi.low;
          if (strength < 76) return Icon.wifi.normal;
          if (strength < 110) return Icon.wifi.good;
          else return Icon.wifi.none;
        })
          .hook(Network.wifi, self => self.tooltip_markup = `SSID: ${Network.wifi.ssid + '\n'}Strength: ${Network.wifi.strength}%`);
      },
    }),
  ],
});

const WiredIndicator = () => Widget.Label({
  css: "font-family: 'Material Symbols Sharp'; font-size: 1.4rem;",
  setup: self => {
    self.bind('label', Network.wired, 'internet', internet => {
      if (internet === "connected") return Icon.wired.power;
      if (internet === "connecting") return Icon.wired.poweroff;
      if (internet === "disconnected") return Icon.wired.poweroff;
      return Icon.wired.poweroff;
    }).hook(Network.wired, self => self.tooltip_markup = `Connection: ${Network.wired.internet}`);
  },
});

export const Connection = () => Widget.Box({
  class_name: 'network',
  children: [
    Widget.Stack({
      items: [
        ['wifi', WifiIndicator()],
        ['wired', WiredIndicator()],
      ],
      setup: self => self.bind('shown', Network, 'primary', p => p || 'wifi'),
    }),
  ],
});

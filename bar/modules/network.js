import { Icon } from '../../widgets/icons.js';

import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Network from 'resource:///com/github/Aylur/ags/service/network.js';

const WifiIndicator = () => Widget.Box({
  children: [
    Widget.Label({
      css: "font-family: 'Material Symbols Sharp'; font-size: 1.4rem;",
      has_tooltip: true,
      // binds: [['label', Network.wifi, 'icon-name']],
      binds: [['label', Network.wifi, 'strength', (/** @type {number} */ strength) => {
        if (strength < 0.1) return Icon.wifi.none;
        if (strength < 0.26) return Icon.wifi.bad;
        if (strength < 0.51) return Icon.wifi.low;
        if (strength < 0.76) return Icon.wifi.normal;
        if (strength < 1.1) return Icon.wifi.good;
        else return Icon.wifi.none;
      }]],
      connections: [[Network.wifi, self => self.tooltip_markup = `Strength: ${Network.wifi.strength * 100}`]],
    }),
  ],
});

const WiredIndicator = () => Widget.Label({
  css: "font-family: 'Material Symbols Sharp'; font-size: 1.4rem;",
  binds: [['label', Network.wired, 'internet', internet => {
    console.log(internet);
    if(internet === "connected") return Icon.wired.power;
    if(internet === "connecting") return Icon.wired.poweroff;
    if(internet === "disconnected") return Icon.wired.poweroff;
    return Icon.wired.poweroff;
  }]],
  connections: [[Network.wired, self => self.tooltip_markup = `Connection: ${Network.wired.internet}`]],
});

export const Connection = () => Widget.Box({
  class_name: 'network',
  children: [
    Widget.Stack({
      items: [
        ['wifi', WifiIndicator()],
        ['wired', WiredIndicator()],
      ],
      binds: [['shown', Network, 'primary', p => p || 'wifi']],
    }),
  ],
});

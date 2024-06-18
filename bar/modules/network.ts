import { VpnConnection } from 'types/service/network.js';

import { Icon } from 'widgets/icons.js';

const network = await Service.import('network');

const WifiIndicator = () => Widget.Box({
  children: [
    Widget.Label({
      css: "font-family: 'Material Symbols Sharp'; font-size: 1.4rem;",
      has_tooltip: true,
      tooltip_markup: Utils.merge([network.wifi.bind('ssid'), network.wifi.bind('strength'), network.vpn.bind('connections')], (ssid: string, strength: number, vpn_state: VpnConnection[]) => 
        `SSID: ${ssid}
Strength: ${strength}%
VPNs: ${vpn_state.map((v,) => `${v.id}: ${v.state}`).join('\n\t')}`),
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
  tooltip_markup: Utils.merge([network.wired.bind('internet'), network.vpn.bind('connections')], (state: string, vpn_state: VpnConnection[]) => `Connection: ${state}
VPNs: ${vpn_state.map((v,) => `${v.id}: ${v.state}`).join('\n\t')}`),
});

export const Connection = () => Widget.Button({
  class_name: 'network',
  // on_primary_clicked: (_: unknown) => {
    // spawn a neat window which contains the ssid information + password thingy for establishing a connection
  // },
  child: Widget.Stack({
    children: {
      'wifi': WifiIndicator(),
      'wired': WiredIndicator(),
    },
    shown: network.bind('primary'),
  }),
});

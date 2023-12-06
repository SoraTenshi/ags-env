import { Workspaces } from './modules/workspaces.js';
import { Volume } from './modules/volume.js';
import { Clock } from './modules/clock.js';
import { Media } from './modules/media.js';
import { SysTray } from './modules/systray.js';
import { Weather } from './modules/weather.js';
import { Connection } from './modules/network.js';
import { AppLauncher, List } from './modules/applications.js';

import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

import Gdk from 'gi://Gdk';

import './state.js';

// import Gdk from 'gi://Gdk';
import { exec } from 'resource:///com/github/Aylur/ags/utils.js';

const Sound = () => Widget.Box({
  class_name: 'sound',
  children: [
    Volume('microphone'),
    Volume('speaker'),
  ]
});

const Left = () => Widget.Box({
  children: [
    Workspaces(),
  ],
});

const Center = () => Widget.Box({
  children: [
    Media(),
  ],
});

const Right = () => Widget.Box({
  hpack: 'end',
  children: [
    Connection(),
    Weather(),
    Sound(),
    Clock(),
    SysTray(),
  ],
});

export const Bar = ({ monitor } = { monitor: 1 }) => Widget.Window({
  name: `bar-${monitor}`, // name has to be unique
  class_name: 'bar',
  monitor,
  anchor: ['top', 'left', 'right'],
  exclusivity: 'exclusive',
  connections: [['key-press-event', (self, event) => {
    // @ts-ignore
    if (event.get_keyval()[1] === Gdk.KEY_Escape) {
      try {
        App.closeWindow(`app-items`);
      } catch (_) {}
      BarState.value = `bar ${monitor}`;
      self.focusable = false;
    }
  }],
  [BarState, self => {
    const bar_state = BarState.value.split(' ');
    if (`${monitor}` === bar_state[1]) self.focusable = 'bar' !== bar_state[0];
  }]],
  child: Widget.Stack({
    transition: 'crossfade',
    items: [
      ['bar', Widget.CenterBox({
        start_widget: Left(),
        center_widget: Center(),
        end_widget: Right(),
      })],
      ['app-launcher', AppLauncher({ monitor })],
      // ['network-manager', NetworkManager()],
    ],
    connections: [[BarState, self => {
      const bar = BarState.value.split(' ');
      if (bar[1] !== `${monitor}`) return;
      const shown = ['bar', 'app-launcher', 'network-manager'].find(
        pred => pred === bar[0]
      );

      self.shown = shown ?? 'bar';
    }]],
  }),
})

/**
  * @returns {unknown[]} The amount of monitors
  */
const Monitors = () => {
  return JSON.parse(exec("hyprctl monitors -j"));
}

export default {
  style: `${App.configDir}/bar/style.css`,
  windows: [
    ...Monitors().map((_, i) => Bar({ monitor: i })),
    List(),
  ],
}


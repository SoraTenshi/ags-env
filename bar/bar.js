// @ts-nocheck
import { Workspaces } from './modules/workspaces.js';
import { Volume } from './modules/volume.js';
import { Clock } from './modules/clock.js';
import { Media } from './modules/media.js';
import { SysTray } from './modules/systray.js';
import { Weather } from './modules/weather.js';
import { Connection } from './modules/network.js';
import { AppLauncher, AppList } from './modules/applications.js';
import { Shutdown, ShutdownList } from './modules/shutdown.js';
import { Executor } from './modules/execute.js';
import { Cpu, Memory } from './modules/system.js';
import { Battery } from './modules/battery.js';

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
    Cpu(),
    Memory(),
    Weather(),
    Battery(),
    Sound(),
    Clock(),
    SysTray(),
  ],
});

export const Bar = ({ monitor } = { monitor: 1 }) => {
  const barStates = {
    'bar': 'bar',
    'app-launcher': 'app-items',
    'executor': 'executor',
    'network-manager': 'network-items',
    'shutdown': 'shutdown',
  };
  return Widget.Window({
    name: `bar-${monitor}`, // name has to be unique
    class_name: 'bar',
    monitor,
    anchor: ['top', 'left', 'right'],
    exclusivity: 'exclusive',
    setup: self => {
      self.keybind("Escape", () => {
          try {
            for (const [_, name] of Object.entries(barStates)) {
              const window = App.getWindow(name);
              if (window?.is_visible()) {
                App.closeWindow(name);
              }
            }
          } catch (_) { }
          BarState.value = `bar ${monitor}`;
          self.keymode = "none";
      })
      .hook(BarState, self => {
        const bar_state = BarState.value.split(' ');
        if (`${monitor}` === bar_state[1]) self.keymode = ('bar' !== bar_state[0] ? "on-demand" : "none");
      });
    },
    child: Widget.Stack({
      transition: 'crossfade',
      children: {
        'bar': Widget.CenterBox({
          start_widget: Left(),
          center_widget: Center(),
          end_widget: Right(),
        }),
        'app-launcher': AppLauncher({ monitor }),
        'executor': Executor({ monitor }),
        'shutdown': Shutdown({ monitor }),
        // ['network-manager', NetworkManager()],
      },
      setup: self => {
        self.hook(BarState, self => {
          const bar = BarState.value.split(' ');
          if (bar[1] !== `${monitor}`) return;
          const shown = Object.keys(barStates).find(
            pred => pred === bar[0]
          );

          self.shown = shown ?? 'bar';
        });
      },
    }),
  });
}

/**
  * @returns {unknown[]} The amount of monitors
  */
export const Monitors = () => {
  return JSON.parse(exec("hyprctl monitors -j"));
}


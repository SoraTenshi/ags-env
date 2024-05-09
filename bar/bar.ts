import { AppLauncher } from './modules/applications';
import { Battery } from './modules/battery';
import { Clock } from './modules/clock';
import { Connection } from './modules/network';
import { Cpu, Memory } from './modules/system';
import { Executor } from './modules/execute';
import { Media } from './modules/media';
import { RunCat } from './modules/runcat';
import { Shutdown } from './modules/shutdown';
import { SysTray } from './modules/systray';
import { Volume } from './modules/volume';
import { Weather } from './modules/weather';
import { Workspaces } from './modules/workspaces';

import { BarState } from './state';

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
    RunCat(),
    Cpu(),
    Memory(),
    Weather(),
    Battery(),
    Sound(),
    Clock(),
    SysTray(),
  ],
});

type BarStateType = 'bar' | 'app-launcher' | 'executor' | 'shutdown';
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
          for (const [, name] of Object.entries(barStates)) {
            const window = App.getWindow(name);
            if (window?.is_visible()) {
              App.closeWindow(name);
            }
          }
        } catch(err) {
          print(err);
        };
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
        // 'network-manager', NetworkManager({ monitor }),
      },
      setup: self => {
        self.hook(BarState, self => {
          const bar = BarState.value.split(' ');
          if (bar[1] !== `${monitor}`) return;
          const shown: string | undefined = Object.keys(barStates).find(
            pred => pred === bar[0]
          );

          self.shown = (shown ?? "bar") as BarStateType;
        });
      },
    }),
  });
}

export const Monitors = () => {
  return JSON.parse(Utils.exec("hyprctl monitors -j"));
}


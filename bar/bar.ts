import { AppLauncher } from './modules/applications.js';
import { Battery } from './modules/battery.js';
import { Clock } from './modules/clock.js';
import { Connection } from './modules/network.js';
import { Cpu, Memory } from './modules/system.js';
import { Executor } from './modules/execute.js';
import { Media } from './modules/media.js';
import { RunCat } from './modules/runcat.js';
import { Shutdown } from './modules/shutdown.js';
import { SysTray } from './modules/systray.js';
import { Volume, unhover } from './modules/volume.js';
import { Weather } from './modules/weather.js';
import { Workspaces } from './modules/workspaces.js';
import { Todo } from './modules/todo.js';

import { BarState } from './state.js';

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
    Todo(),
  ],
});

const Center = () => Widget.Box({
  children: [
    Media(),
  ],
});

const Right = (is_master: boolean) => Widget.Box({
  hpack: 'end',
  children: [
    Connection(),
    RunCat(is_master),
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
  const is_master = monitor == 0;
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
    setup: (self: ReturnType<typeof Widget.Window>) => {
      self.keybind("Escape", () => {
        try {
          for (const [, name] of Object.entries(barStates)) {
            const window = App.getWindow(name);
            if (window?.is_visible()) {
              App.closeWindow(name);
            }
          }
        } catch (err) {
          print(err);
        };
        BarState.value = `bar ${monitor}`;
        self.keymode = "none";
      })
        .hook(BarState, (self: ReturnType<typeof Widget.Window>) => {
          const bar_state = BarState.value.split(' ');

          if (`${monitor}` === bar_state[1]) self.keymode = ('bar' !== bar_state[0] ? "exclusive" : "none");
        })
        .on("leave-notify-event", unhover);
    },
    child: Widget.Stack({
      transition: 'crossfade',
      children: {
        'bar': Widget.CenterBox({
          start_widget: Left(),
          center_widget: Center(),
          end_widget: Right(is_master),
        }),
        'app-launcher': AppLauncher({ monitor }),
        'executor': Executor({ monitor }),
        'shutdown': Shutdown({ monitor }),
        // 'network-manager', NetworkManager({ monitor }),
      },
      setup: (self: ReturnType<typeof Widget.Stack>) => {
        self.hook(BarState, (self: ReturnType<typeof Widget.Stack>) => {
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


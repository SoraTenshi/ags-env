import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';

import { Icon, MaterialIcon } from '../../widgets/icons.js';

import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import { Widget } from "resource:///com/github/Aylur/ags/widget.js";

export const Workspaces = () => Widget.Box({
  class_name: 'workspace',
  child: Widget.CenterBox({
    vertical: true,
    start_widget: Widget.Label({
      setup: self => self.label = Hyprland.active.client.title,
      height_request: 23,
      truncate: 'end',
      max_width_chars: 20,
      class_name: 'current-title',
      css: '',
      binds: [['label', Hyprland.active.client, 'title']],
    }),
    end_widget: Widget.Box({
      class_name: 'workspaces',
      vexpand: false,
      homogeneous: true,
      connections: [[Hyprland.active.workspace, self => {
        self.children = Array.from({ length: 9 }).map((_, n) => {
          const i = (n + 1);
          let uwu = Hyprland.active.workspace.id === i ? 'active' : 'inactive';
          const currentWs = Hyprland.getWorkspace(i);
          if (uwu === 'inactive' && currentWs && currentWs['windows'] > 0) {
            uwu = 'occupied';
          }
          return Widget.Button({
            vexpand: true,
            on_clicked: () => execAsync(`hyprctl dispatch workspace ${i}`),
            child: MaterialIcon({ icon: Icon.workspace[uwu], }),
            class_name: uwu,
          });
        })
      }
      ]],
    }),
  }),
});


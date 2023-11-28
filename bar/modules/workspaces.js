import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';

import { Icon, MaterialIcon } from '../../widgets/icons.js';

import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import { Widget } from "resource:///com/github/Aylur/ags/widget.js";

export const Workspaces = () => Widget.Box({
  class_name: 'workspace',
  homogeneous: true,
  child: Widget.Box({
    class_name: 'workspaces',
    connections: [[Hyprland.active.workspace, self => {
      self.children = Array.from({ length: 9 }).map((_, n) => {
        const i = (n + 1);
        const uwu = Hyprland.active.workspace.id === i ? 'active' : 'inactive';
        return Widget.Button({
          on_clicked: () => execAsync(`hyprctl dispatch workspace ${i}`),
          child: MaterialIcon(Icon.workspace[uwu]),
          class_name: uwu,
        });
      })
    }
    ]],
  }),
});


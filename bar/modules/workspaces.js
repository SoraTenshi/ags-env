import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import { Widget } from "resource:///com/github/Aylur/ags/widget.js";

export const Workspaces = () => Widget.Box({
    css: 'background-color: #',
    child: Widget.Box({
        class_name: 'workspaces',
        connections: [[Hyprland.active.workspace, self => {
            self.children = Array.from({ length: 9 }).map((_, n) => {
                const i = n + 1;
                return Widget.Button({
                    css: 'background-color: transparent;',
                    on_clicked: () => execAsync(`hyprctl dispatch workspace ${i}`),
                    child: Widget.Label(`${i}`),
                    class_name: Hyprland.active.workspace.id === i ? 'focused' : 'unfocused',
                });
            })}
        ]],
    }),
});


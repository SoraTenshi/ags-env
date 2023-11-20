import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import { Widget } from "resource:///com/github/Aylur/ags/widget.js";

export const Workspaces = () => Widget.Box({
    class_name: 'workspaces',
    connections: [[Hyprland.active, self => {
        self.children = Array.from({ length: 9 }).map((_, n) => {
            const i = n + 1;
            // @ts-ignore
            let name = Hyprland.workspaces[n]["name"];
            return Widget.Button({
                on_clicked: () => execAsync(`hyprctl dispatch workspace ${i}`),
                child: Widget.Label(name),
                class_name: Hyprland.active.workspace.id === i ? 'focused' : 'unfocused',
            });
        })}
    ]],
});


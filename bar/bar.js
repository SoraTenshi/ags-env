import { Workspaces } from './modules/workspaces.js';
import { Volume } from './modules/volume.js';
import { Clock } from './modules/clock.js';
import { Media } from './modules/media.js';
import { SysTray } from './modules/systray.js';

import Widget from 'resource:///com/github/Aylur/ags/widget.js';

import Gdk from 'gi://Gdk';
import { exec } from 'resource:///com/github/Aylur/ags/utils.js';

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
        Volume(),
        Clock(),
        SysTray(),
    ],
});

export const Bar = ({ monitor } = {monitor: 1}) => Widget.Window({
    name: `bar-${monitor}`, // name has to be unique
    class_name: 'bar',
    monitor,
    anchor: ['top', 'left', 'right'],
    css: 'background-color: #24283b',
    exclusivity: 'exclusive',
    child: Widget.CenterBox({
        start_widget: Left(),
        center_widget: Center(),
        end_widget: Right(),
    }),
})

/**
  * @returns {unknown[]} The amount of monitors
  */
const Monitors = () => {
    return JSON.parse(exec("hyprctl monitors -j"));
}

export default {
    windows: [Monitors().map((_, i) => Bar({monitor: i}))],
}

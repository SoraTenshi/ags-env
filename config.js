import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

/** @type {() => unknown[]} */
const Monitors = () => JSON.parse(Utils.exec("hyprctl monitors -j"));

// widgets can be only assigned as a child in one container
// so to make a reuseable widget, just make it a function
// then you can use it by calling simply calling it

const Workspaces = () => Widget.Box({
    class_name: 'workspaces',
    connections: [[Hyprland, self => {
        self.children = Hyprland.workspaces.map((ws, i) => Widget.Button({
            on_clicked: () => execAsync(`hyprctl dispatch workspace ${i}`),
            child: Widget.Label(`${ws['name']}`),
            class_name: Hyprland.active.workspace.id === i ? 'focused' : 'unfocused',
        }));
    }]],
});

const Clock = () => Widget.Label({
    class_name: 'clock',
    xpad: 10,
    connections: [
        // this is what you should do
        [1000, self => execAsync(['date', '+%H:%M:%S %a'])
            .then(date => self.label = date).catch(console.error)],
    ],
});

const Media = () => Widget.Button({
    class_name: 'media',
    on_primary_click: () => Mpris.getPlayer('')?.playPause(),
    on_scroll_up: () => Mpris.getPlayer('')?.next(),
    on_scroll_down: () => Mpris.getPlayer('')?.previous(),
    child: Widget.Label({
        connections: [[Mpris, self => {
            const mpris = Mpris.getPlayer('');
            // mpris player can be undefined
            if (mpris)
                self.label = `${mpris.track_artists.join(', ')} - ${mpris.track_title}`;
            else
                self.label = 'Nothing is playing';
        }]],
    }),
});

const Volume = () => Widget.Box({
    class_name: 'volume',
    css: 'min-width: 180px',
    children: [
        Widget.Stack({
            items: [
                // tuples of [string, Widget]
                ['101', Widget.Icon('audio-volume-overamplified-symbolic')],
                ['67', Widget.Icon('audio-volume-high-symbolic')],
                ['34', Widget.Icon('audio-volume-medium-symbolic')],
                ['1', Widget.Icon('audio-volume-low-symbolic')],
                ['0', Widget.Icon('audio-volume-muted-symbolic')],
            ],
            connections: [[Audio, self => {
                if (!Audio.speaker)
                    return;

                if (Audio.speaker.is_muted) {
                    self.shown = '0';
                    return;
                }

                const show = [101, 67, 34, 1, 0].find(
                    // @ts-ignore
                    threshold => threshold <= Audio.speaker.volume * 100);

                self.shown = `${show}`;
            }, 'speaker-changed']],
        }),
        Widget.Slider({
            hexpand: true,
            draw_value: false,
            // @ts-ignore
            on_change: ({ value }) => Audio.speaker.volume = value,
            connections: [[Audio, self => {
                self.value = Audio.speaker?.volume || 0;
            }, 'speaker-changed']],
        }),
    ],
});

const SysTray = () => Widget.Box({
    connections: [[SystemTray, self => {
        self.children = SystemTray.items.map(item => Widget.Button({
            child: Widget.Icon({ binds: [['icon', item, 'icon']] }),
            on_primary_click: (_, event) => item.activate(event),
            on_secondary_click: (_, event) => item.openMenu(event),
            binds: [['tooltip-markup', item, 'tooltip-markup']],
        }));
    }]],
});

// layout of the bar
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

const Bar = ({ monitor } = {monitor: 1}) => Widget.Window({
    name: `bar-${monitor}`, // name has to be unique
    class_name: 'bar',
    monitor,
    anchor: ['top', 'left', 'right'],
    css: 'background-color: #24283b',
    exclusive: true,
    child: Widget.CenterBox({
        start_widget: Left(),
        center_widget: Center(),
        end_widget: Right(),
    }),
})

export default {
    style: App.configDir + '/style.css',
    windows: [Monitors().map((_, i) => Bar({monitor: i}))]
}

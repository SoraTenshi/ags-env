// @ts-nocheck
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { exec, execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

/** @type {() => unknown[]} */
const Monitors = () => JSON.parse(Utils.exec("hyprctl monitors -j"));

// widgets can be only assigned as a child in one container
// so to make a reuseable widget, just make it a function
// then you can use it by calling simply calling it

const Workspaces = () => Widget.Box({
    className: 'workspaces',
    connections: [[Hyprland.active.workspace, self => {
        // generate an array [1..10] then make buttons from the index
        self.children = Hyprland.workspaces.map((ws, i) => Widget.Button({
            onClicked: () => execAsync(`hyprctl dispatch workspace ${i}`),
            child: Widget.Label(`${ws.name}`),
            className: Hyprland.active.workspace.id == i ? 'focused' : '',
        }));
    }]],
});

const Clock = () => Widget.Label({
    className: 'clock',
    xpad: 10,
    connections: [
        // this is what you should do
        [1000, self => execAsync(['date', '+%H:%M:%S %a'])
            .then(date => self.label = date).catch(console.error)],
    ],
});

const Media = () => Widget.Button({
    className: 'media',
    onPrimaryClick: () => Mpris.getPlayer('')?.playPause(),
    onScrollUp: () => Mpris.getPlayer('')?.next(),
    onScrollDown: () => Mpris.getPlayer('')?.previous(),
    child: Widget.Label({
        connections: [[Mpris, self => {
            const mpris = Mpris.getPlayer('');
            // mpris player can be undefined
            if (mpris)
                self.label = `${mpris.trackArtists.join(', ')} - ${mpris.trackTitle}`;
            else
                self.label = 'Nothing is playing';
        }]],
    }),
});

const Volume = () => Widget.Box({
    className: 'volume',
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

                if (Audio.speaker.isMuted) {
                    self.shown = '0';
                    return;
                }

                const show = [101, 67, 34, 1, 0].find(
                    threshold => threshold <= Audio.speaker.volume * 100);

                self.shown = `${show}`;
            }, 'speaker-changed']],
        }),
        Widget.Slider({
            hexpand: true,
            drawValue: false,
            onChange: ({ value }) => Audio.speaker.volume = value,
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
            onPrimaryClick: (_, event) => item.activate(event),
            onSecondaryClick: (_, event) => item.openMenu(event),
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
        SysTray(),
    ],
});

const Right = () => Widget.Box({
    hpack: 'end',
    children: [
        Volume(),
        Clock(),
    ],
});

const Bar = ({ monitor } = {}) => Widget.Window({
    name: `bar-${monitor}`, // name has to be unique
    className: 'bar',
    monitor,
    anchor: ['top', 'left', 'right'],
    css: 'background-color: #24283b',
    exclusive: true,
    child: Widget.CenterBox({
        startWidget: Left(),
        centerWidget: Center(),
        endWidget: Right(),
    }),
})

export default {
    style: App.configDir + '/style.css',
    windows: [Monitors().map((_, i) => Bar({monitor: i}))]
}

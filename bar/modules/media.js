import Mpris, { MprisPlayer } from 'resource:///com/github/Aylur/ags/service/mpris.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

export const Media = () => {
    /** @type {MprisPlayer} */
    let player;
    return Widget.Button({
        class_name: 'media',
        on_primary_click: () => Mpris.getPlayer('')?.playPause(),
        on_scroll_up: () => Mpris.getPlayer('')?.next(),
        on_scroll_down: () => Mpris.getPlayer('')?.previous(),
        child: Widget.Overlay({
            pass_through: true,
            child: Widget.Button({
                on_clicked: () => Mpris.players[0]?.playPause(),
                child: Widget.Label(),
                css: 'background-color: transparent;',
                visible: false,
                connections: [[Mpris, self => {
                    const player = Mpris.players[0];
                    self.visible = !!player;
                    if (!player) return;
                    const { track_artists, track_title } = player;
                    self.child["label"] = `${track_artists.join(', ')} - ${track_title}`;
                }]],
            }),
            overlays: [Widget.ProgressBar({
                css: 'foreground-color: #bb9af7',
                connections: [[Mpris, _ => {
                    player = Mpris.players[0];
                }],
                [1000, self => {
                    if(!player) return;
                    self.value = player.position / player.length;
                }]],
            })],
        })
    });
};

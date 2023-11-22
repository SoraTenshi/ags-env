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
            class_name: 'track',
            pass_through: true,
            child: Widget.Button({
                on_clicked: () => Mpris.players[0]?.playPause(),
                child: Widget.Label({ class_name: 'artist' }),
                visible: false,
                connections: [[Mpris, self => {
                    const player = Mpris.players[0];
                    self.visible = !!player;
                    if (!player) {
                        self.child["label"] = "[Nothing]";
                        return;
                    }
                    const { track_artists, track_title } = player;
                    let {artist, title} = {artist: track_artists.join(', '), title: track_title};
                    if (title.length > 21) title = title.slice(0, 21) + "...";
                    if (artist.length > 21) artist = artist.slice(0, 21) + "...";
                    self.child["label"] = `${artist} - ${title}`;
                }]],
            }),
            overlays: [Widget.ProgressBar({
                class_name: 'track',
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

import Mpris, { MprisPlayer } from 'resource:///com/github/Aylur/ags/service/mpris.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

export const Media = () => {
  /** @type {MprisPlayer} */
  let player;
  return Widget.EventBox({
    class_name: 'media',
    on_primary_click: () => Mpris.getPlayer('')?.playPause(),
    on_scroll_up: () => Mpris.getPlayer('')?.next(),
    on_scroll_down: () => Mpris.getPlayer('')?.previous(),
    child: Widget.Box({
      class_name: 'music',
      child: Widget.Overlay({
        pass_through: true,
        child: Widget.Button({
          on_clicked: () => Mpris.players[0]?.playPause(),
          child: Widget.Label({
            max_width_chars: 28,
            truncate: 'end',
            class_name: 'artist'
          }),
          visible: false,
          connections: [[Mpris, self => {
            const mplayer = Mpris.players[0];
            self.visible = !!mplayer;
            if (!mplayer) {
              self.child["label"] = "[Nothing]";
              return;
            }
            const { track_artists, track_title } = mplayer;
            self.child["label"] = `${track_artists.join(', ')} - ${track_title}`;
          }]],
        }),
        overlays: [Widget.ProgressBar({
          class_name: 'trackbar',
          connections: [[Mpris, _ => {
            player = Mpris.players[0];
          }],
          [1000, self => {
            if (!player) return;
            self.value = player.position / player.length;
          }]],
        })],
      }),
    })
  });
};

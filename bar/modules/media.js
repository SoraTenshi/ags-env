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
          class_name: 'music',
          on_clicked: () => Mpris.players[0]?.playPause(),
          child: Widget.Label({ class_name: 'artist' }),
          visible: false,
          connections: [[Mpris, self => {
            const mplayer = Mpris.players[0];
            self.visible = !!mplayer;
            if (!mplayer) {
              self.child["label"] = "[Nothing]";
              return;
            }
            const { track_artists, track_title } = mplayer;
            let { artist, title } = { artist: track_artists.join(', '), title: track_title };
            if (title.length > 12) title = title.slice(0, 12) + "...";
            if (artist.length > 21) artist = artist.slice(0, 21) + "...";
            self.child["label"] = `${artist} - ${title}`;
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

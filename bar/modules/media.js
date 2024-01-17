import Mpris, { MprisPlayer } from 'resource:///com/github/Aylur/ags/service/mpris.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

export const Media = () => {
  /** @type {MprisPlayer} */
  let player = Mpris.getPlayer("spotify") || Mpris.players[0];
  return Widget.EventBox({
    class_name: 'media',
    on_primary_click: () => Mpris.getPlayer('')?.playPause(),
    on_scroll_up: () => Mpris.getPlayer('')?.next(),
    on_scroll_down: () => Mpris.getPlayer('')?.previous(),
    child: Widget.Overlay({
      pass_through: true,
      child: Widget.Button({
        on_clicked: () => (Mpris.getPlayer("spotify") || Mpris.players[0]).playPause(),
        child: Widget.CenterBox({
          vertical: true,
          start_widget: Widget.Label({
            max_width_chars: 28,
            truncate: 'end',
            class_name: 'song'
          }),
          center_widget: Widget.Label({
            max_width_chars: 28,
            truncate: 'end',
            class_name: 'artist',
          })
        }),
        connections: [[Mpris, self => {
          const mplayer = Mpris.getPlayer("spotify") || Mpris.players[0];

          if (!mplayer) {
            self.child['center_widget']['label'] = "[Nothing]";
            self.child['start_widget']['label'] = "[Nothing]";
            return;
          }
          const { track_artists, track_title } = mplayer;
          self.child['center_widget']['label'] = `${track_artists.join(', ')}`;
          self.child['start_widget']['label'] = `${track_title}`;
        }]],
      }),
      overlays: [Widget.ProgressBar({
        class_name: 'trackbar',
        visible: false,
        connections: [[Mpris, self => {
          player = Mpris.getPlayer("spotify") || Mpris.players[0];
          self.visible = !!player;
        }],
        [1000, self => {
          if (!player) return;
          self.visible = !!player;
          self.value = player.position / player.length;
        }]],
      })],
    }),
  });
};

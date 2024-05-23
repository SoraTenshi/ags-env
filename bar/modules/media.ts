const mpris = await Service.import('mpris');

export const Media = () => {
  let player = mpris.getPlayer("spotify") || mpris.players[0];
  return Widget.EventBox({
    class_name: 'media',
    on_primary_click: () => mpris.getPlayer('')?.playPause(),
    on_scroll_up: () => mpris.getPlayer('')?.next(),
    on_scroll_down: () => mpris.getPlayer('')?.previous(),
    child: Widget.Overlay({
      pass_through: true,
      child: Widget.Button({
        on_clicked: () => (mpris.getPlayer("spotify") || mpris.players[0]).playPause(),
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
        setup: (self: ReturnType<typeof Widget.Button>) => {
          self.hook(mpris, (self: ReturnType<typeof Widget.Button>) => {
            if(self.child.center_widget === null || self.child.start_widget === null) {
              return;
            }

            const mplayer = mpris.getPlayer("spotify") || mpris.players[0];

            if (!mplayer) {
              self.child.center_widget.label = "[Nothing]";
              self.child.start_widget.label = "[Nothing]";
              return;
            }
            const { track_artists, track_title } = mplayer;
            self.child.center_widget.label = `${track_artists.join(', ')}`;
            self.child.start_widget.label = `${track_title}`;
          });
        },
      }),
      overlays: [Widget.ProgressBar({
        class_name: 'trackbar',
        visible: false,
        setup: (self: ReturnType<typeof Widget.ProgressBar>) => {
          self.hook(mpris, (self: ReturnType<typeof Widget.ProgressBar>) => {
            player = mpris.getPlayer("spotify") || mpris.players[0];
            self.visible = !!player;
          }).poll(1000, (self: ReturnType<typeof Widget.ProgressBar>) => {
              if (!player) return;
              self.visible = !!player;
              self.value = player.position / player.length;
            });
        },
      })],
    }),
  });
};

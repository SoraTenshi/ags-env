import { MaterialIcon, Icon } from 'widgets/icons';

const audio = await Service.import('audio');

type AudioThreshhold = '101' | '67' | '34' | '1' | '0';
export const Volume = (type: number) => {
  return Widget.EventBox({
    on_hover: self => {
      const child = self.child.children[0];
      child['reveal_child'] = true;
    },
    on_hover_lost: self => {
      const child = self.child.children[0];
      child['reveal_child'] = false;
    },
    on_primary_click: () => {
      if (!audio[type]) return;
      audio[type].is_muted = !audio[type].is_muted;
    },
    child: Widget.Box({
      hexpand: true,
      children: [
        Widget.Revealer({
          reveal_child: false,
          transition_duration: 500,
          transition: 'slide_left',
          child: Widget.Box({
            hexpand: true,
            css: 'min-width: 180px;',
            child: Widget.Slider({
              hexpand: true,
              draw_value: false,
              on_change: ({ value }) => audio[type].volume = value,
              setup: self => {
                self.hook(audio, self => {
                  self.value = audio[type].volume || 0;
                }, `${type}-changed`);
              },
            }),
          }),
        }),
        Widget.Stack({
          children: {
            // tuples of [string, Widget]
            '101': MaterialIcon({ icon: Icon[type].overamplified, size: '1.2rem' }),
            '67': MaterialIcon({ icon: Icon[type].high, size: '1.2rem' }),
            '34': MaterialIcon({ icon: Icon[type].medium, size: '1.2rem' }),
            '1': MaterialIcon({ icon: Icon[type].low, size: '1.2rem' }),
            '0': MaterialIcon({ icon: Icon[type].muted, size: '1.2rem' }),
          },
          setup: self => {
            self.hook(audio, self => {
              if (!audio[type])
                return;

              if (audio[type].is_muted) {
                self.shown = '0';
                return;
              }

              const show = ([101, 67, 34, 1, 0].find(
                threshold => threshold <= audio[type].volume * 100) || 0).toString();

              self.shown = `${show}` as AudioThreshhold;
            }, `${type}-changed`);
          },
        }),
      ],
    }),
  });
};


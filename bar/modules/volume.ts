import { MaterialIcon, Icon } from 'widgets/icons.js';

const audio = await Service.import('audio');

type AudioInterface = 'microphone' | 'speaker';
type AudioThreshhold = '101' | '67' | '34' | '1' | '0';
export const Volume = (type: AudioInterface) => {
  return Widget.EventBox({
    on_hover: (self: ReturnType<typeof Widget.EventBox>) => {
      const child = self.child.children[0];
      child['reveal_child'] = true;
    },
    on_hover_lost: (self: ReturnType<typeof Widget.EventBox>) => {
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
              on_change: ({ value }: { value: AudioInterface }) => audio[type].volume = value,
              setup: (self: ReturnType<typeof Widget.Slider>) => {
                self.hook(audio, (self: ReturnType<typeof Widget.Slider>) => {
                  self.value = audio[type].volume || 0;
                }, `${type}-changed`);
              },
            }),
          }),
        }),
        Widget.Stack({
          children: {
            // tuples of [string, Widget]
            '101': MaterialIcon(Icon[type].overamplified, '1.2rem',),
            '67': MaterialIcon(Icon[type].high, '1.2rem'),
            '34': MaterialIcon(Icon[type].medium, '1.2rem'),
            '1': MaterialIcon(Icon[type].low, '1.2rem'),
            '0': MaterialIcon(Icon[type].muted, '1.2rem'),
          },
          setup: (self: ReturnType<typeof Widget.Stack>) => {
            self.hook(audio, (self: ReturnType<typeof Widget.Stack>) => {
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


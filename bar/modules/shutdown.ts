import { Fzf } from 'fzf';

import { KEY_Down, KEY_Tab, KEY_Up } from 'types/@girs/gdk-3.0/gdk-3.0.cjs';

import { Icon } from 'widgets/icons.js';
import { MaterialIcon } from 'widgets/icons.js';
import { BarState } from '../state.js';

const SHUTDOWN = 'shutdown';
const SELECTION = Variable<number>(0);
const FOUND_ITEMS = Variable<ReturnType<typeof Widget.Box>[]>([]);

const labels = [
  "Shutdown",
  "Reboot",
  "Log Out",
  "Sleep",
  "Hibernate"
];

const commands = {
  shutdown: 'shutdown now',
  reboot: 'reboot',
  logout: 'logout',
  sleep: 'sleep',
  hibernate: 'systemctl hibernate',
};
type Commands = keyof typeof commands;

const ShutdownItem = (elem: string) => Widget.Box({
  class_name: 'app-unfocused',
  vertical: true,
  vexpand: true,
  children: [Widget.Label({
    use_markup: true,
    label: elem,
    class_name: 'app-title',
    xalign: 0,
    vpack: 'center',
  })],
});

export const ShutdownList = () => {
  return Widget.Window({
    visible: false,
    anchor: ['top', 'left', 'right'],
    exclusivity: 'normal',
    class_name: 'app-list',
    name: SHUTDOWN,
    setup: (self: ReturnType<typeof Widget.Window>) => self.keybind('Escape', () => App.closeWindow(SHUTDOWN)),
    child: Widget.Box({
      css: `min-height: 145px`,
      children: [
        Widget.Scrollable({
          hscroll: 'never',
          child: Widget.Box({
            vertical: true,
            class_name: 'item-box',
            vpack: 'start',
            setup: (self: ReturnType<typeof Widget.Box>) => {
              self.hook(FOUND_ITEMS, (self: ReturnType<typeof Widget.Box>) => {
                FOUND_ITEMS.value.length = 5;
                self.children = FOUND_ITEMS.value;
              });
            },
          }),
        })
      ]
    })
  });
}

export const Shutdown = ({ monitor }: { monitor: number; }) => {
  return Widget.CenterBox({
    start_widget: Widget.Box({
      class_name: 'pre-search',
      child: MaterialIcon(Icon.modes.power, '1.8rem'),
    }),
    center_widget: Widget.Entry({
      class_name: 'search',
      on_accept: () => {
        const text: Commands = FOUND_ITEMS.value[SELECTION.value].children[0].label.replaceAll(' ', '').toLowerCase();
        if (text.length > 0) {
          Utils.execAsync(commands[text]).finally(() => {
            SELECTION.value = 0;
            FOUND_ITEMS.value.length = 0;
            BarState.value = `bar ${monitor}`;
            App.closeWindow(SHUTDOWN);
          });
        }
      },

      setup: (self: ReturnType<typeof Widget.Entry>) => {
        self.on('key-press-event', (event: Gdk.Event) => {
          const first = event.get_keyval()[1];
          if (first === KEY_Tab || first == KEY_Down) {
            if (FOUND_ITEMS.value.length <= SELECTION.value + 1) return;
            FOUND_ITEMS.value[SELECTION.value].class_name = 'app-unfocused';
            SELECTION.value += 1;
            FOUND_ITEMS.value[SELECTION.value].class_name = 'app-focused';
          }
          if (first === 65056 || first === KEY_Up) { // Shift + Tab
            if (SELECTION.value === 0) return;
            FOUND_ITEMS.value[SELECTION.value].class_name = 'app-unfocused';
            SELECTION.value -= 1;
            FOUND_ITEMS.value[SELECTION.value].class_name = 'app-focused';
          }
        }).on('notify::text', (entry: ReturnType<typeof Widget.Entry>) => {
          const fzf = new Fzf(labels);
          const text = entry.text;
          // clear the list..
          const names: string[] = [];
          const fzfResults = fzf.find(text);
          fzfResults.forEach((entry: { item: string; positions: { has: (a: number) => boolean; }; }, index: number) => {
            const nameChars = entry.item.split('');
            const nameMarkup = nameChars.map((char: string, i: number) => {
              if (entry.positions.has(i))
                return `<span foreground="#e0af68">${char}</span>`;
              else
                return char;
            }).join('');
            names[index] = nameMarkup;
          });
          FOUND_ITEMS.value = fzfResults.map((_e: unknown, i: number) => {
            const appItem = ShutdownItem(names[i]);
            if (i === 0) {
              SELECTION.value = 0;
              appItem.class_name = 'app-focused';
            }
            return appItem;
          });
        }).hook(App, (self: ReturnType<typeof Widget.Entry>, name: string, visible: boolean) => {
          if (name !== SHUTDOWN || !visible) return;

          self.text = '';
          self.grab_focus();
        }).hook(BarState, () => {
          if (BarState.value === `shutdown ${monitor}`) {
            App.openWindow(SHUTDOWN);
          }
        });
      },
    }),
  });
}


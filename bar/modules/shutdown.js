import { Icon } from '../../widgets/icons.js';

import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Variable from 'resource:///com/github/Aylur/ags/variable.js';

import { Fzf } from '../../node_modules/fzf/dist/fzf.es.js';
import { MaterialIcon } from '../../widgets/icons.js';

import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

import Gdk from 'gi://Gdk';

import '../state.js';
import '../bar.js';

const SHUTDOWN = 'shutdown';
const SELECTION = Variable(0);
const FOUND_ITEMS = Variable([]);

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

const ShutdownItem = (/** @type {any} */ elem) => Widget.Box({
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
    setup: self => self.keybind('Escape', () => App.closeWindow(SHUTDOWN)),
    child: Widget.Box({
      css: `min-height: 145px`,
      children: [
        Widget.Scrollable({
          hscroll: 'never',
          child: Widget.Box({
            vertical: true,
            class_name: 'item-box',
            vpack: 'start',
            setup: self => {
              self.hook(FOUND_ITEMS, self => {
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

export const Shutdown = ({ monitor }) => {
  return Widget.CenterBox({
    start_widget: Widget.Box({
      class_name: 'pre-search',
      child: MaterialIcon({ icon: Icon.modes.power, size: '1.8rem' })
    }),
    center_widget: Widget.Entry({
      class_name: 'search',
      on_accept: _ => {
        // @ts-ignore
        const text = FOUND_ITEMS.value[SELECTION.value]['children'][0]['label'].replaceAll(' ', '').toLowerCase();
        if (text.length > 0) {
          Utils.execAsync(commands[text]).finally(() => {
            SELECTION.value = 0;
            FOUND_ITEMS.value.length = 0;
            BarState.value = `bar ${monitor}`;
            App.closeWindow(SHUTDOWN);
          });
        }
      },

      setup: self => {
        self.on('key-press-event', (_, event) => {
          // @ts-ignore
          const first = event.get_keyval()[1];
          // @ts-ignore
          if (first === Gdk.KEY_Tab || first == Gdk.KEY_Down) {
            if (FOUND_ITEMS.value.length <= SELECTION.value + 1) return;
            // @ts-ignore
            FOUND_ITEMS.value[SELECTION.value].class_name = 'app-unfocused';
            SELECTION.value += 1;
            // @ts-ignore
            FOUND_ITEMS.value[SELECTION.value].class_name = 'app-focused';
            // @ts-ignore
          }
          if (first === 65056 || first === Gdk.KEY_Up) { // Shift + Tab
            if (SELECTION.value === 0) return;
            // @ts-ignore
            FOUND_ITEMS.value[SELECTION.value].class_name = 'app-unfocused';
            SELECTION.value -= 1;
            // @ts-ignore
            FOUND_ITEMS.value[SELECTION.value].class_name = 'app-focused';
          }
        }).on('notify::text', entry => {
          const fzf = new Fzf(labels);
          const text = entry.text;
          // clear the list..
          const names = [];
          const fzfResults = fzf.find(text);
          fzfResults.forEach((/** @type {{ item: string; positions: { has: (arg0: any) => any; }; }} */ entry, /** @type {string | number} */ index) => {
            const nameChars = entry.item.split('');
            const nameMarkup = nameChars.map((char, i) => {
              if (entry.positions.has(i))
                return `<span foreground="#e0af68">${char}</span>`;
              else
                return char;
            }).join('');
            names[index] = nameMarkup;
          });
          // @ts-ignore
          FOUND_ITEMS.value = fzfResults.map((/** @type {any} */ _e, /** @type {number} */ i) => {
            const appItem = ShutdownItem(names[i]);
            if (i === 0) {
              SELECTION.value = 0;
              appItem.class_name = 'app-focused';
            }
            return appItem;
          });
        }).hook(App, (self, name, visible) => {
          if (name !== SHUTDOWN || !visible) return;

          self.text = '';
          self.grab_focus();
        }).hook(BarState, _ => {
          if (BarState.value === `shutdown ${monitor}`) {
            App.openWindow(SHUTDOWN);
          }
        });
      },
    }),
  });
}


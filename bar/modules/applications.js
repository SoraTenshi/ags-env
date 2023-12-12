import { Icon } from '../../widgets/icons.js';

import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Variable from 'resource:///com/github/Aylur/ags/variable.js';

import { Fzf } from '../../node_modules/fzf/dist/fzf.es.js';
import { MaterialIcon } from '../../widgets/icons.js';

import Gdk from 'gi://Gdk';

import '../state.js';
import '../bar.js';

const APP_LAUNCHER = 'app-items';
const SELECTION = Variable(0);
const FOUND_ITEMS = Variable([]);

const AppItem = app => Widget.Box({
  setup: self => self['app'] = app,
  class_name: 'app-unfocused',
  vertical: true,
  vexpand: true,
  children: [Widget.Label({
    use_markup: true,
    class_name: 'app-title',
    xalign: 0,
    vpack: 'center',
  })],
});

export const List = () => {
  return Widget.Window({
    visible: false,
    popup: true,
    anchor: ['top', 'left', 'right'],
    exclusivity: 'normal',
    class_name: 'app-list',
    name: APP_LAUNCHER,
    child: Widget.Box({
      css: `min-height: 395px`,
      children: [
        Widget.Scrollable({
          hscroll: 'never',
          child: Widget.Box({
            vertical: true,
            class_name: 'item-box',
            vpack: 'start',
            connections: [[FOUND_ITEMS, self => {
              FOUND_ITEMS.value.length = 14;
              self.children = FOUND_ITEMS.value;
            }]],
          }),
        })
      ]
    })
  });
}

export const AppLauncher = ({ monitor }) => {
  return Widget.CenterBox({
    start_widget: Widget.Box({
      class_name: 'pre-search',
      child: MaterialIcon({ icon: Icon.modes.search, size: '1.8rem' })
    }),
    center_widget: Widget.Entry({
      class_name: 'search',
      on_accept: (self) => {
        // @ts-ignore
        const text = FOUND_ITEMS.value[SELECTION.value].app.name;
        const list = Applications.query(text ?? '');
        if (list.length > 0) {
          list[0].launch();
          SELECTION.value = 0;
          FOUND_ITEMS.value.length = 0;
          BarState.value = `bar ${monitor}`;
          App.closeWindow(APP_LAUNCHER);
        }
      },

      connections: [
        ['key-press-event', (_, event) => {
          // @ts-ignore
          const first = event.get_keyval()[1];
          // @ts-ignore
          if (first === Gdk.KEY_Tab || first == Gdk.KEY_Down) {
            if(FOUND_ITEMS.value.length <= SELECTION.value + 1) return;
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
        }],
        ['notify::text', entry => {
          const fzf = new Fzf(Applications.list.map(AppItem), {
            selector: item => item.app.name,
            tieBreaker: [(a, b, sel) => b.item.app._frequency - a.item.app._frequency]
          });
          const text = entry.text;
          // clear the list..
          const names = [];
          const fzfResults = fzf.find(text);
          fzfResults.forEach((entry, index) => {
            const nameChars = entry.item.app.name.normalize().split('');
            const nameMarkup = nameChars.map((char, i) => {
              if (entry.positions.has(i))
                return `<span foreground="#e0af68">${char}</span>`;
              else
                return char;
            }).join('');
            names[index] = nameMarkup;
          });
          // @ts-ignore
          FOUND_ITEMS.value = fzfResults.map((e, i) => {
            const appItem = e.item;
            // @ts-ignore
            appItem.children[0].label = names[i];
            if(i === 0) {
              SELECTION.value = 0;
              appItem.class_name = 'app-focused';
            }
            return appItem;
          });
        }],
        // @ts-ignore
        [App, (self, name, visible) => {
          if (name !== APP_LAUNCHER || !visible) return;

          self.text = '';
          self.grab_focus();
        }],
        [BarState, _ => {
          if (BarState.value === `app-launcher ${monitor}`) {
            App.openWindow(APP_LAUNCHER);
          }
        }],
      ],
    }),
  });
}


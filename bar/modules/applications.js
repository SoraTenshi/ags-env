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

let current_monitor = -1;

const AppItem = app => Widget.Box({
  setup: self => self['app'] = app,
  class_name: 'app-item',
  vertical: true,
  vexpand: true,
  children: [Widget.Label({
    use_markup: true,
    class_name: 'app-title',
    xalign: 0,
    vpack: 'center',
  })],
});

export const List = ({ monitor }) => {
  const thisName = `${APP_LAUNCHER}-${monitor}`;
  return Widget.Window({
    monitor,
    anchor: ['top', 'left', 'right'],
    exclusivity: 'normal',
    class_name: 'app-list',
    name: thisName,
    child: Widget.Box({
      css: 'min-height: 390px',
      children: [
        Widget.Scrollable({
          hscroll: 'never',
          child: Widget.Box({
            vertical: true,
            class_name: 'item-box',
            vpack: 'start',
            children: FOUND_ITEMS.value,
            connections: [[FOUND_ITEMS, self => {
              FOUND_ITEMS.value.length = 15;
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
      child: MaterialIcon({ icon: '\ue037', size: '1.8rem' })
    }),
    center_widget: Widget.Entry({
      class_name: 'search',

      on_accept: (self) => {
        const list = Applications.query(self.text ?? '');
        if (list.length > 0) {
          list[SELECTION.value].launch();
          SELECTION.value = 0;
          FOUND_ITEMS.value.length = 0;
          BarState.value = `bar ${monitor}`;
          App.removeWindow(`${APP_LAUNCHER}-${monitor}`);
          self.text = '';
        }
      },

      connections: [
        ['key-press-event', (_, event) => {
          const first = event.get_keyval()[1];
          // @ts-ignore
          if (first === Gdk.KEY_Tab) {
            FOUND_ITEMS.value[SELECTION.value].css = 'background-color: #24283b';
            SELECTION.value += 1;
            FOUND_ITEMS.value[SELECTION.value].css = 'background-color: #33467c';
            // @ts-ignore
          }
          if (first === 65056) { // Shift + Tab
            if (SELECTION.value === 0) return;
            FOUND_ITEMS.value[SELECTION.value].css = 'background-color: #24283b';
            SELECTION.value -= 1;
            FOUND_ITEMS.value[SELECTION.value].css = 'background-color: #33467c';
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
                return `<span foreground="#bb9af7">${char}</span>`;
              else
                return char;
            }).join('');
            names[index] = nameMarkup;
          });
          // @ts-ignore
          FOUND_ITEMS.value = fzfResults.map((e, i) => {
            const appItem = AppItem(e.item);
            // @ts-ignore
            appItem.children[0].label = names[i];
            if(i === 0) {
              appItem.css = 'background-color: #33467c';
            }
            return appItem;
          });
        }],
        // @ts-ignore
        [App, (self, name, visible) => {
          if (name !== `${APP_LAUNCHER}-${current_monitor}` || !visible) return;

          self.text = '';
          self.grab_focus();
        }],
        [BarState, _ => {
          current_monitor = monitor;
          if (BarState.value === `app-launcher ${monitor}`) {
            App.addWindow(List({ monitor }));
          }
        }],
      ],
    }),
  });
}


import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Variable from 'resource:///com/github/Aylur/ags/variable.js';

import { Fzf } from '../../node_modules/fzf/dist/fzf.es.js';
import { MaterialIcon } from '../../widgets/icons.js';

import '../state.js';
import '../bar.js';

const APP_LAUNCHER = 'app-items';

const FOUND_ITEMS = Variable([]);

let current_monitor = -1;

const AppItem = app => Widget.Box({
  setup: self => self['app'] = app,
  class_name: 'app-item',
  vpack: 'start',
  vertical: true,
  vexpand: true,
  children: [Widget.Label({
    use_markup: true,
    class_name: 'app-title',
    xalign: 0,
    vpack: 'center',
    truncate: 'end',
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
      vertical: true,
      children: [
        Widget.Scrollable({
          hscroll: 'never',
          child: Widget.Box({
            vertical: true,
            vexpand: true,
            connections: [[FOUND_ITEMS, self => {
              self.children = FOUND_ITEMS.value.slice(0, 15);
            }]],
          }),
        })
      ]
    })
  });
}

export const AppLauncher = ({ monitor }) => {
  const fzf = new Fzf(Applications.list.map(AppItem), {
    selector: item => item.app.name,
    tieBreaker: [(a, b, sel) => b.item.app._frequency - a.item.app._frequency]
  });
  return Widget.CenterBox({
    start_widget: Widget.Box({
      class_name: 'pre-search',
      child: MaterialIcon({ icon: '\ue037', size: '1.8rem' })
    }),
    center_widget: Widget.Entry({
      class_name: 'search',
      placeholder_text: "Enter name of Application:",
      text: '...',

      on_accept: ({ text }) => {
        const list = Applications.query(text ?? '');
        if (list.length > 0) {
          // App.toggleWindow('search-bar');
          list[0].launch();
          BarState.value = `bar ${monitor}`;
          App.removeWindow(`${APP_LAUNCHER}-${monitor}`);
        }
      },

      on_change: entry => {
        const text = entry.text;
        // clear the list..
        FOUND_ITEMS.value = [];
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
          return appItem;
        });
      },

      connections: [
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


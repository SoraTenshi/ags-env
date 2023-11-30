import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Variable from 'resource:///com/github/Aylur/ags/variable.js';

import { MaterialIcon } from '../../widgets/icons.js';

import '../state.js';
import '../bar.js';

const APP_LAUNCHER = 'app-items';

const FOUND_ITEMS = Variable([]);

let current_monitor = 0;

const AppItem = app => Widget.Button({
  on_clicked: () => {
    BarState.value = `bar ${current_monitor}`;
    Focusable.value = false;
    app.launch();
  },
  on_primary_click: () => {
    BarState.value = `bar ${current_monitor}`;
    Focusable.value = false;
    app.launch();
  },
  setup: self => self['app'] = app,
  child: Widget.Box({
    class_name: 'app-item',
    vpack: 'start',
    children: [
      Widget.Label({
        class_name: 'app-title',
        label: app.name,
        xalign: 0,
        vpack: 'center',
        truncate: 'end',
      }),
    ]
  })
});

const list = ({ monitor }) => Widget.Window({
  monitor,
  anchor: ['top', 'left', 'right'],
  exclusivity: 'normal',
  class_name: 'app-list',
  name: APP_LAUNCHER,
  child: Widget.Box({
    vertical: true,
    children: [
      Widget.Scrollable({
        hscroll: 'never',
        child: Widget.Box({
          children: FOUND_ITEMS.value ?? [],
        }),
      })
    ]
  })
});

export const AppLauncher = ({ monitor }) => {
  Focusable.value = true;
  return Widget.Box({
    children: [
      Widget.Box({
        class_name: 'pre-search',
        child: MaterialIcon({ icon: '\ue037', size: '1.8rem' })
      }),
      Widget.Entry({
        class_name: 'search',
        placeholder_text: "Enter name of Application:",
        text: '...',

        on_accept: ({ text }) => {
          const list = Applications.query(text ?? '');
          if (list.length > 0) {
            App.toggleWindow('search-bar');
            list[0].launch();
            BarState.value = 'bar';
            App.closeWindow(APP_LAUNCHER);
          }
        },

        on_change: ({ text }) => FOUND_ITEMS.value.map(item => {
          // @ts-ignore
          item['visible'] = item['app'].match(text);
        }),

        connections: [
          // @ts-ignore
          [App, (self, name, visible) => {
            if (name !== APP_LAUNCHER) return;

            // @ts-ignore
            FOUND_ITEMS.value = Applications.list.map(AppItem);
            self.text = '';
          }],
          [FOUND_ITEMS, _ => {
            App.add_window(list(monitor));
          }],
          [BarState, _ => current_monitor = monitor],
        ],
      }),
    ]
  });
}


import { Icon } from 'widgets/icons';
import { MaterialIcon } from 'widgets/icons';
import { BarState } from '../state';

import { Fzf } from '../../node_modules/fzf/dist/fzf.es.js';
import { Application } from 'types/service/applications';

const applications = await Service.import('applications');

const APP_LAUNCHER = 'app-items';
const SELECTION = Variable<number>(0);
const FOUND_ITEMS = Variable<AppItem[]>([]);

class AppItem {
  box: Widget.Box;
  app: Application;

  constructor(app: Application) {
    this.app = app;
    this.box = Widget.Box({
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
    })
  }
}

export const AppList = () => {
  return Widget.Window({
    visible: false,
    anchor: ['top', 'left', 'right'],
    exclusivity: 'normal',
    class_name: 'app-list',
    name: APP_LAUNCHER,
    setup: self => self.keybind('Escape', () => App.closeWindow(APP_LAUNCHER)),
    child: Widget.Box({
      css: `min-height: 395px`,
      children: [
        Widget.Scrollable({
          hscroll: 'never',
          child: Widget.Box({
            vertical: true,
            class_name: 'item-box',
            vpack: 'start',
            setup: self => {
              self.hook(FOUND_ITEMS, self => {
                FOUND_ITEMS.value.length = 14;
                self.children = FOUND_ITEMS.value.map(val => val.box);
              });
            },
          }),
        })
      ]
    })
  });
}

const scroll_down = () => {
  if (FOUND_ITEMS.value.length <= SELECTION.value + 1) return;
  FOUND_ITEMS.value[SELECTION.value].box.class_name = 'app-unfocused';
  SELECTION.value += 1;
  FOUND_ITEMS.value[SELECTION.value].box.class_name = 'app-focused';
}

const scroll_up = () => {
  if (SELECTION.value === 0) return;
  FOUND_ITEMS.value[SELECTION.value].box.class_name = 'app-unfocused';
  SELECTION.value -= 1;
  FOUND_ITEMS.value[SELECTION.value].box.class_name = 'app-focused';
}

export const AppLauncher = ({ monitor }) => {
  return Widget.CenterBox({
    start_widget: Widget.Box({
      class_name: 'pre-search',
      child: MaterialIcon({ icon: Icon.modes.search, size: '1.8rem' })
    }),
    center_widget: Widget.Entry({
      class_name: 'search',
      on_accept: () => {
        const text = FOUND_ITEMS.value[SELECTION.value].app.name;
        const list = applications.query(text ?? '');
        if (list.length > 0) {
          list[0].launch();
          SELECTION.value = 0;
          FOUND_ITEMS.value.length = 0;
          BarState.value = `bar ${monitor}`;
          App.closeWindow(APP_LAUNCHER);
        }
      },

      setup: self => {
        self
          .keybind("Tab", scroll_down)
          .keybind("Down", scroll_down)
          .keybind(["SHIFT"], "Tab", scroll_up)
          .keybind("Up", scroll_up)
          .on('notify::text', entry => {
            const fzf = new Fzf(applications.list.map((value: Application,) => new AppItem(value), {
              selector: (item: AppItem) => item.app.name,
              tieBreaker: [(a: AppItem, b: AppItem,) => b.app['_frequency'] - a.app['_frequency']]
            }));
            const text = entry.text;
            // clear the list..
            const names: string[] = [];
            const fzfResults = fzf.find(text);
            fzfResults.forEach((entry: { item: { app: { name: string; }; }; positions: { has: (arg0: number) => boolean; }; }, index: number) => {
              const nameChars = entry.item.app.name.normalize().split('');
              const nameMarkup = nameChars.map((char: string, i: number) => {
                if (entry.positions.has(i))
                  return `<span foreground="#e0af68">${char}</span>`;
                else
                  return char;
              }).join('');
              names[index] = nameMarkup;
            });
            FOUND_ITEMS.value = fzfResults.map((e: { item: AppItem; }, i: number) => {
              const appItem = e.item;
              appItem.box.children[0].label = names[i];
              if (i === 0) {
                SELECTION.value = 0;
                appItem.box.class_name = 'app-focused';
              }
              return appItem;
            });
          })
          .hook(App, (self, name, visible) => {
            if (name !== APP_LAUNCHER || !visible) return;

            self.text = '';
            self.grab_focus();
          })
          .hook(BarState, () => {
            if (BarState.value === `app-launcher ${monitor}`) App.openWindow(APP_LAUNCHER);
          });
      }
    }),
  });
}


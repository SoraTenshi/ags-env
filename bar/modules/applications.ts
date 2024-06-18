import { Fzf, FzfResultItem } from 'fzf';

import { Icon, MaterialIcon } from 'widgets/icons.js';
import { BarState } from '../state.js';

import { Application } from 'types/service/applications.js';

const applications =  await Service.import('applications');

const APP_LAUNCHER = 'app-items';
const SELECTION = Variable<number>(0);
const FOUND_ITEMS = Variable<ReturnType<typeof Widget.Entry>>([]);

type AppItem = ReturnType<typeof Widget.Box> & { app: Application };
const create_app_item = (app: Application): AppItem => Widget.Box({
  setup: (self: ReturnType<typeof Widget.Box>) => (self as AppItem).app = app,
  class_name: 'app-unfocused',
  vertical: true,
  vexpand: true,
  children: [Widget.Label({
    use_markup: true,
    class_name: 'app-title',
    xalign: 0,
    vpack: 'center',
  })],
}) as AppItem;

export const AppList = () => {
  return Widget.Window({
    visible: false,
    anchor: ['top', 'left', 'right'],
    exclusivity: 'normal',
    class_name: 'app-list',
    name: APP_LAUNCHER,
    setup: (self: ReturnType<typeof Widget.Window>) => self.keybind('Escape', () => App.closeWindow(APP_LAUNCHER)),
    child: Widget.Box({
      css: `min-height: 395px`,
      children: [
        Widget.Scrollable({
          hscroll: 'never',
          child: Widget.Box({
            vertical: true,
            class_name: 'item-box',
            vpack: 'start',
            setup: (self: ReturnType<typeof Widget.Box>) => {
              self.hook(FOUND_ITEMS, (self: ReturnType<typeof Widget.Box>) => {
                FOUND_ITEMS.value.length = 14;
                self.children = FOUND_ITEMS.value;
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
  FOUND_ITEMS.value[SELECTION.value].class_name = 'app-unfocused';
  SELECTION.value += 1;
  FOUND_ITEMS.value[SELECTION.value].class_name = 'app-focused';
}

const scroll_up = () => {
  if (SELECTION.value === 0) return;
  FOUND_ITEMS.value[SELECTION.value].class_name = 'app-unfocused';
  SELECTION.value -= 1;
  FOUND_ITEMS.value[SELECTION.value].class_name = 'app-focused';
}

export const AppLauncher = ({ monitor }: { monitor: number }) => {
  return Widget.CenterBox({
    start_widget: Widget.Box({
      class_name: 'pre-search',
      child: MaterialIcon(Icon.modes.search, '1.8rem' )
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

      setup: (self: ReturnType<typeof Widget.Entry>) => {
        self
          .keybind("Tab", scroll_down)
          .keybind("Down", scroll_down)
          .keybind(["SHIFT"], "Tab", scroll_up)
          .keybind("Up", scroll_up)
          .on('notify::text', (entry: ReturnType<typeof Widget.Entry>) => {
            const fzf = new Fzf(applications.list.map(create_app_item), {
              selector: (item: AppItem) => item.app.name,
              tieBreaker: [(a: FzfResultItem<AppItem>, b: FzfResultItem<AppItem>,) => b.item.app._frequency - a.item.app._frequency]
            });
            const text = entry.text ?? "";
            // clear the list..
            const names: string[] = [];
            const fzfResults: FzfResultItem<AppItem>[] = fzf.find(text);
            fzfResults.forEach((entry, index) => {
              const nameChars: string[] = entry.item.app.name.normalize().split('');
              const nameMarkup = nameChars.map((char, i) => {
                if (entry.positions.has(i))
                  return `<span foreground="#e0af68">${char}</span>`;
                else
                  return char;
              }).join('');
              names[index] = nameMarkup;
            });
            FOUND_ITEMS.value = fzfResults.map((e, i) => {
              const appItem: AppItem = e.item;
              (appItem.children[0] as ReturnType<typeof Widget.Label>).label = names[i];
              if (i === 0) {
                SELECTION.value = 0;
                appItem.class_name = 'app-focused';
              }
              return appItem;
            });
          })
          .hook(App, (_: unknown, name: string, visible: boolean) => {
            if (name !== APP_LAUNCHER || !visible) return;
          })
          .hook(BarState, (self: ReturnType<typeof Widget.Window>) => {
            if (BarState.value === `app-launcher ${monitor}`) {
              App.openWindow(APP_LAUNCHER);
              self.text = '';
              self.grab_focus();
            }
          });
      }
    }),
  });
}


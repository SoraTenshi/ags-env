import { TrayItem } from 'types/service/systemtray.js';
import { Icon } from 'widgets/icons.js';

const system_tray = await Service.import('systemtray');

export const SysTray = () => {
  const trayIcon = Widget.Label({
    class_name: 'systray-btn',
    label: Icon.systray.unhide,
  });

  const TrayItems = () => Widget.Box({
    class_name: 'systray',
    setup: (self: ReturnType<typeof Widget.Box>) => {
      self.hook(system_tray, (self: ReturnType<typeof Widget.Box>) => {
      self.children = system_tray.items.map((item: TrayItem) => Widget.Button({
        child: Widget.Icon({ 
          setup: (s: ReturnType<typeof Widget.Icon>) => s.bind('icon', item, 'icon'),
        }),
        on_primary_click: (event: Gdk.Event) => item.activate(event),
        on_secondary_click: (event: Gdk.Event) => item.openMenu(event),
        tooltip_markup: item.bind('tooltip_markup'),
      }));
    });
    },
  });

  const trayRevealer = Widget.Revealer({
    reveal_child: false,
    transition: "slide_left",
    child: TrayItems(),
  });

  return Widget.EventBox({
    child: Widget.Box({
      class_name: 'systray',
      children: [
        Widget.Button({
          child: trayIcon,
          on_primary_click: () => {
            trayRevealer.reveal_child = !trayRevealer.reveal_child;
            trayRevealer.transition = trayRevealer.reveal_child ? 'slide_left' : 'slide_right';
            trayIcon.label = trayRevealer.reveal_child ? Icon.systray.hide : Icon.systray.unhide;
          },
        }),
        trayRevealer,
      ],
    }),
  })
}

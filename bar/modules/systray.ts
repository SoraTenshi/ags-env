import { Icon } from 'widgets/icons';

const system_tray = await Service.import('systemtray');

export const SysTray = () => {
  const trayIcon = Widget.Label({
    class_name: 'systray-btn',
    label: Icon.systray.unhide,
  });

  const TrayItems = () => Widget.Box({
    class_name: 'systray',
    setup: self => {
      self.hook(system_tray, self => {
      self.children = system_tray.items.map(item => Widget.Button({
        child: Widget.Icon({ 
          setup: s => s.bind('icon', item, 'icon'),
        }),
        on_primary_click: (_, event) => item.activate(event),
        on_secondary_click: (_, event) => item.openMenu(event),
        setup: s => s.bind('tooltip_markup', item, 'tooltip_markup'),
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

import { Icon, MaterialIcon } from 'widgets/icons';

const hyprland = await Service.import('hyprland');

export const Workspaces = () => Widget.Box({
  class_name: 'workspace',
  child: Widget.CenterBox({
    vertical: true,
    start_widget: Widget.Label({
      setup: self => {
        self.label = hyprland.active.client.title;
        self.bind('label', hyprland.active.client, 'title');
      },
      height_request: 23,
      truncate: 'end',
      max_width_chars: 20,
      class_name: 'current-title',
      css: '',
    }),
    end_widget: Widget.Box({
      class_name: 'workspaces',
      vexpand: false,
      homogeneous: true,
      spacing: 10,
      setup: self => {
        self.hook(hyprland.active.workspace, self => {
          self.children = Array.from({ length: 9 }).map((_, n) => {
            const i = (n + 1);
            let uwu = hyprland.active.workspace.id === i ? 'active' : 'inactive';
            const currentWs = hyprland.getWorkspace(i);
            if (uwu === 'inactive' && currentWs && currentWs.windows > 0) {
              uwu = 'occupied';
            }
            return MaterialIcon({ icon: Icon.workspace[uwu], class_name: uwu });
          });
        });
      },
    }),
  }),
});


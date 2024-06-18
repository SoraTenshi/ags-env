import { Icon } from 'widgets/icons.js';
import { MaterialIcon } from 'widgets/icons.js';
import { BarState } from '../state.js';

const EXECUTOR = 'executor';

export const Executor = ({ monitor }: { monitor: number; }) => {
  return Widget.CenterBox({
    start_widget: Widget.Box({
      class_name: 'pre-search',
      child: MaterialIcon(Icon.modes.execute, '1.8rem')
    }),
    center_widget: Widget.Entry({
      class_name: 'search',
      on_accept: (self: ReturnType<typeof Widget.Entry>) => {
        Utils.execAsync(self.text || '');
        self.text = '';
        BarState.value = `bar ${monitor}`;
      },

      setup: (self: ReturnType<typeof Widget.Entry>) => {
        self
          .hook(App, (_: unknown, name: string, visible: boolean) => {
            if (name !== EXECUTOR || !visible) return;
          })
          .hook(BarState, (self: ReturnType<typeof Widget.Window>) => {
            if (BarState.value === `exec ${monitor}`) {
              self.text = '';
              self.grab_focus();
            }
          });
      },
    }),
  });
}


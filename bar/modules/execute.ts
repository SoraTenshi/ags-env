import { Icon } from 'widgets/icons.js';
import { MaterialIcon } from 'widgets/icons.js';
import { BarState } from '../state.js';

const EXECUTOR = 'executor';

export const Executor = ({ monitor }) => {
  return Widget.CenterBox({
    start_widget: Widget.Box({
      class_name: 'pre-search',
      child: MaterialIcon({ icon: Icon.modes.execute, size: '1.8rem' })
    }),
    center_widget: Widget.Entry({
      class_name: 'search',
      on_accept: (self) => {
        Utils.execAsync(self.text || '');
        self.text = '';
        BarState.value = `bar ${monitor}`;
      },

      setup: self => {
        self.hook(App, (self, name, visible) => {
          if (name !== EXECUTOR || !visible) return;

          self.text = '';
          self.grab_focus();
        })
      },
    }),
  });
}


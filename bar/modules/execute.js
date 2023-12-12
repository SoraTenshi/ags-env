import { Icon } from '../../widgets/icons.js';

import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import { MaterialIcon } from '../../widgets/icons.js';

import '../state.js';
import '../bar.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

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
        execAsync(self.text || '').finally(() => {
          self.text = '';
          BarState.value = `bar ${monitor}`;
        });
      },

      connections: [
        // @ts-ignore
        [App, (self, name, visible) => {
          if (name !== EXECUTOR || !visible) return;

          self.text = '';
          self.grab_focus();
        }],
      ],
    }),
  });
}


import { Variable } from 'resource:///com/github/Aylur/ags/variable.js';
import { Widget } from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

/** @type {() => unknown[]} */
const Monitors = () => JSON.parse(Utils.exec("hyprctl monitors -j"));

const time = new Variable('', {
    poll: [1000, 'date'],
});

const Bar = (/** @type {number} */ monitor) => Widget.Window({
    monitor,
    name: `bar${monitor}`,
    anchor: ['top', 'left', 'right'],
    exclusivity: 'exclusive',
    child: Widget.CenterBox({
        start_widget: Widget.Label({
            hpack: 'center',
            label: 'Welcome to AGS!',
        }),
        end_widget: Widget.Label({
            hpack: 'center',
            binds: [['label', time]],
        }),
    })
})

export default {
    windows: [Monitors().map((_, i) => Bar(i))]
}

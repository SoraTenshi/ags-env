import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

export const Clock = () => Widget.Label({
    class_name: 'clock',
    xpad: 10,
    connections: [
        // this is what you should do
        [1000, self => execAsync(['date', '+%H:%M:%S | %Y-%m-%d %a'])
            .then(date => self.label = date).catch(console.error)],
    ],
});


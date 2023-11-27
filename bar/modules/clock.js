import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

const Conversion = {
    Ampm: {
        "PM": "午後",
        "AM": "午前",
    },
    Day: {
        "Mon": "月",
        "Tue": "火",
        "Wed": "水",
        "Thu": "木",
        "Fri": "金",
        "Sat": "土",
        "Sun": "日",
    }
}

export const Clock = () => Widget.Button({
    class_name: 'clock-bg',
    child: Widget.Box({
    children: [
        Widget.Label({
            class_name: 'ampm',
            connections: [
                [1000, self => execAsync(['date', '+%p'])
                    .then(ampm => self.label = Conversion.Ampm[ampm]).catch(console.error)],
            ],
        }),
        Widget.Label({
            class_name: 'clock',
            css: 'text-align: justify',
            xpad: 10,
            connections: [
                // this is what you should do
                [1000, self => execAsync(['date', '+%I:%M:%S\n%y-%m-%d'])
                    .then(date => self.label = date).catch(console.error)],
            ],
        }),
        Widget.Label({
            class_name: 'day',
            connections: [
                [1000, self => execAsync(['date', '+%a'])
                    .then(day => self.label = Conversion.Day[day]).catch(console.error)],
            ],
        }),
    ],
    }),
});


import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { MaterialIcon, Icon } from '../../widgets/icons.js';

export const Volume = ( /** @type {string} */ type ) => {
    return Widget.EventBox({
        on_hover: self => {
            let child  = self.child["children"][0];
            child.reveal_child = true;
        },
        on_hover_lost: self => {
            let child = self.child["children"][0];
            child.reveal_child = false;
        },
        on_primary_click: () => {
            if(!Audio[type]) return;
            Audio[type].is_muted = !Audio[type].is_muted;
        },
        child: Widget.Box({
            hexpand: true,
            children: [
                Widget.Revealer({
                    reveal_child: false,
                    transition_duration: 500,
                    transition: 'slide_left',
                    child: Widget.Box({
                        hexpand: true,
                        css: 'min-width: 180px;',
                        child: Widget.Slider({
                            hexpand: true,
                            draw_value: false,
                            on_change: ({ value }) => Audio[type].volume = value,
                            connections: [[Audio, self => {
                                self.value = Audio[type].volume || 0;
                            }, `${type}-changed`]],
                        }),
                    }),
                }),
                Widget.Stack({
                    items: [
                        // tuples of [string, Widget]
                        ['101', MaterialIcon(Icon[type].overamplified)],
                        ['67', MaterialIcon(Icon[type].high)],
                        ['34', MaterialIcon(Icon[type].medium)],
                        ['1', MaterialIcon(Icon[type].low)],
                        ['0', MaterialIcon(Icon[type].muted)],
                    ],
                    connections: [[Audio, self => {
                        if (!Audio[type])
                            return;

                        if (Audio[type].is_muted) {
                            self.shown = '0';
                            return;
                        }

                        const show = [101, 67, 34, 1, 0].find(
                            threshold => threshold <= Audio[type].volume * 100);

                        self.shown = `${show}`;
                    }, `${type}-changed`]],
                }),
            ],
        }),
    });
};

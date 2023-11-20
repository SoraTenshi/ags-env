import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

export const Volume = ( type = 'speaker') => {
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
            class_name: 'volume',
            children: [
                Widget.Revealer({
                    reveal_child: false,
                    transition_duration: 500,
                    transition: 'slide_left',
                    child: Widget.Slider({
                        hexpand: true,
                        draw_value: false,
                        on_change: ({ value }) => {
                            if(!Audio[type]) return;
                            Audio[type].volume = value;
                        },
                        connections: [[Audio, self => {
                            self.value = Audio[type]?.volume || 0;
                        }, `${type}-changed`]],
                    }),
                }),
                Widget.Stack({
                    items: [
                        // tuples of [string, Widget]
                        ['101', Widget.Icon('audio-volume-overamplified-symbolic')],
                        ['67', Widget.Icon('audio-volume-high-symbolic')],
                        ['34', Widget.Icon('audio-volume-medium-symbolic')],
                        ['1', Widget.Icon('audio-volume-low-symbolic')],
                        ['0', Widget.Icon('audio-volume-muted-symbolic')],
                    ],
                    connections: [[Audio, self => {
                        if (!Audio[type])
                            return;

                        if (Audio[type].is_muted) {
                            self.shown = '0';
                            return;
                        }

                        const show = [101, 67, 34, 1, 0].find(
                            // @ts-ignore
                            threshold => threshold <= Audio[type].volume * 100);

                        self.shown = `${show}`;
                    }, `${type}-changed`]],
                }),
            ],
        }),
    });
};


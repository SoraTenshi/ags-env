import { CAT_CYCLE, CatType } from '../state';

let current_cycle = 0;
let load = Variable<number>(0);

const MIN_CYCLES = 1000;
const frames = Variable<number>(MIN_CYCLES);

const as_cycle = (r: number): CatType => {
  return CAT_CYCLE[r];
};

export const RunCat = (is_master: boolean) => Widget.Box({
  tooltip_markup: load.bind().as(r => `CPU: ${r}%`),
  setup: () => {
    if (is_master) {
      Utils.interval(1000, () => {
        Utils.execAsync(["sh", "-c", `top -bn1 | grep '%Cpu' | tail -1 | awk '{print 100-$8}'`])
          .then((r) => {
            load.value = Math.round(Number(r));
            frames.value = Math.round(1000 / load.value / 100);
          })
          .catch((err) => print(err));
      });
    }
  },

  children: [
    Widget.Stack({
      setup: self => {
        setInterval(() => {
          self.shown = as_cycle(current_cycle);
          if (is_master) {
            current_cycle = Number(CAT_CYCLE[(current_cycle+1) % CAT_CYCLE.length]);
          }
        }, frames.value / 5);
      },
      children: {
        '0': Widget.Icon({ icon: "cat_0-symbolic", size: 32, css: 'margin-top: 0.8em; margin-right: 0.4em;' }),
        '1': Widget.Icon({ icon: "cat_1-symbolic", size: 32, css: 'margin-top: 0.8em; margin-right: 0.4em;' }),
        '2': Widget.Icon({ icon: "cat_2-symbolic", size: 32, css: 'margin-top: 0.8em; margin-right: 0.4em;' }),
        '3': Widget.Icon({ icon: "cat_3-symbolic", size: 32, css: 'margin-top: 0.8em; margin-right: 0.4em;' }),
        '4': Widget.Icon({ icon: "cat_4-symbolic", size: 32, css: 'margin-top: 0.8em; margin-right: 0.4em;' }),
      },
      shown: '0',
    })
  ]
});

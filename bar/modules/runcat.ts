import { CAT_CYCLE, CatState } from '../state';

const MIN_CYCLES = 1000;

let current_cycle = 0;
let load = Variable<number>(0);
let frames = MIN_CYCLES;


const schedule_for_framechange = (is_master: boolean) => {
  Utils.timeout(frames, () => {
    CatState.value = CAT_CYCLE[current_cycle];
    if (is_master) {
      current_cycle = (current_cycle+1) % CAT_CYCLE.length;
    }
    schedule_for_framechange(is_master);
  });
}

export const RunCat = (is_master: boolean) => Widget.Box({
  tooltip_markup: load.bind().as(r => `CPU: ${r}%`),
  setup: () => {
    if (is_master) {
      Utils.interval(2000, () => {
        Utils.execAsync(["sh", "-c", `top -bn1 | grep '%Cpu' | tail -1 | awk '{print 100-$8}'`])
          .then((r) => {
            load.value = Math.round(Number(r));
            frames = Math.round(1000 / (load.value / 2));
          })
          .catch((err) => print(err));
      });
    }
  },

  children: [
    Widget.Icon({
      setup: () => {
        schedule_for_framechange(is_master);
      },
      icon: CatState.bind(),
      size: 32,
      css: 'margin-top: 0.8em; margin-right: 0.4em;',
    })
  ]
});

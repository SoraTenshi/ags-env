import { CAT_CYCLE, CatState } from '../state.js';

const MIN_CYCLES = 100;
const MAX_FACTOR = 1.0;

let current_cycle = 0;
let target_frames = MIN_CYCLES;
let old_frames = MIN_CYCLES;
let factor = 0.0;

const load = Variable<number>(0);

const lerp = (s: number, e: number, fac: number): number => {
  return s + fac * (e - s);
}

const schedule_for_framechange = (is_master: boolean) => {
  Utils.timeout(old_frames, () => {
    CatState.value = CAT_CYCLE[current_cycle];
    if (is_master) {
      current_cycle = (current_cycle+1) % CAT_CYCLE.length;
    }
    if(factor >= MAX_FACTOR) {
      old_frames = target_frames;
    } else {
      factor += 0.01;
      old_frames = Math.round(lerp(old_frames, target_frames, factor));
    }

    schedule_for_framechange(is_master);
  });
}

export const RunCat = (is_master: boolean) => Widget.Box({
  tooltip_markup: load.bind().as((r: string) => `CPU: ${r}%`),
  setup: () => {
    if (is_master) {
      Utils.interval(2000, () => {
        Utils.execAsync(["sh", "-c", `top -bn1 | grep '%Cpu' | tail -1 | awk '{print 100-$8}'`])
          .then((r: string) => {
            load.value = Math.round(Number(r));
            old_frames = target_frames;
            target_frames = Math.round(1000 / (load.value / 2));
            factor = 0.0;
          })
          .catch((err: Error) => print(err));
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

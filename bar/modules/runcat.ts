type CatType = "0" | "1" | "2" | "3" | "4";
const cycle: CatType[] = ["0", "1", "2", "3", "4"];
let current_cycle = 0;
let load = Variable<number>(0);
const MIN_CYCLES = 1000;
const frames = Variable<number>(MIN_CYCLES);

const as_cycle = (r: number): CatType => { 
  return cycle[r];
};

export const RunCat = () => Widget.Box({
  tooltip_markup: load.bind().as(r => `CPU: ${r}%`),
  setup: () => {
      Utils.timeout(1000, () => {
          Utils.execAsync(["sh", "-c", `top -bn1 | grep '%Cpu' | tail -1 | awk '{print 100-$8}'`])
            .then((r) => {
              load.value = Math.round(Number(r));
              frames.value = Math.round(50 / load.value);
            })
            .catch((err) => print(err));
      });
    },

  children: [
    Widget.Stack({
      setup: self => {
        Utils.interval(frames.value, () => {
          self.shown = as_cycle(current_cycle);
          current_cycle = Number(cycle[current_cycle % cycle.length]) + 1;
        })
      },
      children: {
        '0': Widget.Icon({icon: "cat_0-symbolic"}),
        '1': Widget.Icon({icon: "cat_1-symbolic"}),
        '2': Widget.Icon({icon: "cat_2-symbolic"}),
        '3': Widget.Icon({icon: "cat_3-symbolic"}),
        '4': Widget.Icon({icon: "cat_4-symbolic"}),
      },
      shown: '0',
    })
  ]
});

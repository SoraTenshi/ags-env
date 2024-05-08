import Widget from "resource:///com/github/Aylur/ags/widget.js";

import * as Utils from "resource:///com/github/Aylur/ags/utils.js";
import { Variable } from "resource:///com/github/Aylur/ags/variable.js";

const cycle = ['0', '1', '2', '3', '4'];
let current_cycle = 4;

const divide = ([total, free]) => free / total;
const cpu = new Variable(1, {
    // @ts-ignore
    poll: [10, 'top -b -n 1', out => divide([100, out.split('\n')
        .find(line => line.includes('Cpu(s)'))
        .split(/\s+/)[1]
        .replace(',', '.')])],
})

const as_cycle = (r) => {
  const curr = Math.round(Number(r));
  let selected = 'sleep';
  if(curr > 0) selected = cycle[cycle.length % current_cycle];

  return selected;
};

export const RunCat = () => Widget.Box({
  setup: self => {
      self.tooltip_markup = self.children[0].shown.bind || "sleep";
  },

  children: [
    Widget.Stack({
      children: {
        '0': Widget.Icon({icon: "cat_0-symbolic"}),
        '1': Widget.Icon({icon: "cat_1-symbolic"}),
        '2': Widget.Icon({icon: "cat_2-symbolic"}),
        '3': Widget.Icon({icon: "cat_3-symbolic"}),
        '4': Widget.Icon({icon: "cat_4-symbolic"}),
        'sleep': Widget.Icon({icon: "cat_sleep-symbolic"}),
      },
      // @ts-ignore
      shown: cpu.bind().as(r => as_cycle(r)),
    })
  ]
});

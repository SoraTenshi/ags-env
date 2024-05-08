import Widget from "resource:///com/github/Aylur/ags/widget.js";

import * as Utils from "resource:///com/github/Aylur/ags/utils.js";

/** @type{["0", "1", "2", "3", "4"]} */
const cycle = ["0", "1", "2", "3", "4"];
let current_cycle = 4;
let last_cpu = 1;

/**
  @type {(r: string) => "sleep" | "0" | "1" | "2" | "3" | "4"}
  */
const as_cycle = (r) => { 
  const curr = Math.round(Number(r));
  /** @type{"sleep" | "0" | "1" | "2" | "3" | "4"}*/
  let selected = "sleep";

  if(curr > 0) selected = cycle[cycle.length % current_cycle];
  
  last_cpu = curr;
  return selected;
};

export const RunCat = () => Widget.Box({
  setup: self => {
      const stack = self.children[0];
      self.poll(1000 / last_cpu, () => {
          Utils.execAsync(["sh", "-c", `top -bn1 | grep '%Cpu' | tail -1 | awk '{print 100-$8}'`])
            .then((r) => stack.shown = as_cycle(r))
            .catch((err) => print(err));
      });
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
      shown: 'sleep',
    })
  ]
});

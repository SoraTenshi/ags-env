import Widget from "resource:///com/github/Aylur/ags/widget.js";

import * as Utils from "resource:///com/github/Aylur/ags/utils.js";

export const Cpu = () => Widget.Box({
  vertical: true,
  children: [
    Widget.Label({
      class_name: 'cpu-name',
      label: "CPU",
    }),
    Widget.Label({
      class_name: 'cpu-val',
      setup: self => {
        self.poll(2000, self => Utils.execAsync(["sh", "-c", `top -bn1 | grep '%Cpu' | tail -1 | awk '{print 100-$8}'`])
          .then((r) => (self.label = Math.round(Number(r)) + "%"))
          .catch((err) => print(err)),
        );
      },
    }),
  ],
});

export const Memory = () => Widget.Box({
  vertical: true,
  children: [
    Widget.Label({
      class_name: 'mem-name',
      label: "MEM",
    }),
    Widget.Label({
      class_name: 'mem-val',
      setup: self => {
        self.poll(2000, self => Utils.execAsync(["sh", "-c", `free | tail -2 | head -1 | awk '{print $3/$2*100}'`])
          .then((r) => (self.label = Math.round(Number(r)) + "%"))
          .catch((err) => print(err)),
        );
      },
    }),
  ],
});

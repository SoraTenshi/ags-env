import { Bar, Monitors } from "bar/bar";
import { AppList } from "bar/modules/applications";
import { ShutdownList } from "bar/modules/shutdown";

App.addIcons(`${App.configDir}/assets/runcat`);
App.config({
  style: `${App.configDir}/bar/style.css`,
  windows: [
    ...Monitors().map((_: unknown, i: number) => Bar({ monitor: i })),
    AppList(),
    ShutdownList(),
  ],
});


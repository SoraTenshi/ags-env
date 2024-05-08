import App from "resource:///com/github/Aylur/ags/app.js";
import { Bar, Monitors } from "./bar/bar.js";
import { AppList } from "./bar/modules/applications.js";
import { ShutdownList } from "./bar/modules/shutdown.js";

App.addIcons(`${App.configDir}/assets/runcat`);

App.config({
  style: `${App.configDir}/bar/style.css`,
  windows: [
    ...Monitors().map((_, i) => Bar({ monitor: i })),
    AppList(),
    ShutdownList(),
  ],
});


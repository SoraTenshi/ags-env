import { Variable } from "resource:///com/github/Aylur/ags/variable.js";

export const BarState = new Variable('bar');

globalThis.BarState = BarState;

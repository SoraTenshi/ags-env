
// -------------- Top Bar State -------------- \\

export const BarState = Variable<string>('bar');
globalThis.BarState = BarState;

// -------------- Cat State :3 -------------- \\

export type CatType = "0" | "1" | "2" | "3" | "4";
export const CAT_CYCLE: CatType[] = ["0", "1", "2", "3", "4"];

export const CatState = Variable<CatType>("0");
globalThis.RunCatState = CatState;

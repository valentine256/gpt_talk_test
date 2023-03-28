import { atom } from "recoil";

const audioUrlAtom = atom<string | null>({
  key: "audioUrlAtom",
  default: null,
});

const recordAtom = atom<boolean>({
  key: "recordAtom",
  default: false,
});

export { audioUrlAtom, recordAtom };

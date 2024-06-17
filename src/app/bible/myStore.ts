import {create} from "zustand";

type MyStore = {
  text2: string;
  // setText2: (text: string) => void;
  clickSignal: number;
  // removeText: (text: string) => void;
};

export const useMyStore = create<MyStore>((set) => (
  {
    text2: "",
    clickSignal: 1,
    // setText2: (text) => set((state) => ({text2: text})),
    // removeText: (text) => set((state) => ({text: state.text.filter((t) => t !== text)}))
  }
));

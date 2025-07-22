import { create } from 'zustand';

type useMessageStore = {
  messageBody: string;
  appendMessage: (letter: string) => void;
};

export const useMessageBody = create<useMessageStore>((set) => ({
  messageBody: '',
  appendMessage: (letter: string) =>
    set((state) => ({ messageBody: state.messageBody + letter })),
}));






// export const useStore = create<useMessageStore>((set) => {
//   return {
//     messageBody: '',
//   };
// });

//     const useMyStore = create((set) => ({
//       // Initial state
//       count: 0,
//       message: 'Hello',

//       // Actions to update state
//       increment: () => set((state) => ({ count: state.count + 1 })),
//       setMessage: (newMessage) => set({ message: (newMessage) => {newMessage   }),
//     }));

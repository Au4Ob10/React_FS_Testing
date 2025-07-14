import React, { createContext, SetStateAction, Dispatch, useContext, useState, FC, PropsWithChildren} from 'react';

// https://stackoverflow.com/questions/72420279/usestate-with-usecontext-in-typescript
type msgContent = {
  messageBody: string | null;
  setMessageBody: Dispatch<SetStateAction<string | null>>
}

const msgContentState = {
    messageBody: null,
    setMessageBody: () => {}
}
 export const msgBody = createContext<msgContent>(msgContentState);




//     export const useMessageContext = (): msgContent => {
//    const context = useContext(msgBody);
//    if (!context) {
//     throw new Error('msgContent must be used in messageProvider')
//    }
//    return context;
//   }

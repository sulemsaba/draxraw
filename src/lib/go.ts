import { createContext, useContext } from 'react';

export const GoContext = createContext<(to: string) => void>(() => {});

/** Navigate with the page wipe: a red vinyl panel slaps over the page, then peels away. */
export const useGo = () => useContext(GoContext);

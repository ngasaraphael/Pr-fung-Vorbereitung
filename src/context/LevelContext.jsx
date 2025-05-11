import { createContext, useState } from 'react';

export const LevelContext = createContext();

export function LevelProvider({ children }) {
  const [level, setLevel] = useState('b1'); // default level

  return (
    <LevelContext.Provider value={{ level, setLevel }}>
      {children}
    </LevelContext.Provider>
  );
}

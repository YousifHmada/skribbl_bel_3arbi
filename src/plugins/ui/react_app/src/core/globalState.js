import React from 'react';
import { apiActions } from './apisActions';
import appReducer from './appReducer';
import { eventActions } from './eventActions';

const initialState = {
  player: null,
  game: null,
  room: null
};

export const GlobalContext = React.createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(appReducer, initialState);

  return (
    <GlobalContext.Provider
      value={{
        state: {
          player: state.player,
          game: state.game,
          room: state.room
        },
        actions: {
          ...apiActions({ dispatch }),
          ...eventActions({ dispatch })
        }
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

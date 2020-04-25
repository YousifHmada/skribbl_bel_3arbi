/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-case-declarations */
import localStoragePlugin from './localStorage';

export default (state, action) => {
  let newState;
  switch (action.type) {
    case 'CREATE_ROOM':
      const { hostId, ...room } = action.payload;
      localStoragePlugin.setItem('playerId', action.payload.hostId);
      newState = {
        ...state,
        room: { ...state.room, ...room }
      };
      break;
    case 'PLAYER_JOINED_EVENT':
      newState = {
        ...state
      };
      break;
    case 'PLAYER_LEFT_EVENT':
      newState = {
        ...state
      };
      break;
    case 'CONNECTED_EVENT':
      newState = {
        ...state,
        game: { ...state.game, ...action.payload.game },
        player: { ...state.player, ...action.payload.me }
      };
      break;
    default:
      newState = state;
  }

  // eslint-disable-next-line no-console
  console.log(action.type, action.payload, newState);
  return newState;
};

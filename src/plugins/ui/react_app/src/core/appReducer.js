export default (state, action) => {
  let newState;
  switch (action.type) {
    case 'CREATE_ROOM':
      newState = {
        ...state,
        room: { ...state.room, roomId: action.payload }
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
        ...state
      };
      break;
    default:
      newState = state;
  }

  // eslint-disable-next-line no-console
  console.log(action.type, newState);
  return newState;
};

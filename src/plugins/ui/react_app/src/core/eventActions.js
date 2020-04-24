import openSocket from 'socket.io-client';
import { baseURL } from './httpClient';

export const eventActions = ({ dispatch }) => {
  const openConnection = ({ nickname, roomId }) => {
    const playerId = localStorage.getItem('playerId');
    const query = { nickname };

    if (playerId) {
      query.id = playerId;
    }

    const socketConnection = openSocket(`${baseURL}/${roomId}`, { query });

    socketConnection.on('playerJoined', (player) => {
      dispatch({
        type: 'PLAYER_JOINED_EVENT',
        payload: player
      });
    });

    socketConnection.on('playerLeft', (player) => {
      dispatch({
        type: 'PLAYER_LEFT_EVENT',
        payload: player
      });
    });

    socketConnection.on('connected', (data) => {
      dispatch({
        type: 'CONNECTED_EVENT',
        payload: data
      });
    });
  };

  return { openConnection };
};

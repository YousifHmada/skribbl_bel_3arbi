import openSocket from 'socket.io-client';
import { baseURL } from './httpClient';

export const socket = ({ nickname, roomId }) => {
  const playerId = localStorage.getItem('playerId');
  const query = { nickname };

  if (playerId) {
    query.id = playerId;
  }

  const socketConnection = openSocket(`${baseURL}/${roomId}`, { query });

  const playerJoinedEvent = (cb) => {
    // eslint-disable-next-line no-console
    socketConnection.on('playerJoined', (player) => (cb && cb(player)) || console.log('playerJoined', player));
  };

  const playerLeftEvent = (cb) => {
    // eslint-disable-next-line no-console
    socketConnection.on('playerLeft', (player) => (cb && cb(player)) || console.log('playerLeft', player));
  };

  const connectPlayerEvent = (cb) => {
    socketConnection.on('connected', (data) => {
      // eslint-disable-next-line no-console
      console.log('connected', data);
      cb(data.me.id);
    });
  };

  return { playerJoinedEvent, playerLeftEvent, connectPlayerEvent };
};

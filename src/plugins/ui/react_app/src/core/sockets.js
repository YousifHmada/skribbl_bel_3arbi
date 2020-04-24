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
    socketConnection.on('playerJoined', (player) => (cb && cb(player)) || console.log(player));
  };

  const playerLeftEvent = (cb) => {
    // eslint-disable-next-line no-console
    socketConnection.on('playerLeft', (player) => (cb && cb(player)) || console.log(player));
  };

  const connectPlayerEvent = (cb) => {
    socketConnection.on('connected', ({ player }) => cb(player.id));
  };

  return { playerJoinedEvent, playerLeftEvent, connectPlayerEvent };
};

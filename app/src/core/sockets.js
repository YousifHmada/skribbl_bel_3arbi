import openSocket from 'socket.io-client';
import { baseURL } from './httpClient';

export const socket = ({ nickname, roomId }) => {
  const playerId = localStorage.getItem('playerId');
  const query = { nickname };

  if (playerId) {
    query.id = playerId;
  }

  const socket = openSocket(`${baseURL}/${roomId}`, { query });

  const playerJoinedEvent = (cb) => {
    socket.on('playerJoined', (player) => (cb && cb(player)) || console.log(player));
  };

  const playerLeftEvent = (cb) => {
    socket.on('playerLeft', (player) => (cb && cb(player)) || console.log(player));
  };

  const connectPlayerEvent = (cb) => {
    socket.on('connected', ({ player }) => cb(player?.id));
  };

  return { playerJoinedEvent, playerLeftEvent, connectPlayerEvent };
};

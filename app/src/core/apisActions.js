import { roomService } from '../services/roomService';

export const apiActions = ({ dispatch }) => {
  const service = roomService();

  const createRoom = async () => {
    const room = await service.createRoom();
    dispatch({
      type: 'CREATE_ROOM',
      payload: room
    });
  };

  return { createRoom };
};

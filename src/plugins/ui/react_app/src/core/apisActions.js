import { roomService } from './../services/roomService';

export const apiActions = ({ dispatch }) => {
  const service = roomService();

  const createRoom = async () => {
    const roomId = await service.createRoom();
    dispatch({
      type: 'CREATE_ROOM',
      payload: roomId
    });
  };

  return { createRoom };
};

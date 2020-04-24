import axiosInstance from '../core/httpClient';

export const roomService = () => {
  const createRoom = async () => {
    const res = await axiosInstance.post('/api/rooms', {});
    return res.data;
  };

  return {
    createRoom
  };
};

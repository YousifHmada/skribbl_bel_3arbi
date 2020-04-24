import axiosInstance from '../core/httpClient';

export const roomService = () => {
  const createRoom = async () => {
    const res = await axiosInstance.post('/api/rooms', {});
    // eslint-disable-next-line no-console
    console.log(res.data);
    return res.data;
  };

  return {
    createRoom
  };
};

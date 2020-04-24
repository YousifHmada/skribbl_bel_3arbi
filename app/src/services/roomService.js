import axiosInstance from '../core/httpClient';

export const roomService = () => {
  const createRoom = async () => {
    const res = await axiosInstance.post('/rooms', {});
    console.log(res);
    return res.data.link;
  };

  return {
    createRoom
  };
};

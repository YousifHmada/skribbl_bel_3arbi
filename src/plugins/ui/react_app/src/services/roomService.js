import axiosInstance from '../core/httpClient';

export const roomService = () => {
  const createRoom = async () => {
    const res = await axiosInstance.post('/rooms', {});
    // eslint-disable-next-line no-console
    console.log(res);
    return res.data.link;
  };

  return {
    createRoom
  };
};

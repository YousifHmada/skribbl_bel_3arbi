import { appSettings } from '../core/settinrgs';

export const userService = () => {
  const createRoom = async () => {
    const url = `${appSettings.endpointURL}/rooms`;

    const res = await fetch(url, { method: 'POST', mode: 'no-cors' });
    console.log(res);
    return res.json().link;
  };

  return {
    createRoom
  };
};

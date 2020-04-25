const setItem = (key, value) => {
  // eslint-disable-next-line no-console
  console.log('SET_ITEM_IN_LOCALSTORAGE', key, value);
  return localStorage.setItem(key, value);
};

const getItem = (key) => {
  const value = localStorage.getItem(key);
  // eslint-disable-next-line no-console
  console.log('GET_ITEM_FROM_LOCALSTORAGE', key, value);
  return value;
};

const removeItem = (key) => {
  // eslint-disable-next-line no-console
  console.log('REMOVE_ITEM_FROM_LOCALSTORAGE', key);
  return localStorage.removeItem(key);
};

export default {
  setItem,
  getItem,
  removeItem
};

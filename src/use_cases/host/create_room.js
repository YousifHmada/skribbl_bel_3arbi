function generateSlug(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function init() {
  return async function createRoom() {
    const roomId = await generateSlug(10);
    // @TODO check the room id if exists in the db or not
    return roomId;
  };
}

module.exports = {
  init,
};

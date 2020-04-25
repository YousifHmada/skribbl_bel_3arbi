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

function init(context) {
  return async function createRoom() {
    let roomId;
    do {
      roomId = generateSlug(10);
    } while (context.plugins.socketIO.hasRoom(roomId));

    const room = context.plugins.socketIO.createRoom(roomId);
    return room.getMetadata();
  };
}

module.exports = {
  init
};

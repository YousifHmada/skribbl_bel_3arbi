/* eslint-disable no-undef */
let socket;
function getQueryStringValue(key) {
  return decodeURIComponent(
    window.location.search.replace(
      new RegExp(`^(?:.*[&\\?]${
        encodeURIComponent(key)
          // eslint-disable-next-line no-useless-escape
          .replace(/[\.\+\*]/g, '\\$&')}(?:\\=([^&]*))?)?.*$`, 'i'), '$1',
    ),
  );
}

async function setup() {
  createCanvas(1000, 1000);
  background(51);
  const userId = getQueryStringValue('userId');
  if (userId) {
    await fetch(`http://localhost:3000/api/rooms/ahmed?userId=${userId}`);
  }
  socket = io.connect('http://localhost:3000', { query: `userId=${userId}` });
  socket.on('playerJoined', console.log);
  socket.on('mouseMoved', newDrawing);
}

function newDrawing(data) {
  noStroke();
  fill(255);
  ellipse(data.x, data.y, 35, 36);
}

function mouseDrag() {
  // console.log('sending', mouseX, mouseY)
  const roomId = getQueryStringValue('roomId');
  // if(!roomId) return
  // console.log(io)
  socket.emit('mouse', { x: mouseX, y: mouseY, roomId });
  noStroke();
  fill(255);
  ellipse(mouseX, mouseY, 35, 36);
}

function draw() {
  mouseDrag();
}

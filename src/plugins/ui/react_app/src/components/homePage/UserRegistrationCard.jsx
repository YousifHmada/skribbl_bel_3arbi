import { Button, Container, Input } from '@material-ui/core';
import React from 'react';
import { socket } from '../../core/sockets';
import { roomService } from '../../services/roomService';

export function UserRegistrationCard() {
  const [inputValue, setInputValue] = React.useState('');
  const [url, setURL] = React.useState(null);

  const handleSubmit = async () => {
    const { hostId, link } = await roomService().createRoom();
    localStorage.setItem('playerId', hostId);
    // eslint-disable-next-line no-console
    setInputValue('');
    setURL(<a href={link}>{link}</a>);
  };

  function getRoomIdFromWindow() {
    // eslint-disable-next-line no-shadow
    const url = window.location.href;
    return url.split('rooms/')[1];
  }

  React.useEffect(() => {
    const roomId = getRoomIdFromWindow();
    if (roomId) {
      const mySocket = socket({ nickname: 'ayNickName', roomId });
      mySocket.connectPlayerEvent((id) => {
        localStorage.setItem('playerId', id);
      });
      mySocket.playerLeftEvent();
      mySocket.playerJoinedEvent();
    }
  }, []);

  return (
    <Container maxWidth="lg" style={{ height: '500px' }}>
      <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
      {url}
    </Container>
  );
}

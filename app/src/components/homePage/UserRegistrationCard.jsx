import { Button, Container, Input } from '@material-ui/core';
import React from 'react';
import { GlobalContext } from '../../core/globalState';

export function UserRegistrationCard() {
  const [inputValue, setInputValue] = React.useState('');
  const { actions } = React.useContext(GlobalContext);

  const handleSubmit = async () => {
    actions.createRoom();
    setInputValue('');
  };

  function getRoomIdFromWindow() {
    const url = window.location.href;
    return url.split('rooms/')[1];
  }

  React.useEffect(() => {
    const roomId = getRoomIdFromWindow();
    if (roomId) {
      actions.openConnection({ nickname: inputValue, roomId });
    }
  }, []);

  return (
    <Container maxWidth="lg" style={{ height: '500px', backgroundColor: 'white', padding: '20px' }}>
      <Input color="secondary" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter your nickname" />
      <Button variant="contained" color="secondary" onClick={handleSubmit}>
        Create private room
      </Button>
    </Container>
  );
}

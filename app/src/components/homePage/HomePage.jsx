import { Button } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { UserRegistrationCard } from './UserRegistrationCard';

export function HomePage() {
  const history = useHistory();

  return (
    <>

      <Button variant="contained" color="primary" onClick={() => history.push('/room')}>
        Game Page
      </Button>
      <UserRegistrationCard />
    </>
  );
}

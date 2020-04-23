import { Button, Container, Input } from '@material-ui/core';
import React from 'react';
import { userService } from '../../services/userService';

export function UserRegistrationCard() {
    const [inputValue, setInputValue] = React.useState('');

    const handleSubmit = () => {
        const link = userService().createRoom();
        console.log(link);
        setInputValue('');
    };

    return (
        <Container maxWidth="lg" style={{ height: '500px' }}>
            <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
        </Container>
    );
}

import React from 'react';
import { GlobalProvider } from './core/globalState';
import { Routes } from './core/routes';


function App() {
  return (
    <GlobalProvider>
      <center>
        <Routes />
      </center>
    </GlobalProvider>
  );
}

export default App;

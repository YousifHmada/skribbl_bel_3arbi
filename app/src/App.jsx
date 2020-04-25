import React from 'react';
import { GlobalProvider } from './core/globalState';
import { Routes } from './core/routes';


function App() {
  return (
    <GlobalProvider>
      <div style={{ textAlign: 'center' }}>
        <img className="logo logoBig" src="logo.gif" />
      </div>
      <center>
        <Routes />
      </center>
    </GlobalProvider>
  );
}

export default App;

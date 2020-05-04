import React from 'react';
import ReactGA from 'react-ga'; // Google Analytics
import { GlobalProvider } from './core/globalState';
import { Routes } from './core/routes';

function initAnalytics() {
  ReactGA.initialize('UA-164613143-1');
  ReactGA.pageview(window.location.pathname + window.location.search);
}
function App() {
  initAnalytics();
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

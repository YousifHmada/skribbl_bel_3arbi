import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { HomePage } from '../components/homePage/HomePage';
import GamePage from './../components/gamePage/GamePage';

export const Routes = () => (
  <BrowserRouter>
    <Route path="/room" component={GamePage} />
    <Route exact path="/" component={HomePage} />
  </BrowserRouter>
);

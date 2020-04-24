import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import { Canvas } from './../components/gamePage/Canvas';
import { HomePage } from './../components/homePage/HomePage';

export const Routes = () => {
  return (
    <BrowserRouter>
      <Route path="/room" component={Canvas} />
      <Route exact path="/" component={HomePage} />
    </BrowserRouter>
  )
}

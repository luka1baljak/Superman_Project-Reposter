import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
  transitions,
  positions,
  types,
  Provider as AlertProvider
} from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

//Opcije za obavijesti
const options = {
  position: positions.BOTTOM_LEFT,
  timeout: 4000,
  type: types.INFO,
  offset: '30px',
  transition: transitions.SCALE
};

ReactDOM.render(
  <AlertProvider template={AlertTemplate} {...options}>
    <App />
  </AlertProvider>,
  document.getElementById('root')
);

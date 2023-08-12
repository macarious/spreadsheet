/**
 * @jest-environment jsdom
 */

import React from 'react';
import './App.css';
import SpreadSheet from './Components/SpreadSheet';
import Home from './Components/Home';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <input type="text" id="username" placeholder="username" />
        <SpreadSheet />
      </header>

    </div>
  );
}

export default App;



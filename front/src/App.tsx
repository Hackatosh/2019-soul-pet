import React from 'react';
import logo from './resources/logo.svg';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to Soul Pet !
        </p>
      </header>
    </div>
  );
}

export default App;

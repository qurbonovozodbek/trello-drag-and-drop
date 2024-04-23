import React from 'react';
import './App.css';
import Board from './components/Board';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Trello-like Board</h1>
      <Board />
    </div>
  );
};

export default App;

import logo from './logo.svg';
import './App.css';
import React from "react";
import Main from './views/Main';
import box from './components/imgs/box.svg'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>OneBox</h2>
        <img src={box} alt="box icon"></img>
      </header>
      <Main />
    </div>
  );
}

export default App;

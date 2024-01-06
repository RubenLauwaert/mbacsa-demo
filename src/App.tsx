import React from 'react';
import './css/App.css';
import StepMechanism from './components/StepMechanism';
import DelegationVisuals from './components/DelegationVisuals';
import ServerOutput from './components/ServerOutput';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Demo</p>
      </header>
      <div className="StepMechanism">
          <StepMechanism />
        </div>
        <div className="DelegationVisuals">
          <DelegationVisuals />
        </div>
        <div className="ServerOutput">
          <ServerOutput />
        </div>
    </div>
  );
}


export default App;

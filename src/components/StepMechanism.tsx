import React, { useState } from 'react';
import "../css/StepMechanism.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DelegationVisuals from './DelegationVisuals';
import ServerOutput from './ServerOutput';

const agentInfo = {
  targetEndpoint: "http://localhost:3001/Alice/social/post1.json",
  infoAlice: { webId: "http://localhost:30001/Alice/profile/card#me",
                email: "Alice@example.com",
                password: "Alice"},
  infoBob: { webId: "http://localhost:3002/Bob/profile/card#me",
                email: "Bob@example.com",
                password: "Bob"},
  infoJane: { webId: "http://localhost:3003/Jane/profile/card#me",
            email: "Jane@example.com",
            password: "Jane"}
}

const stepDescriptions: { [key: string]: string } = {
  0: "Initialize the Community Solid Servers",
  1: "Alice mints macaroon for her resource",
  2: "Alice adds a discharge proof for minted macaroon",
  3: "Alice delegates to Bob",
  4: "Bob adds a discharge proof, activating delegation of Alice",
  5: "Bob delegates to Jane",
  6: "Jane adds a discharge proof, activating delegation of Bob",
  7: "Jane accesses resource of Alice via macaroons"
}


const StepMechanism = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const maxStep = Object.keys(stepDescriptions).length ;


  const handleNext = () => {
    if (currentStep < maxStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };


  // Mbacsa Client

  const mintStep = async (minter:string  ) => {
    // 
  }





  return (
    <div className="step-mechanism-container">
      <div className="step-controls">
        <button className="step-button" onClick={handlePrevious} disabled={currentStep === 0}>
          <ArrowBackIosIcon /> Previous step
        </button>
        <p className="current-step">{currentStep}</p>
        <button className="step-button" onClick={handleNext} disabled={currentStep === maxStep}>
          Next step <ArrowForwardIosIcon />
        </button>
      </div>
      <div className="step-description">
        <p>{stepDescriptions[currentStep]}</p>
      </div>
      <div className='visual-and-output-window'>
        <div className='ServerOutput'>
          <p>Output of Solid servers</p>
          <ServerOutput></ServerOutput>
        </div>
        <div className="DelegationVisuals">
            <DelegationVisuals stepNumber={currentStep} />
        </div>
      </div>
    </div>
  );
};

export default StepMechanism;

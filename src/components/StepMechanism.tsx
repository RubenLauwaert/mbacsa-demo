import React, { useState } from 'react';
import "../css/StepMechanism.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DelegationVisuals from './DelegationVisuals';
import ServerOutput from './ServerOutput';



const stepDescriptions: { [key: string]: string } = {
  1: "Initialize the Community Solid Server",
  2: "Seed the pods of Alice, Bob and Jane",
  3: "Alice mints a macaroon for her own resource",
  4: "Alice delegates permissions to Bob by adding third-party caveat",
  5: "Alice sends macaroon to Bob",
  6: "Upon receival, Bob obtains discharge proof, activating the delegation",
  7: "Bob delegates permissions to Jane by adding third-party caveat",
  8: "Bob sends macaroon to Jane",
  9: "Upon receival, Jane obtains discharge proof, activating the delegation",
  10: "Jane accesses Alice's resource via macaroon-based permissions"
}


const StepMechanism = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const maxStep = Object.keys(stepDescriptions).length ;

  const handleNext = () => {
    if (currentStep < maxStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="step-mechanism-container">
      <div className="step-controls">
        <button className="step-button" onClick={handlePrevious} disabled={currentStep === 1}>
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
        <div className="DelegationVisuals">
            <DelegationVisuals stepNumber={currentStep} />
        </div>
        <div className='ServerOutput'>
          <p>Output of Solid servers</p>
          <ServerOutput></ServerOutput>
        </div>

      </div>
    </div>
  );
};

export default StepMechanism;

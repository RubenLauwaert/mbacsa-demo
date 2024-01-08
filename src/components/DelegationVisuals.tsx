import React from 'react';
import '../css/DelegationVisuals.css'
import StepFigure from './StepFigure';

type StepFigureProps = {
  stepNumber: number;
};

const DelegationVisuals: React.FC<StepFigureProps> = ({ stepNumber }) => {
  return (
    <div className='visuals-container'>
      <StepFigure stepNumber={stepNumber}></StepFigure>
    </div>
  );
};

export default DelegationVisuals;

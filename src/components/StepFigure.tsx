import React from 'react';

type StepFigureProps = {
  stepNumber: number;
};

const StepFigure: React.FC<StepFigureProps> = ({ stepNumber }) => {
  const imageUrl = `../../images/${stepNumber}.png`;

  return (
    <div className="step-figure-container">
      <img src={imageUrl} alt={`Step ${stepNumber}`} style={{ width: '600px', height: '400px' }} />
    </div>
  );
};

export default StepFigure;

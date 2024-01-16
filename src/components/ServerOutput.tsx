import React from 'react';
import '../css/ServerOutput.css';

interface ServerOutputProps {
  output: string[];
}

const ServerOutput: React.FC<ServerOutputProps> = ({ output }) => {
  // Get the last 5 elements of the array, or all elements if fewer than 5
  const lastThree = output.slice(-3);

  return (
    <div className='output-container'>
      <div className='output-text'>
        {lastThree.map((item, index) => (
          <p key={index}>{item}</p> // Use index as a key (or a unique identifier if available)
        ))}
      </div>
    </div>
  );
};

export default ServerOutput;



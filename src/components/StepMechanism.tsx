import React, { useEffect, useState } from 'react';
import "../css/StepMechanism.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DelegationVisuals from './DelegationVisuals';
import ServerOutput from './ServerOutput';
import {getPublicDischargeKey, mintMacaroon, retrieveDPoPToken} from '../util/api'

const agentInfo = {
  targetEndpoint: "http://localhost:3001/Alice/social/post1.json",
  infoAlice: { 
    podServerUri: "http://localhost:3001/",
    webId: "http://localhost:3001/Alice/profile/card#me",
    email: "Alice@example.com",
    password: "Alice"},
  infoBob: { 
    podServerUri: "http://localhost:3002/",
    webId: "http://localhost:3002/Bob/profile/card#me",
    email: "Bob@example.com",
    password: "Bob"},
  infoJane: { 
    podServerUri: "http://localhost:3003/",
    webId: "http://localhost:3003/Jane/profile/card#me",
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
  // Steps counter
  const [currentStep, setCurrentStep] = useState(0);
  const maxStep = Object.keys(stepDescriptions).length ;
  // DPoP tokens for Alice, Bob and Janse
  const [dpopTokens,setDpopTokens] = useState({alice: {}, bob: {}, jane: {}});
  // Public discharge keys for Alice, Bob and Jane;
  const [publicDischargeKeys,setPublicDischargeKeys] = useState({alice: {}, bob: {}, jane: {}});
  // Root (attenuated) macaroons for Alice, Bob and Janse
  const [rootMacaroons,setRootMacaroons] = useState({alice: {}, bob: {}, jane: {}});
  // Discarge macaroons for Alice, Bob and Janse
  const [dischargeMacaroons,setDischargeMacaroons] = useState({alice: {}, bob: {}, jane: {}});


  const handleNext = () => {
    if (currentStep < maxStep - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };


  const fetchDPoPTokens = async () => {
    const dpopTokenAlice = await retrieveDPoPToken(agentInfo.infoAlice.podServerUri,agentInfo.infoAlice.email,agentInfo.infoAlice.password);
    const dpopTokenBob = await retrieveDPoPToken(agentInfo.infoBob.podServerUri,agentInfo.infoBob.email,agentInfo.infoBob.password);
    const dpopTokenJane = await retrieveDPoPToken(agentInfo.infoJane.podServerUri,agentInfo.infoJane.email,agentInfo.infoJane.password);
    setDpopTokens({alice: dpopTokenAlice, bob: dpopTokenBob, jane: dpopTokenJane})
  }
  


  // Upon starting the demo, retrieve dpop token for Alice, Bob and Jane
  useEffect(() => {
    fetchDPoPTokens()
  }, []);

  const stepActions = [
    async () => {
      // Logic for step 0
    },
    async () => {
      // Logic for step 1
      console.log("Handling step 1")
      // Retrieving pdk of Alice
      const pdkAlice = await getPublicDischargeKey(agentInfo.infoAlice.webId);
      setPublicDischargeKeys({alice: pdkAlice, bob: publicDischargeKeys.bob, jane: publicDischargeKeys.jane})
      // Sending mint request
      const mintedMacaroonAlice = await mintMacaroon(
        agentInfo.targetEndpoint,
        agentInfo.infoAlice.webId,
        pdkAlice,
        'read',
        dpopTokens.alice)
    },
    async () => {
      // Logic for step 2
      console.log("Handling step 2")


    },
    async () => {
      // Logic for step 3
      console.log("Handling step 3")

    },
    async () => {
      // Logic for step 4
      console.log("Handling step 4")

  
    },
    async () => {
      // Logic for step 5
      console.log("Handling step 5")
    },
    async () => {
      // Logic for step 6
      console.log("Handling step 6")
    },
    async () => {
      // Logic for step 7
      console.log("Handling step 1")
    }];

  useEffect(() => {
    if (currentStep < stepActions.length) {
      const handleCurrentStep = stepActions[currentStep];
      handleCurrentStep();
    }
  }, [currentStep]);



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

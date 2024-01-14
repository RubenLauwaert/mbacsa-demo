type AgentInfo =  {
  podServerUri:string,
  email:string,
  password: string
}

// Function to retrieve a DPoP token
export const retrieveDPoPToken = async (podServerUri:string, email:string, password:string):Promise<any> => {
  try {
    const response = await fetch('http://localhost:3004/dpop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ podServerUri, email, password }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('DPoP Token:', data.dpop);
    return data.dpop;
    // Handle the response as needed, e.g., store it in state or use it directly
  } catch (error) {
    console.error('Error retrieving DPoP token:', error);
  }
};

// Function to retrieve the public discharge key
export const getPublicDischargeKey = async (subject:string):Promise<any> => {
  try {
    const response = await fetch('http://localhost:3004/pdk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject: subject}),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Successfully retrieved public discharge key for: ' + subject);
    return data.pdk
    // Handle the response as needed, e.g., store it in state
  } catch (error) {
    console.error('Error retrieving public discharge key:', error);
  }
};

 // Function to mint a macaroon
 export const mintMacaroon = async (uri:string, requestor: string, pdk:object, mode:string, agentInfo:AgentInfo):Promise<string|undefined> => {
  try {
    const response = await fetch('http://localhost:3004/mint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resourceURI: uri,
        requestor: requestor,
        dischargeKey: pdk,
        mode: mode,
        agentInfo:agentInfo
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const mintResponse = await response.json();
    console.log(mintResponse.mintedMacaroon)
    return mintResponse.mintedMacaroon as string;
    // Handle the response as needed
  } catch (error) {
    console.error('Error minting macaroon:', error);
  }
};

// Function to discharge macaroon
export const dischargeMacaroon = async (serializedMacaroon:string,dischargee:string,agentInfo:AgentInfo):Promise<string|undefined> => {
  try {
    const response = await fetch('http://localhost:3004/discharge',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      serializedMacaroon: serializedMacaroon,
      dischargee: dischargee,
      agentInfo:agentInfo
    }),
  });

  const dischargeResponse = await response.json();
  console.log(dischargeResponse.dischargeMacaroon);
  return dischargeResponse.dischargeMacaroon
  } catch (error) {
    console.log("Error discharging macaroon: " + error)
  }
  


}

// Function to discharge macaroon
export const delegateTo = async (serializedMacaroon:string,delegatee: string):Promise<string|undefined> => {
  try {
    const response = await fetch('http://localhost:3004/delegate',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      serializedMacaroon: serializedMacaroon,
      delegatee: delegatee
    }),
  });

  const delegateResponse = await response.json();
  console.log(delegateResponse.attenuatedMacaroon);
  return delegateResponse.attenuatedMacaroon;
  } catch (error) {
    console.log("Error delegating : " + error)
  }
  


}
import { MbacsaClient } from 'mbacsa-client';
import express from 'express'
import cors from 'cors';



// Express app
const app = express();
app.use(cors());
app.use(express.json());

// Mbacsa Client
const mbacsaClient = new MbacsaClient();


// Listen on
const PORT =  3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Endpoint for retrieving a dpoptoken
app.post('/dpop', async (req, res) => {
  try {
      const podServerUri = req.body.podServerUri;
      const email = req.body.email;
      const password = req.body.password;
      const dpopToken = await mbacsaClient.retrieveDPoPToken(podServerUri,email,password);
      console.log("Successfully retrieved dpop token for: " + req.body.email)
      res.json({ success: true, dpop: dpopToken});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint for retrieving a public discharge key
app.post('/pdk', async (req, res) => {
  try {
    const subject = req.body.subject;
    console.log(req.body)
    const {dischargeKey} = await mbacsaClient.getPublicDischargeKey(subject);
    console.log('Successfully retrieved public discharge key for: ' + subject);
    res.json({ success: true, pdk: dischargeKey});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



// Endpoint for minting a new macaroon
app.post('/mint', async (req, res) => {
  try {
    const resourceURI = req.body.resourceURI;
    const requestor = req.body.requestor;
    const dischargeKey = req.body.dischargeKey;
    const mode = req.body.mode;
    const {podServerUri,email,password} = req.body.agentInfo;
    const mintInfo = {
      resourceURI: resourceURI,
      requestor: requestor,
      dischargeKey: dischargeKey,
      mode: mode
    }

    const dpopToken = await mbacsaClient.retrieveDPoPToken(podServerUri,email,password);
    const mintResponse = await mbacsaClient.mintDelegationToken(requestor,mintInfo,dpopToken);
    console.log(mintResponse);
    res.json({ success: true, mintedMacaroon: mintResponse.mintedMacaroon});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint for delegating a macaroon
app.post('/delegate', async (req, res) => {
  try {
    const serializedMacaroon = req.body.serializedMacaroon;
    const delegatee = req.body.delegatee;

    const pdkDelegatee = await mbacsaClient.getPublicDischargeKey(delegatee);
    const attenuatedMacaroon = await mbacsaClient.delegateAccessTo(serializedMacaroon,delegatee,pdkDelegatee.dischargeKey);
    console.log(attenuatedMacaroon);
    res.json({ success: true, attenuatedMacaroon: attenuatedMacaroon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint for discharging a macaroon
app.post('/discharge', async (req, res) => {
  try {
    const serializedMacaroon = req.body.serializedMacaroon;
    const dischargee = req.body.dischargee;
    const {podServerUri,email,password} = req.body.agentInfo;

    
    const dpopToken = await mbacsaClient.retrieveDPoPToken(podServerUri,email,password);
    const dischargeResponse = await mbacsaClient.dischargeLastThirdPartyCaveat(serializedMacaroon,dischargee,dpopToken);
    console.log(dischargeResponse)


    res.json({ success: true, dischargeMacaroon:dischargeResponse.dischargeMacaroon});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint for accessing a resource with a macaroon
app.post('/access', async (req, res) => {
  try {

    const resourceUri = req.body.resourceUri;
    const serializedMacaroons = req.body.serializedMacaroons;

    const resource = await mbacsaClient.accessWithDelegationToken(resourceUri,serializedMacaroons);

    res.json({ success: true, resource:resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


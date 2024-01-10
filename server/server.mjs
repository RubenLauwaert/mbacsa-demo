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
    const dpop = req.body.dpop
    const mintInfo = {
      resourceURI: resourceURI,
      requestor: requestor,
      dischargeKey: dischargeKey,
      mode: mode
    }

    const {mintedMacaroon} = await mbacsaClient.mintDelegationToken(requestor,mintInfo,dpop);
    console.log(mintedMacaroon)
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint for delegating a macaroon
app.post('/delegate', async (req, res) => {
  try {

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint for discharging a macaroon
app.post('/discharge', async (req, res) => {
  try {
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint for accessing a resource with a macaroon
app.post('/access', async (req, res) => {
  try {

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


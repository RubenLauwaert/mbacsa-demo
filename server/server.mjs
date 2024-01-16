import { MbacsaClient } from 'mbacsa-client';
import express from 'express'
import cors from 'cors';
import  dotenv from 'dotenv';
import net from 'net';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';



// dotenv
dotenv.config()

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

// Helper function to check port availability
function checkPort(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false); // Port is in use
      } else {
        reject(err);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(true); // Port is available
    });

    server.listen(port);
  });
}

// Helper function to remove ./internal directory
async function removeInternalDirectory(serverPath) {
  const internalDirPath = path.join(serverPath, '.internal');
  const removeCommand = `rm -rf "${internalDirPath}"`;

  return new Promise((resolve, reject) => {
    exec(removeCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('Error removing .internal directory:', error);
        reject(error);
      } else {
        console.log('Removed .internal directory');
        resolve(stdout || stderr);
      }
    });
  });
}

// endpoint for starting the community solid servers

app.get('/start-servers', async(req,res) => {
  try {

    
    // Check if servers are already running
    const ports = [process.env.PORT_ALICE, process.env.PORT_BOB, process.env.PORT_JANE];
    const portStatuses = await Promise.all(ports.map(port => checkPort(port)));
    const allPortsAvailable = portStatuses.every(status => status);
    if (allPortsAvailable) {
      console.log("Starting the community solid servers");
      exec(`bash ${process.env.PATH_TO_SERVER_SCRIPT}`, (error, stdout, stderr) => {
        if (error) {
          console.error('Error executing script:', error);
          return res.status(500).json({ success: false, message: 'Failed to start servers.' });
        }
        console.log('Servers started successfully');
        res.json({ success: true, message: 'Servers started successfully.' });
      });
    } else {
      res.status(400).json({ success: false, message: 'One or more ports are already in use.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
})




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


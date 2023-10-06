<h1 align="center">
  <br>
  ![Ladon Cloud Agent Logo](https://github.com/Simo56/LadonCloudAgent/blob/main/LadonLogo.png?raw=true)
  <br>
  Ladon Cloud Agent
  <br>
</h1>

<h4 align="center">An implementation of a HyperLedger Aries Cloud Agent</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#license">License</a>
</p>

## Key Features

<b>Cloud Agent Implementation</b>: Ladon Cloud Agent is built upon the Hyperledger Aries framework, delivering a powerful and adaptable cloud agent solution.

<b>Robust Security and Customization</b>: Enjoy the benefits of a secure and highly customizable agent setup that facilitates seamless interaction with Aries networks. Tailor your agent's behavior to meet your specific requirements.

<b>Module Integration</b>: Leveraging a diverse range of Aries modules, Ladon Cloud Agent empowers you with advanced features for DID management, connection establishment, and more. Seamlessly integrate these modules into your workflow.

<b>Verifiable Credentials Management</b>: Streamline the registration and administration of schemas, ensuring a hassle-free process for creating, validating, and managing verifiable credentials. Simplify your interaction with credential issuance and verification workflows.

## How To Use

To set up and run the Ladon Cloud Agent, follow these steps:

1. Clone this repository:
   ```bash
   $ git clone https://github.com/Simo56/LadonCloudAgent
   $ cd LadonCloudAgent
   ```
2. Install dependencies:

```bash
$ npm install
```

3. Create the appropriate configurationData.json file

4. Run the agent:

```bash
$ npm start
```

Note: For development mode, use npm start:dev.

## Configuration

Before running the agent, make sure to configure the necessary parameters in configurationData.json, including your endpoint URL, DID information, and other relevant settings.
This is an example of the configuration JSON file:

```
{
    "label": "Ladon Cloud Agent",
    "walletPassword": "<YOUR_PASSWORD>",
    "id": "Ladon Cloud Agent",
    "storageMethod": "postgres_storage",
    "connectionImageUrl": "https://ipfs.io/ipfs/QmQGTESg3BymZ7eQwppXfNXoS4YS5AVpmVHxxKD7VXtpXb?filename=LADON_CLOUDAGENT_PIXLR.COM.jpg",
    "agentPort": 3001,
    "seedPhrase24WordsKeplr": "<YOUR_SEED_PHRASE>",
    "cheqdNetwork": "testnet",
    "endpointURL": null,
    "DIDSeed": "<YOUR_DID_SEED>",
    "DID": "<YOUR_DID>",
    "DIDVerkey": "<YOUR_DID_VERKEY>"
}
```

## License

This project is licensed under the MIT License.

Created by Simone Pio Tosatto ·
GitHub @Simo56 ·

```
LadonCloudAgent
├─ nodemon.json
├─ package-lock.json
├─ package.json
├─ README.md
├─ tsconfig.json
├─ src
|  └─ public
|     └─ styles.css
│  ├─ app.ts
│  ├─ bc_ovrin.ts
│  ├─ configurationData.json
│  ├─ express.d.ts
│  ├─ GovernmentDigitalCredentialSchema.ts
│  ├─ index.ts
│  ├─ LadonCloudAgent.ts
│  └─ routes.ts
|
└─ views
   ├─ credential-issue.ejs
   ├─ index.ejs
   └─ proof-request.ejs

```

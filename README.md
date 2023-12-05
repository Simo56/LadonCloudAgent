<h1 align="center">
  <br>
  <img width="512" alt="LadonLogo" src="https://github.com/Simo56/LadonCloudAgent/assets/20564263/22c02a08-5ff9-4c09-b92a-8f581d18abc7">
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

## Why?
In the context of the growing significance of privacy, digital identity, and cybersecurity, I have developed "Ladon," an innovative agent for self-sovereign identity (SSI). This decentralized model of digital identity management leverages Hyperledger Aries and blockchain technology, incorporating distributed ledgers, asymmetric encryption, Zero-Knowledge Proofs (ZKPs), and Decentralized Identifiers (DIDs).

The project is implemented in TypeScript and is based on a Node.js web server with Express and npm. The approach focuses on the practical application of Hyperledger Aries technologies and their integration into the ecosystem. Throughout development, I adhered to best practices in digital identity management, decentralization, cybersecurity, and user control over their digital identity.

The thesis covers the fundamentals of digital identities, major innovations, comparisons with current methodologies, and an exploration of blockchain technology and Hyperledger Aries. Ladon's architecture, features, and its role in the blockchain-based self-sovereign identity space are examined.

This implementation contributes to understanding the potential of blockchain-based SSI, providing a practical example of technology application. It promotes user autonomy and control over their digital identity, emphasizing the key role of Hyperledger Aries in providing a robust and scalable framework for digital identity management in an increasingly decentralized era. This opens new possibilities for secure and private digital interactions based on blockchain technology.

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

import {
  Agent,
  ConsoleLogger,
  KeyDerivationMethod,
  LogLevel,
  HttpOutboundTransport,
  WsOutboundTransport,
  ConnectionsModule,
  DidsModule,
  OutOfBandRecord,
  ConnectionEventTypes,
  DidExchangeState,
  ConnectionStateChangedEvent,
  KeyDidResolver,
  TypedArrayEncoder,
  KeyType,
  AutoAcceptCredential,
  AutoAcceptProof,
  DidRecord,
  CredentialsModule,
  V2CredentialProtocol,
  ProofsModule,
  V2ProofProtocol,
  BasicMessagesModule,
} from "@aries-framework/core";
import { agentDependencies, HttpInboundTransport } from "@aries-framework/node";
import { AskarModule } from "@aries-framework/askar";
import { ariesAskar } from "@hyperledger/aries-askar-nodejs";
import { anoncreds } from "@hyperledger/anoncreds-nodejs";
import {
  AnonCredsCredentialFormatService,
  AnonCredsModule,
  AnonCredsProofFormatService,
  LegacyIndyCredentialFormatService,
  LegacyIndyProofFormatService,
} from "@aries-framework/anoncreds";
import { AnonCredsRsModule } from "@aries-framework/anoncreds-rs";
import { indyVdr } from "@hyperledger/indy-vdr-nodejs";
import {
  IndyVdrAnonCredsRegistry,
  IndyVdrIndyDidRegistrar,
  IndyVdrIndyDidResolver,
  IndyVdrModule,
} from "@aries-framework/indy-vdr";
import {
  CheqdAnonCredsRegistry,
  CheqdDidRegistrar,
  CheqdDidResolver,
  CheqdModule,
  CheqdModuleConfig,
} from "@aries-framework/cheqd";
import { connect } from "ngrok";
import { BCOVRIN_TEST_GENESIS } from "./bc_ovrin";
import * as initConfigurationData from "./configurationData.json";
import { governmentDigitalCredentialSchema } from "./GovernmentDigitalCredentialSchema";

class LadonCloudAgent {
  agent: Agent | undefined;
  outOfBandRecord: OutOfBandRecord | undefined;
  invitationUrl: string | undefined;
  // Add this property to store the credential definition id
  credentialDefinitionId: any;
  connectionIds: any;
  schemaId: any;
  schemaObject: any;

  constructor() {
    this.connectionIds = []; // Initialize an empty array to store connection IDs

    // Call the initialize method in the constructor
    this.initializeAgent().catch((error) => {
      console.error(
        "Error initializing LadonCloudAgent Inside CONSTRUCTOR:",
        error
      );
    });
  }

  async initializeAgent() {
    const config = await this.setupAgentConfiguration();

    this.agent = this.createAgentInstance(config);

    this.registerTransports();

    await this.initializeAgentInstance();

    await this.importDID();

    //this.printAllDIDs();

    await this.registerSchema();

    await this.registerCredentialDefinition();

    return this.agent;
  }

  async setupAgentConfiguration() {
    const endpoint =
      initConfigurationData.endpointURL ||
      (await connect(initConfigurationData.agentPort));

    return {
      publicDidSeed: initConfigurationData.DIDSeed,
      label: initConfigurationData.label,
      logger: new ConsoleLogger(LogLevel.info),
      connectionImageUrl: initConfigurationData.connectionImageUrl,
      walletConfig: {
        id: initConfigurationData.id,
        key: initConfigurationData.walletPassword,
        keyDerivationMethod: KeyDerivationMethod.Argon2IMod,
      },
      endpoints: [endpoint],
      autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
      autoAcceptProofs: AutoAcceptProof.ContentApproved,
    };
  }

  private createAgentInstance(config: any) {
    return new Agent({
      config,
      dependencies: agentDependencies,
      modules: {
        dids: new DidsModule({
          registrars: [
            /*new CheqdDidRegistrar(),*/ new IndyVdrIndyDidRegistrar(),
          ],
          resolvers: [
            /*new CheqdDidResolver(),*/
            new KeyDidResolver(),
            new IndyVdrIndyDidResolver(),
          ],
        }),
        anoncredsRs: new AnonCredsRsModule({
          anoncreds,
        }),
        anoncreds: new AnonCredsModule({
          // Here we add an Indy VDR registry as an example, any AnonCreds registry can be used
          registries: [
            /*new CheqdAnonCredsRegistry(),*/
            new IndyVdrAnonCredsRegistry(),
          ],
        }),
        indyVdr: new IndyVdrModule({
          indyVdr,
          networks: [
            {
              isProduction: false,
              indyNamespace: "bcovrin:test",
              genesisTransactions: BCOVRIN_TEST_GENESIS,
              connectOnStartup: true,
            },
          ],
        }),
        /*cheqd: new CheqdModule(
          new CheqdModuleConfig({
            networks: [
              {
                network: initConfigurationData.cheqdNetwork,
                cosmosPayerSeed: initConfigurationData.seedPhrase24WordsKeplr,
              },
            ],
          })
        ),*/
        credentials: new CredentialsModule({
          autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
          credentialProtocols: [
            new V2CredentialProtocol({
              credentialFormats: [
                new LegacyIndyCredentialFormatService(),
                new AnonCredsCredentialFormatService(),
              ],
            }),
          ],
        }),
        proofs: new ProofsModule({
          autoAcceptProofs: AutoAcceptProof.ContentApproved,
          proofProtocols: [
            new V2ProofProtocol({
              proofFormats: [
                new LegacyIndyProofFormatService(),
                new AnonCredsProofFormatService(),
              ],
            }),
          ],
        }),
        connections: new ConnectionsModule({ autoAcceptConnections: true }),
        basicMessages: new BasicMessagesModule(),
        askar: new AskarModule({ ariesAskar }),
      },
    });
  }

  private registerTransports() {
    this.agent?.registerOutboundTransport(new WsOutboundTransport());
    this.agent?.registerOutboundTransport(new HttpOutboundTransport());
    this.agent?.registerInboundTransport(
      new HttpInboundTransport({ port: initConfigurationData.agentPort })
    );
  }

  private async initializeAgentInstance() {
    try {
      await this.agent?.initialize();
      console.log("Agent initialized!");
    } catch (error) {
      console.error("Error initializing agent:", error);
      throw error;
    }
  }

  async importDID() {
    if (!this.agent) {
      throw new Error("Agent is not initialized.");
    }

    const seed = TypedArrayEncoder.fromString(initConfigurationData.DIDSeed); // What you input on bcovrin. Should be kept secure in production!
    const unqualifiedIndyDid = initConfigurationData.DID; // will be returned after registering seed on bcovrin
    const indyDid = `did:indy:bcovrin:test:${unqualifiedIndyDid}`;

    /*
    const cheqdDid = await this.agent.dids.create({
      method: "cheqd",
      secret: {
        verificationMethod: {
          id: "key-1",
          type: "Ed25519VerificationKey2020",
        },
      },
      options: {
        network: "testnet",
        methodSpecificIdAlgo: "uuid",
      },
    });
    */

    await this.agent.dids.import({
      did: indyDid,
      overwrite: true,
      privateKeys: [
        {
          privateKey: seed,
          keyType: KeyType.Ed25519,
        },
      ],
    });
  }

  async createInvitation() {
    if (!this.agent) {
      throw new Error("Agent is not initialized.");
    }

    this.outOfBandRecord = await this.agent.oob.createInvitation();

    return {
      invitationUrl: this.outOfBandRecord.outOfBandInvitation.toUrl({
        domain: "",
      }),
      outOfBandRecord: this.outOfBandRecord,
    };
  }

  setupConnectionListener(
    outOfBandRecord: OutOfBandRecord, // Add this parameter
    cb: () => void
  ) {
    if (!this.agent) {
      throw new Error("Agent is not initialized.");
    }
    if (!outOfBandRecord) {
      // Use the parameter here
      throw new Error("There is no outOfBandRecord initialized.");
    }
    if (!outOfBandRecord.id) {
      // Use the parameter here
      throw new Error("There is no outOfBandRecord id initialized.");
    }

    this.agent.events.on<ConnectionStateChangedEvent>(
      ConnectionEventTypes.ConnectionStateChanged,
      ({ payload }) => {
        if (!outOfBandRecord) {
          // Use the parameter here
          throw new Error("There is no outOfBandRecord initialized.");
        }
        if (!outOfBandRecord.id) {
          // Use the parameter here
          throw new Error("There is no outOfBandRecord id initialized.");
        }
        if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id) return;
        if (payload.connectionRecord.state === DidExchangeState.Completed) {
          console.log(
            `Connection for out-of-band id ${outOfBandRecord.id} completed`
          );

          // Store the connection ID in the array
          this.connectionIds.push(payload.connectionRecord.id);

          console.log("connections array content:");
          console.log(this.connectionIds);

          // Custom business logic can be included here
          // In this example we can send a basic message to the connection, but
          // anything is possible
          cb();
        }
      }
    );
  }

  async registerSchema() {
    try {
      if (!this.agent) {
        console.error("Agent is not initialized.");
        return;
      }

      // Check if the schema already exists
      this.schemaId =
        governmentDigitalCredentialSchema.issuerId +
        "/anoncreds/v0/SCHEMA/" +
        governmentDigitalCredentialSchema.name +
        "/" +
        governmentDigitalCredentialSchema.version;
      const existingSchema = await this.agent.modules.anoncreds.getSchema(
        this.schemaId
      );

      console.log(existingSchema);

      if (existingSchema && !existingSchema.resolutionMetadata.error) {
        console.log(`Schema with ID ${this.schemaId} already exists.`);
        this.schemaObject = existingSchema;
        return;
      }

      // Register the schema
      const schemaResult = await this.agent.modules.anoncreds.registerSchema({
        schema: governmentDigitalCredentialSchema,
        options: {},
      });

      if (schemaResult.schemaState.state === "failed") {
        throw new Error(schemaResult.schemaState.reason);
      }

      this.schemaObject = schemaResult;
      this.schemaId = schemaResult.schemaState.schemaId;
    } catch (error) {
      console.error("Error registering schema", error);
      throw error;
    }
  }

  async registerCredentialDefinition() {
    if (!this.agent) {
      console.error("Agent is not initialized.");
      return;
    }

    const issuerId =
      this.schemaObject.schema?.issuerId !== undefined
        ? this.schemaObject.schema.issuerId
        : this.schemaObject.schemaState?.schema.issuerId;

    // Register the credential definition if not already registered
    const credentialDefinitionResult =
      await this.agent.modules.anoncreds.registerCredentialDefinition({
        credentialDefinition: {
          tag: initConfigurationData.CredentialDefinitionTag,
          issuerId: issuerId,
          schemaId: this.schemaId,
        },
        options: {},
      });

    if (
      credentialDefinitionResult.credentialDefinitionState.state === "failed"
    ) {
      throw new Error(
        `Error creating credential definition: ${credentialDefinitionResult.credentialDefinitionState.reason}`
      );
    }

    // Store the credential definition id in the class property
    //this.credentialDefinitionId =
    //credentialDefinitionResult.credentialDefinitionState.credentialDefinitionId;

    this.credentialDefinitionId =
      credentialDefinitionResult.credentialDefinitionState.credentialDefinitionId;

    console.log(
      "Credential definition registered (simone) CredentialDefinitionID:",
      this.credentialDefinitionId
    );
    console.log("Credential Object:");
    console.log(credentialDefinitionResult);
  }

  async offerCredential(
    connectionId: string,
    fullName: string,
    address: string,
    dateOfBirth: string,
    governmentID: string,
    contactInfo: string
  ) {
    if (!this.agent) {
      console.error("Agent is not initialized.");
      return;
    }

    // Use the connectionId and attribute values to issue the credential
    const anonCredsCredentialExchangeRecord =
      await this.agent.credentials.offerCredential({
        connectionId: connectionId,
        protocolVersion: "v2",
        credentialFormats: {
          anoncreds: {
            attributes: [
              { name: "full_name", value: fullName },
              { name: "date_of_birth", value: dateOfBirth },
              { name: "address", value: address },
              { name: "government_id", value: governmentID },
              { name: "contact_info", value: contactInfo },
            ],
            credentialDefinitionId: this.credentialDefinitionId,
          },
        },
      });

    if (!anonCredsCredentialExchangeRecord) {
      console.log("Error offering credential");
      return;
    }

    // check the state of the credential exchange
    // and log appropriate messages or take further actions.

    console.log("Credential offer sent successfully");
    console.log(
      "Credential exchange ID:",
      anonCredsCredentialExchangeRecord.id
    );
    console.log(
      "Credential exchange state:",
      anonCredsCredentialExchangeRecord.state
    );
  }

  private async newProofAttribute() {
    const proofAttribute = {
      name: {
        name: "government_id",
        restrictions: [
          {
            cred_def_id: this.credentialDefinitionId,
          },
        ],
      },
    };

    return proofAttribute;
  }

  public async sendProofRequest(connectionId: string) {
    if (!this.agent) {
      console.error("Agent is not initialized.");
      return;
    }
    const proofAttribute = await this.newProofAttribute();
    await this.agent.proofs.requestProof({
      protocolVersion: "v2",
      connectionId: connectionId,
      proofFormats: {
        anoncreds: {
          name: "proof-request",
          version: "1.0",
          requested_attributes: proofAttribute,
        },
      },
    });
  }

  public async sendMessage(message: string, connectionId: string) {
    await this.agent?.basicMessages.sendMessage(connectionId, message);
  }

  async printAllDIDs() {
    if (!this.agent) {
      throw new Error("Agent is not initialized.");
    }

    const didRecords = await this.agent.dids.getCreatedDids();

    console.log("All DIDs:");
    for (const record of didRecords) {
      console.log(`DID: ${record.did}`);
      console.log(`Verkey: ${record.id}`);
      console.log(`Role: ${record.role}`);
      console.log(`Metadata: ${JSON.stringify(record.metadata)}`);
      console.log("------------");
    }
  }
}

export default LadonCloudAgent;

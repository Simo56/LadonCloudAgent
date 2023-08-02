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
} from "@aries-framework/core";
import { agentDependencies, HttpInboundTransport } from "@aries-framework/node";
import * as initConfigurationData from "./configurationData.json";
import { AskarModule } from "@aries-framework/askar";
import { ariesAskar } from "@hyperledger/aries-askar-nodejs";
import { anoncreds } from "@hyperledger/anoncreds-nodejs";
import { AnonCredsModule } from "@aries-framework/anoncreds";
import { AnonCredsRsModule } from "@aries-framework/anoncreds-rs";
import { connect } from "ngrok";
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
import { BCOVRIN_TEST_GENESIS } from "./bc_ovrin";

class LadonCloudAgent {
  agent: Agent | undefined;
  outOfBandRecord: OutOfBandRecord | undefined;
  invitationUrl: string | undefined;

  constructor() {
    // Call the initialize method in the constructor
    this.initializeAgent().catch((error) => {
      console.error("Error initializing LadonCloudAgent:", error);
    });
  }

  async initializeAgent() {
    const endpoint =
      initConfigurationData.endpointURL ??
      (await connect(initConfigurationData.agentPort));
    const config = {
      label: initConfigurationData.label,
      logger: new ConsoleLogger(LogLevel.info),
      connectionImageUrl: initConfigurationData.connectionImageUrl,
      walletConfig: {
        id: initConfigurationData.id,
        key: initConfigurationData.walletPassword,
        keyDerivationMethod: KeyDerivationMethod.Argon2IMod,
      },
      endpoints: [endpoint],
    };

    this.agent = new Agent({
      config,
      modules: {
        dids: new DidsModule({
          registrars: [new CheqdDidRegistrar(), new IndyVdrIndyDidRegistrar()],
          resolvers: [
            new CheqdDidResolver(),
            new KeyDidResolver(),
            new IndyVdrIndyDidResolver(),
          ],
        }),
        anoncredsRs: new AnonCredsRsModule({
          anoncreds,
        }),
        anoncreds: new AnonCredsModule({
          // Here we add an Indy VDR registry as an example, any AnonCreds registry
          // can be used
          registries: [
            new CheqdAnonCredsRegistry(),
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
        // Add cheqd module
        cheqd: new CheqdModule(
          new CheqdModuleConfig({
            networks: [
              {
                network: initConfigurationData.cheqdNetwork,
                cosmosPayerSeed: initConfigurationData.seedPhrase24WordsKeplr,
              },
            ],
          })
        ),
        connections: new ConnectionsModule({ autoAcceptConnections: true }),
        // Register the Askar module on the agent
        askar: new AskarModule({ ariesAskar }),
      },
      dependencies: agentDependencies,
    });

    // Register a simple `WebSocket` outbound transport
    this.agent.registerOutboundTransport(new WsOutboundTransport());

    // Register a simple `Http` outbound transport
    this.agent.registerOutboundTransport(new HttpOutboundTransport());

    // Register a simple `Http` inbound transport
    this.agent.registerInboundTransport(
      new HttpInboundTransport({ port: initConfigurationData.agentPort })
    );

    try {
      // Initialize the agent
      await this.agent?.initialize();
      console.log("Agent initialized!");

      // Rest of your existing initialization logic
    } catch (error) {
      console.error("Error initializing agent:", error);
      throw error;
    }

    // Create and import the DID
    const seed = TypedArrayEncoder.fromString(initConfigurationData.DIDSeed);
    const unqualifiedIndyDid = initConfigurationData.DID;
    const indyDid = `did:indy:bcovrin:test:${unqualifiedIndyDid}`;

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
    return this.agent;
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

          // Custom business logic can be included here
          // In this example we can send a basic message to the connection, but
          // anything is possible
          cb();

          process.exit(0);
        }
      }
    );
  }
}

export default LadonCloudAgent;

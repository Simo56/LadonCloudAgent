import {
  Agent,
  ConsoleLogger,
  KeyDerivationMethod,
  InitConfig,
  LogLevel,
  HttpOutboundTransport,
  WsOutboundTransport,
  ConnectionsModule,
  DidsModule,
  OutOfBandRecord,
  ConnectionEventTypes,
  DidExchangeState,
  ConnectionStateChangedEvent,
} from "@aries-framework/core";
import { agentDependencies, HttpInboundTransport } from "@aries-framework/node";
import * as initConfigurationData from "./configurationData.json";
import { AskarModule } from "@aries-framework/askar";
import { ariesAskar } from "@hyperledger/aries-askar-nodejs";
import { anoncreds } from "@hyperledger/anoncreds-nodejs";
import { AnonCredsModule } from "@aries-framework/anoncreds";
import { AnonCredsRsModule } from "@aries-framework/anoncreds-rs";

import {
  CheqdAnonCredsRegistry,
  CheqdDidRegistrar,
  CheqdDidResolver,
  CheqdModule,
  CheqdModuleConfig,
} from "@aries-framework/cheqd";

const initializeCloudAgent = async () => {
  const config: InitConfig = {
    label: initConfigurationData.label,
    logger: new ConsoleLogger(LogLevel.info),
    connectionImageUrl: initConfigurationData.connectionImageUrl,
    walletConfig: {
      id: initConfigurationData.id,
      key: initConfigurationData.walletPassword,
      keyDerivationMethod: KeyDerivationMethod.Argon2IMod,
    },
    //endpoints: ["http://localhost:" + initConfigurationData.agentPort],
  };

  const agent = new Agent({
    config,
    modules: {
      dids: new DidsModule({
        registrars: [new CheqdDidRegistrar()],
        resolvers: [new CheqdDidResolver()],
      }),
      anoncredsRs: new AnonCredsRsModule({
        anoncreds,
      }),
      anoncreds: new AnonCredsModule({
        // Here we add an Indy VDR registry as an example, any AnonCreds registry
        // can be used
        registries: [new CheqdAnonCredsRegistry()],
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
  agent.registerOutboundTransport(new WsOutboundTransport());

  // Register a simple `Http` outbound transport
  agent.registerOutboundTransport(new HttpOutboundTransport());

  // Register a simple `Http` inbound transport
  agent.registerInboundTransport(
    new HttpInboundTransport({ port: initConfigurationData.agentPort })
  );

  // Initialization of the agent
  await agent
    .initialize()
    .then(async () => {
      console.log("Agent initialized!");
    })
    .catch((e) => {
      console.error(
        `Something went wrong while setting up the agent! Message: ${e}`
      );
    });

  return { agent: agent};
};

const createNewInvitation = async (agent: Agent) => {
  const outOfBandRecord = await agent.oob.createInvitation();

  return {
    invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({ domain: "" }),
    outOfBandRecord: outOfBandRecord,
  };
};

const setupConnectionListener = (
  agent: Agent,
  outOfBandRecord: OutOfBandRecord,
  cb: (...args: any) => void
) => {
  agent.events.on<ConnectionStateChangedEvent>(
    ConnectionEventTypes.ConnectionStateChanged,
    ({ payload }) => {
      if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id) return;
      if (payload.connectionRecord.state === DidExchangeState.Completed) {
        // the connection is now ready for usage in other protocols!
        console.log(
          `Connection for out-of-band id ${outOfBandRecord.id} completed`
        );

        // Custom business logic can be included here
        // In this example, we can send a basic message to the connection, but anything is possible
        cb();

        // We exit the flow
        process.exit(0);
      }
    }
  );
};

export { initializeCloudAgent, createNewInvitation, setupConnectionListener }; // Export the functions so it can be used in other files

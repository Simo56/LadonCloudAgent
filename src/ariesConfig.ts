import { Agent, ConsoleLogger, KeyDerivationMethod, InitConfig, LogLevel, HttpOutboundTransport, WsOutboundTransport, ConnectionsModule } from '@aries-framework/core'
import { agentDependencies, HttpInboundTransport  } from '@aries-framework/node'
import * as initConfigurationData from "./initConfigurationData.json";
import { AskarModule } from '@aries-framework/askar'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'

const initializeCloudAgent = async () => {
  const config: InitConfig = {
    label: 'ladonCloudAgent',
    logger: new ConsoleLogger(LogLevel.info),
    connectionImageUrl: initConfigurationData.connectionImageUrl,
    walletConfig: {
      id: initConfigurationData.id,
      key: initConfigurationData.walletPassword,
      keyDerivationMethod: KeyDerivationMethod.Argon2IMod
    },
    endpoints: ['http://localhost:' + initConfigurationData.agentPort],
  }
  
  const agent = new Agent({
    config,
    dependencies: agentDependencies,
    modules: {
      // Register the Askar module on the agent
      askar: new AskarModule({ ariesAskar }),
      connections: new ConnectionsModule({ autoAcceptConnections: true }),
    },
  })
  
  // Register a simple `WebSocket` outbound transport
  agent.registerOutboundTransport(new WsOutboundTransport())
  
  // Register a simple `Http` outbound transport
  agent.registerOutboundTransport(new HttpOutboundTransport())
  
  // Register a simple `Http` inbound transport
  agent.registerInboundTransport(new HttpInboundTransport({ port: initConfigurationData.agentPort }))
  
  //initialization of the agent
  agent
    .initialize()
    .then(() => {
      console.log('Agent initialized!');
    })
    .catch((e) => {
      console.error(`Something went wrong while setting up the agent! Message: ${e}`)
    })

  return agent
}

export { initializeCloudAgent }; // Export the function so it can be used in other files

import type { InitConfig } from '@aries-framework/core'
import { Agent } from '@aries-framework/core'
import { agentDependencies } from '@aries-framework/node'
import { KeyDerivationMethod } from '@aries-framework/core'
import * as initConfigurationData from "./initConfigurationData.json";



const config: InitConfig = {
  label: 'ladonCloudAgent',
  walletConfig: {
    id: initConfigurationData.id,
    key: initConfigurationData.walletPassword,
    keyDerivationMethod: KeyDerivationMethod.Argon2IMod,
    storage: {
        type: initConfigurationData.storageMethod,
  }
  },
}

const agent = new Agent({
  config,
  dependencies: agentDependencies,
})

export default agent;
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCloudAgent = void 0;
const core_1 = require("@aries-framework/core");
const node_1 = require("@aries-framework/node");
const initConfigurationData = __importStar(require("./initConfigurationData.json"));
const askar_1 = require("@aries-framework/askar");
const aries_askar_nodejs_1 = require("@hyperledger/aries-askar-nodejs");
const initializeCloudAgent = () => __awaiter(void 0, void 0, void 0, function* () {
    const config = {
        label: 'ladonCloudAgent',
        logger: new core_1.ConsoleLogger(core_1.LogLevel.info),
        connectionImageUrl: initConfigurationData.connectionImageUrl,
        walletConfig: {
            id: initConfigurationData.id,
            key: initConfigurationData.walletPassword,
            keyDerivationMethod: core_1.KeyDerivationMethod.Argon2IMod,
            storage: {
                type: initConfigurationData.storageMethod,
            }
        },
        endpoints: ['http://localhost:' + initConfigurationData.agentPort],
    };
    const agent = new core_1.Agent({
        config,
        dependencies: node_1.agentDependencies,
        modules: {
            // Register the Askar module on the agent
            askar: new askar_1.AskarModule({ ariesAskar: aries_askar_nodejs_1.ariesAskar }),
            connections: new core_1.ConnectionsModule({ autoAcceptConnections: true }),
        },
    });
    // Register a simple `WebSocket` outbound transport
    agent.registerOutboundTransport(new core_1.WsOutboundTransport());
    // Register a simple `Http` outbound transport
    agent.registerOutboundTransport(new core_1.HttpOutboundTransport());
    // Register a simple `Http` inbound transport
    agent.registerInboundTransport(new node_1.HttpInboundTransport({ port: initConfigurationData.agentPort }));
    //initialization of the agent
    agent
        .initialize()
        .then(() => {
        console.log('Agent initialized!');
    })
        .catch((e) => {
        console.error(`Something went wrong while setting up the agent! Message: ${e}`);
    });
    return agent;
});
exports.initializeCloudAgent = initializeCloudAgent;

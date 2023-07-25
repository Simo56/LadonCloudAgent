"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const ariesConfig_1 = require("./ariesConfig"); // Import the agent configuration
class App {
    constructor() {
        this.server = (0, express_1.default)();
        this.middlewares();
        this.routes();
    }
    //used to perform various tasks and operations on incoming requests before they reach the route handlers
    //You can add additional middleware functions to perform tasks such as authentication, logging, error handling, request validation, and more.
    middlewares() {
        return __awaiter(this, void 0, void 0, function* () {
            this.server.use(express_1.default.json());
            //initialize the cloud agent
            try {
                // Initialize the cloud agent
                const agent = yield (0, ariesConfig_1.initializeCloudAgent)();
                console.log('Agent initialized!');
                // Now you have access to the initialized agent and can use it as needed.
                // For example, you can pass the agent to route handlers or use it for agent interactions.
                // Example: Pass the agent to route handlers
                this.server.use((req, res, next) => {
                    req.agent = agent;
                    next();
                });
            }
            catch (error) {
                console.error('Error initializing agent:', error);
                // Handle initialization error if needed
            }
        });
    }
    routes() {
        this.server.use(routes_1.default);
    }
}
exports.default = new App().server;

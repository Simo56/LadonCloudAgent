import express from "express";
import { Express } from "express";
import routes from "./routes";
import { initializeCloudAgent } from "./ariesConfig"; // Import the agent configuration

class App {
  public server: Express;

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  //used to perform various tasks and operations on incoming requests before they reach the route handlers
  //You can add additional middleware functions to perform tasks such as authentication, logging, error handling, request validation, and more.
  async middlewares() {
    this.server.use(express.json());

    try {
      // Initialize the cloud agent
      const agent = await initializeCloudAgent();
      console.log('Agent initialized!');

      // Now you have access to the initialized agent and can use it as needed.
      // For example, you can pass the agent to route handlers or use it for agent interactions.

      // Example: Pass the agent to route handlers
      this.server.use((req, res, next) => {
        req.agent = agent;
        next();
      });
    } catch (error) {
      console.error('Error initializing agent:', error);
      // Handle initialization error if needed
    }

  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
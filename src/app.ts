import express from "express";
import { Express } from "express";
import routes from "./routes";
import { initializeCloudAgent } from "./agentMethods"; // Import the agent configuration

class App {
  public server: Express;

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  // Used to perform various tasks and operations on incoming requests before they reach the route handlers
  // You can add additional middleware functions to perform tasks such as authentication, logging, error handling, request validation, and more.
  async middlewares() {
    this.server.use(express.json());

    this.server.use(async (req, res, next) => {
      try {
        // Initialize the cloud agent and Pass the agent to route handlers
        req.agent = await initializeCloudAgent();
        next();
      } catch (error) {
        console.error("Error initializing the agent:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });

  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
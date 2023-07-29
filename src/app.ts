import express from "express";
import { Express } from "express";
import routes from "./routes";
import { initializeCloudAgent } from "./agentMethods"; // Import the agent configuration
import { Agent } from "@aries-framework/core";

class App {
  public server: Express;
  // Declares a private class property called agentPromise, which will hold a promise that resolves to the initialized agent.
  // It starts with an initial value of null, indicating that the agent has not been initialized yet.
  private agentPromise: Promise<{agent: Agent}> | null = null; // Store the agent promise and the qrCodeData

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  // Used to perform various tasks and operations on incoming requests before they reach the route handlers
  // You can add additional middleware functions to perform tasks such as authentication, logging, error handling, request validation, and more.
  async middlewares() {
    this.server.use(express.json());

    this.server.use(express.json());

  this.server.use(async (req, res, next) => {
    try {
      if (!this.agentPromise) {
        this.agentPromise = initializeCloudAgent(); // Store the promise in the class property
        console.log("Agent is being initialized...");
      }
      const { agent } = await this.agentPromise;
      req.agent = agent;
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

import express from "express";
import { Express } from "express";
import routes from "./routes";
import LadonCloudAgent from "./LadonCloudAgent";
import cors from 'cors';

class App {
  public server: Express;
  private agentInstance: LadonCloudAgent | null = null; // Store the LadonCloudAgent instance

  constructor() {
    this.server = express();
    this.middlewares();
    this.agentInstance = new LadonCloudAgent();
    this.routes();
  }

  async middlewares() {
    const corsOptions = {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      optionsSuccessStatus: 204,
    };

    this.server.use(cors(corsOptions));

    this.server.use(express.json());

    this.server.use(async (req, res, next) => {
      try {
        if (!this.agentInstance) {
          // Create a new instance of LadonCloudAgent and initialize it
          this.agentInstance = new LadonCloudAgent();
          //await this.agentInstance.initializeAgent();
          console.log("Agent is initialized.");
        }

        // Set the agent instance on the request object
        req.agentInstance = this.agentInstance;

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



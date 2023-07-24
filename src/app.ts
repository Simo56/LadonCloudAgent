import express from "express";
import { Express } from "express";
import routes from "./routes";
import agent from "./ariesConfig"; // Import the agent configuration

class App {
  public server: Express;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  //used to perform various tasks and operations on incoming requests before they reach the route handlers
  //You can add additional middleware functions to perform tasks such as authentication, logging, error handling, request validation, and more.
  middlewares() {
    this.server.use(express.json());

  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
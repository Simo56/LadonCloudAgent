import { Agent } from "@aries-framework/core";
import { Router, Request, Response } from "express";
import path from "path";

const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  // Check if req.agent and req.qrCodeDataURL are defined
  if (!req.agent || !req.qrCodeDataURL) {
    // If they're not defined, handle the situation accordingly
    return res
      .status(400)
      .json({ error: "Agent or QR Code Data URL not available" });
  }

  const agent: Agent = req.agent;
  const qrCodeDataURL: string = req.qrCodeDataURL;

  // Now you can use the agent to perform specific actions
  // For example, you can initiate a connection with another Aries agent.
  // Example: await agent.connections.createConnection(...);

  // Data to be passed to the rendered template
  const renderedData = {
    agentIsInitialized: agent.isInitialized,
    qrCodeDataURL: qrCodeDataURL,
  };

  // Use the 'res.render()' method to send the 'index.ejs' file as the response
  // Provide the correct path to the 'views' folder relative to the project's root
  // Pass the data object as the second argument to the 'res.render()' method
  res.render(path.join(__dirname, "../views/index.ejs"), renderedData);
});

export default routes;

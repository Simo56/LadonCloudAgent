import { Agent } from "@aries-framework/core";
import { Router, Request, Response } from "express";
import path from "path";
import { createNewInvitation, setupConnectionListener } from "./agentMethods"
import qrcode from "qrcode";

const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  // Check if req.agent and req.qrCodeDataURL are defined
  if (!req.agent) {
    // If they're not defined, handle the situation accordingly
    return res
      .status(400)
      .json({ error: "Agent not available" });
  }

  const agent: Agent = req.agent;

  // Now you can use the agent to perform specific actions
  // For example, you can initiate a connection with another Aries agent.
  // Example: await agent.connections.createConnection(...);

  // Data to be passed to the rendered template
  const renderedData = {
    agentIsInitialized: agent.isInitialized,
  };

  // Use the 'res.render()' method to send the 'index.ejs' file as the response
  // Provide the correct path to the 'views' folder relative to the project's root
  // Pass the data object as the second argument to the 'res.render()' method
  res.render(path.join(__dirname, "../views/index.ejs"), renderedData);
});

routes.get("/generateQRCode", async (req, res) => {
  try {
    // Check if req.agent is defined
    if (!req.agent) {
      return res.status(400).json({ error: "Agent not available" });
    }

    // Create a new invitation using the agent
    const { invitationUrl, outOfBandRecord } = await createNewInvitation(req.agent);

    // Generate a QR code from the invitation URL
    const qrCodeDataURL = await qrcode.toDataURL(invitationUrl);

    setupConnectionListener(req.agent, outOfBandRecord, () =>
    console.log('We now have an active connection to use in the following tutorials')
  )
    // Send the QR code data URL as the response
    res.json({ qrCodeDataURL });
  } catch (error) {
    console.error("Error creating invitation:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
export default routes;

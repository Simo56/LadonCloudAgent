import { Router, Request, Response } from "express";
import path from "path";
import qrcode from "qrcode";

const routes = Router();

routes.get("/", async (req: Request, res: Response) => {
  try {
    const cloudAgent = req.agentInstance;

    // Data to be passed to the rendered template
    const renderedData = {
      agentIsInitialized: cloudAgent?.agent?.isInitialized ?? false,
    };

    // Use the 'res.render()' method to send the 'index.ejs' file as the response
    // Provide the correct path to the 'views' folder relative to the project's root
    // Pass the data object as the second argument to the 'res.render()' method
    res.render(path.join(__dirname, "../views/index.ejs"), renderedData);
  } catch (error) {
    console.error("Error initializing agent:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

routes.get("/generateQRCode", async (req, res) => {
  try {
    const cloudAgent = req.agentInstance;

    // Create a new invitation using the agent
    const invitationData = await cloudAgent?.createInvitation();

    if (!invitationData) {
      return res.status(500).json({ error: "Failed to create invitation" });
    }

    const { invitationUrl, outOfBandRecord } = invitationData;

    // Generate a QR code from the invitation URL
    const qrCodeDataURL = await qrcode.toDataURL(invitationUrl);

    cloudAgent?.setupConnectionListener(outOfBandRecord, () =>
      console.log(
        "We now have an active connection to use in the following tutorials"
      )
    );

    // Send the QR code data URL as the response
    res.json({ qrCodeDataURL });
  } catch (error) {
    console.error("Error creating invitation:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default routes;
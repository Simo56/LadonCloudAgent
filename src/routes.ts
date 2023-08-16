import { Router, Request, Response } from "express";
import qrcode from "qrcode";

const routes = Router();

routes.get("/", async (req: Request, res: Response) => {
  try {
    const cloudAgent = req.agentInstance;

    // Data to be passed to the rendered template
    const renderedData = {
      agentIsInitialized: cloudAgent?.agent?.isInitialized ?? false,
    };
    console.log("cloudAgent?.credentialDefinitionId: -------------")
    console.log(cloudAgent?.credentialDefinitionId)
    // Use the 'res.render()' method to send the 'index.ejs' file as the response
    // Provide the correct path to the 'views' folder relative to the project's root
    // Pass the data object as the second argument to the 'res.render()' method
    res.render("index.ejs", renderedData);
  } catch (error) {
    console.error("Error initializing agent:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

routes.get("/credential-issue-endpoint", (req, res) => {
  try {
    // Retrieve the list of connections
    const connections = req.agentInstance?.connectionIds;
    // Render the credential-issue.ejs template and pass the connections data
    res.render("credential-issue.ejs", { connections });
  } catch (error) {
    console.error("Error rendering credential-issue:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

routes.get("/generateDynamicQRCode", async (req, res) => {
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

    // Set up the connection listener for the new out-of-band record
    cloudAgent?.setupConnectionListener(outOfBandRecord, () => {
      console.log(
        "We now have an active connection"
      );
    });

    // Send the QR code data URL as the response
    res.json({ qrCodeDataURL });
  } catch (error) {
    console.error("Error creating dynamic invitation:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

routes.post("/issue-credential-from-ejs-form", async (req, res) => {
  try {
    const cloudAgent = req.agentInstance;
    const connectionId = req.body.connectionId;
    const fullName = req.body.fullName;
    const address = req.body.address;
    const dateOfBirth = req.body.dateOfBirth;
    const governmentID = req.body.governmentID;
    const contactInfo = req.body.contactInfo;


    console.log(cloudAgent?.agent?.credentials.offerCredential)

    // Use the connectionId and attribute values to issue the credential
    const anonCredsCredentialExchangeRecord =
      await cloudAgent?.agent?.credentials.offerCredential({
        connectionId: connectionId,
        protocolVersion: "v2",
        credentialFormats: {
          anoncreds: {
            attributes: [
              { name: "full_name", value: fullName },
              { name: "date_of_birth", value: dateOfBirth },
              { name: "address", value: address },
              { name: "government_id", value: governmentID },
              { name: "contact_info", value: contactInfo },
            ],
            credentialDefinitionId: cloudAgent?.credentialDefinitionId,
          },
        },
      });

    if (!anonCredsCredentialExchangeRecord) {
      return res.status(500).json({ error: "Failed to offer credential" });
    }

    // check the state of the credential exchange
    // and log appropriate messages or take further actions.

    console.log("Credential offer sent successfully");
    console.log(
      "Credential exchange ID:",
      anonCredsCredentialExchangeRecord.id
    );
    console.log(
      "Credential exchange state:",
      anonCredsCredentialExchangeRecord.state
    );

    res.redirect("/"); // Redirect back to the main page
  } catch (error) {
    console.error("Error issuing credential:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default routes;

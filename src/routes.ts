import { Router, Request, Response } from "express";

const routes = Router();

routes.get('/', (req: Request, res: Response) => {
  //const agent: Agent = req.agent;
  // Now you can use the agent to perform specific actions
  // For example, you can initiate a connection with another Aries agent.
  // Example: await agent.connections.createConnection(...);

  return res.json({ message: 'Hello World' });
});

export default routes; 
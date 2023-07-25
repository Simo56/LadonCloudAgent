"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes = (0, express_1.Router)();
routes.get('/', (req, res) => {
    //const agent: Agent = req.agent;
    // Now you can use the agent to perform specific actions
    // For example, you can initiate a connection with another Aries agent.
    // Example: await agent.connections.createConnection(...);
    return res.json({ message: 'Hello World' });
});
exports.default = routes;

import app from './app';
import * as initConfigurationData from "./initConfigurationData.json";

const PORT = 3333;

app.listen(PORT);

console.log("Server in ascolto sulla porta: " + PORT);
console.log("Agent in ascolto sulla porta: " + initConfigurationData.agentPort);
console.log("SIAMO SU LOCALHOST!!");
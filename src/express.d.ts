import { Agent } from '@aries-framework/core';
import LadonCloudAgent from './LadonCloudAgent';

export { }
declare global {
  namespace Express {
    export interface Request {
      agentInstance?: LadonCloudAgent;
    }
  }
}

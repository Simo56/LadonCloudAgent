import { Agent } from '@aries-framework/core';

export {}
declare global {
  namespace Express {
    export interface Request {
      agent?: Agent;
      qrCodeDataURL?: string;
    }
  }
}

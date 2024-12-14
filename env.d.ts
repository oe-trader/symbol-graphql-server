declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Required
      NODE_URL: string;
      SCHEMA_PATH: string;

      // Optional
      PORT?: string;
      HOST?: string;
      API_TIMEOUT?: string;
      MAX_REQUESTS?: string;
      TIME_WINDOW?: string;
      CORS_ORIGIN?: string;
      CORS_CREDENTIALS?: string;
    }
  }
}

export {};

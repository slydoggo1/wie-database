import dotenv from 'dotenv';

dotenv.config();

declare var process: {
  env: {
    PORT: number;
    FIREBASE_CONFIG_BASE64: string;
    EMAIL_USER: string;
    EMAIL_PASSWORD: string;
    FRONTEND_URL: string;
    ALGOLIA_ADMIN_API: string;
    ALGOLIA_APP_ID: string;
    ALGOLIA_SEARCH_KEY: string;
    ALGOLIA_USAGE_KEY: string;
    ALGOLIA_ENGINEER_INDEX: string;
    FIREBASE_STORAGE_BUCKET: string;
    FB_AUTH_API_KEY: string;
    FB_AUTH_AUTH_DOMAIN: string;
    FB_AUTH_PROJECT_ID: string;
    FB_AUTH_APP_ID: string;
  };
};

const PORT = process.env.PORT || 8000;
const FIREBASE_CONFIG_BASE64 = process.env.FIREBASE_CONFIG_BASE64;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const FRONTEND_URL = process.env.FRONTEND_URL;
const ALGOLIA_ADMIN_API = process.env.ALGOLIA_ADMIN_API;
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_SEARCH_KEY = process.env.ALGOLIA_SEARCH_KEY;
const ALGOLIA_USAGE_KEY = process.env.ALGOLIA_USAGE_KEY;
const ALGOLIA_ENGINEER_INDEX = process.env.ALGOLIA_ENGINEER_INDEX;
const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;
const FB_AUTH_API_KEY = process.env.FB_AUTH_API_KEY;
const FB_AUTH_AUTH_DOMAIN = process.env.FB_AUTH_AUTH_DOMAIN;
const FB_AUTH_PROJECT_ID = process.env.FB_AUTH_PROJECT_ID;
const FB_AUTH_APP_ID = process.env.FB_AUTH_APP_ID;

export default {
  FIREBASE_CONFIG_BASE64,
  PORT,
  EMAIL_USER,
  EMAIL_PASSWORD,
  FRONTEND_URL,
  ALGOLIA_ADMIN_API,
  ALGOLIA_APP_ID,
  ALGOLIA_SEARCH_KEY,
  ALGOLIA_USAGE_KEY,
  ALGOLIA_ENGINEER_INDEX,
  FIREBASE_STORAGE_BUCKET,
  FB_AUTH_API_KEY,
  FB_AUTH_AUTH_DOMAIN,
  FB_AUTH_PROJECT_ID,
  FB_AUTH_APP_ID,
};

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import Config from '../configs/globalConfig';

const firebaseConfig = {
  apiKey: Config.FB_AUTH_API_KEY,
  authDomain: Config.FB_AUTH_AUTH_DOMAIN,
  projectId: Config.FB_AUTH_PROJECT_ID,
  appId: Config.FB_AUTH_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

import express, { Express, Request, Response, Application } from 'express';
import admin from 'firebase-admin';
import Config from './configs/globalConfig';
import cors from 'cors';
import appRoutes from './routes/appRoutes';

const serverless = require('serverless-http');

const app: Application = express();
app.use(cors());
const port = Config.PORT;

//initialising firebase
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(Buffer.from(Config.FIREBASE_CONFIG_BASE64, 'base64').toString('ascii'))),
  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
});

//export const firebaseAdmin = admin;

// app.use('/.netlify/functions/api', appRoutes);
// module.exports.handler = serverless(app);

// for auth related features use admin.auth()
// for storage related features use admin.storage()
// for firestore/db related features use admin.firestore()

// Define the middleware to set the Access-Control-Expose-Headers
app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Expose-Headers', 'Totalpages');
  next();
});

app.use('/', appRoutes);
app.listen(port, () => {
  console.log(`Server is working at http://localhost:${port}`);
});

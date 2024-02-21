"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const globalConfig_1 = __importDefault(require("../dist/configs/globalConfig"));
const cors_1 = __importDefault(require("cors"));
const appRoutes_1 = __importDefault(require("../dist/routes/appRoutes"));
var bodyparser = require("body-parser");
var jsonParser = bodyparser.json();
const serverless = require('serverless-http');
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const port = globalConfig_1.default.PORT;
//initialising firebase
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(JSON.parse(Buffer.from(globalConfig_1.default.FIREBASE_CONFIG_BASE64, "base64").toString("ascii"))),
    storageBucket: globalConfig_1.default.FIREBASE_STORAGE_BUCKET,
});

app.use((req, res, next) => {
    res.header('Access-Control-Expose-Headers', 'Totalpages');
    next();
});

app.use('/.netlify/functions/api', appRoutes_1.default);
module.exports.handler = serverless(app);
// for auth related features use admin.auth()
// for storage related features use admin.storage()
// for firestore/db related features use admin.firestore()
// app.use("/", appRoutes);
// app.listen(port, () => {
//   console.log(`Server is working at http://localhost:${port}`);
// });

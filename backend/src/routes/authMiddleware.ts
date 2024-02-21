import admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';

const HTTP_UNAUTHORISED = 401;

/*
 * auth middleware for logged in users
 */
export default async function auth(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.headers.authorization) {
    res.sendStatus(HTTP_UNAUTHORISED);
  } else {
    const idToken = req.headers.authorization.split(' ')[1];

    try {
      const token = await admin.auth().verifyIdToken(idToken);
      const { uid } = token;
      req.body = req.body || {};
      req.body.uid = uid;
      next();
    } catch (error) {
      console.log(error);
      res.sendStatus(HTTP_UNAUTHORISED);
    }
  }
}

/*
 * auth middleware for logged in admins
 */
export async function adminAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.headers.authorization) {
    res.sendStatus(HTTP_UNAUTHORISED);
  } else {
    const idToken = req.headers.authorization.split(' ')[1];

    try {
      const token = await admin.auth().verifyIdToken(idToken);
      if (token.admin !== true) {
        console.log('User is not an admin.');
        res.sendStatus(HTTP_UNAUTHORISED);
        return;
      }

      // Allow access to requested admin resource.
      const { uid } = token;
      req.body = req.body || {};
      req.body.uid = uid;
      next();
    } catch (error) {
      console.log(error);
      res.sendStatus(HTTP_UNAUTHORISED);
    }
  }
}

/*
 * auth middleware for logged in engineers
 */
export async function engineerAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.headers.authorization) {
    res.sendStatus(HTTP_UNAUTHORISED);
  } else {
    const idToken = req.headers.authorization.split(' ')[1];

    try {
      const token = await admin.auth().verifyIdToken(idToken);
      if (token.engineer !== true) {
        console.log('User is not an engineer.');
        res.sendStatus(HTTP_UNAUTHORISED);
        return;
      }

      // Allow access to requested engineer resource.
      const { uid } = token;
      req.body = req.body || {};
      req.body.uid = uid;
      next();
    } catch (error) {
      console.log(error);
      res.sendStatus(HTTP_UNAUTHORISED);
    }
  }
}

module.exports = {
  auth,
  adminAuth,
  engineerAuth,
};

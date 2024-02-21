import admin from 'firebase-admin';
import { firebaseAuth } from '../configs/firebaseClientConfig';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

/**
 * get user token for testing
 * @param id
 * @returns 200 status code and message
 * @throws 500 if an unknown error occurs
 */
export async function getUserToken(id: string): Promise<{ status: number; message: string; token?: string }> {
  try {
    const userRecord = await admin.auth().getUser(id);
    const token = await admin.auth().createCustomToken(userRecord.uid);

    return { status: 200, message: 'User token retrieved successfully', token: token };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'Unknown error' };
    }
  }
}

/**
 * change user claim for testing
 * @param id
 * @param userType
 * @returns 200 status code and message
 * @throws 500 if an unknown error occurs
 */
export async function changeUserClaim(id: string, userType: string): Promise<{ status: number; message: string }> {
  try {
    await admin.auth().setCustomUserClaims(id, { userType: true });
    return { status: 200, message: 'User claim changed successfully' };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'Unknown error' };
    }
  }
}

/**
 * testing send password reset email to user
 * @param id
 * @returns 200 status code and message
 * @throws 500 if an unknown error occurs
 */
export async function testingClientSideEmail(id: string): Promise<{ status: number; message: string }> {
  try {
    const userRecord = await admin.auth().getUser(id);
    const email = userRecord.email;
    if (!email) {
      return { status: 500, message: 'User does not have an email' };
    }

    await sendPasswordResetEmail(firebaseAuth, email);
    return { status: 200, message: 'Email sent' };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'Unknown error' };
    }
  }
}

module.exports = {
  getUserToken,
  changeUserClaim,
  testingClientSideEmail,
};

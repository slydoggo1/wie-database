import admin from 'firebase-admin';
import { UserDAO, Role, UserSortByOptions } from '../dao/user.dao';
import { UserProfileDTO } from '../dto/user.dto';
import { GetAllUsersDTO } from '../dto/user.dto';
import { SendEmail } from '../services/mailservice';
import Config from '../configs/globalConfig';
import { UserFeedbackDAO } from '../dao/feedback.dao';
import { AllUserFeedbackDTO, UserFeedbackDTO } from '../dto/feedback.dto';
import { Timestamp } from '@google-cloud/firestore';
import { EngineerCardDTO } from '../dto/engineer.dto';
import { firebaseAuth } from '../configs/firebaseClientConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
const engineerController = require('./engineers.controller');

/**
 * updates the user in the firestore database when signing up
 * only for teachers and students
 * @param uid
 * @param firstName
 * @param lastName
 * @param email
 * @param school
 * @param role
 * @returns 201 status and message
 * @throws 500 if an unknown error occurs
 */
export async function signup(
  uid: string,
  firstName: string,
  lastName: string,
  email: string,
  school: string,
  role: string,
): Promise<{ status: number; message: string }> {
  try {
    // add new user to the firestore database users collection
    if (!(role.toLocaleUpperCase() in Role)) {
      throw new Error(`Not a Role`);
    }
    const user: UserDAO = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: role as Role,
      school: school,
    };

    // add user to firestore
    await admin.firestore().collection('users').doc(uid).set(user);

    await admin.auth().setCustomUserClaims(uid, { [role.toLowerCase()]: true });

    // add userid to the shortlist collection and create empty arrays for the articles and engineers
    await admin.firestore().collection('shortlist').doc(uid).set({
      articles: [],
      engineers: [],
    });

    return { status: 201, message: 'User added successfully' };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'An unknown error occurred' };
    }
  }
}

/**
 * Creates a new admin and sends reset password email
 * Also adds the admin to the firestore Users collection
 * @param firstName
 * @param lastName
 * @param email
 * @returns 201 status and message
 * @throws 500 if an unknown error occurs
 */
export async function signupAdmin(
  firstName: string,
  lastName: string,
  email: string,
): Promise<{ status: number; message: string }> {
  try {
    // create new user in firebase auth
    const userRecord = await admin.auth().createUser({
      email: email,
      displayName: firstName + ' ' + lastName,
    });

    // set custom claims to make user an admin
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    // send password reset email to the new admin
    await sendPasswordResetEmail(firebaseAuth, email);

    // add new admin to the firestore database users collection
    const user: UserDAO = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: Role.ADMIN,
      school: 'WIE Admin',
    };
    await admin.firestore().collection('users').doc(userRecord.uid).set(user);

    return { status: 201, message: 'Admin added successfully' };
  } catch (error) {
    if (error instanceof Error) {
      return { status: 500, message: error.message };
    } else {
      return { status: 500, message: 'An unknown error occurred' };
    }
  }
}

/**
 * Sends an email to the contact email address
 * @param email – the email of the engineer
 * @param yourEmail – the email of the user
 * @param name – the name of the user
 * @param title – the title of the message
 * @param message – the message
 * @returns {status: number, message: string}  200 status and message
 * @throws 500 if an unknown error occurs
 * @throws 500 if email not successful
 * */
export async function contactEmail(
  email: string,
  yourEmail: string,
  name: string,
  title: string,
  message: string,
): Promise<{ status: number; message: string }> {
  try {
    const isSent = await SendEmail(email, 'Contact Engineer', title, `${message}<br> ${name}, (${yourEmail})`);

    if (isSent) {
      return { status: 200, message: 'Email sent successfully.' };
    } else {
      return { status: 500, message: 'Email not successful' };
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return { status: 500, message: errorMessage };
  }
}

/**
 * Gets all users for admin viewing
 * @param startAfter – the uid of the users to startAfter
 * @param limit – the number of users to return
 * @param orderBy – the field to sort the engineers by
 * @returns {status: number, message: string, users: GetAllUsersDTO[], count: number} 200 status, message, users and count
 * @throws 400 if orderBy parameter is invalid
 * @throws 400 if startAfter parameter is invalid
 * @throws 500 if an unknown error occurs
 */

export async function adminGetAllUsers(
  orderBy?: string,
  startAfter?: string,
  limit?: number,
): Promise<{ status: number; message: string; users?: GetAllUsersDTO[]; count?: number }> {
  try {
    const users: GetAllUsersDTO[] = [];

    // check if orderBy parameter is valid
    if (orderBy && !UserSortByOptions.includes(orderBy)) {
      return { status: 400, message: 'Invalid orderBy parameter' };
    }

    // Build the firebase query based on path parameters from frontend
    let query = admin.firestore().collection('users') as FirebaseFirestore.Query;
    let queryCount = admin.firestore().collection('users').count().get();

    if (orderBy) {
      query = query.orderBy(orderBy);
    }

    if (startAfter) {
      const startAfterDoc = await admin.firestore().collection('users').doc(startAfter).get();

      // If the user document does not exist, return bad request
      if (!startAfterDoc.exists) {
        return { status: 400, message: 'Invalid startAfter parameter' };
      }

      query = query.startAfter(startAfterDoc);
    }

    if (limit) {
      query = query.limit(limit);
    }

    // fetch the users
    const snapshot = query.get();

    // wait for both queries to finish
    const [countSnap, snap] = await Promise.all([queryCount, snapshot]);

    snap.forEach((doc) => {
      const userData = doc.data();

      const user: GetAllUsersDTO = {
        uid: doc.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
      };

      users.push(user);
    });

    const { count } = countSnap.data();

    return { status: 200, message: 'Success', users: users, count: count };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'An unknown error occurred' };
    }
  }
}

/**
 * Gets the user details for the profile page
 * @param uid – the uid of the user
 * @returns {status: number, message: string, user: UserNavBarDTO} 200 status, message and user
 * @throws 404 if user not found
 * @throws 500 if an unknown error occurs
 * @throws 500 if user details not found
 */
export async function getUserDetails(uid: string): Promise<{ status: number; message: string; user?: UserProfileDTO }> {
  try {
    const userDoc = await admin.firestore().collection('users').doc(uid).get();

    // check that user and user details exist
    if (!userDoc.exists) {
      return { status: 404, message: 'User not found' };
    }

    if (userDoc.data()?.firstName === undefined || userDoc.data()?.lastName === undefined) {
      return { status: 500, message: 'User details not found' };
    }

    const user: UserProfileDTO = {
      firstName: userDoc.data()?.firstName,
      lastName: userDoc.data()?.lastName,
      school: userDoc.data()?.school,
      email: userDoc.data()?.email,
      role: userDoc.data()?.role,
    };

    return { status: 200, message: 'Successful retrieval of user details', user: user };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'Unsuccessful retrieval of user details' };
    }
  }
}

/**
 * Delete a user from Firestore collections and Firebase Authentication.
 * @param uid - The UID of the user to delete.
 * @returns {Promise<{ status: number; message: string }>} - 200 Status and message
 * @throws 404 if user does not exist
 * @throws 500 if an unknown error occurs
 */
export async function deleteUser(uid: string): Promise<{ status: number; message: string }> {
  try {
    const userRecord = await admin.firestore().collection('users').doc(uid).get();

    if (userRecord.exists) {
      await admin.firestore().collection('users').doc(uid).delete();
      await admin.firestore().collection('shortlist').doc(uid).delete();
      await admin.auth().deleteUser(uid);

      return { status: 200, message: 'User deleted successfully' };
    } else {
      return { status: 404, message: 'User does not exist' };
    }
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'An unknown error occurred' };
    }
  }
}
/**
 * Creates a new document with user feedback in the Firestore database
 * @param email - The email of the user providing feedback
 * @param name - The name of the user providing feedback
 * @param feedbackType - The type of feedback (e.g., "suggestion", "bug report")
 * @param feedback - The feedback message
 * @param time - Timestamp indicating when the feedback was provided
 * @param feedbackType - Feedback category
 * @param name - Name of the user providing feedback
 * @param uid - The UID of the user providing feedback
 * @returns {status: number, message: string} - 201 Status and message
 * @throws 400 if email, name, feedbackType or feedback is not provided
 * @throws 500 if an unknown error occurs
 */
export async function createUserFeedback(
  email: string,
  name: string,
  feedbackType: string,
  feedback: string,
  time: Timestamp,
  uid: string,
): Promise<{ status: number; message: string }> {
  try {
    const errors: string[] = [];

    // check that all required fields are provided
    if (!email) {
      errors.push('Email is required');
    }

    if (!name) {
      errors.push('Name is required');
    }

    if (!feedbackType) {
      errors.push('Feedback type is required');
    }

    if (!feedback) {
      errors.push('Feedback message is required');
    }

    if (errors.length > 0) {
      return { status: 400, message: errors.join(', ') };
    }

    const feedbackData: UserFeedbackDAO = {
      email: email,
      name: name,
      feedbackType: feedbackType,
      feedback: feedback,
      time: time,
      uid: uid,
    };

    await admin.firestore().collection('userFeedback').add(feedbackData);

    return { status: 201, message: 'User feedback added successfully' };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'An unknown error occurred' };
    }
  }
}

/**
 * Adds an engineer to the user's favourites
 * @param uid – the uid of the user
 * @param engineerId – the uid of the engineer
 * @returns {status: number, message: string} 201 status and message
 * @throws 404 if engineer or user favourites not found
 * @throws 500 if an unknown error occurs
 * */
export async function addFavouriteEngineer(
  uid: string,
  engineerId: string,
): Promise<{ status: number; message: string }> {
  try {
    const userFavDoc = await admin.firestore().collection('shortlist').doc(uid).get();
    const engineerDoc = await admin.firestore().collection('engineers').doc(engineerId).get();

    // check that engineer and user favourites exist
    if (!engineerDoc.exists) {
      return { status: 404, message: 'Engineer not found' };
    }

    if (!userFavDoc.exists) {
      return { status: 404, message: 'User favourites not found' };
    }

    // add engineer to user favourites
    await admin
      .firestore()
      .collection('shortlist')
      .doc(uid)
      .update({
        engineers: admin.firestore.FieldValue.arrayUnion(engineerId),
      });

    return { status: 201, message: 'Engineer added to favourites successfully' };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'Error adding engineer to favourites' };
    }
  }
}

/**
 * Deletes an engineer from the user's favourites
 * @param uid – the uid of the user
 * @param engineerId – the uid of the engineer
 * @returns {status: number, message: string} 201 status and message
 * @throws 404 if engineer or user favourites not found
 * @throws 500 if an unknown error occurs
 * */
export async function deleteFavouriteEngineer(
  uid: string,
  engineerId: string,
): Promise<{ status: number; message: string }> {
  try {
    const [userFavDoc, engineerDoc] = await Promise.all([
      admin.firestore().collection('shortlist').doc(uid).get(),
      admin.firestore().collection('engineers').doc(engineerId).get(),
    ]);

    // check that engineer and user favourites exist
    if (!engineerDoc.exists) {
      return { status: 404, message: 'Engineer not found' };
    }

    if (!userFavDoc.exists) {
      return { status: 404, message: 'User favourites not found' };
    }

    // remove engineer from user favourites
    await admin
      .firestore()
      .collection('shortlist')
      .doc(uid)
      .update({
        engineers: admin.firestore.FieldValue.arrayRemove(engineerId),
      });

    return { status: 201, message: 'Engineer deleted from favourites successfully' };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'Error deleting engineer from favourites' };
    }
  }
}

/**
 * Gets all the user feedback for the website (admin only)
 * organised by month and sorted by date
 * @returns {status: number, message: string, feedback: AllUserFeedbackDTO[]} 200 status, message and feedback
 * @throws 500 if an unknown error occurs
 */
export async function getAllUserFeedback(): Promise<{
  status: number;
  message: string;
  feedback?: AllUserFeedbackDTO[];
}> {
  try {
    let feedback: AllUserFeedbackDTO[] = [];

    let query = admin.firestore().collection('userFeedback') as FirebaseFirestore.Query;

    // order by time
    query = query.orderBy('time', 'asc');

    const snapshot = query.get();

    const snap = await snapshot;

    // loop through each feedback and add to the feedback array
    snap.forEach((doc) => {
      const feedbackData = doc.data();

      const userFeedback: UserFeedbackDTO = {
        email: feedbackData.email,
        feedback: feedbackData.feedback,
        time: feedbackData.time.toDate().toDateString(),
        uid: feedbackData.uid,
        name: feedbackData.name,
        feedbackType: feedbackData.feedbackType,
        feedbackId: doc.id,
      };

      // get the month from the timestamp
      const month = feedbackData.time.toDate().toLocaleString('default', { month: 'long' });

      // check if the month already exists in the feedback array
      const currentMonthsFeedback = feedback.find((item) => item.month === month);
      if (currentMonthsFeedback) {
        currentMonthsFeedback.feedback.push(userFeedback);
      } else {
        feedback.push({
          month: month,
          feedback: [userFeedback],
        });
      }
    });

    return { status: 200, message: 'Successful retrieval of user feedback', feedback: feedback };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'Unsuccessful retrieval of user feedback' };
    }
  }
}

/**
 * Gets the user's favourite engineers
 * @param uid – the uid of the user
 * @returns {status: number, message: string, favourites: EngineerCardDTO[]} 200 status, message and engineers
 * @throws 400 if startAfter parameter is invalid
 * @throws 404 if user favourites not found
 * @throws 404 if engineer not found
 * @throws 500 if engineer details not found
 * @throws 500 if an unknown error occurs
 * */
export async function getFavouriteEngineers(
  uid: string,
  startAfter?: string,
  limit?: number,
): Promise<{ status: number; message: string; favourites?: EngineerCardDTO[]; count?: number }> {
  try {
    const engineers: EngineerCardDTO[] = [];

    const userFavDoc = await admin.firestore().collection('shortlist').doc(uid).get();

    if (!userFavDoc.exists) {
      return { status: 404, message: 'User favourites not found' };
    }

    // get the engineers array from the user favourites
    let engineersArray = userFavDoc.data()?.engineers;
    const totalCount = engineersArray?.length;

    if (engineersArray === undefined) {
      return { status: 404, message: 'Engineers array not found' };
    }

    // check if startAfter parameter is valid and slice the array
    if (startAfter) {
      const start: number = engineersArray.indexOf(startAfter);
      if (start === -1) {
        return { status: 400, message: 'Invalid startAfter parameter' };
      }
      engineersArray = engineersArray.slice(start + 1);
    }

    // check if limit parameter is valid and slice the array
    if (limit) {
      engineersArray = engineersArray.slice(0, limit);
    }

    // loop through each engineer and add to the engineers array
    for (const engineerId of engineersArray) {
      const engineerDoc = await admin.firestore().collection('engineers').doc(engineerId).get();

      if (!engineerDoc.exists) {
        return { status: 404, message: 'Engineer not found' };
      }

      const engineerData = engineerDoc.data();

      if (engineerData?.firstName === undefined || engineerData?.lastName === undefined) {
        return { status: 500, message: 'Engineer details not found' };
      }

      const { error, topicsNames } = await engineerController.getTopicNamesFromAnEngineer(engineerData);

      if (error) {
        return { status: 500, message: error };
      }

      const topics = topicsNames ? topicsNames : [];

      const engineer: EngineerCardDTO = {
        uid: engineerId,
        name: engineerData?.firstName + ' ' + engineerData?.lastName,
        location: engineerData?.suburb + ', ' + engineerData?.city,
        specialisation: topics,
        position: engineerData?.position,
        organisation: engineerData?.organisation,
        imageURL: engineerData?.profilePictureURL,
      };

      engineers.push(engineer);
    }

    return {
      status: 200,
      message: 'Successful retrieval of favourite engineers',
      favourites: engineers,
      count: totalCount,
    };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'Unsuccessful retrieval of favourite engineers' };
    }
  }
}

/**
 * Generates a password reset link and sends it to the client
 * @param email
 * @returns {status: number, message: string, resetLink?: string} 201 status, message and resetLink
 * @throws 404 if user not found
 * @throws 500 if an unknown error occurs
 * @throws 500 if user password reset function unable to run
 */
export async function sendUserPasswordResetLink(
  email: string,
): Promise<{ status: number; message: string; resetLink?: string }> {
  try {
    // check if user email exists first in the auth database
    try {
      await admin.auth().getUserByEmail(email);
    } catch (error) {
      return { status: 404, message: 'User not found' };
    }

    // generate password reset link
    const actionCodeSettings = {
      url: Config.FRONTEND_URL,
      handleCodeInApp: true,
    };
    const resetLink = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);
    if (!resetLink) {
      return { status: 500, message: 'Failed to generate password reset link' };
    }

    return { status: 201, message: 'Password reset link generated successfully', resetLink: resetLink };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'User password reset function unable to run' };
    }
  }
}

/**
 * Sends a password reset email to the user
 * @param email
 * @returns {status: number, message: string} 201 status and message
 * @throws 500 if an unknown error occurs
 * @throws 500 if user password reset function unable to run
 */
export async function sendUserResetPasswordEmail(email: string): Promise<{ status: number; message: string }> {
  try {
    await sendPasswordResetEmail(firebaseAuth, email);
    return { status: 201, message: 'Password reset email sent successfully' };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'User password reset function unable to run' };
    }
  }
}

module.exports = {
  signup,
  signupAdmin,
  contactEmail,
  adminGetAllUsers,
  getUserDetails,
  deleteUser,
  createUserFeedback,
  addFavouriteEngineer,
  deleteFavouriteEngineer,
  getAllUserFeedback,
  getFavouriteEngineers,
  sendUserPasswordResetLink,
  sendUserResetPasswordEmail,
};

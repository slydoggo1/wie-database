import admin from 'firebase-admin';
const { FieldValue } = require('firebase-admin/firestore');
import { EngineerDTO, Events, GetAllEngineersDTO, ProfileState } from '../dto/engineer.dto';
import { EngineerDAO, EngineerSortByOptions } from '../dao/engineer.dao';
import { FeedbackDAO } from '../dao/feedback.dao';
import Config from '../configs/globalConfig';

const algoliasearch = require('algoliasearch');
const client = algoliasearch(Config.ALGOLIA_APP_ID, Config.ALGOLIA_ADMIN_API);
const index = client.initIndex(Config.ALGOLIA_ENGINEER_INDEX);

/**
 * get all engineers to review i.e status is TO_BE_REVIEWED
 * @returns status, message and engineersUid array, 200 if successful
 * @throws 500 if an unknown error occurs
 * @throws 500 if an error occurs while fetching the document
 */
export async function getAllEngineersToReview(): Promise<{
  status: number;
  message: string;
  engineers?: EngineerDTO[];
}> {
  try {
    const engineers: EngineerDTO[] = [];
    const snapshot = await admin
      .firestore()
      .collection('engineers')
      .where('verified', '==', ProfileState.TO_BE_REVIEWED)
      .get();

    // loop through all the results and add to engineers array
    const promises = snapshot.docs.map(async (doc) => {
      // Process the events string array to Enum
      const events = doc.data().events.map((str: string) => {
        const name = str.toUpperCase();
        return Events[name as keyof typeof Events];
      });

      const { error, topicsNames } = await getTopicNamesFromAnEngineer(doc.data());

      if (error) {
        throw new Error(error);
      }

      // ensure string[] can be assigned to String[]
      const topics = topicsNames ? topicsNames : [];

      const engineerDto: EngineerDTO = {
        firstName: doc.data().firstName,
        lastName: doc.data().lastName,
        bio: doc.data().biography,
        userId: doc.id,
        email: doc.data().email,
        linkedin: doc.data().linkedin,
        personalWebsite: doc.data().personalWebsite,
        verified: doc.data().verified,
        topics: topics,
        events: events,
        organisation: doc.data().organisation,
        position: doc.data().position,
        city: doc.data().city,
        suburb: doc.data().suburb,
        profilePictureURL: doc.data().profilePictureURL,
        introductionVideoURL: doc.data().introductionVideoURL,
      };
      return engineerDto;
    });

    const results = await Promise.all(promises);
    engineers.push(...results);
    return { status: 200, message: 'Success', engineers: engineers };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'An unknown error occurred' };
    }
  }
}

/**
 * review engineer profile and update the engineer in the database
 * if the engineer is verified, add the engineer to the algolia index
 * if the engineer is not verified, return with feedback
 * @throws 500 if an unknown error occurs
 * @throws 404 if the engineer does not exist
 * @throws 500 if the engineer data does not exist
 * @throws 500 if the engineer has a topic that does not exist
 * @param uid
 * @param feedback
 * @param sectionsToChange
 * @param verified
 * @returns 201 status and message
 */
export async function engineerProfileReview(
  uid: string,
  feedback: string,
  sections: boolean[],
  verified: ProfileState,
): Promise<{ status: number; message: string }> {
  try {
    // add engineer feedback to the firestore database feedback collection
    const engineerFeedback: FeedbackDAO = {
      feedback: feedback,
      sectionsToChange: sections,
    };

    const docRef = admin.firestore().collection('engineers').doc(uid);
    const doc = await docRef.get();
    if (!doc.exists) {
      return { status: 404, message: 'Engineer with the requested UID does not exist' };
    }

    // add feedback and sections to change in firestore
    await admin.firestore().collection('feedback').doc(uid).set(engineerFeedback);

    // set if engineer is verifed in firestore
    await admin.firestore().collection('engineers').doc(uid).update({ verified: verified });

    // if engineer is verified, add engineer to algolia index
    if (verified == ProfileState.VERIFIED) {
      const engineerData = doc.data();
      if (!engineerData) {
        return { status: 500, message: 'Engineer data does not exist, not adding to the algolia index' };
      }

      const { error, topicsNames } = await getTopicNamesFromAnEngineer(engineerData);
      if (error) {
        return { status: 500, message: error };
      }

      await index.saveObject({
        objectID: uid,
        name: engineerData.firstName + ' ' + engineerData.lastName,
        location: engineerData.suburb + ', ' + engineerData.city,
        position: engineerData.position,
        organisation: engineerData.organisation,
        topics: topicsNames,
        events: engineerData.events,
        bio: engineerData.biography,
        imageURL: engineerData.profilePictureURL,
      });
    }

    return { status: 201, message: 'Feedback posted successfully' };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'An unknown error occurred' };
    }
  }
}

/**
 * helper function to get the topic display names from an engineer
 * @param engineerData
 * @returns topicsNames array
 * @throws 500 if the engineer has a topic that does not exist
 * @throws 500 if the engineer has no data in topic document
 */
export async function getTopicNamesFromAnEngineer(
  engineerData: admin.firestore.DocumentData,
): Promise<{ topicsNames?: string[]; error?: string }> {
  let topics: string[] = [];

  for (const topic of engineerData.topics) {
    const topicDoc = await admin.firestore().collection('topics').doc(topic).get();
    if (!topicDoc.exists) {
      return { error: 'Engineer has a topic that does not exist' };
    }
    const topicData = topicDoc.data();
    if (!topicData) {
      return { error: 'Engineer has no data in topic document' };
    }
    topics.push(topicData.topicName);
  }

  return { topicsNames: topics };
}

/**
 * get engineer by user id
 * @param userId
 * @returns 200 status, message and engineerDTO
 * @throws 500 if an unknown error occurs
 * @throws 404 if the engineer does not exist
 * @throws 500 if the engineer has no data in document
 * @throws 500 if the engineer has a topic that does not exist
 */
export async function getEngineerByUserId(
  userId: string,
): Promise<{ status: number; message: string; engineer?: EngineerDTO }> {
  try {
    const docRef = admin.firestore().collection('engineers').doc(userId);
    const doc = await docRef.get();
    if (!doc.exists) {
      return { status: 404, message: 'No such document!' };
    }

    const engineerData = doc.data();
    if (!engineerData) {
      return { status: 500, message: 'No data in document!' };
    }

    // Process the events string array to Enum
    const events = engineerData.events.map((str: string) => {
      const name = str.toUpperCase();
      if (!name || !(name in Events)) {
        throw new Error(`Invalid event type: ${name}`);
      }
      return Events[name as keyof typeof Events];
    });

    const { error, topicsNames } = await getTopicNamesFromAnEngineer(engineerData);

    if (error) {
      return { status: 500, message: error };
    }

    // ensure string[] can be assigned to String[]
    const topics = topicsNames ? topicsNames : [];

    // Populate the EngineerDTO with the fetched and processed data
    const engineerDto: EngineerDTO = {
      firstName: engineerData.firstName,
      lastName: engineerData.lastName,
      bio: engineerData.biography,
      userId: userId,
      email: engineerData.email,
      linkedin: engineerData.linkedin,
      personalWebsite: engineerData.personalWebsite,
      verified: engineerData.verified,
      topics: topics,
      events: events,
      organisation: engineerData.organisation,
      position: engineerData.position,
      city: engineerData.city,
      suburb: engineerData.suburb,
      profilePictureURL: engineerData.profilePictureURL,
      introductionVideoURL: engineerData.introductionVideoURL,
    };

    return { status: 200, message: 'Success', engineer: engineerDto };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'An unknown error occurred' };
    }
  }
}

/**
 * Helper functions that transforms a list of topic db names to topic display names
 * @param topicsDbName
 * @returns topics display name
 */
export async function getTopicsDisplayName(topicsDbName: string[]): Promise<string[]> {
  const topicsDisplayName: string[] = [];
  for (const topicDbName of topicsDbName) {
    const topicDisplayName = await getTopicDisplayName(topicDbName);
    topicsDisplayName.push(topicDisplayName);
  }
  return topicsDisplayName;
}

/**
 * Helper function that transforms topic db name to topic display name
 * @param topicDbName
 * @returns the topic display name
 */
export async function getTopicDisplayName(topicDbName: string): Promise<string> {
  const topicDoc = await admin.firestore().collection('topics').doc(topicDbName).get();
  if (!topicDoc.exists) {
    throw new Error('topic: ' + topicDbName + ', does not exist');
  }
  const topicData = topicDoc.data();
  if (!topicData) {
    throw new Error('topic: ' + topicDbName + ', has no data');
  }
  return topicData.topicName;
}

/**
 * helper function to configure the new topics
 * takes in the display name and outputs the db name
 * @param newTopicsDisplayName
 * @returns dictionary of new topics, key is the topicDisplay name and value is the topic DB name
 */
export function configureNewTopics(newTopicsDisplayName: string[]): { [key: string]: string } {
  const newTopics: { [key: string]: string } = {};
  for (const topic of newTopicsDisplayName) {
    // remove spaces and make camel case
    const topicDbName = topic
      .split(/\s+/)
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
      })
      .join('');
    newTopics[topic] = topicDbName;
  }
  return newTopics;
}

/**
 * sign up engineer
 * @param uid
 * @param firstName
 * @param lastName
 * @param email
 * @param biography
 * @param linkedin
 * @param organisation
 * @param topics
 * @param events
 * @param position
 * @param city
 * @param suburb
 * @returns 201 status and message
 * @throws 500 if an unknown error occurs
 */
export async function signup(
  uid: string,
  firstName: string,
  lastName: string,
  email: string,
  biography: string,
  linkedin: string,
  personalWebsite: string,
  organisation: string,
  topics: string[],
  newTopicsDisplayName: string[],
  events: string[],
  position: string,
  city: string,
  suburb: string,
  profilePictureURL: string,
  introductionVideoURL?: string,
): Promise<{ status: number; message: string }> {
  try {
    // if there are new topics, configure them
    let newTopics: { [key: string]: string } = {};
    if (newTopicsDisplayName.length > 0) {
      newTopics = configureNewTopics(newTopicsDisplayName);
    }

    // add the newTopics value strings together with the topics array
    const combinedTopics: string[] = [...topics, ...Object.values(newTopics)];

    // add new engineer to the firestore database engineers collection
    let engineer: EngineerDAO = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      biography: biography,
      linkedin: linkedin,
      personalWebsite: personalWebsite,
      organisation: organisation,
      topics: combinedTopics,
      events: events,
      position: position,
      city: city,
      suburb: suburb,
      verified: ProfileState.TO_BE_REVIEWED,
      profilePictureURL: profilePictureURL,
    };

    // check if introductionVideoURL is provided
    if (introductionVideoURL) {
      engineer.introductionVideoURL = introductionVideoURL;
    }

    // add engineer in firestore
    await admin.firestore().collection('engineers').doc(uid).set(engineer);
    await admin.auth().setCustomUserClaims(uid, { engineer: true });

    // add new topics to the topics collection in firestore with engineers as uid
    for (const topicName in newTopics) {
      await admin
        .firestore()
        .collection('topics')
        .doc(newTopics[topicName])
        .set({
          articles: [],
          engineers: [uid],
          topicName: topicName,
        });
    }

    // add user id to existing events and topics collections in firestore
    for (const topic of topics) {
      await admin
        .firestore()
        .collection('topics')
        .doc(topic)
        .update({
          engineers: admin.firestore.FieldValue.arrayUnion(uid),
        });
    }

    for (const event of events) {
      if (!(event.toLocaleUpperCase() in Events)) {
        throw new Error(`Not a valid event`);
      }
      await admin
        .firestore()
        .collection('events')
        .doc(event.toLowerCase())
        .update({
          engineers: admin.firestore.FieldValue.arrayUnion(uid),
        });
    }

    return { status: 201, message: 'Engineer signed up successfully' };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'An unknown error occurred' };
    }
  }
}

/**
 * deletes the engineer from the database and auth
 * also removes the engineer links from the topics and events collections
 * can only be called by an admin
 * @param uid
 * @returns 200 status and message
 * @throws 500 if an unknown error occurs
 * @throws 404 if the engineer does not exist
 * @throws 500 if the engineer has no data in document
 */
export async function deleteEngineer(uid: string): Promise<{ status: number; message: string }> {
  try {
    // check if engineer exists
    const engineer = await admin.firestore().collection('engineers').doc(uid).get();
    if (!engineer.exists) {
      return { status: 404, message: 'Engineer does not exist!' };
    }
    const engineerData = engineer.data();
    if (!engineerData) {
      // this should never happen but just in case
      return { status: 500, message: 'No data in engineer to delete!' };
    }

    // get the topics and events of the engineer
    const topics = engineerData.topics;
    const events = engineerData.events;

    // removing the engineer from the topics collection
    for (const topic of topics) {
      const topicDocument = admin.firestore().collection('topics').doc(topic);
      await topicDocument.update({
        engineers: admin.firestore.FieldValue.arrayRemove(uid),
      });

      // delete the topic if no engineers are associated with it
      const topicDoc = await topicDocument.get();
      if (topicDoc.exists) {
        const topicSnapshot = topicDoc.data();
        if (!topicSnapshot) {
          return { status: 500, message: 'No data in topic document!' };
        }

        if (topicSnapshot.engineers.length == 0) {
          await topicDocument.delete();
        }
      }
    }

    // removing the engineer from the events collection
    for (const event of events) {
      await admin
        .firestore()
        .collection('events')
        .doc(event.toLowerCase())
        .update({
          engineers: admin.firestore.FieldValue.arrayRemove(uid),
        });
    }

    // delete the engineer firebase storage collection
    await admin
      .storage()
      .bucket()
      .deleteFiles({ prefix: `${uid}/` });

    // delete engineer from firestore
    await admin.firestore().collection('engineers').doc(uid).delete();

    // delete the algolia index
    await index.deleteObject(uid);

    // delete engineer from auth
    await admin.auth().deleteUser(uid);

    return { status: 200, message: 'Engineer deleted successfully' };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'An unknown error occurred' };
    }
  }
}

/**
 * Gets all engineers for Admin Viewing
 * @param startAfter – the uid of the engineer to startAfter
 * @param limit – the number of engineers to return
 * @param orderBy – the field to sort the engineers by
 * @returns {status: number, message: string, engineers: GetAllEngineersDTO[]} 200 status, message and engineers array
 * @throws 500 if an unknown error occurs
 * @throws 400 if orderBy is invalid
 * @throws 400 if startAfter is invalid
 */

export async function adminGetAllEngineers(
  orderBy?: string,
  startAfter?: string,
  limit?: number,
): Promise<{ status: number; message: string; engineers?: GetAllEngineersDTO[]; count?: number }> {
  try {
    const engineers: GetAllEngineersDTO[] = [];

    // Check if orderBy is valid
    if (orderBy && !EngineerSortByOptions.includes(orderBy)) {
      return { status: 400, message: 'Invalid orderBy parameter' };
    }

    // Build the firebase query based on path parameters from frontend
    let query = admin.firestore().collection('engineers') as FirebaseFirestore.Query;
    let queryCount = admin.firestore().collection('engineers').count().get();

    if (orderBy) {
      query = query.orderBy(orderBy);
    }

    if (startAfter) {
      const startAfterDoc = await admin.firestore().collection('engineers').doc(startAfter).get();

      // If the user document does not exist, return bad request
      if (!startAfterDoc.exists) {
        return { status: 400, message: 'Invalid startAfter parameter' };
      }

      query = query.startAfter(startAfterDoc);
    }

    if (limit) {
      query = query.limit(limit);
    }

    // Fetch the engineers
    const snapshot = query.get();

    // Wait for fetches to complete
    const [countSnap, snap] = await Promise.all([queryCount, snapshot]);

    snap.forEach((doc) => {
      const engineerData = doc.data();

      const engineer: GetAllEngineersDTO = {
        uid: doc.id,
        firstName: engineerData.firstName,
        lastName: engineerData.lastName,
        email: engineerData.email,
        profilePictureURL: engineerData.profilePictureURL,
        professionalTitle: engineerData.position,
      };

      engineers.push(engineer);
    });

    // Return the engineers and count
    const { count } = countSnap.data();

    return { status: 200, message: 'Success', engineers: engineers, count: count };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'An unknown error occurred' };
    }
  }
}

/**
 * Fetches feedback for an engineer
 * @param uid – the uid of the engineer
 * @returns {status: number, message: string, feedback: FeedbackDAO} 200 status, message and feedback
 * @throws 500 if an unknown error occurs
 * @throws 404 if the engineer feedback does not exist
 * @throws 500 if the engineer feedback has no data in document
 */

export async function getEngineerFeedback(
  uid: string,
): Promise<{ status: number; message: string; feedback?: FeedbackDAO }> {
  try {
    const docRef = admin.firestore().collection('feedback').doc(uid);
    const doc = await docRef.get();
    if (!doc.exists) {
      return { status: 404, message: 'No such document!' };
    }

    const feedbackData = doc.data();
    if (!feedbackData) {
      return { status: 500, message: 'No data in document!' };
    }

    const feedback: FeedbackDAO = {
      feedback: feedbackData.feedback,
      sectionsToChange: feedbackData.sectionsToChange,
    };

    return { status: 200, message: 'Success', feedback: feedback };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'An unknown error occurred' };
    }
  }
}

/**
 * Updates an engineer's data in the Firestore database.
 *
 * @param uid - The UID of the engineer to update.
 * @param data - The new data for the engineer.
 * @returns { status: number, message: string } - 200 status and a message indicating success
 * @throws 500 if an unknown error occurs
 * @throws 404 if the engineer does not exist
 * @throws 403 if the UID does not match the email
 */
export async function updateEngineer(
  uid: string,
  data: {
    firstName: string;
    lastName: string;
    city: string;
    suburb: string;
    biography: string;
    topics: string[];
    events: string[];
    linkedin?: string;
    personalWebsite?: string;
    profilePictureURL: string;
    introductionVideoURL?: string;
    position: string;
    organisation: string;
  },
): Promise<{ status: number; message: string }> {
  try {
    const userRecord = await admin.auth().getUser(uid);
    const engineer = admin.firestore().collection('engineers').doc(uid);
    const doc = await engineer.get();

    if (!doc.exists) {
      return { status: 404, message: 'Engineer does not exist' };
    }

    const engineerData = doc.data();
    if (userRecord.email !== engineerData?.email) {
      return { status: 403, message: 'Provided UID does not match the email' };
    }

    const currentTopics = engineerData?.topics || [];
    const currentEvents = engineerData?.events || [];

    const transformedTopics = configureNewTopics(data.topics);
    const combinedTopics: string[] = [...Object.values(transformedTopics)];
    const newTopics = Object.values(transformedTopics).filter((topicDbName) => !currentTopics.includes(topicDbName));

    const updatedData: Partial<EngineerDAO> = {
      firstName: data.firstName,
      lastName: data.lastName,
      city: data.city,
      suburb: data.suburb,
      biography: data.biography,
      topics: combinedTopics,
      events: data.events,
      profilePictureURL: data.profilePictureURL,
      position: data.position,
      organisation: data.organisation,
    };

    // Check if optional fields are provided
    if (data.linkedin) {
      updatedData.linkedin = data.linkedin;
    }

    if (data.personalWebsite) {
      updatedData.personalWebsite = data.personalWebsite;
    }

    if (data.introductionVideoURL) {
      updatedData.introductionVideoURL = data.introductionVideoURL;
    }
    await engineer.update(updatedData);

    // Handle new topics
    for (const topicDbName of newTopics) {
      const topicDoc = await admin.firestore().collection('topics').doc(topicDbName).get();
      // using the dictonary get the topic display name
      const topicDisplayName = Object.keys(transformedTopics).find((key) => transformedTopics[key] === topicDbName);

      if (!topicDoc.exists) {
        await admin
          .firestore()
          .collection('topics')
          .doc(topicDbName)
          .set({
            articles: [],
            engineers: [uid],
            topicName: topicDisplayName,
          });
      } else if (!currentTopics.includes(topicDbName)) {
        await admin
          .firestore()
          .collection('topics')
          .doc(topicDbName)
          .update({
            engineers: FieldValue.arrayUnion(uid),
          });
      }
    }

    // Handle removed topics
    for (const topic of currentTopics) {
      if (!Object.values(transformedTopics).includes(topic)) {
        await admin
          .firestore()
          .collection('topics')
          .doc(topic)
          .update({
            engineers: FieldValue.arrayRemove(uid),
          });

        // delete the topic if no engineers are associated with it
        const topicDoc = await admin.firestore().collection('topics').doc(topic).get();
        if (topicDoc.exists) {
          const topicSnapshot = topicDoc.data();
          if (!topicSnapshot) {
            return { status: 500, message: 'No data in topic document!' };
          }

          if (topicSnapshot.engineers.length == 0) {
            await admin.firestore().collection('topics').doc(topic).delete();
          }
        }
      }
    }

    // Handle events
    for (const event of data.events) {
      if (!currentEvents.includes(event)) {
        await admin
          .firestore()
          .collection('events')
          .doc(event)
          .update({
            engineers: FieldValue.arrayUnion(uid),
          });
      }
    }

    for (const event of currentEvents) {
      if (!data.events.includes(event)) {
        await admin
          .firestore()
          .collection('events')
          .doc(event)
          .update({
            engineers: FieldValue.arrayRemove(uid),
          });
      }
    }

    // Update Algolia index
    await index.deleteObject(uid);
    await index.saveObject({
      objectID: uid,
      name: updatedData.firstName + ' ' + updatedData.lastName,
      location: updatedData.suburb + ', ' + updatedData.city,
      position: updatedData.position,
      organisation: updatedData.organisation,
      topics: data.topics,
      events: updatedData.events,
      bio: updatedData.biography,
      imageURL: updatedData.profilePictureURL,
    });

    return { status: 200, message: 'Engineer updated successfully' };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'An unknown error occurred' };
    }
  }
}

/**
 * Resubmits an engineer's profile for an admin to re-review.
 *
 * @param uid - The UID of the engineer to update.
 * @param data - The new data for the engineer.
 * @returns { status: number, message: string } - 200 status and a message indicating success.
 * @throws 500 if an unknown error occurs
 * @throws 404 if the engineer does not exist
 * @throws 403 if the UID does not match the email
 */
export async function resubmitEngineerProfile(
  uid: string,
  data: {
    firstName: string;
    lastName: string;
    city: string;
    suburb: string;
    biography: string;
    topics: string[];
    events: string[];
    linkedin?: string;
    personalWebsite?: string;
    profilePictureURL: string;
    introductionVideoURL?: string;
    position: string;
    organisation: string;
  },
): Promise<{ status: number; message: string }> {
  try {
    const userRecord = await admin.auth().getUser(uid);
    const engineer = admin.firestore().collection('engineers').doc(uid);
    const doc = await engineer.get();

    if (!doc.exists) {
      return { status: 404, message: 'Engineer does not exist' };
    }

    const engineerData = doc.data();

    if (userRecord.email !== engineerData?.email) {
      return { status: 403, message: 'Provided UID does not match the email' };
    }

    const currentTopics = engineerData?.topics || [];
    const currentEvents = engineerData?.events || [];

    // Transform the new topic names using configureNewTopics function
    const transformedTopics = configureNewTopics(data.topics);
    const combinedTopics: string[] = [...Object.values(transformedTopics)];
    const newTopics = Object.values(transformedTopics).filter((topicDbName) => !currentTopics.includes(topicDbName));

    const updatedData: Partial<EngineerDAO> = {
      firstName: data.firstName,
      lastName: data.lastName,
      city: data.city,
      suburb: data.suburb,
      biography: data.biography,
      topics: combinedTopics,
      events: data.events,
      position: data.position,
      organisation: data.organisation,
      verified: ProfileState.TO_BE_REVIEWED,
      profilePictureURL: data.profilePictureURL,
    };

    // Check if optional fields are provided
    if (data.linkedin) {
      updatedData.linkedin = data.linkedin;
    }

    if (data.personalWebsite) {
      updatedData.personalWebsite = data.personalWebsite;
    }

    if (data.introductionVideoURL) {
      updatedData.introductionVideoURL = data.introductionVideoURL;
    }
    await engineer.update(updatedData);

    // Handle new topics
    for (const topicDbName of newTopics) {
      const topicDoc = await admin.firestore().collection('topics').doc(topicDbName).get();
      const topicDisplayName = Object.keys(transformedTopics).find((key) => transformedTopics[key] === topicDbName);
      if (!topicDoc.exists) {
        await admin
          .firestore()
          .collection('topics')
          .doc(topicDbName)
          .set({
            articles: [],
            engineers: [uid],
            topicName: topicDisplayName,
          });
      } else if (!currentTopics.includes(topicDbName)) {
        await admin
          .firestore()
          .collection('topics')
          .doc(topicDbName)
          .update({
            engineers: FieldValue.arrayUnion(uid),
          });
      }
    }

    // Handle removed topics
    for (const topic of currentTopics) {
      if (!Object.values(transformedTopics).includes(topic)) {
        await admin
          .firestore()
          .collection('topics')
          .doc(topic)
          .update({
            engineers: FieldValue.arrayRemove(uid),
          });
      }

      // delete the topic if no engineers are associated with it
      const topicDoc = await admin.firestore().collection('topics').doc(topic).get();
      if (topicDoc.exists) {
        const topicSnapshot = topicDoc.data();
        if (!topicSnapshot) {
          return { status: 500, message: 'No data in topic document!' };
        }

        if (topicSnapshot.engineers.length == 0) {
          await admin.firestore().collection('topics').doc(topic).delete();
        }
      }
    }

    // Handle events
    for (const event of data.events) {
      if (!currentEvents.includes(event)) {
        await admin
          .firestore()
          .collection('events')
          .doc(event)
          .update({
            engineers: FieldValue.arrayUnion(uid),
          });
      }
    }

    for (const event of currentEvents) {
      if (!data.events.includes(event)) {
        await admin
          .firestore()
          .collection('events')
          .doc(event)
          .update({
            engineers: FieldValue.arrayRemove(uid),
          });
      }
    }

    return { status: 200, message: 'Profile has been resubmitted for review' };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'An unknown error occurred' };
    }
  }
}

module.exports = {
  signup,
  getEngineerByUserId,
  getAllEngineersToReview,
  getTopicNamesFromAnEngineer,
  engineerProfileReview,
  deleteEngineer,
  configureNewTopics,
  adminGetAllEngineers,
  getEngineerFeedback,
  updateEngineer,
  resubmitEngineerProfile,
};

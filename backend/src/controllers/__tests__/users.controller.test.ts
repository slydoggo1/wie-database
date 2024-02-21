import * as SendMailModule from '../../services/mailservice';
import Config from '../../configs/globalConfig';
import { mockFirebase } from 'firestore-jest-mock';
import { mockSetCustomUserClaims, mockDeleteUser } from 'firestore-jest-mock/mocks/auth';
import { mockDelete, mockUpdate } from 'firestore-jest-mock/mocks/firestore';

const mockSendMail = jest.fn(() => ({ isSent: true }));

//firebase mock database for all our tests to access
mockFirebase({
  database: {
    users: [
      {
        id: 'user1',
        email: 'azhe202+3@aucklanduni.ac.nz',
        firstName: 'f',
        lastName: 'f',
        role: 'admin',
        school: 'WIE Admin',
      },
      {
        id: 'user2',
        email: 'example',
        firstName: 'first',
        lastName: 'last',
        role: 'student',
        school: 'WIE test high school',
      },
      {
        id: 'user3',
        email: 'example',
        firstName: 'first',
        role: 'student',
        school: 'WIE test high school',
      },
    ],
    engineers: [
      {
        id: 'engineer1',
      },
      {
        id: 'engineer2',
        firstName: 'first',
        lastName: 'last',
        email: 'example',
        profilePictureURL: 'example',
        topics: ['example'],
        position: 'example',
        organisation: 'example',
        city: 'example',
        suburb: 'example',
      },
      {
        id: 'engineer3',
        firstName: 'first3',
        lastName: 'last3',
        email: 'example',
        profilePictureURL: 'example',
        topics: ['example'],
        position: 'example',
        organisation: 'example',
        city: 'example',
        suburb: 'example',
      },
      {
        id: 'engineer4',
        firstName: 'first4',
        lastName: 'last4',
        email: 'example',
        profilePictureURL: 'example',
        topics: ['example'],
        position: 'example',
        organisation: 'example',
        city: 'example',
        suburb: 'example',
      },
    ],
    shortlist: [
      {
        id: 'user1',
        articles: [],
        engineers: [],
      },
      {
        id: 'user2',
        articles: [],
        engineers: ['engineer2'],
      },
      {
        id: 'user3',
        articles: [],
        engineers: ['engineer1'],
      },
      {
        id: 'user4',
        articles: [],
        engineers: ['engineer2', 'engineer3', 'engineer4'],
      },
    ],
    userFeedback: [
      {
        id: 'feedback1',
        email: 'example@gmail.com',
        name: 'John Doe',
        feedbackType: 'Bug Report',
        feedback: 'This is my feedback',
        time: new Date('2023-09-01T00:00:00.000Z'),
        uid: 'user1',
      },
    ],
    topics: [
      {
        id: 'example',
        displayName: 'example',
        topicName: 'example',
      },
    ],
  },
  currentUser: {
    uid: 'user1',
    email: 'sdshj',
    emailVerified: true,
    displayName: 'f f',
    photoURL: 'example',
    phoneNumber: 'example',
    disabled: false,
  },
});

// Mocking the SendEmail function in the current module
jest.mock('../../services/mailservice', () => ({
  __esModule: true,
  default: jest.fn(() => ({ isSent: true })),
}));

const uid = 'user3';
const firstName = 'aden';
const lastName = 'ing';
const email = 'test@example.com';
const school = 'test high school';
const role = 'student';

describe('deleteUser method testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 on successful deletion', async () => {
    const deleteUser = require('../users.controller').deleteUser;

    const response = await deleteUser('user1');

    expect(response.status).toBe(200);
    expect(response.message).toBe('User deleted successfully');
    expect(mockDelete).toHaveBeenCalledTimes(2);
    expect(mockDeleteUser).toHaveBeenCalledTimes(1);
  });

  it('should return 404 if user to delete does not exist', async () => {
    const deleteUser = require('../users.controller').deleteUser;

    const response = await deleteUser('nonExistentUser');
    expect(response.status).toBe(404);
    expect(response.message).toBe('User does not exist');
    expect(mockDelete).toHaveBeenCalledTimes(0);
    expect(mockDeleteUser).toHaveBeenCalledTimes(0);
  });
});

describe('Create User Feedback method testing', () => {
  it('should create user feedback with the current timestamp', async () => {
    const { createUserFeedback } = require('../users.controller');
    const email = 'test@example.com';
    const name = 'John Doe';
    const feedbackType = 'Bug Report';
    const feedback = 'This is my feedback';
    const uid = 'user123';

    const result = await createUserFeedback(email, name, feedbackType, feedback, null, uid);

    expect(result).toEqual({
      status: 201,
      message: 'User feedback added successfully',
    });
  });

  it('should handle missing email', async () => {
    const { createUserFeedback } = require('../users.controller');
    const name = 'John Doe';
    const feedbackType = 'Bug Report';
    const feedback = 'This is my feedback';
    const uid = 'user123';

    const result = await createUserFeedback(null, name, feedbackType, feedback, null, uid);

    expect(result).toEqual({
      status: 400,
      message: 'Email is required',
    });
  });

  it('should handle missing name', async () => {
    const { createUserFeedback } = require('../users.controller');
    const email = 'test@example.com';
    const feedbackType = 'Suggestion';
    const feedback = 'This is my feedback';
    const uid = 'user123';

    const result = await createUserFeedback(email, null, feedbackType, feedback, null, uid);

    expect(result).toEqual({
      status: 400,
      message: 'Name is required',
    });
  });

  it('should handle missing feedback type', async () => {
    const { createUserFeedback } = require('../users.controller');
    const email = 'test@example.com';
    const name = 'Jane Smith';
    const feedback = 'This is my feedback';
    const uid = 'user123';

    const result = await createUserFeedback(email, name, null, feedback, null, uid);

    expect(result).toEqual({
      status: 400,
      message: 'Feedback type is required',
    });
  });

  it('should handle missing feedback', async () => {
    const { createUserFeedback } = require('../users.controller');
    const email = 'test@example.com';
    const name = 'John Doe';
    const feedbackType = 'Bug Report';
    const uid = 'user123';

    const result = await createUserFeedback(email, name, feedbackType, null, null, uid);

    expect(result).toEqual({
      status: 400,
      message: 'Feedback message is required',
    });
  });

  it('allow feedback without uid', async () => {
    const { createUserFeedback } = require('../users.controller');
    const email = 'test@example.com';
    const name = 'John Doe';
    const feedbackType = 'Bug Report';
    const feedback = 'This is my feedback';

    const result = await createUserFeedback(email, name, feedbackType, feedback, null, null);

    expect(result).toEqual({
      status: 201,
      message: 'User feedback added successfully',
    });
  });
});

describe('user add engineer to favourites method testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add engineer to favourites', async () => {
    const { addFavouriteEngineer } = require('../users.controller');
    const result = await addFavouriteEngineer('user1', 'engineer1');

    expect(result).toEqual({
      status: 201,
      message: 'Engineer added to favourites successfully',
    });
  });

  it('should return 404 if user shortlist does not exist', async () => {
    const { addFavouriteEngineer } = require('../users.controller');
    const result = await addFavouriteEngineer('user5', 'engineer1');

    expect(result).toEqual({
      status: 404,
      message: 'User favourites not found',
    });
  });

  it('should return 404 if engineer does not exist', async () => {
    const { addFavouriteEngineer } = require('../users.controller');
    const result = await addFavouriteEngineer(uid, 'engineer5');

    expect(result).toEqual({
      status: 404,
      message: 'Engineer not found',
    });
  });
});

describe('user deletes an engineer from favourites method testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete engineer from favourites', async () => {
    const { deleteFavouriteEngineer } = require('../users.controller');
    const result = await deleteFavouriteEngineer('user2', 'engineer2');

    expect(result).toEqual({
      status: 201,
      message: 'Engineer deleted from favourites successfully',
    });
    expect(mockUpdate).toHaveBeenCalledTimes(1);
  });

  it('should return 404 if user shortlist does not exist', async () => {
    const { deleteFavouriteEngineer } = require('../users.controller');
    const result = await deleteFavouriteEngineer('user5', 'engineer1');

    expect(result).toEqual({
      status: 404,
      message: 'User favourites not found',
    });
    expect(mockUpdate).toHaveBeenCalledTimes(0);
  });

  it('should return 404 if engineer does not exist', async () => {
    const { deleteFavouriteEngineer } = require('../users.controller');
    const result = await deleteFavouriteEngineer(uid, 'engineer5');

    expect(result).toEqual({
      status: 404,
      message: 'Engineer not found',
    });
    expect(mockUpdate).toHaveBeenCalledTimes(0);
  });
});

describe('getFavouriteEngineers method testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 on successful get', async () => {
    const { getFavouriteEngineers } = require('../users.controller');

    const response = await getFavouriteEngineers('user2');

    expect(response.status).toBe(200);
    expect(response.message).toBe('Successful retrieval of favourite engineers');
    expect(response.favourites[0]).toEqual({
      uid: 'engineer2',
      name: 'first last',
      location: 'example, example',
      specialisation: ['example'],
      position: 'example',
      organisation: 'example',
      imageURL: 'example',
    });
  });

  it('should return 404 if user shortlist does not exist', async () => {
    const { getFavouriteEngineers } = require('../users.controller');

    const response = await getFavouriteEngineers('user5');

    expect(response.status).toBe(404);
    expect(response.message).toBe('User favourites not found');
  });

  it('should return 500 if error occurs', async () => {
    const { getFavouriteEngineers } = require('../users.controller');

    const response = await getFavouriteEngineers('user3');

    expect(response.status).toBe(500);
    expect(response.message).toBe('Engineer details not found');
  });

  it('should return 400 if startAfter is invalid', async () => {
    const { getFavouriteEngineers } = require('../users.controller');

    const response = await getFavouriteEngineers('user2', 'not a number');

    expect(response.status).toBe(400);
    expect(response.message).toBe('Invalid startAfter parameter');
  });

  it('should return 200 on successful get with startAfter and limit', async () => {
    const { getFavouriteEngineers } = require('../users.controller');

    const response = await getFavouriteEngineers('user4', 'engineer2', 1);

    expect(response.status).toBe(200);
    expect(response.message).toBe('Successful retrieval of favourite engineers');
    expect(response.favourites.length).toEqual(1);
    expect(response.favourites[0]).toEqual({
      uid: 'engineer3',
      name: 'first3 last3',
      location: 'example, example',
      specialisation: ['example'],
      position: 'example',
      organisation: 'example',
      imageURL: 'example',
    });
  });

  it('should return 200 on successful get with startAfter', async () => {
    const { getFavouriteEngineers } = require('../users.controller');

    const response = await getFavouriteEngineers('user4', 'engineer2');

    expect(response.status).toBe(200);
    expect(response.message).toBe('Successful retrieval of favourite engineers');
    expect(response.favourites.length).toEqual(2);
    expect(response.favourites[0]).toEqual({
      uid: 'engineer3',
      name: 'first3 last3',
      location: 'example, example',
      specialisation: ['example'],
      position: 'example',
      organisation: 'example',
      imageURL: 'example',
    });
    expect(response.favourites[1]).toEqual({
      uid: 'engineer4',
      name: 'first4 last4',
      location: 'example, example',
      specialisation: ['example'],
      position: 'example',
      organisation: 'example',
      imageURL: 'example',
    });
  });
});

describe('User claims', () => {
  //   TODO: test admin user claim - it cannot currently be tested because the createUser mock is not supported
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Teacher claim should be set', async () => {
    const { signup } = require('../users.controller');

    await signup(uid, firstName, lastName, email, school, 'teacher').then(() => {
      expect(mockSetCustomUserClaims).toHaveBeenCalledWith(uid, { teacher: true });
    });
  });

  it('Student claim should be set', async () => {
    const { signup } = require('../users.controller');

    await signup(uid, firstName, lastName, email, school, 'student').then(() => {
      expect(mockSetCustomUserClaims).toHaveBeenCalledWith(uid, { student: true });
    });
  });
});

describe('signup method testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds user to Firestore and shortlist successfully', async () => {
    const { signup } = require('../users.controller');
    const result = await signup(uid, firstName, lastName, email, school, role);

    expect(result).toEqual({
      status: 201,
      message: 'User added successfully',
    });
  });

  it('handles general error(invalid name)', async () => {
    const { signup } = require('../users.controller');
    const errorRole = 'dog';
    const result = await signup(uid, firstName, lastName, email, school, errorRole);

    expect(result).toEqual({
      status: 500,
      message: 'Not a Role',
    });
  });
});

describe('getUserDetails method testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('gets user details successfully', async () => {
    const { getUserDetails } = require('../users.controller');
    const result = await getUserDetails('user2');

    expect(result).toEqual({
      status: 200,
      message: 'Successful retrieval of user details',
      user: {
        firstName: 'first',
        lastName: 'last',
        email: 'example',
        role: 'student',
        school: 'WIE test high school',
      },
    });
  });

  it('handles error when user does not exist', async () => {
    const { getUserDetails } = require('../users.controller');
    const result = await getUserDetails('user4');

    expect(result).toEqual({
      status: 404,
      message: 'User not found',
    });
  });

  it('should return 500 if error occurs', async () => {
    const { getUserDetails } = require('../users.controller');
    const result = await getUserDetails('user3');

    expect(result).toEqual({
      status: 500,
      message: 'User details not found',
    });
  });
});

describe('sendUserPasswordResetLink method testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 201 on successful password generation', async () => {
    const sendUserPasswordResetLink = require('../users.controller').sendUserPasswordResetLink;
    const generatePasswordResetLinkMock = jest.fn(() => 'https://example.com/reset-password');

    require('firebase-admin').auth = jest.fn(() => ({
      getUserByEmail: jest.fn().mockResolvedValueOnce({ UserRecord: { uid: uid } }),
      generatePasswordResetLink: generatePasswordResetLinkMock,
    }));

    const response = await sendUserPasswordResetLink(email);
    expect(response.status).toBe(201);
    expect(response.message).toBe('Password reset link generated successfully');
    expect(generatePasswordResetLinkMock).toHaveBeenCalledWith(email, {
      url: Config.FRONTEND_URL,
      handleCodeInApp: true,
    });
  });

  it('should return 404 if user does not exist', async () => {
    const sendUserPasswordResetLink = require('../users.controller').sendUserPasswordResetLink;

    require('firebase-admin').auth = jest.fn(() => ({
      // mock the getUserByEmail function to throw an error
      getUserByEmail: jest.fn().mockRejectedValueOnce(new Error('User not found')),
    }));

    const response = await sendUserPasswordResetLink(email);
    expect(response.status).toBe(404);
    expect(response.message).toBe('User not found');
  });
});

describe('contactEmail method testing', () => {
  it('should send email successfully', async () => {
    const { contactEmail } = require('../users.controller');

    Object.defineProperty(SendMailModule, 'SendEmail', {
      value: mockSendMail,
    });

    (mockSendMail.mockResolvedValue as any)(true);

    const response = await contactEmail('receiver@example.com', 'sender@example.com', 'Name', 'Title', 'Message');

    expect(response).toEqual({
      status: 200,
      message: 'Email sent successfully.',
    });
    expect(mockSendMail).toHaveBeenCalledWith(
      'receiver@example.com',
      'Contact Engineer',
      'Title',
      'Message<br> Name, (sender@example.com)',
    );
  });

  it('should handle email sending failure', async () => {
    const { contactEmail } = require('../users.controller');

    (mockSendMail.mockResolvedValue as any)(false);

    const response = await contactEmail('receiver@example.com', 'sender@example.com', 'Name', 'Title', 'Message');
    expect(response).toEqual({
      status: 500,
      message: 'Email not successful',
    });
  });
});

describe('getAllUsersAdmin method testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 on successful get', async () => {
    const adminGetAllUsers = require('../users.controller').adminGetAllUsers;

    // Mocking the firestore collection

    const limitMock = jest.fn(() => {
      return {
        get: jest.fn(() => {
          return [];
        }),
      };
    });

    const startAfterMock = jest.fn(() => {
      return {
        get: jest.fn(() => {
          return [];
        }),
        limit: limitMock,
      };
    });

    const orderByMock = jest.fn(() => {
      return {
        get: jest.fn(() => {
          return [];
        }),
        startAfter: startAfterMock,
      };
    });

    const docMock = jest.fn(() => {
      return {
        get: jest.fn((startAfterUid: string) => {
          return {
            exists: true,
          };
        }),
      };
    });

    const countMock = jest.fn(() => {
      return {
        get: jest.fn(() => {
          return {
            data: jest.fn(() => {
              return { count: 0 };
            }),
          };
        }),
      };
    });

    const collectionMock = jest.fn(() => {
      return {
        get: jest.fn(() => {
          return [];
        }),
        doc: docMock,
        count: countMock,
        orderBy: orderByMock,
      };
    });

    require('firebase-admin').firestore = jest.fn(() => ({
      collection: collectionMock,
    }));

    // Constants for the function
    const orderBy = 'firstName';
    const limit = 10;
    const startAfter = 'uid';

    const response = await adminGetAllUsers(orderBy, startAfter, limit);

    expect(response.status).toBe(200);
    expect(response.message).toBe('Success');
    expect(collectionMock).toBeCalledWith('users');

    expect(orderByMock).toHaveBeenCalledWith(orderBy);
    expect(limitMock).toHaveBeenCalledWith(limit);

    // We fetch the last user to get the next page
    expect(docMock).toHaveBeenCalledWith(startAfter);
  });

  it('should return 400 if orderBy parameter is not correct', async () => {
    const adminGetAllUsers = require('../users.controller').adminGetAllUsers;

    const limitMock = jest.fn(() => {
      return {
        get: jest.fn(() => {
          return [];
        }),
      };
    });

    const startAfterMock = jest.fn(() => {
      return {
        get: jest.fn(() => {
          return [];
        }),
        limit: limitMock,
      };
    });

    const orderByMock = jest.fn(() => {
      return {
        get: jest.fn(() => {
          return [];
        }),
        startAfter: startAfterMock,
      };
    });

    const docMock = jest.fn(() => {
      return {
        get: jest.fn((startAfterUid: string) => {
          return [];
        }),
      };
    });

    const countMock = jest.fn(() => {
      return {
        get: jest.fn(() => {
          return {
            data: jest.fn(() => {
              return { count: 0 };
            }),
          };
        }),
      };
    });

    const collectionMock = jest.fn(() => {
      return {
        get: jest.fn(() => {
          return [];
        }),
        doc: docMock,
        count: countMock,
        orderBy: orderByMock,
      };
    });

    require('firebase-admin').firestore = jest.fn(() => ({
      collection: collectionMock,
    }));

    const orderBy = 'invalidOrderBy';
    const limit = 10;
    const startAfter = 'uid';

    const response = await adminGetAllUsers(orderBy, startAfter, limit);

    expect(response.status).toBe(400);
    expect(response.message).toBe('Invalid orderBy parameter');

    //  Nothing should be called
    expect(orderByMock).toHaveBeenCalledTimes(0);
    expect(limitMock).toHaveBeenCalledTimes(0);
    expect(docMock).toHaveBeenCalledTimes(0);
    expect(collectionMock).toHaveBeenCalledTimes(0);
  });

  it('should return 400 if startBy parameter is not correct', async () => {
    const adminGetAllUsers = require('../users.controller').adminGetAllUsers;

    const limitMock = jest.fn(() => {
      return {
        get: jest.fn(() => {
          return [];
        }),
      };
    });

    const startAfterMock = jest.fn(() => {
      return {
        get: jest.fn(() => {
          return [];
        }),
        limit: limitMock,
      };
    });

    const orderByMock = jest.fn(() => {
      return {
        get: jest.fn(() => {
          return [];
        }),
        startAfter: startAfterMock,
      };
    });

    const docMock = jest.fn(() => {
      return {
        get: jest.fn((startAfterUid: string) => {
          return [];
        }),
      };
    });

    const countMock = jest.fn(() => {
      return {
        get: jest.fn(() => {
          return {
            data: jest.fn(() => {
              return { count: 0 };
            }),
          };
        }),
      };
    });

    const collectionMock = jest.fn(() => {
      return {
        get: jest.fn(() => {
          return [];
        }),
        doc: docMock,
        count: countMock,
        orderBy: orderByMock,
      };
    });

    require('firebase-admin').firestore = jest.fn(() => ({
      collection: collectionMock,
    }));

    const orderBy = 'firstName';
    const limit = 10;
    const startAfter = 'invalidStartAfter';

    const response = await adminGetAllUsers(orderBy, startAfter, limit);

    expect(response.status).toBe(400);
    expect(response.message).toBe('Invalid startAfter parameter');

    // All but limit should have been called
    expect(orderByMock).toHaveBeenCalledTimes(1);
    expect(docMock).toHaveBeenCalledTimes(1);
    expect(collectionMock).toHaveBeenCalledTimes(3);
    expect(limitMock).toHaveBeenCalledTimes(0);
  });

  describe('getAllUserFeedback method testing', () => {
    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return all user feedback', async () => {
      const { getAllUserFeedback } = require('../users.controller');

      // Mocking the firestore collection

      const orderByMock = jest.fn(() => {
        return {
          get: jest.fn(() => {
            return [];
          }),
        };
      });

      const collectionMock = jest.fn(() => {
        return {
          get: jest.fn(() => {
            return [];
          }),
          orderBy: orderByMock,
        };
      });

      require('firebase-admin').firestore = jest.fn(() => ({
        collection: collectionMock,
      }));

      const result = await getAllUserFeedback();

      expect(result.status).toBe(200);
      expect(result.message).toBe('Successful retrieval of user feedback');
      expect(collectionMock).toBeCalledWith('userFeedback');
      expect(orderByMock).toBeCalledWith('time', 'asc');
    });
  });
});

import { mockFirebase } from 'firestore-jest-mock';
import { EngineerDTO, ProfileState } from '../../dto/engineer.dto';
import {
  mockSet,
  mockUpdate,
  mockDelete,
  mockArrayRemoveFieldValue,
  mockWhere,
} from 'firestore-jest-mock/mocks/firestore';

import { mockSetCustomUserClaims, mockDeleteUser, mockGetUser } from 'firestore-jest-mock/mocks/auth';

//firebase mock database for all our tests to access
mockFirebase({
  database: {
    engineers: [
      {
        id: 'engineer1',
        firstName: 'John',
        lastName: 'Doe',
        biography: 'A passionate software engineer.',
        email: 'john.doe@example.com',
        linkedin: 'john-doe-linkedin',
        personalWebsite: 'john-doe-website',
        verified: false,
        organisation: 'TechCorp',
        topics: ['Machine Learning', 'Web Development'],
        events: ['Outreach', 'Mentoring'],
        position: 'Lead Developer',
        city: 'New York',
        suburb: 'Brooklyn',
        profilePictureURL: 'fakeURL',
        introductionVideoURL: 'fakeURL',
      },
      {
        id: 'engineer2',
        firstName: 'Bob',
        lastName: 'Doe',
        biography: 'A passionate software engineer.',
        email: 'Bob.doe@example.com',
        linkedin: 'Bob-doe-linkedin',
        verified: true,
        organisation: 'TechCorp',
        topics: ['Machine Learning', 'Web Development'],
        events: ['Nothing', 'Mentoring'],
        position: 'Lead Developer',
        city: 'New York',
        suburb: 'Brooklyn',
        profilePictureURL: 'fakeURL',
        introductionVideoURL: 'fakeURL',
      },
      {
        id: 'engineer3',
        firstName: 'Bob',
        lastName: 'Doe',
        biography: 'A passionate software engineer.',
        email: 'Bob.doe@mail.com',
        linkedin: 'Bob-doe-linkedin',
        verified: true,
        organisation: 'TechCorp',
        topics: ['Machine Learning', 'Does not exist'],
        events: ['Nothing', 'Mentoring'],
        position: 'Lead Developer',
        city: 'New York',
        suburb: 'Brooklyn',
      },
    ],
    feedback: [
      {
        id: 'engineer2',
        feedback: 'LGTM',
        sectionsToChange: ['bio', 'organisation'],
      },
    ],
    topics: [
      {
        id: 'Machine Learning',
        displayName: 'Machine Learning',
        topicName: 'Machine Learning',
        engineers: ['engineer1', 'engineer2'],
      },
      {
        id: 'Web Development',
        displayName: 'Web Development',
        topicName: 'Web Development',
        engineers: ['engineer1'],
      },
      {
        id: 'software',
        displayName: 'Software',
        topicName: 'Software',
        engineers: ['engineer1'],
      },
    ],
  },
});
const newEngineer = {
  uid: 'testUserId',
  firstName: 'angela',
  lastName: 'lorusso',
  city: 'auckland',
  organisation: 'test organisation',
  linkedin: 'user/linkedin.com',
  personalWebsite: 'user/personal.com',
  surburb: 'cbd',
  position: 'ceo',
  biography: 'i was in wen',
  email: 'email.com',
  topics: ['electrical', 'software'],
  newTopicsDisplayName: ['a new very cool topic', 'Cyber Security'],
  topicsUpper: ['ELECTRICAL', 'SOFTWARE'],
  events: ['collaboration'],
  eventsUpper: ['COLLABORATION'],
};

const mockSaveObject = jest.fn();
const mockDeleteObject = jest.fn();
jest.mock('algoliasearch', () => {
  const mockIndex = {
    saveObject: mockSaveObject,
    deleteObject: mockDeleteObject,
  };

  const mockClient = {
    initIndex: jest.fn(() => mockIndex),
  };

  // Mock the algoliasearch function to return the mocked client
  const algoliasearch = jest.fn((appId, adminApiKey) => {
    return mockClient;
  });

  return algoliasearch;
});

describe('engineerProfileReview method testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should post engineer profile review with feedback and return 201 status on success', async () => {
    const uid = 'engineer1';
    const feedback = 'Test feedback';
    const sections = [false, false, false, false, false, false, false, false, false];
    const verified = true;

    const engineerProfileReview = require('../engineers.controller').engineerProfileReview;

    await engineerProfileReview(uid, feedback, sections, verified).then((res: any) => {
      expect(res.status).toBe(201);
      expect(res.message).toBe('Feedback posted successfully');
      expect(mockSet).toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalledWith({ verified: true });
    });
  });

  it('should return 404 status if engineer document does not exist', async () => {
    const uid = 'wrongId';
    const feedback = 'Test feedback';
    const sections = [true, false, false, false, false, false, false, false, true];
    const verified = true;

    const engineerProfileReview = require('../engineers.controller').engineerProfileReview;

    await engineerProfileReview(uid, feedback, sections, verified).then((res: any) => {
      expect(res.status).toBe(404);
      expect(res.message).toBe('Engineer with the requested UID does not exist');
      expect(mockSet).toHaveBeenCalledTimes(0);
      expect(mockUpdate).toHaveBeenCalledTimes(0);
    });
  });
});

describe('getEngineerByUserId method testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve an engineer by ID', async () => {
    const { getEngineerByUserId } = require('../engineers.controller');
    const engineer = await getEngineerByUserId('engineer1');

    expect(engineer.status).toBe(200);
    expect(engineer.message).toBe('Success');
    expect(engineer.engineer.firstName).toStrictEqual('John');
    expect(engineer.engineer.lastName).toStrictEqual('Doe');
    expect(engineer.engineer.bio).toBe('A passionate software engineer.');
    expect(engineer.engineer.email).toStrictEqual('john.doe@example.com');
    expect(engineer.engineer.linkedin).toStrictEqual('john-doe-linkedin');
    expect(engineer.engineer.personalWebsite).toStrictEqual('john-doe-website');
    expect(engineer.engineer.verified).toBe(false);
    expect(engineer.engineer.organisation).toStrictEqual('TechCorp');
    expect(engineer.engineer.topics).toEqual(['Machine Learning', 'Web Development']);
    expect(engineer.engineer.events).toEqual(['Outreach', 'Mentoring']);
    expect(engineer.engineer.position).toStrictEqual('Lead Developer');
    expect(engineer.engineer.city).toStrictEqual('New York');
    expect(engineer.engineer.suburb).toStrictEqual('Brooklyn');
    expect(engineer.engineer.profilePictureURL).toStrictEqual('fakeURL');
    expect(engineer.engineer.introductionVideoURL).toStrictEqual('fakeURL');
    expect(engineer.engineer as EngineerDTO).toEqual(expect.anything());
  });

  it('should return 404 if document does not exist', async () => {
    const { getEngineerByUserId } = require('../engineers.controller');
    const response = await getEngineerByUserId('testUserId');

    expect(response).toEqual({
      status: 404,
      message: 'No such document!',
    });
  });
  it('should return 500 if an error occurs while fetching the document', async () => {
    const { getEngineerByUserId } = require('../engineers.controller');
    const response = await getEngineerByUserId('engineer2');
    expect(response.status).toBe(500);
  });
});

describe('sign up engineer method testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 201 if engineer is created successfully', async () => {
    const { signup } = require('../engineers.controller');

    const response = await signup(
      newEngineer.uid,
      newEngineer.firstName,
      newEngineer.lastName,
      newEngineer.email,
      newEngineer.biography,
      newEngineer.linkedin,
      newEngineer.personalWebsite,
      newEngineer.organisation,
      newEngineer.topics,
      newEngineer.newTopicsDisplayName,
      newEngineer.events,
      newEngineer.position,
      newEngineer.city,
      newEngineer.surburb,
    );

    expect(response).toEqual({
      status: 201,
      message: 'Engineer signed up successfully',
    });
    // 3 times because 2 new topics and 1 engineer to add
    expect(mockSet).toHaveBeenCalledTimes(3);
    expect(mockSetCustomUserClaims).toHaveBeenCalledWith(newEngineer.uid, { engineer: true });
  });

  it('Engineer claim should be set', async () => {
    const { signup } = require('../engineers.controller');
    await signup(
      newEngineer.uid,
      newEngineer.firstName,
      newEngineer.lastName,
      newEngineer.email,
      newEngineer.biography,
      newEngineer.linkedin,
      newEngineer.personalWebsite,
      newEngineer.organisation,
      newEngineer.topics,
      newEngineer.events,
      newEngineer.position,
      newEngineer.city,
      newEngineer.surburb,
    ).then(() => {
      expect(mockSetCustomUserClaims).toHaveBeenCalledWith(newEngineer.uid, { engineer: true });
    });
  });

  it('should return 201 even if topics and events are uppercase', async () => {
    const { signup } = require('../engineers.controller');

    const response = await signup(
      newEngineer.uid,
      newEngineer.firstName,
      newEngineer.lastName,
      newEngineer.email,
      newEngineer.biography,
      newEngineer.linkedin,
      newEngineer.personalWebsite,
      newEngineer.organisation,
      newEngineer.topicsUpper,
      newEngineer.newTopicsDisplayName,
      newEngineer.eventsUpper,
      newEngineer.position,
      newEngineer.city,
      newEngineer.surburb,
    );
    expect(response).toEqual({
      status: 201,
      message: 'Engineer signed up successfully',
    });
    expect(mockSet).toHaveBeenCalled();
  });

  it('should return 500 if an error occurs while creating the engineer document(invalid topic in original topic field)', async () => {
    const { signup } = require('../engineers.controller');
    const failTopic = 241244;
    const response = await signup(
      newEngineer.uid,
      newEngineer.firstName,
      newEngineer.lastName,
      newEngineer.email,
      newEngineer.biography,
      newEngineer.linkedin,
      newEngineer.personalWebsite,
      newEngineer.organisation,
      failTopic,
      newEngineer.newTopicsDisplayName,
      newEngineer.events,
      newEngineer.position,
      newEngineer.city,
      newEngineer.surburb,
    );
    expect(response).toEqual({
      status: 500,
      message: 'topics is not iterable',
    });
  });

  it('should return 500 if an error occurs while creating the engineer document(Event is not Enum)', async () => {
    const { signup } = require('../engineers.controller');
    const failEvent = ['playing games'];
    const response = await signup(
      newEngineer.uid,
      newEngineer.firstName,
      newEngineer.lastName,
      newEngineer.email,
      newEngineer.biography,
      newEngineer.linkedin,
      newEngineer.organisation,
      newEngineer.topics,
      failEvent,
      newEngineer.newTopicsDisplayName,
      newEngineer.position,
      newEngineer.city,
      newEngineer.surburb,
    );
    expect(response).toEqual({
      status: 500,
      message: 'Not a valid event',
    });
  });

  it('should return dictionary of new topics when configuring new topics', async () => {
    const { configureNewTopics } = require('../engineers.controller');
    const newTopics = await configureNewTopics(newEngineer.newTopicsDisplayName);

    expect(newTopics).toEqual({
      'a new very cool topic': 'aNewVeryCoolTopic',
      'Cyber Security': 'cyberSecurity',
    });
  });
});

describe('getAllEngineersToReview method testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call where on successful data retrieval', async () => {
    const { getAllEngineersToReview } = require('../engineers.controller');
    const expected = [
      {
        userId: 'engineer1',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'A passionate software engineer.',
        email: 'john.doe@example.com',
        linkedin: 'john-doe-linkedin',
        personalWebsite: 'john-doe-website',
        verified: false,
        organisation: 'TechCorp',
        topics: ['Machine Learning', 'Web Development'],
        events: ['Outreach', 'Mentoring'],
        position: 'Lead Developer',
        city: 'New York',
        suburb: 'Brooklyn',
        profilePictureURL: 'fakeURL',
        introductionVideoURL: 'fakeURL',
      },
    ];

    const response = await getAllEngineersToReview();
    expect(mockWhere).toHaveBeenCalledTimes(1);
  });
});

describe('deleteEngineer method testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 on successful deletion', async () => {
    const deleteEngineer = require('../engineers.controller').deleteEngineer;

    const mockDeleteStorage = jest.fn();
    const mockBucket = jest.fn(() => ({
      deleteFiles: mockDeleteStorage,
    }));
    const mockStorage = jest.fn(() => ({
      bucket: mockBucket,
    }));

    jest.isolateModules(() => {
      require('firebase-admin').storage = mockStorage;
    });
    mockBucket.mockImplementationOnce(() => ({
      deleteFiles: jest.fn(() => Promise.resolve()).mockResolvedValue(),
    }));

    const response = await deleteEngineer('engineer1');
    expect(mockStorage).toHaveBeenCalledTimes(1);

    expect(response.status).toBe(200);
    expect(response.message).toBe('Engineer deleted successfully');
    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDeleteUser).toHaveBeenCalledTimes(1);
    // 4 times because 2 topics and 2 events to remove
    expect(mockArrayRemoveFieldValue).toHaveBeenCalledTimes(4);
  });

  it('should return 404 if engineer to delete does not exist', async () => {
    const deleteEngineer = require('../engineers.controller').deleteEngineer;

    const response = await deleteEngineer('nonExistentEngineer');
    expect(response.status).toBe(404);
    expect(response.message).toBe('Engineer does not exist!');
    expect(mockDelete).toHaveBeenCalledTimes(0);
    expect(mockDeleteUser).toHaveBeenCalledTimes(0);
  });
});

describe('updateEngineer method testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 status on successful update', async () => {
    const uid = 'engineer1';
    const updatedData = {
      firstName: 'Aden',
      lastName: 'Ing',
      city: 'Auckland',
      suburb: 'Manukau',
      biography: 'hire me pls',
      events: ['outreach', 'conference', 'collaboration', 'committees', 'mentoring'],
      topics: ['software'],
      profilePictureURL: 'test',
      position: 'jobless',
      organisation: 'at home',
    };

    const userRecord = {
      customClaims: undefined,
      disabled: false,
      email: 'john.doe@example.com',
      emailVerified: false,
      metadata: {},
      multiFactor: undefined,
      passwordHash: undefined,
      passwordSalt: undefined,
      phoneNumber: 'undefined',
      photoURL: undefined,
      providerData: [],
      tenantId: null,
      tokensValidAfterTime: undefined,
      uid: 'engineer1',
    };
    mockGetUser.mockReturnValueOnce(userRecord);
    const updateEngineer = require('../engineers.controller').updateEngineer;

    const response = await updateEngineer(uid, updatedData);
    expect(mockGetUser).toBeCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.message).toBe('Engineer updated successfully');
  });

  it('should return 404 status if engineer does not exist', async () => {
    const uid = 'nonExistentEngineer';
    const updatedData = {
      firstName: 'UpdatedName',
      email: 'updated.email@example.com',
    };

    const updateEngineer = require('../engineers.controller').updateEngineer;

    const response = await updateEngineer(uid, updatedData);
    expect(response.status).toBe(404);
    expect(response.message).toBe('Engineer does not exist');
    expect(mockUpdate).toHaveBeenCalledTimes(0);
  });

  it('should call deleteObject and SaveObject', async () => {
    const uid = 'engineer1';
    const updatedData = {
      firstName: 'Aden',
      lastName: 'Ing',
      city: 'Auckland',
      suburb: 'Manukau',
      biography: 'hire me pls',
      events: ['outreach', 'conference', 'collaboration', 'committees', 'mentoring'],
      topics: ['software'],
      profilePictureURL: 'test',
      position: 'jobless',
      organisation: 'at home',
    };

    const userRecord = {
      customClaims: undefined,
      disabled: false,
      email: 'john.doe@example.com',
      emailVerified: false,
      metadata: {},
      multiFactor: undefined,
      passwordHash: undefined,
      passwordSalt: undefined,
      phoneNumber: 'undefined',
      photoURL: undefined,
      providerData: [],
      tenantId: null,
      tokensValidAfterTime: undefined,
      uid: 'engineer1',
    };
    mockGetUser.mockReturnValueOnce(userRecord);

    const updateEngineer = require('../engineers.controller').updateEngineer;

    const response = await updateEngineer(uid, updatedData);
    expect(response.status).toBe(200);
    expect(response.message).toBe('Engineer updated successfully');
    expect(mockDeleteObject).toHaveBeenCalledTimes(1);
    expect(mockSaveObject).toHaveBeenCalledTimes(1);
  });
});

describe('resubmitEngineerProfile method testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 status on successful update', async () => {
    const uid = 'engineer1';
    const updatedData = {
      firstName: 'Aden',
      lastName: 'Ing',
      city: 'Auckland',
      suburb: 'Manukau',
      biography: 'hire me pls',
      events: ['outreach', 'conference', 'collaboration', 'committees', 'mentoring'],
      topics: ['software'],
      profilePictureURL: 'test',
      position: 'jobless',
      organisation: 'at home',
    };

    const userRecord = {
      customClaims: undefined,
      disabled: false,
      email: 'john.doe@example.com',
      emailVerified: false,
      metadata: {},
      multiFactor: undefined,
      passwordHash: undefined,
      passwordSalt: undefined,
      phoneNumber: 'undefined',
      photoURL: undefined,
      providerData: [],
      tenantId: null,
      tokensValidAfterTime: undefined,
      uid: 'engineer1',
    };
    mockGetUser.mockReturnValueOnce(userRecord);
    const resubmitEngineerProfile = require('../engineers.controller').resubmitEngineerProfile;

    const response = await resubmitEngineerProfile(uid, updatedData);
    expect(mockGetUser).toBeCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledTimes(11);
    expect(mockUpdate).toHaveBeenCalledWith({
      biography: 'hire me pls',
      city: 'Auckland',
      events: ['outreach', 'conference', 'collaboration', 'committees', 'mentoring'],
      firstName: 'Aden',
      lastName: 'Ing',
      organisation: 'at home',
      position: 'jobless',
      profilePictureURL: 'test',
      suburb: 'Manukau',
      topics: ['software'],
      verified: 'to-be-reviewed',
    });
    expect(response.status).toBe(200);
    expect(response.message).toBe('Profile has been resubmitted for review');
  });

  it('should return 404 status if engineer does not exist', async () => {
    const uid = 'nonExistentEngineer';
    const updatedData = {
      firstName: 'UpdatedName',
      email: 'updated.email@example.com',
    };

    const resubmitEngineerProfile = require('../engineers.controller').resubmitEngineerProfile;

    const response = await resubmitEngineerProfile(uid, updatedData);
    expect(response.status).toBe(404);
    expect(response.message).toBe('Engineer does not exist');
    expect(mockUpdate).toHaveBeenCalledTimes(0);
  });
});

describe('getAllEngineersAdmin method testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 on successful get', async () => {
    const adminGetAllEngineers = require('../engineers.controller').adminGetAllEngineers;

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

    const response = await adminGetAllEngineers(orderBy, startAfter, limit);

    expect(response.status).toBe(200);
    expect(response.message).toBe('Success');
    expect(collectionMock).toBeCalledWith('engineers');

    expect(orderByMock).toHaveBeenCalledWith(orderBy);
    expect(limitMock).toHaveBeenCalledWith(limit);

    // We fetch the last user to get the next page
    expect(docMock).toHaveBeenCalledWith(startAfter);
  });

  it('should return 400 if orderBy parameter is not correct', async () => {
    const adminGetAllEngineers = require('../engineers.controller').adminGetAllEngineers;

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

    const response = await adminGetAllEngineers(orderBy, startAfter, limit);

    expect(response.status).toBe(400);
    expect(response.message).toBe('Invalid orderBy parameter');

    //  Nothing should be called
    expect(orderByMock).toHaveBeenCalledTimes(0);
    expect(limitMock).toHaveBeenCalledTimes(0);
    expect(docMock).toHaveBeenCalledTimes(0);
    expect(collectionMock).toHaveBeenCalledTimes(0);
  });

  it('should return 400 if startBy parameter is not correct', async () => {
    const adminGetAllEngineers = require('../engineers.controller').adminGetAllEngineers;

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

    const response = await adminGetAllEngineers(orderBy, startAfter, limit);

    expect(response.status).toBe(400);
    expect(response.message).toBe('Invalid startAfter parameter');

    // All but limit should have been called
    expect(orderByMock).toHaveBeenCalledTimes(1);
    expect(docMock).toHaveBeenCalledTimes(1);
    expect(collectionMock).toHaveBeenCalledTimes(3);
    expect(limitMock).toHaveBeenCalledTimes(0);
  });
});

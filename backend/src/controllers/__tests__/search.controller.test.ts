import { mockFirebase } from 'firestore-jest-mock';
import { mockCollection, mockGet } from 'firestore-jest-mock/mocks/firestore';

mockFirebase({
  database: {
    topics: [
      {
        id: 'software',
        topicName: 'Software Engineering',
      },
      {
        id: 'compsys',
        topicName: 'Computer Systems',
      },
    ],
  },
});

jest.mock('algoliasearch', () => {
  const mockIndex = {
    search: jest.fn().mockResolvedValue({
      hits: [
        {
          objectID: 'df546889e376_dashboard_generated_id',
          name: 'John Doe',
          location: 'Auckland, New Zealand',
          topics: ['software'],
          position: 'ceo',
          organisation: 'Beca',
          imageURL: 'https://www.google.com',
        },
        {
          objectID: '9a80339bc69d0_dashboard_generated_id',
          name: 'Mary jane',
          location: 'Greylynn, Auckland',
          topics: ['software', 'compsys'],
          position: 'engineer',
          organisation: 'University',
          imageURL: 'https://www.google.com',
        },
      ],
      nbPages: 1,
    }),
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

describe('search method testing', () => {
  afterAll(() => {
    jest.unmock('algoliasearch');
    jest.clearAllMocks();
  });

  it('should return 200 if search is successful and with both spec and interest defined', async () => {
    const { search } = require('../search.controller');

    const specialisation = 'software';
    const interest = 'mentoring';
    const pageNumber = 0;
    const limit = 10;

    const response = await search(undefined, specialisation, interest, pageNumber, limit);

    expect(response).toEqual({
      status: 200,
      message: 'Successful search',
      totalPages: 1,
      engineers: [
        {
          uid: 'df546889e376_dashboard_generated_id',
          name: 'John Doe',
          location: 'Auckland, New Zealand',
          specialisation: ['software'],
          position: 'ceo',
          organisation: 'Beca',
          imageURL: 'https://www.google.com',
        },
        {
          uid: '9a80339bc69d0_dashboard_generated_id',
          name: 'Mary jane',
          location: 'Greylynn, Auckland',
          specialisation: ['software', 'compsys'],
          position: 'engineer',
          organisation: 'University',
          imageURL: 'https://www.google.com',
        },
      ],
    });
  });

  it('should return 500 if page number and limit are not defined', async () => {
    const { search } = require('../search.controller');

    const specialisation = 'software';
    const interest = 'mentoring';

    const response = await search(undefined, specialisation, interest, NaN, NaN);

    expect(response).toEqual({
      status: 500,
      message: 'Page number and limit are not defined',
    });
  });
});

describe('get all topics method testing', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should return 200 if get all topics is successful', async () => {
    const { getAllTopics } = require('../search.controller');

    const response = await getAllTopics();
    expect(mockCollection).toHaveBeenCalledWith('topics');
    expect(mockGet).toHaveBeenCalled();
    expect(response).toEqual({
      status: 200,
      message: 'Successful get all topics',
      topics: [
        {
          topicDBName: 'software',
          topicDisplayName: 'Software Engineering',
        },
        {
          topicDBName: 'compsys',
          topicDisplayName: 'Computer Systems',
        },
      ],
    });
  });
});

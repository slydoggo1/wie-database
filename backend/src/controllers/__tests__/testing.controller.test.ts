import { mockFirebase } from 'firestore-jest-mock';
import { mockCreateCustomToken, mockGetUser } from 'firestore-jest-mock/mocks/auth';

mockFirebase({
  database: {
    users: [{ id: 'abc123', name: 'Homer Simpson' }],
  },
});

describe('testing stuff method testing', () => {
  it('should retrieve a token from a UID', async () => {
    const getUserToken = require('../testing.controller').getUserToken;

    await getUserToken('abc123').then((res: any) => {
      expect(res.status).toBe(200);
      expect(res.message).toBe('User token retrieved successfully');
      expect(res.token).toBe('');
      expect(mockGetUser).toHaveBeenCalledWith('abc123');
      expect(mockCreateCustomToken).toHaveBeenCalled();
    });
  });
});

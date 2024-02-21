import { Timestamp } from '@google-cloud/firestore';

export interface FeedbackDAO {
  feedback: string;
  sectionsToChange: boolean[];
}

export interface UserFeedbackDAO {
  email: string;
  name: string;
  feedbackType: string;
  feedback: string;
  time: Timestamp;
  uid: string;
}

export interface UserFeedbackDTO {
  email: string;
  feedback: string;
  time: string;
  uid: string;
  name: string;
  feedbackType: string;
  feedbackId: string;
}

export interface AllUserFeedbackDTO {
  month: string;
  feedback: UserFeedbackDTO[];
}

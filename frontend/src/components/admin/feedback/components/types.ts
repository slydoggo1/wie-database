export interface FeedbackDataProps {
  feedbackData: FeedbackList[];
  isError: boolean;
}

export interface FeedbackDetailsProps {
  feedback: FeedbackDetails | null | undefined;
}

export interface FeedbackTabProps {
  feedbackList: FeedbackList;
  setSelectedFeedback: React.Dispatch<React.SetStateAction<FeedbackDetails | undefined | null>>;
  setSelectedFeedbackId: React.Dispatch<React.SetStateAction<string>>;
  selectedFeedbackId: string;
}

export interface FeedbackDetails {
  email: string;
  name: string;
  time: string;
  feedbackType: string;
  feedback: string;
  uid: string;
  feedbackId: string;
}

export interface FeedbackList {
  month: string;
  feedback: FeedbackDetails[];
}

export interface MonthDropdownProps {
  currentMonth: string;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
}

export const MONTHS: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

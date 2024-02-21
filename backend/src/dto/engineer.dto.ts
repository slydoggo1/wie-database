export enum Events {
  OUTREACH = 'Outreach',
  COLLABORATION = 'Collaboration',
  CONFERENCE = 'Conference',
  COMMITTEES = 'Committees',
  MENTORING = 'Mentoring',
}

export enum ProfileState {
  VERIFIED = 'verified',
  TO_BE_REVIEWED = 'to-be-reviewed',
  REQUEST_CHANGES = 'request-changes',
}

export interface EngineerDTO {
  firstName: string;
  lastName: string;
  bio: string;
  userId: string;
  email: string;
  linkedin?: string;
  personalWebsite?: string;
  verified: ProfileState;
  topics: String[];
  events: Events[];
  organisation: String;
  position: String;
  city: String;
  suburb: String;
  profilePictureURL: string;
  introductionVideoURL?: string;
}

export interface GetAllEngineersDTO {
  uid: string;
  firstName: string;
  lastName: string;
  professionalTitle: string;
  email: string;
  profilePictureURL: string;
}

export interface EngineerCardDTO {
  uid: string;
  name: string;
  location: string;
  specialisation: string[];
  position: string;
  organisation: string;
  imageURL: string;
}

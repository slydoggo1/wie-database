export interface EngineerDAO {
  firstName: string;
  lastName: string;
  biography: string;
  email: string;
  linkedin: string;
  personalWebsite: string;
  verified: string;
  organisation: string;
  topics: string[];
  events: string[];
  position: string;
  city: string;
  suburb: string;
  profilePictureURL: string;
  introductionVideoURL?: string;
}

export const EngineerSortByOptions = ['firstName', 'lastName', 'city', 'suburb', 'verified'];

import { ProfileState } from './ProfileState';

export default interface Engineer {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    city: string;
    suburb: string;
    position: string;
    organisation: string;
    specialisation: string[];
    additionalSpecialisation: string[];
    biography: string;
    profilePicture?: File;
    introductionVideo?: File;
    events: string[];
    linkedIn?: string;
    personalWebsite?: string;
}

export interface EngineerDTO {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    suburb: string;
    position: string;
    organisation: string;
    topics: string[];
    newTopicsDisplayName: string[];
    biography: string;
    events: string[];
    linkedin?: string;
    personalWebsite?: string;
    profilePictureURL: string;
    introductionVideoURL?: string;
}

export interface GetAllEngineersDTO {
    uid: string;
    firstName: string;
    lastName: string;
    title: string;
    professionalTitle: string;
    email: string;
    profilePictureURL: string;
}

export enum Events {
    OUTREACH = 'Outreach',
    COLLABORATION = 'Collaboration',
    CONFERENCE = 'Conference',
    COMMITTEES = 'Committees',
    MENTORING = 'Mentoring',
}

export interface EngineerProfileDTO {
    firstName: string;
    lastName: string;
    bio: string;
    userId: string;
    email: string;
    linkedin?: string;
    personalWebsite: string;
    verified: ProfileState;
    topics: string[];
    events: Events[];
    organisation: string;
    position: string;
    city: string;
    suburb: string;
    profilePictureURL: string;
    introductionVideoURL?: string;
}

export interface AdminEngineerReview {
    uid: string;
    verified: ProfileState;
    feedback: string;
    sections: boolean[];
}

export interface EditEngineerDTO {
    firstName: string;
    lastName: string;
    biography: string;
    linkedin?: string;
    personalWebsite?: string;
    topics: string[];
    events: string[];
    organisation: string;
    position: string;
    city: string;
    suburb: string;
    profilePictureURL: string;
    introductionVideoURL?: string;
}

export interface engineerCardDTO {
    uid: string;
    name: string;
    location: string;
    specialisation: string[];
    position: string;
    organisation: string;
    imageURL: string;
}

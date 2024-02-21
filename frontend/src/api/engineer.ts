import Engineer, { EditEngineerDTO, AdminEngineerReview, EngineerDTO } from '../types/Engineer';
import axios from 'axios';
import { ENGINEERS_URL } from './urls';
import { ProfileState } from '../types/ProfileState';

export const signUpEngineer = async (engineer: Engineer, uid: string, profilePictureURL, introductionVideoURL) => {
    try {
        const engineerDTO: EngineerDTO = {
            uid: uid,
            firstName: engineer.firstName,
            lastName: engineer.lastName,
            email: engineer.email,
            city: engineer.city,
            suburb: engineer.suburb,
            position: engineer.position,
            organisation: engineer.organisation,
            topics: engineer.specialisation,
            newTopicsDisplayName: engineer.additionalSpecialisation,
            biography: engineer.biography,
            events: engineer.events,
            linkedin: engineer.linkedIn,
            personalWebsite: engineer.personalWebsite,
            profilePictureURL: profilePictureURL,
            introductionVideoURL: introductionVideoURL,
        };

        const response = await axios.post(`${ENGINEERS_URL}/signup`, engineerDTO);

        if (response.status !== 201) {
            console.error('An unknown error occured while creating engineer from our backend');
            return undefined;
        }

        return response;
    } catch (error) {
        console.error('An unknown error occured');
        return undefined;
    }
};
export const getEngineerByUserId = async (id: string) => {
    try {
        const response = await axios.get(`${ENGINEERS_URL}/${id}`);

        if (response.status !== 200) {
            console.log('Could not find profile');
            return undefined;
        }

        return response;
    } catch (error) {
        console.log('An unknown error occured');
        return undefined;
    }
};

export const getAllEngineersToReview = async (token: string | null) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = axios.get(`${ENGINEERS_URL}/review`, config);

    return response;
};

export const engineerProfileReview = async (
    uid: string,
    feedback: string,
    sections: boolean[],
    verified: ProfileState,
    token: string | null,
) => {
    const engineerReviewFeedback: AdminEngineerReview = {
        uid: uid,
        verified: verified,
        feedback: feedback,
        sections: sections,
    };

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = axios.post(`${ENGINEERS_URL}/review-engineer-feedback`, engineerReviewFeedback, config);

    return response;
};

export const getEngineerFeedback = async (uid: string, token: string | null) => {
    const response = await axios.get(`${ENGINEERS_URL}/feedback`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            uid: uid,
        },
    });
    return response;
};

export const editEngineer = async (uid: string, updatedEngineer: EditEngineerDTO, token: string | null) => {
    const response = await axios.put(`${ENGINEERS_URL}/edit/${uid}`, updatedEngineer, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

export const resubmitEngineer = async (uid: string, updatedEngineer: EditEngineerDTO, token: string | null) => {
    const response = await axios.put(`${ENGINEERS_URL}/resubmit/${uid}`, updatedEngineer, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

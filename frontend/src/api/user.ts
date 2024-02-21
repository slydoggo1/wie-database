import { User, UserDTO } from '../types/User';
import ContactDetail from '../types/ContactForm';
import axios from 'axios';
import { USERS_URL } from './urls';
import { getUserIdToken } from './firebase.ts';
import { User as firebaseUser } from 'firebase/auth';

export const signUpUser = async (uid: string, user: User, role: string) => {
    try {
        const userDTO: UserDTO = {
            uid: uid,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            school: user.school,
            role: role,
        };

        const response = await axios.post(`${USERS_URL}/signup`, userDTO);
        if (response.status !== 201) {
            console.error('An unkonwn error occured while creating user from our backend');
            return undefined;
        }

        return response.data;
    } catch (error) {
        console.error('An unkonwn error occured while creating user from our backend');
        return undefined;
    }
};

export const getUserById = async (id: string | undefined) => {
    try {
        const response = await axios.get(`${USERS_URL}/${id}`);

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

export const getFavouriteEngineers = (
    id: string | null,
    startAfter: string,
    limit: number | null,
    token: string | null | undefined,
) => {
    return axios.get(`${USERS_URL}/favourites/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { startAfter, limit },
    });
};

export const addFavouriteEngineer = (uid: string | undefined, engineerId: string | undefined, token: string | null) => {
    return axios.post(
        `${USERS_URL}/addFavourite`,
        { uid, engineerId },
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );
};

export const deleteFavouriteEngineer = (
    uid: string | undefined,
    engineerId: string | undefined,
    token: string | null,
) => {
    return axios.post(
        `${USERS_URL}/deleteFavourite`,
        { uid, engineerId },
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );
};

export const forgetPassword = async (email: string) => {
    try {
        const response = await axios.post(`${USERS_URL}/forget-password`, {
            email: email,
        });

        if (response.status !== 201) {
            console.error('An unkonwn error occured while creating the password reset link from our backend');
            return undefined;
        }

        return response.data;
    } catch (error) {
        if ((error as { response?: { status?: number } }).response?.status === 404) {
            console.error('User not found');
            return 'User not found';
        } else {
            console.error('An unknown error occurred while creating the password reset link from our backend');
            return undefined;
        }
    }
};

export const contactEngineer = async (
    email: string,
    yourEmail: string | null,
    name: string | null,
    title: string,
    emailMessage: string,
    token: string | null | undefined,
) => {
    const contactDetail: ContactDetail = {
        email: email,
        yourEmail: yourEmail,
        name: name,
        title: title,
        emailMessage: emailMessage,
        token: token,
    };
    return await axios.post(`${USERS_URL}/contact`, contactDetail, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const fetchFeedbackData = async (firebaseUser: firebaseUser | null) => {
    const token = await getUserIdToken(firebaseUser!);

    const response = await axios.get(`${USERS_URL}/user-feedback`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

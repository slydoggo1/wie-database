import { createUserWithEmailAndPassword, User as FirebaseUser, updateProfile, UserCredential } from 'firebase/auth';
import { FirebaseError } from '@firebase/util';
import { auth } from './../firebaseConfig';
import { uploadBytes, ref, StorageReference } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { FirebaseSignUpError } from '../types/Firebase';

export const createFirebaseUser = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
): Promise<{
    success: boolean;
    value:
        | UserCredential
        | FirebaseSignUpError.EMAIL_ALREADY_IN_USE
        | FirebaseSignUpError.INVALID_EMAIL
        | FirebaseSignUpError.WEAK_PASSWORD
        | undefined;
}> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        updateProfile(auth.currentUser!, {
            displayName: `${firstName} ${lastName}`,
        })
            .then(() => {
                console.log('display name set');
            })
            .catch((error) => {
                console.log(error);
            });

        return { success: true, value: userCredential };
    } catch (error) {
        if (error instanceof FirebaseError) {
            let value: FirebaseSignUpError | undefined = undefined;

            switch (error.code) {
                case 'auth/email-already-in-use':
                    value = FirebaseSignUpError.EMAIL_ALREADY_IN_USE;
                    break;
                case 'auth/invalid-email':
                    value = FirebaseSignUpError.INVALID_EMAIL;
                    break;
                case 'auth/weak-password':
                    value = FirebaseSignUpError.WEAK_PASSWORD;
                    break;
                default:
                    console.error('An unkonwn error occured while creating a firebase user');
                    console.error(error);
                    value = undefined;
                    break;
            }

            return { success: false, value: value };
        } else {
            console.error('An unkonwn error occured while creating a firebase user');
            console.error(error);

            return { success: false, value: undefined };
        }
    }
};

export const cleanUpAuth = async (user: FirebaseUser): Promise<void> => {
    return user.delete();
};

export const uploadFile = async (file: File, path: string): Promise<StorageReference> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);

    return storageRef;
};

export const getUserIdToken = async (user: FirebaseUser): Promise<string | null> => {
    const token = await user.getIdToken(true);
    return token;
};

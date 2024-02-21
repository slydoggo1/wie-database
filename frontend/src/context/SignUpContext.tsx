import Engineer from '../types/Engineer';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { User } from '../types/User';

interface ISignUpContext {
    engineer: Engineer;
    setEngineer: Dispatch<SetStateAction<Engineer>>;
    user: User;
    setUser: Dispatch<SetStateAction<User>>;
    role: string;
    setRole: Dispatch<SetStateAction<string>>;
}

const SignUpContext = createContext<ISignUpContext>({
    engineer: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        city: '',
        suburb: '',
        position: '',
        organisation: '',
        specialisation: [],
        additionalSpecialisation: [],
        biography: '',
        profilePicture: new File([''], ''),
        introductionVideo: new File([''], ''),
        events: [],
        linkedIn: '',
        personalWebsite: '',
    },
    setEngineer: () => {},
    user: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        school: '',
    },
    setUser: () => {},
    role: '',
    setRole: () => {},
});

export function SignUpContextProvider({ children }) {
    const [engineer, setEngineer] = useState<Engineer>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        city: '',
        suburb: '',
        position: '',
        organisation: '',
        specialisation: [],
        additionalSpecialisation: [],
        biography: '',
        profilePicture: new File([''], ''),
        introductionVideo: new File([''], ''),
        events: [],
        linkedIn: '',
        personalWebsite: '',
    });

    const [user, setUser] = useState<User>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        school: '',
    });

    const [role, setRole] = useState<string>('');

    return (
        <SignUpContext.Provider value={{ engineer, setEngineer, user, setUser, role, setRole }}>
            {children}
        </SignUpContext.Provider>
    );
}

export default SignUpContext;

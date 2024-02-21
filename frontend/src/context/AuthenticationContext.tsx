// AuthenticationContext.ts
import { createContext } from 'react';
import { User } from 'firebase/auth';

interface ContextValue {
    firebaseUser: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; errorMessage: string }>;
    logout: () => void;
    claim: string | null | undefined;
    loadingClaim: boolean;
    loadingAuth: boolean;
    favouritedEngineers: string[];
}

const defaultContextValue: ContextValue = {
    firebaseUser: null,
    login: async () => ({
        success: false,
        errorMessage: 'Default context value',
    }),
    logout: () => {},
    claim: undefined,
    loadingClaim: true,
    loadingAuth: true,
    favouritedEngineers: [],
};

const AuthenticationContext = createContext<ContextValue>(defaultContextValue);

export default AuthenticationContext;

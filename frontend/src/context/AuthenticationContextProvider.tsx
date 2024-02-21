import { ReactNode, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, store } from './../firebaseConfig';
import { signInWithEmailAndPassword, User, getAuth } from 'firebase/auth';
import AuthenticationContext from './AuthenticationContext';
import { doc, onSnapshot } from 'firebase/firestore';

interface ContextValue {
    firebaseUser: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; errorMessage: string }>;
    logout: () => void;
    claim: string | null | undefined;
    loadingClaim: boolean;
    loadingAuth: boolean;
    favouritedEngineers: string[];
}

const AuthenticationContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, loading] = useAuthState(auth);
    const [claim, setClaim] = useState<string | null>();
    const [loadingClaim, setLoadingClaim] = useState<boolean>(true);
    const [favouritedEngineers, setFavouriteEngineers] = useState<string[]>([]);
    const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

    useEffect(() => {
        getAuth().onIdTokenChanged(async (user) => {
            if (!user) {
                setClaim(null);
                setLoadingClaim(false);
                setLoadingAuth(false);
                return;
            }

            user.getIdTokenResult(true).then((idTokenResult) => {
                if (idTokenResult.claims.admin) {
                    setClaim('admin');
                } else if (idTokenResult.claims.engineer) {
                    setClaim('engineer');
                } else if (idTokenResult.claims.teacher) {
                    setClaim('teacher');
                } else if (idTokenResult.claims.student) {
                    setClaim('student');
                } else {
                    setClaim(null);
                }
                setLoadingClaim(false);
                setLoadingAuth(false);
            });
        });
    }, []);

    useEffect(() => {
        if (user) {
            onSnapshot(doc(store, 'shortlist', user.uid), (doc) => {
                setFavouriteEngineers(doc.data()?.engineers);
            });
        } else {
            setFavouriteEngineers([]);
        }
    }, [user]);

    const login = async (email: string, password: string): Promise<{ success: boolean; errorMessage: string }> => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true, errorMessage: '' };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return { success: false, errorMessage: errorMessage };
        }
    };

    const logout = (): void => {
        auth.signOut();
    };

    const contextValue: ContextValue = {
        firebaseUser: user || null,
        login,
        logout,
        claim,
        loadingClaim,
        loadingAuth,
        favouritedEngineers,
    };

    return <AuthenticationContext.Provider value={contextValue}>{!loading && children}</AuthenticationContext.Provider>;
};

export default AuthenticationContextProvider;

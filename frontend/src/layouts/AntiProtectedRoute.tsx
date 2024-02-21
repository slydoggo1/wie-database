import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthenticationContext from '../context/AuthenticationContext';
import { Navigate } from 'react-router-dom';

interface AntiProtectedRouteProps {
    redirectPath: string;
}

export default function AntiProtectedRoute({ redirectPath }: AntiProtectedRouteProps) {
    const { firebaseUser } = useContext(AuthenticationContext);

    //   Redirect to home if user is logged in
    if (firebaseUser) {
        return <Navigate to={redirectPath} replace={false} />;
    }

    return <Outlet />;
}

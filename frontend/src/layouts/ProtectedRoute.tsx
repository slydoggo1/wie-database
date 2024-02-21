import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthenticationContext from '../context/AuthenticationContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    requiredClaims: string[];
}

export default function ProtectedRoute({ requiredClaims }: ProtectedRouteProps) {
    const { claim, loadingClaim } = useContext(AuthenticationContext);

    //   Claim has not been loaded yet
    if (loadingClaim) {
        return <div>Loading...</div>;
    }

    //   Claim has loaded and there is no user
    if (claim === null) {
        return <Navigate to={'/login'} replace={true} />;
    }

    //   Claim has loaded but the user does not have the required claim
    if (!requiredClaims.includes(claim!)) {
        return <Navigate to="/access-denied" replace={true} />;
    }

    return <Outlet />;
}

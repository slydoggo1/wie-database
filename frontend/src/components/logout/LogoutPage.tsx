import { useEffect, useContext } from 'react';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router';
import AuthenticationContext from '../../context/AuthenticationContext';

export default function LogoutPage() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthenticationContext);

    useEffect(() => {
        logout();
        navigate('/');
    }, [logout]);

    return (
        <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center text-[#4F2D7F]">
            <div className="m-auto text-center flex-column text-xl font-semibold">
                <CircularProgress size="50px" style={{ color: '#4F2D7F' }} />
                <br />
                Logging out...
            </div>
        </div>
    );
}

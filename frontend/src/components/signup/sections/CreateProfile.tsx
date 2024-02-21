import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '../components/Button';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface CreateProfileProps {
    isLoading: boolean;
    error: boolean;
}

export default function CreateProfile({ isLoading, error }: CreateProfileProps) {
    const navigate = useNavigate();

    const loadingScreen = () => {
        return (
            <>
                <div className=" h-[300px] w-full rounded-xl flex flex-col items-center justify-center">
                    <p className="font-sans text-lg">Creating your Profile</p>
                    <CircularProgress style={{ color: '#4F2D7F' }} />
                </div>
            </>
        );
    };

    const errorPage = () => {
        return (
            <>
                <div className="bg-red-300 h-[300px] rounded-xl flex flex-col items-center justify-center">
                    <ErrorIcon sx={{ fontSize: 90 }} className="text-red-500" />
                    <p className="text-2xl font-bold text-red-500 mt-4">Error</p>
                    <p className="mt-2 text-red-500">Something has gone wrong! Try again later</p>
                </div>

                <Button label="Try Again" className="mt-6" />
            </>
        );
    };

    if (isLoading) {
        return loadingScreen();
    }

    if (error) {
        return errorPage();
    }

    return (
        <>
            <div className="bg-green-200 h-[300px] rounded-xl flex flex-col items-center justify-center">
                <CheckCircleIcon sx={{ fontSize: 90 }} className="text-green-700" />
                <p className="text-2xl font-bold text-green-800 mt-4">Success</p>
                <p className="mt-2">You have successfully created a profile</p>
            </div>

            <Button label="Go to Home" className="mt-6" onClick={() => navigate('/')} />
        </>
    );
}

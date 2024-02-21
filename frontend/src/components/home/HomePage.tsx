import HomePageBanner from './components/HomePageBanner.tsx';
import VisionStatementBanner from './components/VisionStatementBanner.tsx';
import Search from '../search/Search.tsx';
import { useState, useContext, useEffect } from 'react';
import AuthenticationContext from '../../context/AuthenticationContext.tsx';
import { cleanUpAuth } from '../../api/firebase.ts';
import Button from '../signup/components/Button.tsx';
import { Modal } from '@mui/material';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function HomePage() {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const { firebaseUser } = useContext(AuthenticationContext);
    const navigate = useNavigate();
    const handleContinue = () => {
        setOpen(false);
        navigate('/sign-up');
    };

    const handleStartAgain = async () => {
        localStorage.clear();
        setLoading(true);
        if (firebaseUser) {
            await cleanUpAuth(firebaseUser).catch((error) => {
                toast.error('Error Signing Out', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 5000,
                });

                console.log(error);
            });
        }

        setOpen(false);
        setLoading(false);
        navigate('/sign-up');
    };

    const handleExit = async () => {
        localStorage.clear();
        setLoading(true);
        if (firebaseUser) {
            await cleanUpAuth(firebaseUser).catch((error) => {
                toast.error('Error Signing Out', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 5000,
                });

                console.log(error);
            });
        }

        setOpen(false);
        setLoading(false);
    };

    useEffect(() => {
        const personalDetails = localStorage.getItem('personal-details');
        const moreInfo = localStorage.getItem('more-info');
        const interests = localStorage.getItem('interests');

        if (personalDetails || moreInfo || interests) {
            setOpen(true);
        }
    }, []);

    return (
        <div className="bg-[#F1EEF2] h-full overflow-auto">
            <ToastContainer />
            <HomePageBanner />
            <div className=" flex-col content-around relative bottom-[10vh] md:bottom-[10%] px-3 md:px-10 lg:bottom-[10%] 2xl:px-40">
                <div className="bg-white drop-shadow-md rounded-lg">
                    <Search isHome={true} />
                </div>
                <VisionStatementBanner />
            </div>
            <Modal open={open} onClose={handleExit}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-[30%] max-w-[45%] bg-white shadow-lg rounded-xl p-6 flex flex-col">
                    <h1 className="text-[#4F2D7F] font-semibold text-2xl">Continue Signing Up</h1>
                    <p className="text-[#808080] text-sm mb-4">
                        It looks like you've already begun your application. Would you like to continue where you left
                        off?
                    </p>

                    <img src="/continue-signup.svg" alt="Continue Signing Up" className="w-1/2 h-auto mx-auto my-4" />

                    <div className="flex">
                        <div className="w-1/2 pr-1">
                            <Button label="Continue" className="mt-6" onClick={handleContinue} />
                        </div>
                        <div className="w-1/2 pl-1">
                            <Button
                                label={loading ? 'Loading...' : 'Start Again'}
                                className="mt-6"
                                variant="secondary"
                                onClick={handleStartAgain}
                            />
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default HomePage;

import { Outlet } from 'react-router-dom';
import AdminNavBar from '../components/admin/AdminNavBar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

export default function AdminLayout() {
    const { height, width } = useWindowDimensions();
    const navigate = useNavigate();

    const handleClickHome = () => {
        navigate('/');
    };

    const [isSmallScreen, setIsSmallScreen] = useState(width <= 750 || height <= 600);
    // 500 is the width of the mobile breakpoint
    // 768 is the width of the tablet breakpoint

    // 420 is the height of the mobile breakpoint
    // 1024 is the height of the tablet breakpoint

    useEffect(() => {
        const handleResize = () => {
            if (width < 750 || height < 600) {
                setIsSmallScreen(true);
            } else {
                setIsSmallScreen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [height, width]);

    return (
        <div>
            {isSmallScreen ? (
                <div className="bg-[#4F2D7F] h-screen items-center flex flex-col justify-center ">
                    <div className="text-white bg-[#4F2D7F] mx-4">
                        Mobile support not available for admin dashboard.
                    </div>
                    <div className="text-white bg-[#4F2D7F] mx-4"> Please use a larger screen or a desktop.</div>

                    <button
                        className="rounded-md mt-8 mx-8 w-3/6 bg-white h-[60px] text-[#4F2D7F] font-medium hover:border-white hover:border-2 hover:text-white hover:bg-[#4F2D7F]"
                        onClick={handleClickHome}
                    >
                        Back to home
                    </button>
                </div>
            ) : (
                <div className="flex flex-row">
                    <AdminNavBar />
                    <Outlet />
                </div>
            )}
        </div>
    );
}

import { useNavigate } from 'react-router';
import AuthenticationContext from '../../context/AuthenticationContext';
import { useContext } from 'react';

export default function AccessDeniedPage() {
    const navigate = useNavigate();

    const { firebaseUser } = useContext(AuthenticationContext);

    const handleClickGoHome = () => {
        navigate('/');
    };

    const handleClickLogin = () => {
        navigate('/login');
    };

    return (
        <div className="h-screen flex bg-background">
            <div className="m-auto text-center">
                <div className="text-[#4F2D7F] text-3xl font-bold mb-[20px]">
                    Sorry, you do not have access to this page.
                </div>
                <button
                    onClick={handleClickGoHome}
                    className="h-[40px] w-[120px]
                                border-solid border-[#4F2D7F] rounded-md border-2
                                transition ease-in-out delay-50
                                bg-[#4F2D7F] text-white font-medium
                                hover:cursor-pointer hover:bg-[#3C2065] hover:text-white hover:border-[#3C2065]"
                >
                    Go Home
                </button>

                {firebaseUser ? null : (
                    <div>
                        <div className="text-lg font-bold my-2">Or</div>
                        <div>
                            <button
                                onClick={handleClickLogin}
                                className="h-[40px] w-[120px]
                                            border-solid border-[#4F2D7F] rounded-md border-2
                                            transition ease-in-out delay-50
                                            bg-[#4F2D7F] text-white font-medium
                                            hover:cursor-pointer hover:bg-[#3C2065] hover:text-white hover:border-[#3C2065]"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

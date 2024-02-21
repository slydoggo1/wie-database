import { useNavigate } from 'react-router';
import { useContext, useState } from 'react';
import { TextField, CircularProgress } from '@mui/material';
import logo from '../../assets/WiE_Logo.svg';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AuthenticationContext from '../../context/AuthenticationContext';
import { getUserIdToken } from '../../api/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { NavLink } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isFocusedUsername, setIsFocusedUsername] = useState(false);
    const [isFocusedPassword, setIsFocusedPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, firebaseUser } = useContext(AuthenticationContext);
    const [isLoading, setIsLoading] = useState(false);

    const handleClickForgotPassword = () => {
        navigate('/forgot-password');
    };

    const handleClickSignup = () => {
        navigate('/sign-up');
    };

    const handleClickLogin = async (): Promise<void> => {
        setIsLoading(true);
        const { success, errorMessage } = await login(username, password);
        setIsLoading(false);

        if (success) {
            navigate('/');
            if (firebaseUser) {
                const token = await getUserIdToken(firebaseUser);
                console.log(token);
            } else {
                console.log('user not logged in');
            }
        } else {
            console.log(errorMessage);
            toast.error('Incorrect Login Details', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleFocusUsername = () => {
        setIsFocusedUsername(true);
    };

    const handleBlurUsername = () => {
        setIsFocusedUsername(false);
    };

    const handleFocusPassword = () => {
        setIsFocusedPassword(true);
    };

    const handleBlurPassword = () => {
        setIsFocusedPassword(false);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const inputStylesUsername = {
        backgroundColor: isFocusedUsername ? 'white' : '#E5E7EB',
        fontWeight: 'bold',
        borderRadius: '8px',
    };

    const inputStylesPassword = {
        backgroundColor: isFocusedPassword ? 'white' : '#E5E7EB',
        fontWeight: 'bold',
        borderRadius: '8px',
    };

    return (
        <div className="flex h-screen flex-row">
            <ToastContainer />
            <div className="flex flex-col items-center min-w-[50%] max-md:w-[70%] max-sm:w-[100%] max-lg:w-[70%] h-full">
                <NavLink to="/" className="self-start">
                    <img src={logo} alt="WiE Logo" className="w-[180px] max-sm:w-[150px] p-4 pb-0" />
                </NavLink>

                <div className="flex-1 flex flex-col justify-center w-[70%]">
                    <h1 className="font-bold text-[38px] max-md:text-[30px]">Sign in</h1>

                    <h2 className="mb-2 mt-8 font-regular text-[16px]">Username</h2>
                    <TextField
                        id="email"
                        InputProps={{
                            style: inputStylesUsername,
                        }}
                        onFocus={handleFocusUsername}
                        onBlur={handleBlurUsername}
                        onChange={handleUsernameChange}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                handleClickLogin();
                            }
                        }}
                    />

                    <h2 className="mb-2 mt-6 font-regular text-[16px]">Password</h2>
                    <TextField
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment: (
                                <span className="cursor-pointer" onClick={togglePasswordVisibility}>
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </span>
                            ),
                            style: inputStylesPassword,
                        }}
                        onFocus={handleFocusPassword}
                        onBlur={handleBlurPassword}
                        onChange={handlePasswordChange}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                handleClickLogin();
                            }
                        }}
                    />

                    <div className="text-right mt-4">
                        <p
                            onClick={handleClickForgotPassword}
                            className="font-semibold text-[14px] text-[#4F2D7F] hover:underline cursor-pointer"
                        >
                            Forgot password?
                        </p>
                    </div>

                    <button
                        className="rounded-md mt-8 bg-primary-100 w-full h-[60px] text-white font-medium hover:border-[#3C2065] hover:border-2 hover:bg-[#3C2065]"
                        onClick={handleClickLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Log in'}
                    </button>

                    <div className="flex items-center mt-8">
                        <div className="w-1/2 border-t border-solid border-1 border-black"></div>
                        <p className="mx-4 font-medium text-[#4F2D7F] text-[16px]">Or</p>
                        <div className="w-1/2 border-t border-solid border-1 border-black"></div>
                    </div>

                    <div className="flex items-center justify-center mt-8">
                        <p className="font-regular text-[16px]">
                            Don't have an account?{' '}
                            <a
                                onClick={handleClickSignup}
                                className="text-[#4F2D7F] font-semibold hover:underline cursor-pointer"
                            >
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-gradient-to-b from-[#5d258f] via-[#5532a6] to-[#3792ed]"></div>
        </div>
    );
}

export default LoginPage;

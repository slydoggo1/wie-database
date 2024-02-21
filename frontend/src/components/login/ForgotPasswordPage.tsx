import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TextField, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/WiE_Logo.svg';
import { forgetPassword } from '../../api/user';

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isFocusedEmail, setIsFocusedEmail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resetLink, setResetLink] = useState(null);

    const handleClickSignup = () => {
        navigate('/sign-up');
    };
    const handleClickLogin = () => {
        navigate('/login');
    };

    const handleClickResetLink = () => {
        if (resetLink) {
            window.open(resetLink, '_blank');
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError('');
        setResetLink(null);
    };

    const inputStylesEmail = {
        backgroundColor: isFocusedEmail ? 'white' : '#E5E7EB',
        fontWeight: 'bold',
        borderRadius: '8px',
    };
    const handleFocusEmail = () => {
        setIsFocusedEmail(true);
    };

    const handleBlurEmail = () => {
        setIsFocusedEmail(false);
    };

    const validateEmail = (email) => {
        // Simple email format validation using a regular expression
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    };

    const handleResetPassword = async () => {
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }
        setIsLoading(true);

        const response = await forgetPassword(email);
        if (response === 'User not found') {
            toast.error('Please check your email is correct and try again', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
            });
            setIsLoading(false);
        } else if (response) {
            setResetLink(response);
            setIsLoading(false);
            toast.success(
                <div>
                    <a href={response} target="_blank" rel="noopener noreferrer">
                        Password reset link generated. Click here to reset your password.
                    </a>
                </div>,
                {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 5000,
                },
            );
            setEmail(''); // Clear the email input
        } else {
            toast.error('Failed to generate password reset link. Please try again.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            <ToastContainer />
            <div className="flex-1 items-center min-w-[700px]">
                <NavLink to="/">
                    <img src={logo} alt="WiE Logo" className="w-64 p-4" />
                </NavLink>

                <div className="mx-8 sm:mx-16 md:mx-24 lg:mx-32 xl:mx-48 flex-1 p-4 flex flex-col justify-center mt-16">
                    <h1 className="font-bold text-[40px] ">Forgot your password?</h1>

                    <h2 className="mb-2 mt-8 font-regular text-[16px]">
                        Enter your email address here to reset your password
                    </h2>
                    <TextField
                        className="mt-7 w-full"
                        id="email"
                        InputProps={{
                            style: inputStylesEmail,
                        }}
                        onFocus={handleFocusEmail}
                        onBlur={handleBlurEmail}
                        onChange={handleEmailChange}
                        value={email}
                    />

                    {emailError && <div style={{ color: 'red' }}>{emailError}</div>}

                    {resetLink && (
                        <div className="text-center mt-4">
                            <p
                                onClick={handleClickResetLink}
                                className="font-semibold text-[16px] text-[#4F2D7F] hover:underline cursor-pointer underline"
                            >
                                Reset password link
                            </p>
                        </div>
                    )}

                    <button
                        className="rounded-md mt-8 bg-[#4F2D7F] w-full h-[60px] text-white font-medium hover:border-[#3C2065] hover:border-2 hover:text-white hover:bg-[#3C2065]"
                        onClick={handleResetPassword}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <CircularProgress size={24} color="inherit" />
                                <span className="ml-2">Generating reset password link</span>
                            </div>
                        ) : (
                            'Generate reset password link'
                        )}
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
                                Sign up here
                            </a>
                        </p>
                    </div>

                    <div className="flex items-center justify-center mt-8">
                        <p className="font-regular text-[16px]">
                            Already have an account?{' '}
                            <a
                                onClick={handleClickLogin}
                                className="text-[#4F2D7F] font-semibold hover:underline cursor-pointer"
                            >
                                Login here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex-1 bg-gradient-to-b from-[#5d258f] via-[#5532a6] to-[#3792ed]"></div>
        </div>
    );
}

export default ForgotPasswordPage;

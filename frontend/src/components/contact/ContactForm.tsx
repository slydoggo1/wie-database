import { useState, useEffect, useContext } from 'react';
import InputField from './InputField';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import TextField from '@mui/material/TextField';
import { useLocation } from 'react-router';
import { getUserIdToken } from '../../api/firebase';
import AuthenticationContext from '../../context/AuthenticationContext';
import { contactEngineer } from '../../api/user';
import { useNavigate } from 'react-router';
import { CircularProgress } from '@mui/material';

export default function ContactForm() {
    const [email, setEmail] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const { state } = useLocation();
    const [userToken, setUserToken] = useState<string | null | undefined>(undefined);
    const { engineerEmail, firstName, lastName, id } = state;
    const { firebaseUser } = useContext(AuthenticationContext);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [, setShowSuccess] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserToken = async () => {
            if (firebaseUser) {
                const token = await getUserIdToken(firebaseUser);
                setUserToken(token);
                setEmail(firebaseUser.email as string);
                setUserName(firebaseUser.displayName);
            }
        };
        fetchUserToken();
    }, [firebaseUser]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        setShowModal(true);

        if (!title || !message) {
            toast.error('All fields are required!');
            setLoading(false);
            setShowModal(false); // hide the modal if there's an immediate error
            return;
        }

        try {
            const response = await contactEngineer(engineerEmail, email, userName, title, message, userToken);

            setLoading(false);

            if (response.status === 200) {
                setShowSuccess(true);
                setTimeout(() => {
                    navigate(`/view-profile/${id}`);
                    setShowModal(false); // hide the modal after navigating away
                }, 2000);
            } else {
                toast.error('Error sending message. Please try again.');
                setShowModal(false); // hide the modal if there's an error
            }
        } catch (error) {
            setLoading(false);
            toast.error('Error sending message. Please check your connection and try again.');
            setShowModal(false); // hide the modal if there's an error
        }
    };

    return (
        <div className="w-full h-full p-3 md:px-10 md:py-[5px] 2xl:px-40 bg-background">
            <ToastContainer />
            <div className="flex flex-col bg-white p-8 rounded-xl relative">
                {' '}
                <h1 className="text-3xl font-bold text-[#4F2D7F]">
                    Contact {firstName} {lastName}
                </h1>
                {showModal && (
                    <div
                        className="fixed top-0 left-0 w-full h-full flex items-center justify-center"
                        style={{ zIndex: 1000, pointerEvents: 'auto' }}
                    >
                        <div
                            className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"
                            style={{ pointerEvents: 'none' }}
                        ></div>

                        <div
                            className="bg-white p-8 rounded-md shadow-lg w-96 flex flex-col items-center relative"
                            style={{ pointerEvents: 'auto' }}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress sx={{ color: '#4F2D7F' }} />
                                    <p className="text-[#4F2D7F] mt-4">Sending Message...</p>
                                </>
                            ) : (
                                <>
                                    <div className="text-[#4F2D7F] text-5xl mb-4">✓</div>
                                    <p className="text-green-600">Message sent successfully!</p>
                                </>
                            )}
                        </div>
                    </div>
                )}
                <div className="flex flex-col py-4">
                    <InputField
                        labelText="Message Title"
                        inputName="Title"
                        value={title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                        className=""
                    />
                </div>
                <div className="flex flex-col">
                    <label className="pb-4" htmlFor="message">
                        Message Body <span className="text-red-500">*</span>
                    </label>
                    <TextField
                        name="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={16}
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#4F2D7F',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#4F2D7F',
                                },
                            },
                        }}
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    className="mt-4 self-end bg-[#4F2D7F] w-44 text-white p-1 text-lg font-semibold rounded-md hover:bg-[#3C2065] hover:border-[#3C2065] transition ease-in-out delay-50"
                    type="button"
                >
                    Send Message
                </button>
            </div>
        </div>
    );
}

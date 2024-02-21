import { ChangeEvent, useContext, useState } from 'react';

import FeedbackDropDown from './FeedbackDropDown.tsx';
import { CircularProgress, SelectChangeEvent } from '@mui/material';
import TextfieldWithLabel from './TextFieldWithLabel.tsx';
import { StyledTextField } from './components.tsx';
import axios from 'axios';
import { USERS_URL } from '../../api/urls';
import { toast, ToastContainer } from 'react-toastify';
import AuthenticationContext from '../../context/AuthenticationContext';
import { FeedbackType } from '../../types/Feedback.ts';

export default function FeedbackForm() {
    const { firebaseUser } = useContext(AuthenticationContext);

    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [feedbackType, setFeedbackType] = useState<string>(FeedbackType.Website);
    const [feedback, setFeedback] = useState<string>('');

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const handleChangeEmail = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEmail(e.target.value);
    };

    const handleChangeName = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setName(e.target.value);
    };

    const handleChangeFeedbackType = (e: SelectChangeEvent) => {
        setFeedbackType(e.target.value);
    };

    const handleChangeFeedback = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFeedback(e.target.value);
    };

    const handleClickSubmit = async () => {
        setIsLoading(true);
        setIsDisabled(true);

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            toast.error('Email is invalid');
            setIsLoading(false);
            setIsDisabled(false);
            return;
        }

        if (email.trim() === '' || name.trim() === '' || feedback.trim() === '') {
            toast.error('All fields must be filled');
            setIsLoading(false);
            setIsDisabled(false);
            return;
        }

        const response = await axios.post(`${USERS_URL}/submit-user-feedback`, {
            name,
            email,
            feedback,
            uid: firebaseUser ? firebaseUser.uid : null,
            feedbackType,
        });

        if (response.status === 201) {
            toast.success('Feedback successfully submitted');
            clearText();
        } else {
            toast.error('Something went wrong, please try again');
        }

        setIsLoading(false);
        setIsDisabled(false);
    };

    const clearText = () => {
        setEmail('');
        setFeedback('');
        setFeedbackType(FeedbackType.Website);
        setName('');
    };

    return (
        <div className="p-6 md:px-10 md:py-[5px] 2xl:px-40  flex min-h-full justify-center w-full bg-[#F1EEF2]">
            <div className="flex flex-col w-full bg-white drop-shadow-md rounded-lg p-[20px]">
                <div className="flex flex-row justify-between gap-x-4 mb-5">
                    <TextfieldWithLabel
                        placeholder="Email"
                        title="Your email *"
                        value={email}
                        handleChange={handleChangeEmail}
                        type="email"
                        multiline={false}
                    />
                    <TextfieldWithLabel
                        placeholder="Name"
                        title="Your name *"
                        value={name}
                        handleChange={handleChangeName}
                        type="text"
                        multiline={false}
                    />
                </div>

                <h2>Feedback Type *</h2>
                <FeedbackDropDown handleChange={handleChangeFeedbackType} feedbackType={feedbackType} />

                <div className="mt-5">
                    <div className="font-medium text-base">Feedback</div>
                    <StyledTextField
                        fullWidth
                        required
                        placeholder="Your feedback here..."
                        value={feedback}
                        onChange={handleChangeFeedback}
                        multiline
                        className="h-full"
                        minRows={15}
                    />
                </div>
                <div className="flex flex-row justify-end mt-5" onClick={handleClickSubmit}>
                    <button
                        className={`text-center items-center w-[160px] h-[50px]
                                border-solid border-[#4F2D7F] rounded-md p-[10px] border-2
                                font-medium bg-[#4F2D7F] text-white 
                                ${
                                    !isDisabled &&
                                    `hover:cursor-pointer hover:text-white hover:bg-[#3C2065] hover:border-[#3C2065]
                                transition ease-in-out delay-50`
                                }`}
                        disabled={isDisabled}
                    >
                        {isLoading ? <CircularProgress style={{ color: 'white' }} size="24px" /> : `Send Feedback`}
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

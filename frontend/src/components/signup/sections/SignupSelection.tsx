import { useState, useContext } from 'react';
import SignUpContext from '../../../context/SignUpContext';
import Button from '../components/Button';

interface SignupSelectionProps {
    setEngineer: (isEngineer: boolean) => void;
    goToPage: (number: -1 | 1) => void;
}

function SignupSelection({ setEngineer, goToPage }: SignupSelectionProps) {
    const [userType, setUserType] = useState<string>('');

    const { setRole } = useContext(SignUpContext);

    function handleClickContinue() {
        if (userType == 'Engineer') {
            setEngineer(true);
        } else {
            setEngineer(false);
        }

        setRole(userType);
        goToPage(1);
    }

    const handleClickSelection = (selection: string) => {
        setUserType(selection);
    };

    return (
        <div className="text-[#4F2D7F] text-center">
            <div className="text-2xl font-semibold mb-[20px]">Sign up as a</div>
            <div className="h-[450px]">
                <div
                    className={`flex-col items-center mb-[20px]
                                py-[10px]
                                border-solid border-[#4F2D7F] rounded-md border-2
                                transition ease-in-out delay-50
                                hover:bg-[#4F2D7F] hover:text-white hover:cursor-pointer
                                ${userType == 'Engineer' ? 'bg-[#4F2D7F] text-white' : 'bg-white text-[4F2D7F]'}
                                `}
                    onClick={() => handleClickSelection('Engineer')}
                >
                    <div className="m-auto">
                        <div className="text-2xl font-semibold">Engineer/Professional</div>
                        <div className="text-med py-[10px]">You are passionate and want to be a role model...</div>
                    </div>
                </div>

                <div
                    className={`flex-col items-center mb-[20px]
                    py-[10px]
                    border-solid border-[#4F2D7F] rounded-md border-2
                    transition ease-in-out delay-50
                    hover:bg-[#4F2D7F] hover:text-white hover:cursor-pointer
                    ${userType == 'Teacher' ? 'bg-[#4F2D7F] text-white' : 'bg-white text-[4F2D7F]'}
                    `}
                    onClick={() => handleClickSelection('Teacher')}
                >
                    <div className="m-auto">
                        <div className="text-2xl font-semibold">Teacher</div>
                        <div className="text-med py-[10px]">
                            You’re looking for passionate women in STEM to showcase to your....
                        </div>
                    </div>
                </div>

                <div
                    className={`flex-col items-center mb-[20px]
                    py-[10px]
                    border-solid border-[#4F2D7F] rounded-md border-2
                    transition ease-in-out delay-50
                    hover:bg-[#4F2D7F] hover:text-white hover:cursor-pointer
                    ${userType == 'Student' ? 'bg-[#4F2D7F] text-white' : 'bg-white text-[4F2D7F]'}
                    `}
                    onClick={() => handleClickSelection('Student')}
                >
                    <div className="m-auto">
                        <div className="text-2xl font-semibold">Student</div>
                        <div className="text-med py-[10px]">You’re interested in STEM and want to see...</div>
                    </div>
                </div>

                <Button isDisabled={userType == ''} label="Continue" onClick={handleClickContinue} />
            </div>
        </div>
    );
}

export default SignupSelection;

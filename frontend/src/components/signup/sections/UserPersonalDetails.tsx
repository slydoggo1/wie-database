import TextField from '../components/TextField';
import Button from '../components/Button';
import { ChangeEvent, useState, useContext } from 'react';
import SignUpContext from '../../../context/SignUpContext';
import { createFirebaseUser } from '../../../api/firebase';
import { FirebaseSignUpError } from '../../../types/Firebase';
import { passwordStrength } from 'check-password-strength';

interface UserPersonalDetailsProps {
    goToPage: (number: number) => void;
}

export default function UserPersonalDetails({ goToPage }: UserPersonalDetailsProps) {
    const { setUser } = useContext(SignUpContext);
    const [loading, setLoading] = useState(false);

    const [personalDetails, setPersonalDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        school: '',
        password: '',
        confirmPassword: '',
        terms: false,
    });

    const [helperText, setHelperText] = useState({
        firstName: '',
        lastName: '',
        email: '',
        school: '',
        password: '',
        confirmPassword: '',
        terms: '',
    });

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPersonalDetails({ ...personalDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);

        const formValidated = validateForm();

        if (!formValidated) {
            setLoading(false);
            return;
        }

        const { ...rest } = personalDetails;
        setUser(rest);

        const { success, value } = await createFirebaseUser(
            personalDetails.email,
            personalDetails.password,
            personalDetails.firstName,
            personalDetails.lastName,
        );

        if (!success) {
            const error = value as FirebaseSignUpError;
            const newHelperText = {
                ...helperText,
                email: '',
                password: '',
                confirmPassword: '',
            };

            switch (error) {
                case 'auth/email-already-in-use':
                    newHelperText.email = 'Email already in use';
                    break;
                case 'auth/invalid-email':
                    newHelperText.email = 'Invalid email';
                    break;
                case 'auth/weak-password':
                    newHelperText.password = 'Password is too weak';
                    break;
                default:
                    newHelperText.email = 'Something went wrong';
                    break;
            }

            setHelperText(newHelperText);
            setLoading(false);
            return;
        }

        goToPage(2);
        setLoading(false);
    };

    const validateForm = () => {
        let isValid = true;
        const newHelperText = {
            firstName: '',
            lastName: '',
            email: '',
            school: '',
            password: '',
            confirmPassword: '',
            terms: '',
        };

        if (personalDetails.firstName == '') {
            newHelperText.firstName = 'First name is required';
            isValid = false;
        }

        if (personalDetails.lastName == '') {
            newHelperText.lastName = 'Last name is required';
            isValid = false;
        }

        if (personalDetails.email == '') {
            newHelperText.email = 'Email is required';
            isValid = false;
        } else if (!personalDetails.email.includes('@')) {
            newHelperText.email = 'Email is invalid';
            isValid = false;
        }

        if (personalDetails.school == '') {
            newHelperText.school = 'School is required';
            isValid = false;
        }

        if (personalDetails.password == '') {
            newHelperText.password = 'Password is required';
            isValid = false;
        }

        if (!['Weak', 'Medium', 'Strong'].includes(passwordStrength(personalDetails.password).value)) {
            newHelperText.password = 'Password should include at least 6 characters and a number';
            isValid = false;
        }

        if (personalDetails.confirmPassword == '') {
            newHelperText.confirmPassword = 'Confirm password is required';
            isValid = false;
        } else if (personalDetails.confirmPassword != personalDetails.password) {
            newHelperText.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        if (!personalDetails.terms) {
            newHelperText.terms = 'Please accept the terms and conditions';
            isValid = false;
        }

        setHelperText(newHelperText);

        return isValid;
    };

    return (
        <>
            <div className="w-full lg:flex">
                <div className="lg:w-1/2 mt-7">
                    <TextField
                        label="First Name"
                        name="firstName"
                        onChange={onChange}
                        helperText={helperText['firstName']}
                        error={helperText['firstName'] != ''}
                    />
                </div>
                <div className="lg:w-1/2 lg:ml-4 mt-7">
                    <TextField
                        label="Last Name"
                        name="lastName"
                        onChange={onChange}
                        helperText={helperText['lastName']}
                        error={helperText['lastName'] != ''}
                    />
                </div>
            </div>

            <TextField
                label="Email Address"
                name="email"
                className="mt-7"
                onChange={onChange}
                helperText={helperText['email']}
                error={helperText['email'] != ''}
            />

            <TextField
                label="School"
                className="mt-7"
                name="school"
                onChange={onChange}
                helperText={helperText['school']}
                error={helperText['school'] != ''}
            />

            <TextField
                label="Password"
                className="mt-7"
                name="password"
                isPassword
                onChange={onChange}
                helperText={helperText['password']}
                error={helperText['password'] != ''}
            />

            <TextField
                label="Confirm Password"
                className="mt-7"
                name="confirmPassword"
                isPassword
                onChange={onChange}
                helperText={helperText['confirmPassword']}
                error={helperText['confirmPassword'] != ''}
            />

            <div className={`flex items-center my-4`}>
                <input
                    id="terms"
                    type="checkbox"
                    value=""
                    className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onClick={() => setPersonalDetails({ ...personalDetails, terms: !personalDetails.terms })}
                />
                <label
                    htmlFor={'terms'}
                    className="text-slate-500 ml-6 text-sm font-medium font-sans hover:cursor-pointer"
                >
                    I understand and agree to the{' '}
                    <a href="/terms-and-conditions" target="_blank" className="text-blue-700 underline">
                        Terms and Conditions
                    </a>
                </label>
            </div>
            <div className="text-[#d32f2f]">{helperText['terms']}</div>
            <Button label="Continue" className="mt-14" onClick={handleSubmit} loading={loading} />
        </>
    );
}

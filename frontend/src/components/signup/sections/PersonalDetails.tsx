import TextField from '../components/TextField';
import Button from '../components/Button';
import { useContext, useState } from 'react';
import { ChangeEvent } from 'react';
import SignUpContext from '../../../context/SignUpContext';
import { createFirebaseUser } from '../../../api/firebase';
import { FirebaseSignUpError } from '../../../types/Firebase';
import { useEffect } from 'react';
import { passwordStrength } from 'check-password-strength';

interface PersonalDetailsProps {
    goToPage: (number) => void;
}

export default function PersonalDetails({ goToPage }: PersonalDetailsProps) {
    const [personalDetails, setPersonalDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [helperText, setHelperText] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const { engineer, setEngineer } = useContext(SignUpContext);
    const [loading, setLoading] = useState(false);

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
        setEngineer({
            ...engineer,
            ...rest,
        });

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
        localStorage.setItem('personal-details', JSON.stringify(personalDetails));
        goToPage(2);
        setLoading(false);
    };

    const validateForm = () => {
        personalDetails.firstName = personalDetails.firstName.trim();
        personalDetails.lastName = personalDetails.lastName.trim();
        personalDetails.email = personalDetails.email.trim();
        personalDetails.password = personalDetails.password.trim();
        personalDetails.confirmPassword = personalDetails.confirmPassword.trim();

        let isValid = true;
        const newHelperText = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
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

        setHelperText(newHelperText);
        return isValid;
    };

    useEffect(() => {
        const personalDetails = localStorage.getItem('personal-details');

        if (personalDetails) {
            setPersonalDetails(JSON.parse(personalDetails));
        }
    }, []);

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

            <Button label="Continue" className="mt-6" onClick={handleSubmit} loading={loading} />
        </>
    );
}

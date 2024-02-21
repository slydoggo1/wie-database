import { TextField, FormGroup, FormControlLabel, Checkbox, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import { getUserIdToken } from '../../../api/firebase';
import AuthenticationContext from '../../../context/AuthenticationContext';
import { engineerProfileReview } from '../../../api/engineer';
import { EngineerProfileDTO as EngineerDTO } from '../../../types/Engineer';
import { ProfileState } from '../../../types/ProfileState';

interface ReviewEngineerProfile {
    engineer: EngineerDTO | null;
}

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: '#4F2D7F',
            borderWidth: '2px',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#4F2D7F',
        },
        '& fieldset': {
            borderWidth: '2px',
        },
        '& .MuiInputBase-input': {
            minHeight: '100px',
            maxHeight: '100px',
        },
    },
});

export default function EngineerFeedback({
    engineer,
    triggerFetchData,
}: ReviewEngineerProfile & { triggerFetchData: () => void }) {
    const { firebaseUser } = useContext(AuthenticationContext);

    const [userToken, setUserToken] = useState<string | null | undefined>(undefined);

    const [textFieldValue, setTextFieldValue] = useState('');

    const initialCheckboxValues = {
        biography: false,
        email: false,
        city: false,
        suburb: false,
        position: false,
        organisation: false,
        linkedInProfile: false,
        profilePicture: false,
        videoIntroduction: false,
    };

    const fieldNames = [
        { name: 'biography' },
        { name: 'email' },
        { name: 'city' },
        { name: 'suburb' },
        { name: 'position' },
        { name: 'organisation' },
        { name: 'linkedInProfile' },
        { name: 'profilePicture' },
        { name: 'videoIntroduction' },
    ];

    const checkboxValuesArray = Object.values(initialCheckboxValues);

    const [checkboxValues, setCheckboxValues] = useState<boolean[]>(checkboxValuesArray);

    useEffect(() => {
        const fetchUserToken = async () => {
            if (firebaseUser) {
                const token = await getUserIdToken(firebaseUser);
                setUserToken(token);
            }
        };
        fetchUserToken();
    }, [firebaseUser]);

    // reset feedback inputs on selected engineer change
    useEffect(() => {
        setCheckboxValues(fieldNames.map(() => false));
        setTextFieldValue('');
    }, [engineer]);

    useEffect(() => {}, [checkboxValues]);

    const handleTextFieldChange = (event) => {
        setTextFieldValue(event.target.value);
    };

    const handleCheckboxChange = (event, index) => {
        const { checked } = event.target;
        setCheckboxValues((prevValues) => {
            const newValues = [...prevValues];
            newValues[index] = checked;
            return newValues;
        });
    };

    const handleVerifyButtonClick = async (verified: ProfileState) => {
        const userId = engineer?.userId ?? '';
        const adminToken = userToken || '';

        if (textFieldValue.length === 0 && verified === ProfileState.REQUEST_CHANGES) {
            toast.error('Feedback field required! Please enter feedback');

            setCheckboxValues(fieldNames.map(() => false));
            setTextFieldValue('');
        } else {
            engineerProfileReview(userId, textFieldValue, checkboxValues, verified, adminToken)
                .then(() => {
                    if (verified === ProfileState.VERIFIED) {
                        toast.success('Profile reviewed and verified');
                    }
                    if (verified === ProfileState.REQUEST_CHANGES) {
                        toast.success('Profile reviewed and rejected');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    toast.error('Error sending review');
                });

            setCheckboxValues(fieldNames.map(() => false));
            setTextFieldValue('');
            triggerFetchData();
        }
    };

    return (
        <div className="h-1/2">
            <div className="bg-white h-3/4 shadow-lg rounded-lg p-4 mb-8 overflow-y-scroll flex-col">
                <h1 className="text-xl font-semibold text-[#4F2D7F] mb-4"> Feedback</h1>

                <h1 className="text-base font-semibold mb-4"> General Feedback</h1>

                <div className="mb-4">
                    <StyledTextField
                        fullWidth
                        placeholder="Enter engineer profile feedback here"
                        multiline
                        value={textFieldValue}
                        onChange={handleTextFieldChange}
                    />
                </div>

                <h1 className="text-base font-semibold mb-4">Section To Change</h1>

                <div>
                    <Grid container spacing={2}>
                        {fieldNames.map((field, index) => (
                            <Grid item xs={4} key={field.name}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={checkboxValues[index]}
                                                onChange={(event) => handleCheckboxChange(event, index)}
                                                name={field.name}
                                            />
                                        }
                                        label={field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                                    />
                                </FormGroup>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </div>

            <div className="flex-grow flex justify-between">
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleVerifyButtonClick(ProfileState.VERIFIED)}
                    style={{ flex: 1, marginRight: '8px' }}
                >
                    Verify
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleVerifyButtonClick(ProfileState.REQUEST_CHANGES)}
                    style={{ flex: 1 }}
                >
                    Reject
                </Button>

                <ToastContainer />
            </div>
        </div>
    );
}

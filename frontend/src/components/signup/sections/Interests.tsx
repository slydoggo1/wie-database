import TextField from '../components/TextField';
import Button from '../components/Button';
import Title from '../components/Title';
import { useState, ChangeEvent, useEffect, useContext } from 'react';
import SignUpContext from '../../../context/SignUpContext';
import Interest from '../components/Interest';

import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import CoPresentRoundedIcon from '@mui/icons-material/CoPresentRounded';

interface InterestsProps {
    goToPage: (number: number) => void;
}

interface InterestsState {
    events: string[];
    linkedIn: string;
    terms: boolean;
    personalWebsite: string;
}

export default function Interests({ goToPage }: InterestsProps) {
    const [interests, setInterests] = useState<InterestsState>({
        events: [],
        linkedIn: '',
        terms: false,
        personalWebsite: '',
    });

    const [helperText, setHelperText] = useState({
        events: '',
        linkedIn: '',
        terms: '',
        personalWebsite: '',
    });

    const { engineer, setEngineer } = useContext(SignUpContext);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInterests({ ...interests, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let isValid = true;
        const newHelperText = { ...helperText };

        interests.linkedIn = interests.linkedIn.trim();
        // linkedin can be empty, only check if link is valid if there is input
        if (interests.linkedIn !== '') {
            if (!interests.linkedIn.includes('https://')) {
                interests.linkedIn = `https://${interests.linkedIn}`;
            }

            const linkedinPattern = new RegExp('^(https?:\\/\\/)?(www\\.)?linkedin\\.com\\/in\\/.+$', 'i');

            if (!linkedinPattern.test(interests.linkedIn)) {
                isValid = false;
                newHelperText.linkedIn = 'Please enter a valid LinkedIn Profile URL';
            } else {
                newHelperText.linkedIn = '';
            }
        }

        interests.personalWebsite = interests.personalWebsite.trim();
        // personal website can be empty, only check if link is valid if there is input
        if (interests.personalWebsite !== '') {
            if (!interests.personalWebsite.includes('https://')) {
                interests.personalWebsite = `https://${interests.personalWebsite}`;
            }

            const personalWebsitePattern = new RegExp(
                '^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$',
                'i',
            );

            if (!personalWebsitePattern.test(interests.personalWebsite)) {
                isValid = false;
                newHelperText.personalWebsite = 'Please enter a valid website URL';
            } else {
                newHelperText.personalWebsite = '';
            }
        }

        if (interests.events.length === 0) {
            isValid = false;
            newHelperText.events = 'Please select at least one event interest';
        } else {
            newHelperText.events = '';
        }

        if (!interests.terms) {
            isValid = false;
            newHelperText.terms = 'Please accept the terms and conditions';
        } else {
            newHelperText.terms = '';
        }

        setHelperText(newHelperText);
        return isValid;
    };

    const onInterestClick = (interest: string) => {
        if (interests.events.includes(interest)) {
            setInterests({
                ...interests,
                events: interests.events.filter((item) => item !== interest),
            });
        } else {
            setInterests({ ...interests, events: [...interests.events, interest] });
        }
    };

    const updateContext = () => {
        const { ...rest } = interests;

        setEngineer({
            ...engineer,
            ...rest,
        });

        localStorage.setItem('interests', JSON.stringify(interests));
        return true;
    };

    useEffect(() => {
        localStorage.getItem('interests') && setInterests(JSON.parse(localStorage.getItem('interests')!));
    }, []);

    return (
        <>
            <Title>Interests</Title>
            <p className="font-sans mt-2">Select the events that you would like to be contacted for</p>

            <div className="flex flex-row justify-evenly flex-wrap mt-6 mb-6">
                <Interest
                    icon={<VolunteerActivismRoundedIcon fontSize="large" />}
                    text="Outreach"
                    onClick={() => onInterestClick('outreach')}
                />
                <Interest
                    icon={<CoPresentRoundedIcon fontSize="large" />}
                    text="Conference"
                    onClick={() => onInterestClick('conference')}
                />
                <Interest
                    icon={<HandshakeRoundedIcon fontSize="large" />}
                    text="Collaborations"
                    onClick={() => onInterestClick('collaboration')}
                />
                <Interest
                    icon={<Diversity3RoundedIcon fontSize="large" />}
                    text="Committees"
                    onClick={() => onInterestClick('committees')}
                />
                <Interest
                    icon={<SupervisorAccountRoundedIcon fontSize="large" />}
                    text="Mentoring"
                    onClick={() => onInterestClick('mentoring')}
                />
            </div>

            <div className="text-[#d32f2f]">{helperText['events']}</div>

            <Title className="mt-4">Social Media</Title>
            <TextField label="LinkedIn URL" name="linkedIn" className="mt-4" onChange={onChange} />
            <div className="text-[#d32f2f]">{helperText['linkedIn']}</div>

            <Title className="mt-4">Extra link</Title>
            <TextField
                label="Another link to your personal website/research/etc..."
                name="personalWebsite"
                className="mt-4"
                onChange={onChange}
            />
            <div className="text-[#d32f2f]">{helperText['personalWebsite']}</div>

            <Title className="mt-4">Terms and Conditions</Title>

            <div className={`flex items-center my-4`}>
                <input
                    id="terms"
                    type="checkbox"
                    value=""
                    className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onClick={() => setInterests({ ...interests, terms: !interests.terms })}
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
            <Button
                label="Continue"
                className="mt-6"
                onClick={() => validateForm() && updateContext() && goToPage(4)}
            />
        </>
    );
}

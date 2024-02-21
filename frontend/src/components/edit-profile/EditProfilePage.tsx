import Title from '../signup/components/Title';
import Section from './components/Section';
import TextField from '../signup/components/TextField';
import TopicSelect from '../signup/components/TopicSelect';
import { useState, useEffect, useRef, useContext } from 'react';
import AuthenticationContext from '../../context/AuthenticationContext';
import { getSpecialisations } from '../../api/search';
import { TopicsDTO } from '../../types/Search';

import Interest from '../signup/components/Interest';
import ToBeReviewed from './components/ToBeReviewed';
import UploadItem from '../signup/components/UploadItem';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import CoPresentRoundedIcon from '@mui/icons-material/CoPresentRounded';
import { editEngineer, getEngineerByUserId, getEngineerFeedback, resubmitEngineer } from '../../api/engineer';
import { CircularProgress } from '@mui/material';
import RequestChanges from './components/RequestChanges';
import { getIdToken } from 'firebase/auth';
import { ProfileState } from '../../types/ProfileState';
import { uploadFile } from '../../api/firebase';
import { getDownloadURL } from 'firebase/storage';
import { EditEngineerDTO } from '../../types/Engineer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

interface ProfileUpdateState {
    firstName: string;
    lastName: string;
    city: string;
    suburb: string;
    position: string;
    organisation: string;
    interests: string[];
    specs: string[];
    biography: string;
    linkedIn: string;
    personalWebsite: string;
    verified: string;
    profilePictureURL: string;
    introductionVideoURL?: string;
}

export default function EditProfilePage() {
    const { firebaseUser } = useContext(AuthenticationContext);
    const [options, setOptions] = useState<string[]>([]);
    const [originalSpecs, setOriginalSpecs] = useState<TopicsDTO[]>([]);
    const [feedback, setFeedback] = useState(null);

    const [profilePicture, setProfilePicture] = useState<File>();
    const [introductionVideo, setIntroductionVideo] = useState<File>();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const [profileUpdate, setProfileUpdate] = useState<ProfileUpdateState>({
        firstName: '',
        lastName: '',
        city: '',
        suburb: '',
        position: '',
        organisation: '',
        interests: [],
        specs: [],
        biography: '',
        linkedIn: '',
        personalWebsite: '',
        verified: '',
        profilePictureURL: '',
        introductionVideoURL: undefined,
    });

    const personalDetailsRef = useRef<null | HTMLDivElement>(null);
    const locationRef = useRef<null | HTMLDivElement>(null);
    const professionalTitleRef = useRef<null | HTMLDivElement>(null);
    const biographyRef = useRef<null | HTMLDivElement>(null);
    const profileDetailsRef = useRef<null | HTMLDivElement>(null);
    const interestsRef = useRef<null | HTMLDivElement>(null);
    const socialRef = useRef<null | HTMLDivElement>(null);

    const handleSubmit = async () => {
        const validationErrors: Record<string, boolean> = {};
        const errorMessages: string[] = [];

        if (!profileUpdate.firstName) {
            validationErrors.firstName = true;
            errorMessages.push('First Name');
        }
        if (!profileUpdate.lastName) {
            validationErrors.lastName = true;
            errorMessages.push('Last Name');
        }
        if (!profileUpdate.city) {
            validationErrors.city = true;
            errorMessages.push('City');
        }
        if (!profileUpdate.suburb) {
            validationErrors.suburb = true;
            errorMessages.push('Suburb');
        }
        if (!profileUpdate.position) {
            validationErrors.position = true;
            errorMessages.push('Position');
        }
        if (!profileUpdate.organisation) {
            validationErrors.organisation = true;
            errorMessages.push('Organisation');
        }
        if (!profileUpdate.biography) {
            validationErrors.biography = true;
            errorMessages.push('Biography');
        }
        if (profileUpdate.interests.length === 0) {
            validationErrors.interests = true;
            errorMessages.push('Interest');
        }
        if (profileUpdate.specs.length === 0) {
            validationErrors.specs = true;
            errorMessages.push('Specialisations');
        }

        if (errorMessages.length > 0) {
            setErrors(validationErrors);
            toast.error(`Please fill in the following fields: ${errorMessages.join(', ')}`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
            });
            return;
        }
        setSubmitting(true);
        try {
            let profilePictureURL: string = profileUpdate.profilePictureURL;

            if (profilePicture) {
                const profilePictureRef = await uploadFile(
                    profilePicture,
                    `${firebaseUser!.uid}/images/profile-picture.${profilePicture?.name.split('.').pop()}`,
                );
                profilePictureURL = await getDownloadURL(profilePictureRef);
            }

            let introductionVideoURL: string | undefined = profileUpdate.profilePictureURL;
            if (introductionVideo) {
                const introductionVideoRef = await uploadFile(
                    introductionVideo,
                    `${firebaseUser!.uid}/videos/introduction-video.${introductionVideo?.name.split('.').pop()}`,
                );
                introductionVideoURL = await getDownloadURL(introductionVideoRef);
            }

            const token = await getIdToken(firebaseUser!);

            const topics = profileUpdate.specs.map((item) => {
                const topic = originalSpecs.find((spec) => spec.topicDisplayName === item);
                return topic?.topicDisplayName || item;
            });

            const editEngineerDTO: EditEngineerDTO = {
                firstName: profileUpdate.firstName,
                lastName: profileUpdate.lastName,
                city: profileUpdate.city,
                suburb: profileUpdate.suburb,
                position: profileUpdate.position,
                organisation: profileUpdate.organisation,
                topics: topics,
                events: profileUpdate.interests.map((item) => item.toLowerCase()),
                biography: profileUpdate.biography,
                linkedin: profileUpdate.linkedIn,
                personalWebsite: profileUpdate.personalWebsite,
                profilePictureURL: profilePictureURL,
                introductionVideoURL: introductionVideoURL,
            };

            
            if (
                profileUpdate.verified === ProfileState.REQUEST_CHANGES ||
                profileUpdate.verified === ProfileState.TO_BE_REVIEWED
            ) {
                await resubmitEngineer(firebaseUser!.uid, editEngineerDTO, token);
            } else {
                await editEngineer(firebaseUser!.uid, editEngineerDTO, token);
            }

            setSubmitting(false);
            toast.success('Profile Updated', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
            });

            profileUpdate.verified =
                profileUpdate.verified === ProfileState.REQUEST_CHANGES
                    ? ProfileState.TO_BE_REVIEWED
                    : profileUpdate.verified;
        } catch (error) {
            toast.error('Error has Occurred', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
            });
        }
    };

    useEffect(() => {
        const fetchFeedback = async () => {
            const token = await getIdToken(firebaseUser!);
            const response = await getEngineerFeedback(firebaseUser!.uid, token);
            setLoading(false);

            return response;
        };

        getSpecialisations().then((res) => {
            const topics: TopicsDTO[] = res.data;
            setOriginalSpecs(topics);

            const topicsName = topics.map((item) => item.topicDisplayName);
            setOptions(topicsName);
        });

        getEngineerByUserId(firebaseUser!.uid)
            .then((response) => {
                const engineer = response?.data;

                setProfileUpdate({
                    firstName: engineer.firstName,
                    lastName: engineer.lastName,
                    city: engineer.city,
                    suburb: engineer.suburb,
                    position: engineer.position,
                    organisation: engineer.organisation,
                    interests: engineer.events,
                    specs: engineer.topics,
                    biography: engineer.bio,
                    linkedIn: engineer.linkedin,
                    personalWebsite: engineer.personalWebsite,
                    verified: engineer.verified,
                    profilePictureURL: engineer.profilePictureURL,
                    introductionVideoURL: engineer.introductionVideoURL,
                });

                if (engineer.verified === ProfileState.REQUEST_CHANGES) {
                    fetchFeedback()
                        .then((res) => {
                            setFeedback(res?.data?.feedback);
                        })
                        .catch((error) => {
                            console.log(error);
                            setLoading(false);
                        });
                } else {
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const removeSpec = (spec: string) => {
        const updatedSpecs = profileUpdate.specs.filter((item) => item !== spec);
        setProfileUpdate({
            ...profileUpdate,
            specs: updatedSpecs,
        });
    };

    const setSpecs = (specs: string[]) => {
        setProfileUpdate({
            ...profileUpdate,
            specs: specs,
        });
    };

    const onInterestClick = (interest: string) => {
        if (profileUpdate.interests.includes(interest)) {
            setProfileUpdate({
                ...profileUpdate,
                interests: profileUpdate.interests.filter((item) => item !== interest),
            });
        } else {
            setProfileUpdate({
                ...profileUpdate,
                interests: [...profileUpdate.interests, interest],
            });
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileUpdate({ ...profileUpdate, [e.target.name]: e.target.value });
    };

    return (
        <div className="w-full min-h-screen p-3 md:p-10 2xl:px-40 2xl:py-10 bg-[#F1EEF2] p-2 md:p-4 xl:px-10 flex flex-col">
            <ToastContainer />
            {profileUpdate.verified === ProfileState.TO_BE_REVIEWED ? (
                <ToBeReviewed />
            ) : profileUpdate.verified === ProfileState.REQUEST_CHANGES ? (
                <RequestChanges changes={feedback || 'Feedback not Found'} />
            ) : (
                ''
            )}
            <div className="bg-white rounded-md w-full drop-shadow-md px-10 py-7 grow flex flex-col">
                <Title>Edit Profile</Title>
                <p>
                    Change any of the text fields below to update your profile. You can also upload a new profile
                    picture and introduction video. Click Save once you are happy with your changes.
                </p>
                <div className="flex mt-6 grow">
                    <div className="w-1/5 px-2 hidden lg:block">
                        <Section
                            onClick={() =>
                                personalDetailsRef.current?.scrollIntoView({
                                    behavior: 'smooth',
                                })
                            }
                            number={1}
                            label="Personal Details"
                        />
                        <Section
                            onClick={() =>
                                locationRef.current?.scrollIntoView({
                                    behavior: 'smooth',
                                })
                            }
                            number={2}
                            label="Location"
                        />
                        <Section
                            onClick={() =>
                                professionalTitleRef.current?.scrollIntoView({
                                    behavior: 'smooth',
                                })
                            }
                            number={3}
                            label="Professional Title"
                        />
                        <Section
                            onClick={() =>
                                biographyRef.current?.scrollIntoView({
                                    behavior: 'smooth',
                                })
                            }
                            number={4}
                            label="Biography"
                        />
                        <Section
                            onClick={() =>
                                profileDetailsRef.current?.scrollIntoView({
                                    behavior: 'smooth',
                                })
                            }
                            number={5}
                            label="Profile Details"
                        />
                        <Section
                            onClick={() =>
                                interestsRef.current?.scrollIntoView({
                                    behavior: 'smooth',
                                })
                            }
                            number={6}
                            label="Interests"
                        />
                        <Section
                            onClick={() =>
                                socialRef.current?.scrollIntoView({
                                    behavior: 'smooth',
                                })
                            }
                            number={7}
                            label="Social Media"
                        />
                    </div>

                    <div className="w-full flex justify-center items-center">
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <div className="w-full lg:w-4/5">
                                <Title innerRef={personalDetailsRef} className="text-xl">
                                    Personal Details
                                </Title>
                                <div className="mt-4 flex flex-col md:flex-row">
                                    <div className="w-full md:w-1/2 mr-2">
                                        <TextField
                                            value={profileUpdate['firstName']}
                                            name="firstName"
                                            onChange={onChange}
                                            label="First Name"
                                            error={errors.firstName}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <TextField
                                            value={profileUpdate['lastName']}
                                            name="lastName"
                                            onChange={onChange}
                                            label="Last Name"
                                            error={errors.lastName}
                                        />
                                    </div>
                                </div>

                                <Title innerRef={locationRef} className="text-xl mt-4">
                                    Location
                                </Title>
                                <div className="mt-4 flex flex-col md:flex-row">
                                    <div className="w-full md:w-1/2 mr-2">
                                        <TextField
                                            value={profileUpdate['city']}
                                            name="city"
                                            onChange={onChange}
                                            label="City"
                                            error={errors.city}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <TextField
                                            value={profileUpdate['suburb']}
                                            name="suburb"
                                            onChange={onChange}
                                            label="Suburb"
                                            error={errors.suburb}
                                        />
                                    </div>
                                </div>

                                <Title innerRef={professionalTitleRef} className="text-xl mt-4">
                                    Professional Title
                                </Title>
                                <div className="mt-4 flex flex-col md:flex-row">
                                    <div className="w-full md:w-1/3 mr-2">
                                        <TextField
                                            value={profileUpdate['position']}
                                            name="position"
                                            onChange={onChange}
                                            label="Position"
                                            error={errors.position}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/3 mr-2">
                                        <TextField
                                            value={profileUpdate['organisation']}
                                            name="organisation"
                                            onChange={onChange}
                                            label="Organisation"
                                            error={errors.organisation}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/3">
                                        <TopicSelect
                                            options={options}
                                            specs={profileUpdate['specs']}
                                            setSpec={setSpecs}
                                            onRemoveSpec={removeSpec}
                                            label="Specialisation"
                                            error={errors.specs}
                                        />
                                    </div>
                                </div>

                                <Title innerRef={biographyRef} className="text-xl mt-4 mb-2">
                                    Biography
                                </Title>
                                <TextField
                                    value={profileUpdate['biography']}
                                    name="biography"
                                    onChange={onChange}
                                    multiline
                                    rows={4}
                                    error={errors.biography}
                                />

                                <Title innerRef={profileDetailsRef} className="text-xl mt-4 mb-2">
                                    Profile Details
                                </Title>

                                <div className="mt-4 flex flex-col md:flex-row">
                                    <div className="w-full md:w-1/2 mr-2">
                                        <UploadItem
                                            type="image"
                                            id="profile-picture"
                                            icon={
                                                <CloudUploadIcon
                                                    sx={{
                                                        color: '#C4C4C4',
                                                        height: '3rem',
                                                        width: '3rem',
                                                    }}
                                                />
                                            }
                                            label="Upload your Profile Picture here!"
                                            className="mt-2"
                                            accept="image/*"
                                            file={profilePicture}
                                            setFile={setProfilePicture}
                                            existingImage={profileUpdate['profilePictureURL']}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <UploadItem
                                            type="video"
                                            id="intro-video"
                                            icon={
                                                <CloudUploadIcon
                                                    sx={{
                                                        color: '#C4C4C4',
                                                        height: '3rem',
                                                        width: '3rem',
                                                    }}
                                                />
                                            }
                                            label="Upload your Introduction Video here!"
                                            className="mt-2"
                                            accept="video/mp4,video/x-m4v,video/*"
                                            file={introductionVideo}
                                            setFile={setIntroductionVideo}
                                            existingVideo={profileUpdate['introductionVideoURL']}
                                        />
                                    </div>
                                </div>

                                <Title innerRef={interestsRef} className="text-xl mt-4 mb-2">
                                    Interests
                                </Title>
                                <div className="flex flex-row justify-evenly flex-wrap mt-6 mb-6">
                                    <Interest
                                        icon={<VolunteerActivismRoundedIcon fontSize="large" />}
                                        text="Outreach"
                                        onClick={() => onInterestClick('Outreach')}
                                        initialSelect={profileUpdate['interests'].includes('Outreach')}
                                    />
                                    <Interest
                                        icon={<CoPresentRoundedIcon fontSize="large" />}
                                        text="Conference"
                                        onClick={() => onInterestClick('Conference')}
                                        initialSelect={profileUpdate['interests'].includes('Conference')}
                                    />
                                    <Interest
                                        icon={<HandshakeRoundedIcon fontSize="large" />}
                                        text="Collaborations"
                                        onClick={() => onInterestClick('Collaboration')}
                                        initialSelect={profileUpdate['interests'].includes('Collaboration')}
                                    />
                                    <Interest
                                        icon={<Diversity3RoundedIcon fontSize="large" />}
                                        text="Committees"
                                        onClick={() => onInterestClick('Committees')}
                                        initialSelect={profileUpdate['interests'].includes('Committees')}
                                    />
                                    <Interest
                                        icon={<SupervisorAccountRoundedIcon fontSize="large" />}
                                        text="Mentoring"
                                        onClick={() => onInterestClick('Mentoring')}
                                        initialSelect={profileUpdate['interests'].includes('Mentoring')}
                                    />
                                </div>

                                <Title innerRef={socialRef} className="text-xl mt-4 mb-2">
                                    Social Media
                                </Title>
                                <TextField
                                    value={profileUpdate['linkedIn']}
                                    name="linkedIn"
                                    onChange={onChange}
                                    label="LinkedIn URL"
                                    className="mb-2"
                                />

                                <TextField
                                    value={profileUpdate['personalWebsite']}
                                    name="personalWebsite"
                                    onChange={onChange}
                                    label="Personal Website"
                                />

                                <div className="flex justify-end py-5">
                                    <button
                                        className="self-end max-lg:mt-2 rounded-md bg-[#4F2D7F]
                                text-white font-medium
                                px-4 py-2
                                border-2
                                border-[#4F2D7F]
                                hover:bg-[#3C2065]
                                hover:border-[#3C2065]
                                transition ease-in-out delay-50"
                                        onClick={() => handleSubmit()}
                                    >
                                        {submitting
                                            ? 'Submitting'
                                            : profileUpdate.verified == ProfileState.REQUEST_CHANGES
                                            ? 'Resubmit'
                                            : 'Save'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

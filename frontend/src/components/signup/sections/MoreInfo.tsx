import TextField from '../components/TextField';
import Button from '../components/Button';
import Title from '../components/Title';
import UploadItem from '../components/UploadItem';
import TopicSelect from '../components/TopicSelect';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ChangeEvent, useState, useContext, useEffect } from 'react';
import SignUpContext from '../../../context/SignUpContext';
import { getSpecialisations } from '../../../api/search';
import { TopicsDTO } from '../../../types/Search';
interface MoreInfoProps {
    goToPage: (number: number) => void;
}

interface MoreInfoState {
    city: string;
    suburb: string;
    position: string;
    organisation: string;
    specialisation: string[];
    biography: string;
}

export default function MoreInfo({ goToPage }: MoreInfoProps) {
    const [profilePicture, setProfilePicture] = useState<File>();
    const [introductionVideo, setIntroductionVideo] = useState<File>();
    const [specs, setSpecs] = useState<string[]>([]);
    const [specialisationOptions, setSpecialisationOptions] = useState<string[]>([]);
    const [originalSpecialisationOptions, setOriginalSpecialisationOptions] = useState<TopicsDTO[]>([]);

    const { engineer, setEngineer } = useContext(SignUpContext);

    const [moreInfo, setMoreInfo] = useState<MoreInfoState>({
        city: '',
        suburb: '',
        position: '',
        organisation: '',
        specialisation: [],
        biography: '',
    });

    const [helperText, setHelperText] = useState({
        city: '',
        suburb: '',
        position: '',
        organisation: '',
        specialisation: '',
        biography: '',
        introVideo: '',
        profilePicture: '',
    });

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMoreInfo({ ...moreInfo, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        moreInfo.city = moreInfo.city.trim();
        moreInfo.suburb = moreInfo.suburb.trim();
        moreInfo.position = moreInfo.position.trim();
        moreInfo.organisation = moreInfo.organisation.trim();
        moreInfo.biography = moreInfo.biography.trim();

        let isValid = true;
        const newHelperText = { ...helperText };

        if (moreInfo.city == '') {
            newHelperText.city = 'City is required';
            isValid = false;
        } else {
            newHelperText.city = '';
        }

        if (moreInfo.suburb == '') {
            newHelperText.suburb = 'Suburb is required';
            isValid = false;
        } else {
            newHelperText.suburb = '';
        }

        if (moreInfo.position == '') {
            newHelperText.position = 'Position is required';
            isValid = false;
        } else {
            newHelperText.position = '';
        }

        if (moreInfo.organisation == '') {
            newHelperText.organisation = 'Organisation is required';
            isValid = false;
        } else {
            newHelperText.organisation = '';
        }

        if (moreInfo.specialisation.length == 0) {
            newHelperText.specialisation = 'Specialisation is required';
            isValid = false;
        } else {
            newHelperText.specialisation = '';
        }

        if (moreInfo.biography == '') {
            newHelperText.biography = 'Biography is required';
            isValid = false;
        } else {
            newHelperText.biography = '';
        }

        if (profilePicture == null) {
            newHelperText.profilePicture = 'Profile Picture is required';
            isValid = false;
        } else {
            newHelperText.profilePicture = '';
        }

        setHelperText(newHelperText);

        return isValid;
    };

    const removeSpec = (spec: string) => {
        const updatedSpecs = specs.filter((item) => item !== spec);
        setSpecs(updatedSpecs);
    };

    useEffect(() => {
        setMoreInfo({
            ...moreInfo,
            specialisation: specs,
        });
    }, [specs]);

    const updateContext = () => {
        const specialisations = originalSpecialisationOptions
            .filter((item) => specs.includes(item.topicDisplayName))
            .map((item) => item.topicDBName);

        const additionalSpecialisations = specs.filter(
            (item) => !originalSpecialisationOptions.map((item) => item.topicDisplayName).includes(item),
        );

        setEngineer({
            ...engineer,
            ...moreInfo,
            specialisation: specialisations,
            additionalSpecialisation: additionalSpecialisations,
            profilePicture: profilePicture,
            introductionVideo: introductionVideo,
        });

        localStorage.setItem('more-info', JSON.stringify(moreInfo));

        return true;
    };

    useEffect(() => {
        const moreInfo = localStorage.getItem('more-info');

        if (moreInfo) {
            setMoreInfo(JSON.parse(moreInfo));
        }

        getSpecialisations().then((res) => {
            const topics: TopicsDTO[] = res.data;
            setOriginalSpecialisationOptions(topics);

            const topicsName = topics.map((item) => item.topicDisplayName);
            setSpecialisationOptions(topicsName);
        });
    }, []);

    return (
        <>
            <Title>Location</Title>
            <div className="w-full lg:flex">
                <div className="lg:w-1/2 mt-4">
                    {/* Text field for Suburb */}
                    <TextField
                        label="Suburb"
                        require={true}
                        name="suburb"
                        onChange={onChange}
                        helperText={helperText['suburb']}
                        error={helperText['suburb'] != ''}
                    />
                </div>
                <div className="lg:w-1/2 lg:ml-4 mt-4">
                    <TextField
                        label="City"
                        require={true}
                        name="city"
                        onChange={onChange}
                        helperText={helperText['city']}
                        error={helperText['city'] != ''}
                    />
                </div>
            </div>

            <Title className="mt-4">Professional Title</Title>
            {/* TextField for Position */}
            <TextField
                label="Position"
                require={true}
                name="position"
                className="mt-4"
                onChange={onChange}
                helperText={helperText['position']}
                error={helperText['position'] != ''}
            />

            {/* TextField for Organisation */}
            <TextField
                label="Organisation"
                require={true}
                name="organisation"
                className="mt-4"
                onChange={onChange}
                helperText={helperText['organisation']}
                error={helperText['organisation'] != ''}
            />

            {/* TextField for Specialisation */}

            <TopicSelect
                className="mt-4"
                label="Topics"
                setSpec={setSpecs}
                specs={specs}
                onRemoveSpec={removeSpec}
                options={specialisationOptions}
                helperText={helperText['specialisation']}
                error={helperText['specialisation'] != ''}
                require
            />

            <Title className="mt-4">Biography</Title>
            <p className="text-['Poppins'] mt-2">
                Write around 100-200 words introducing yourself, profession and interests
            </p>
            {/* Multiline Textfield for Biography */}
            <TextField
                label="Biography"
                require={true}
                name="biography"
                className="mt-4"
                onChange={onChange}
                helperText={helperText['biography']}
                error={helperText['biography'] != ''}
                multiline
                rows={4}
            />

            <Title className="mt-4">Upload Profile Details</Title>

            <p className="text-sans text-lg mt-3">Profile Picture *</p>
            <UploadItem
                type="image"
                id="profile-picture"
                icon={<CloudUploadIcon sx={{ color: '#C4C4C4', height: '3rem', width: '3rem' }} />}
                label="Upload your Profile Picture here!"
                className="mt-2"
                accept="image/*"
                helperText={helperText['profilePicture']}
                file={profilePicture}
                setFile={setProfilePicture}
            />

            <p className="text-sans text-lg mt-3">Introduction Video</p>
            <UploadItem
                type="video"
                id="intro-video"
                icon={<CloudUploadIcon sx={{ color: '#C4C4C4', height: '3rem', width: '3rem' }} />}
                label="Upload your Introduction Video here!"
                className="mt-2"
                accept="video/mp4,video/x-m4v,video/*"
                file={introductionVideo}
                setFile={setIntroductionVideo}
            />
            <Button
                label="Continue"
                className="mt-6"
                onClick={() => validateForm() && updateContext() && goToPage(3)}
            />
        </>
    );
}

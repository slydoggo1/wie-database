import ProfileHeader from './ProfileHeader';
import ProfileBio from './ProfileBio';
import ProfileVideo from './ProfileVideo';
import { useEffect, useState, useContext } from 'react';
import { getEngineerByUserId } from '../../api/engineer';
import { useNavigate, useParams } from 'react-router-dom';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { CircularProgress } from '@mui/material';
import AuthenticationContext from '../../context/AuthenticationContext';
import { ProfileState } from '../../types/ProfileState';
import ToBeReviewed from '../edit-profile/components/ToBeReviewed';
import RequestChangesStatic from '../edit-profile/components/RequestChangesStatic';
import { EngineerProfileDTO } from '../../types/Engineer';

function ProfilePage() {
    const [engineerData, setEngineerData] = useState<EngineerProfileDTO>();
    const [loading, setLoading] = useState<boolean>(true);
    const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
    const [error, setError] = useState<boolean>(false);
    const { firebaseUser } = useContext(AuthenticationContext);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getEngineerByUserId(`${id || firebaseUser!.uid}`).then((response) => {
            if (!response) {
                setError(true);
            } else {
                setEngineerData(response?.data);
                setVideoUrl(response?.data.introductionVideoURL);
            }
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center bg-[#F1EEF2] min-h-full w-full">
                <div className="flex flex-col items-center justify-center gap-y-2">
                    <CircularProgress sx={{ color: '#4F2D7F' }} />
                    <p className="text-primary-100 text-lg font-medium">Loading profile...</p>
                </div>
            </div>
        );
    } else if (!loading && error) {
        return (
            <div className="flex justify-center bg-[#F1EEF2] min-h-screen w-full">
                <div className="flex flex-col items-center justify-center gap-y-2">
                    <SentimentVeryDissatisfiedIcon sx={{ color: '#4F2D7F', fontSize: '50px' }} />
                    <p className="text-primary-100 text-lg font-medium">Sorry! Profile does not exist</p>
                    <button
                        onClick={() => navigate('/')}
                        className="rounded-md bg-primary-100
                                text-white font-medium
                                px-3 py-1
                                border-2
                                border-primary-100
                                hover:bg-[#3C2065]
                                hover:border-[#3C2065]
                                transition ease-in-out delay-50"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col p-3 md:px-10 md:py-[5px] 2xl:px-40 bg-[#F1EEF2] min-h-screen gap-y-4">
            {id ? null : engineerData?.verified === ProfileState.TO_BE_REVIEWED ? (
                <ToBeReviewed />
            ) : engineerData?.verified === ProfileState.REQUEST_CHANGES ? (
                <RequestChangesStatic />
            ) : null}
            <ProfileHeader data={engineerData} />
            <ProfileBio data={engineerData} />
            {videoUrl && <ProfileVideo videoUrl={videoUrl} />}
        </div>
    );
}

export default ProfilePage;

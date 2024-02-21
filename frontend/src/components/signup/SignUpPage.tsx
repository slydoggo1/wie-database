import ProgressBar from './components/ProgressBar';
import { useEffect, useState } from 'react';
import PersonalDetails from './sections/PersonalDetails';
import FadeIn from './animation/FadeIn';
import MoreInfo from './sections/MoreInfo';
import Interests from './sections/Interests';
import SignupSelection from './sections/SignupSelection';
import UserPersonalDetails from './sections/UserPersonalDetails';
import CreateProfile from './sections/CreateProfile';
import { useContext } from 'react';
import SignUpContext from '../../context/SignUpContext';
import { signUpEngineer } from '../../api/engineer';
import { signUpUser } from '../../api/user';
import AuthenticationContext from '../../context/AuthenticationContext';
import { cleanUpAuth, uploadFile } from '../../api/firebase';
import { getDownloadURL } from 'firebase/storage';

export default function SignUpPage() {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [isEngineer, setIsEngineer] = useState<boolean>(false);
    const [animate, setAnimate] = useState<boolean>(false);

    const { user, role, engineer, setEngineer } = useContext(SignUpContext);
    const { firebaseUser } = useContext(AuthenticationContext);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const goToPage = (index: number) => {
        setCurrentPage(index);
    };

    const EngineerSignUp = [
        <SignupSelection setEngineer={setIsEngineer} goToPage={goToPage} />,
        <PersonalDetails goToPage={goToPage} />,
        <MoreInfo goToPage={goToPage} />,
        <Interests goToPage={goToPage} />,
        <CreateProfile isLoading={isLoading} error={error} />,
    ];

    const UserSignUp = [
        <SignupSelection setEngineer={setIsEngineer} goToPage={goToPage} />,
        <UserPersonalDetails goToPage={goToPage} />,
        <CreateProfile isLoading={isLoading} error={error} />,
    ];

    useEffect(() => {
        if (isEngineer && currentPage == EngineerSignUp.length - 1) {
            if (firebaseUser) {
                const profilePictureURL: Promise<string> = uploadFile(
                    engineer.profilePicture!,
                    `${firebaseUser.uid}/images/profile-picture.${engineer.profilePicture?.name.split('.').pop()}`,
                )
                    .then((storageRef) => {
                        return getDownloadURL(storageRef);
                    })
                    .then((string) => string);

                let introVideoURL: Promise<string> | undefined = undefined;

                if (engineer.introductionVideo) {
                    introVideoURL = uploadFile(
                        engineer.introductionVideo,
                        `${firebaseUser.uid}/videos/introduction-video.${engineer.introductionVideo?.name
                            .split('.')
                            .pop()}`,
                    )
                        .then((storageRef) => {
                            return getDownloadURL(storageRef);
                        })
                        .then((string) => string);
                }

                Promise.all([profilePictureURL, introVideoURL]).then((values) => {
                    const [pfpUrl, vidUrl] = values;

                    signUpEngineer(engineer, firebaseUser.uid, pfpUrl, vidUrl).then((res) => {
                        if (res?.status == 201) {
                            setIsLoading(false);
                            firebaseUser.getIdToken(true);
                            localStorage.clear();
                        } else {
                            setError(true);
                            cleanUpAuth(firebaseUser);
                        }
                    });
                });
            }
        } else if (!isEngineer && currentPage == UserSignUp.length - 1) {
            if (firebaseUser) {
                signUpUser(firebaseUser.uid, user, role)
                    .then(() => {
                        setIsLoading(false);
                        firebaseUser.getIdToken(true);
                    })
                    .catch((err) => {
                        console.log(err);
                        setError(true);
                        cleanUpAuth(firebaseUser);
                    });
            }
        }
    }, [currentPage, firebaseUser]);

    useEffect(() => {
        setTimeout(() => {
            setAnimate(true);
        }, 50);

        const personalDetails = localStorage.getItem('personal-details');
        const moreInfo = localStorage.getItem('more-info');
        const interests = localStorage.getItem('interests');

        if (personalDetails && moreInfo && interests) {
            setIsEngineer(true);
            setEngineer({
                ...JSON.parse(personalDetails),
                ...JSON.parse(moreInfo),
                ...JSON.parse(interests),
            });
            setCurrentPage(4);
            return;
        }

        if (personalDetails && moreInfo) {
            setIsEngineer(true);
            setEngineer({
                ...engineer,
                ...JSON.parse(personalDetails),
                ...JSON.parse(moreInfo),
            });
            setCurrentPage(3);
            return;
        }

        if (personalDetails) {
            setIsEngineer(true);
            setEngineer({ ...engineer, ...JSON.parse(personalDetails) });
            setCurrentPage(2);
        }

        firebaseUser?.getIdToken(true);
    }, []);

    return (
        <div className="w-full min-h-screen flex flex-col px-10 sm:px-20 md:px-40 xl:px-40 2xl:px-[30rem] py-10 bg-background">
            <div className="p-10">
                <ProgressBar
                    goToPage={goToPage}
                    index={currentPage}
                    totalPageNum={isEngineer ? EngineerSignUp.length - 1 : UserSignUp.length - 1}
                />
            </div>
            <FadeIn isVisible={animate}>
                <div className="w-full bg-white rounded-lg drop-shadow-md p-10">
                    <div className="lg:px-10 2xl:px-10">
                        {isEngineer ? EngineerSignUp[currentPage] : UserSignUp[currentPage]}
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}

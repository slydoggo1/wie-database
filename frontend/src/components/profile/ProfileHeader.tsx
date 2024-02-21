import { useContext, useEffect, useState } from 'react';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import CoPresentRoundedIcon from '@mui/icons-material/CoPresentRounded';
import StarPurple500RoundedIcon from '@mui/icons-material/StarPurple500Rounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import AuthenticationContext from '../../context/AuthenticationContext';
import { addFavouriteEngineer, deleteFavouriteEngineer } from '../../api/user';
import { getUserIdToken } from '../../api/firebase';
import { useNavigate, useLocation } from 'react-router';
import { EngineerProfileDTO, Events } from '../../types/Engineer';
import FavouritesAccessDeniedModal from '../favourites/FavouritesAccessDeniedModal';

interface ProfileHeaderProps {
    data: EngineerProfileDTO | undefined;
}

function ProfileHeader({ data }: ProfileHeaderProps) {
    const [isFavourited, setIsFavourited] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { firebaseUser, favouritedEngineers, claim } = useContext(AuthenticationContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSetFavourite = () => {
        if (!firebaseUser || claim === 'admin') {
            setIsOpen(true);
        } else {
            setIsFavourited(!isFavourited);
        }
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const setFavourites = async () => {
            const token = await getUserIdToken(firebaseUser!);
            if (isFavourited && claim !== 'admin') {
                addFavouriteEngineer(firebaseUser?.uid, data?.userId, token).catch((err) => console.log(err));
            } else if (!isFavourited && favouritedEngineers?.includes(data ? data.userId : '') && claim !== 'admin') {
                deleteFavouriteEngineer(firebaseUser?.uid, data?.userId, token).catch((err) => console.log(err));
            }
        };

        setFavourites();
    }, [isFavourited]);

    useEffect(() => {
        if (favouritedEngineers?.includes(data ? data.userId : '')) {
            setIsFavourited(true);
        }
    }, [favouritedEngineers]);

    const handleClickContact = () => {
        navigate('/contact', {
            state: {
                engineerEmail: `${data?.email}`,
                firstName: `${data?.firstName}`,
                lastName: `${data?.lastName}`,
                id: `${data?.userId}`,
            },
        });
    };

    return (
        <div className="flex max-lg:flex-col flex-row self-center gap-4 w-full">
            <div className="w-[65%] max-lg:w-[100%] relative">
                <div className="bg-[#4F2D7F] rounded-t-lg h-[170px] bg-gradient-to-r from-[#5d258f] via-[#5532a6] to-[#009AC7]" />
                <div className="rounded-full border-white bg-slate-300 border-2 w-[160px] h-[160px]  absolute top-[90px] left-[16px] overflow-hidden">
                    <img
                        src={data?.profilePictureURL}
                        alt="profile picture"
                        className="w-full h-full object-cover object-center"
                    />
                </div>
                <div className="flex flex-col bg-white rounded-b-lg p-4 shadow-xl">
                    <div className="flex self-end">
                        {claim !== 'engineer' && claim !== 'admin' && (
                            <div className="flex flex-col items-center">
                                {isFavourited ? (
                                    <StarRateRoundedIcon
                                        fontSize="large"
                                        onClick={() => handleSetFavourite()}
                                        className="hover:cursor-pointer text-[#4F2D7F] hover:text-[#3C2065]"
                                    />
                                ) : (
                                    <StarPurple500RoundedIcon
                                        className="hover:cursor-pointer text-[#4F2D7F] hover:text-[#3C2065]"
                                        fontSize="large"
                                        onClick={() => handleSetFavourite()}
                                    />
                                )}
                                <p className="font-semibold text-[#4F2D7F] text-xs">Favourite</p>
                            </div>
                        )}
                        <div className="w-full h-[55px]" />
                    </div>
                    <div>
                        <div className="flex flex-row items-center mb-2 mt-5">
                            <h2 className="font-semibold text-2xl mr-[10px]">
                                {data?.firstName} {data?.lastName}
                            </h2>
                            <div className="flex flex-row items-center gap-x-2">
                                <p className="text-[#4F2D7F]">|</p>
                                <div>
                                    <a
                                        href={`${data?.linkedin}`}
                                        target="_blank"
                                        className="underline decoration-solid text-[#4F2D7F] hover:text-[#3C2065] transition ease-in-out delay-50"
                                    >
                                        <LinkedInIcon />
                                    </a>
                                </div>
                            </div>
                            {data?.personalWebsite && (
                                <div className="flex flex-row items-center gap-x-2">
                                    <p className="text-[#4F2D7F]">|</p>
                                    <div>
                                        <a
                                            href={`${data?.personalWebsite}`}
                                            target="_blank"
                                            className="underline decoration-solid text-[#4F2D7F] hover:text-[#3C2065] transition ease-in-out delay-50"
                                        >
                                            See more
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-row gap-2 mb-3 flex-wrap">
                            {data?.topics.map((topic: string, index: number) => (
                                <div key={index} className="bg-[#4F2D7F] rounded-full w-fit text-white px-3 py-1">
                                    <p className="font-semibold m-0 text-[14px]">{topic}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-x-[4px]">
                            <LocationOnRoundedIcon className="text-[#808080]" />
                            <p className="text-[#808080] text-base ">
                                {data?.suburb}, {data?.city}
                            </p>
                        </div>
                        <div className="flex flex-row max-lg:flex-col justify-between items-center max-lg:items-start">
                            <p className="text-[#808080] text-base">
                                {data?.position} at {data?.organisation}
                            </p>
                            <div>
                                {location.pathname.includes('/profile') ? (
                                    <button
                                        className="self-end max-lg:mt-2 rounded-md bg-[#4F2D7F]
                                text-white font-medium
                                px-3 py-1
                                border-2
                                border-[#4F2D7F]
                                hover:bg-[#3C2065]
                                hover:border-[#3C2065]
                                transition ease-in-out delay-50"
                                        onClick={() => navigate('/edit-profile')}
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <button
                                        className="self-end max-lg:mt-2 rounded-md bg-[#4F2D7F]
                                text-white font-medium
                                px-3 py-1
                                border-2
                                border-[#4F2D7F]
                                hover:bg-[#3C2065]
                                hover:border-[#3C2065]
                                transition ease-in-out delay-50"
                                        onClick={() => handleClickContact()}
                                    >
                                        Contact me
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-lg:w-[100%] w-[35%] flex flex-col p-4 bg-white rounded-lg shadow-xl">
                <h2 className="font-semibold text-xl mb-7">Interests</h2>
                <div className="mt-2">
                    <div className="flex flex-row justify-evenly">
                        <div className="flex flex-col items-center gap-2">
                            <VolunteerActivismRoundedIcon
                                style={{
                                    color: data?.events.includes(Events.OUTREACH) ? '#4F2D7F' : '#ADADAD',
                                    fontSize: 40,
                                }}
                            />
                            <p
                                className={`${
                                    data?.events.includes(Events.OUTREACH) ? 'text-[#4F2D7F]' : 'text-[#ADADAD]'
                                } font-semibold text-md`}
                            >
                                Outreach
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <CoPresentRoundedIcon
                                style={{
                                    color: data?.events.includes(Events.CONFERENCE) ? '#4F2D7F' : '#ADADAD',
                                    fontSize: 40,
                                }}
                            />
                            <p
                                className={`${
                                    data?.events.includes(Events.CONFERENCE) ? 'text-[#4F2D7F]' : 'text-[#ADADAD]'
                                } font-semibold text-md`}
                            >
                                Conference
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-row justify-evenly mt-4 mb-4">
                        <div className="flex flex-col items-center gap-2">
                            <SupervisorAccountRoundedIcon
                                style={{
                                    color: data?.events.includes(Events.MENTORING) ? '#4F2D7F' : '#ADADAD',
                                    fontSize: 40,
                                }}
                            />
                            <p
                                className={`${
                                    data?.events.includes(Events.MENTORING) ? 'text-[#4F2D7F]' : 'text-[#ADADAD]'
                                } font-semibold text-md`}
                            >
                                Mentoring
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Diversity3RoundedIcon
                                style={{
                                    color: data?.events.includes(Events.COMMITTEES) ? '#4F2D7F' : '#ADADAD',
                                    fontSize: 40,
                                }}
                            />
                            <p
                                className={`${
                                    data?.events.includes(Events.COMMITTEES) ? 'text-[#4F2D7F]' : 'text-[#ADADAD]'
                                } font-semibold text-md`}
                            >
                                Committees
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <HandshakeRoundedIcon
                            style={{
                                color: data?.events.includes(Events.COLLABORATION) ? '#4F2D7F' : '#ADADAD',
                                fontSize: 40,
                            }}
                        />
                        <p
                            className={`${
                                data?.events.includes(Events.COLLABORATION) ? 'text-[#4F2D7F]' : 'text-[#ADADAD]'
                            } font-semibold text-md`}
                        >
                            Collaborations
                        </p>
                    </div>
                </div>
            </div>
            <FavouritesAccessDeniedModal isOpen={isOpen} handleCloseModal={handleCloseModal} />
        </div>
    );
}

export default ProfileHeader;

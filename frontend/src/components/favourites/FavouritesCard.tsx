import { useContext, useEffect, useState } from 'react';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import StarPurple500RoundedIcon from '@mui/icons-material/StarPurple500Rounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import { engineerCardDTO } from '../../types/Engineer';
import { useNavigate } from 'react-router-dom';
import AuthenticationContext from '../../context/AuthenticationContext';
import { getUserIdToken } from '../../api/firebase';
import { addFavouriteEngineer, deleteFavouriteEngineer } from '../../api/user';

interface FavouritesCardProps {
    data: engineerCardDTO;
}

function FavouritesCard({ data }: FavouritesCardProps) {
    const [isFavourited, setIsFavourited] = useState<boolean>(true);
    const [additionalSpecialisations, setAdditionalSpecialisations] = useState<number>(0);
    const { firebaseUser, favouritedEngineers } = useContext(AuthenticationContext);
    const navigate = useNavigate();

    useEffect(() => {
        const additionalSpecs = data.specialisation.length - 3;
        if (additionalSpecs > 0) {
            setAdditionalSpecialisations(additionalSpecs);
        }
    }, []);

    const handleSetFavourite = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        event.stopPropagation();
        setIsFavourited(!isFavourited);
    };

    useEffect(() => {
        const setFavourites = async () => {
            const token = await getUserIdToken(firebaseUser!);
            if (isFavourited) {
                addFavouriteEngineer(firebaseUser?.uid, data?.uid, token).catch((err) => console.log(err));
            } else if (!isFavourited && favouritedEngineers.includes(data?.uid)) {
                deleteFavouriteEngineer(firebaseUser?.uid, data?.uid, token).catch((err) => console.log(err));
            }
        };

        setFavourites();
    }, [isFavourited]);

    return (
        <div className="h-fit-content">
            <div
                className="grid grid-cols-[128px_auto] gap-x-4 bg-white rounded-lg p-4 shadow-lg hover:cursor-pointer transform transition duration-500 hover:scale-105 h-[160px]"
                onClick={() => navigate(`/view-profile/${data.uid}`)}
            >
                <div className="w-full h-[128px]">
                    <div className="relative bg-slate-300 rounded-full self-center h-full w-full">
                        <img
                            src={data.imageURL}
                            alt="profile picture"
                            className="rounded-full w-full h-full object-cover object-center"
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-between relative w-full h-[80%] overflow-x-hidden">
                    <div className="flex flex-row justify-between">
                        <h2 className="font-semibold text-xl self-center  max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                            {data.name}
                        </h2>
                        <div className="flex">
                            {isFavourited ? (
                                <StarRateRoundedIcon
                                    fontSize="large"
                                    onClick={(event) => handleSetFavourite(event)}
                                    className="hover: cursor-pointer text-primary-100"
                                />
                            ) : (
                                <StarPurple500RoundedIcon
                                    className="hover: cursor-pointer text-primary-100"
                                    fontSize="large"
                                    onClick={(event) => handleSetFavourite(event)}
                                />
                            )}
                        </div>
                    </div>
                    <p className="relative text-[#808080] text-sm mb-1 max-w-[85%] whitespace-nowrap overflow-hidden text-ellipsis">
                        {data.position} at {data.organisation}
                    </p>
                    <div className="flex gap-x-[8px] max-w-[85%]">
                        <LocationOnRoundedIcon className="text-[#808080]" fontSize="small" />
                        <p className="text-[#808080] text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                            {data.location}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-row flex-wrap gap-2 mt-2 h-fit-content">
                {data.specialisation.map((spec, index) => {
                    if (index < 3) {
                        return (
                            <div
                                key={index}
                                className="flex self-end items-center bg-[#4F2D7F] rounded-full w-fit text-white px-3 py-1"
                            >
                                <p className="font-semibold m-0 text-sm">{spec}</p>
                            </div>
                        );
                    }
                })}
                {additionalSpecialisations > 0 && (
                    <div className="bg-[#4F2D7F] rounded-full w-fit text-white px-3 py-1">
                        <p className="font-semibold m-0 text-sm">+{additionalSpecialisations}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FavouritesCard;

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFavouriteEngineer, deleteFavouriteEngineer } from '../../api/user';
import AuthenticationContext from '../../context/AuthenticationContext';
import { getUserIdToken } from '../../api/firebase';
import { engineerCardDTO } from '../../types/Engineer';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import StarPurple500RoundedIcon from '@mui/icons-material/StarPurple500Rounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import FavouritesAccessDeniedModal from '../favourites/FavouritesAccessDeniedModal';

interface SearchResultCardProps {
    result: engineerCardDTO;
}

function SearchResultCard({ result }: SearchResultCardProps) {
    const [isFavourited, setIsFavourited] = useState<boolean>(false);
    const [additionalSpecialisations, setAdditionalSpecialisations] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { firebaseUser, favouritedEngineers, claim } = useContext(AuthenticationContext);
    const navigate = useNavigate();

    const handleSetFavourite = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        event.stopPropagation();
        if (!firebaseUser || claim === 'admin') {
            setIsOpen(true);
        } else {
            setIsFavourited(!isFavourited);
        }
    };

    useEffect(() => {
        const setFavourites = async () => {
            const token = await getUserIdToken(firebaseUser!);
            if (isFavourited && claim !== 'admin') {
                addFavouriteEngineer(firebaseUser?.uid, result.uid, token).catch((err) => console.log(err));
            } else if (!isFavourited && favouritedEngineers?.includes(result.uid) && claim !== 'admin') {
                deleteFavouriteEngineer(firebaseUser?.uid, result.uid, token).catch((err) => console.log(err));
            }
        };

        setFavourites();
    }, [isFavourited]);

    useEffect(() => {
        if (favouritedEngineers?.includes(result.uid)) {
            setIsFavourited(true);
        }
    }, [favouritedEngineers]);

    useEffect(() => {
        const additionalSpecs = result.specialisation.length - 3;
        if (additionalSpecs > 0) {
            setAdditionalSpecialisations(additionalSpecs);
        }
    }, []);

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    return (
        <div className="h-fit-content">
            <div className="flex flex-col">
                <div
                    className="flex flex-col bg-white h-[400px] w-full rounded-lg p-4 item shadow-lg hover:cursor-pointer transform transition duration-500 hover:scale-105 hover:shadow-2xl overflow-y-hidden"
                    onClick={() => navigate(`/view-profile/${result.uid}`)}
                >
                    {claim !== 'engineer' && claim !== 'admin' && (
                        <div className="flex justify-end">
                            {isFavourited ? (
                                <StarRateRoundedIcon
                                    fontSize="large"
                                    className="hover: cursor-pointer text-primary-100"
                                    onClick={(event) => handleSetFavourite(event)}
                                />
                            ) : (
                                <StarPurple500RoundedIcon
                                    className="hover: cursor-pointer text-primary-100"
                                    fontSize="large"
                                    onClick={(event) => handleSetFavourite(event)}
                                />
                            )}
                        </div>
                    )}
                    <div className="w-full h-[150px] flex justify-center">
                        <img
                            className="rounded-full w-[150px] h-[150px] object-cover object-center"
                            src={result.imageURL}
                            alt="profile image"
                        />
                    </div>
                    <div
                        className="flex flex-col items-center mt-4 h-full justify-around"
                        onClick={() => navigate(`/view-profile/${result.uid}`)}
                    >
                        <h1 className="font-semibold text-[24px] text-center">{result.name}</h1>
                        <div className="flex flex-row gap-x-[4px] mt-1">
                            <LocationOnRoundedIcon className="text-primary-100" />
                            <p className="text-[#808080]">{result.location}</p>
                        </div>
                        <p className="text-[#808080] mt-2 text-center">
                            {result.position} at {result.organisation}
                        </p>
                    </div>
                </div>
                <div className="w-full mt-3 flex flex-row flex-wrap gap-1 h-[5%]">
                    {result.specialisation.map((value, index) => {
                        if (index < 3) {
                            return (
                                <div key={index} className="bg-primary-100 rounded-full w-fit text-white px-3 py-1">
                                    <p className="font-semibold m-0 text-sm">{value}</p>
                                </div>
                            );
                        }
                    })}
                    {additionalSpecialisations > 0 && (
                        <div className="bg-primary-100 rounded-full w-fit text-white px-3 py-1">
                            <p className="font-semibold m-0 text-sm">+{additionalSpecialisations}</p>
                        </div>
                    )}
                </div>
            </div>
            <FavouritesAccessDeniedModal isOpen={isOpen} handleCloseModal={handleCloseModal} />
        </div>
    );
}

export default SearchResultCard;

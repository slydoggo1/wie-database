import { useContext, useEffect, useRef, useState } from 'react';
import FavouritesCard from './FavouritesCard';
import { getFavouriteEngineers } from '../../api/user';
import AuthenticationContext from '../../context/AuthenticationContext';
import { getUserIdToken } from '../../api/firebase';
import { CircularProgress } from '@mui/material';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import { useNavigate } from 'react-router-dom';
import { engineerCardDTO } from '../../types/Engineer';

function FavouritesPage() {
    const [favourites, setFavourites] = useState<engineerCardDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const { firebaseUser, favouritedEngineers } = useContext(AuthenticationContext);
    const navigate = useNavigate();

    const favouritesRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchFavourites = async () => {
            setIsLoading(true);
            const token = await getUserIdToken(firebaseUser!);
            getFavouriteEngineers(firebaseUser!.uid, '', 12, token)
                .then((response) => {
                    setFavourites(response.data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    if (err.response.status === 404) {
                        setError(true);
                        setIsLoading(false);
                    }
                });
        };

        fetchFavourites();
    }, [favouritedEngineers]);

    // scroll event listener to fetch more data when scrolled to the bottom
    useEffect(() => {
        const container = favouritesRef.current;

        container?.addEventListener('scroll', handleScroll);

        return () => {
            container?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScroll = async () => {
        const container = favouritesRef.current;

        if (container) {
            const scrollTop = container?.scrollTop;
            const scrollHeight = container?.scrollHeight;
            const clientHeight = container?.clientHeight;

            if (scrollTop + clientHeight === scrollHeight) {
                const token = await getUserIdToken(firebaseUser!);
                getFavouriteEngineers(firebaseUser!.uid, favourites[favourites.length - 1].uid, 12, token).then(
                    (response) => {
                        if (response.data.length > 0) {
                            setFavourites(favourites.concat(response.data));
                        }
                    },
                );
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center bg-[#F1EEF2] h-[calc(100vh-110px)] items-center">
                <div className="flex flex-col items-center gap-y-2">
                    <CircularProgress sx={{ color: '#4F2D7F' }} />
                    <p className="text-primary-100 text-lg font-medium">Loading favourites...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F1EEF2] h-[calc(100vh-110px)] flex flex-col">
            <div className="bg-primary-100 p-3 md:px-10 md:py-16 2xl:px-40 shadow-md shadow-slate-300">
                <h2 className="text-white font-semibold text-4xl mb-2">Women you think are amazing!</h2>
                <p className="text-white text-md text-base">
                    Keep track of profiles of women engineers by favouriting them
                </p>
            </div>
            {(error || favourites.length === 0) && (
                <div className="flex flex-col items-center  h-[calc(100vh-230px)] justify-center">
                    <p className="text-[20px] text-primary-100 font-semibold">
                        You haven't favourited any engineers yet
                    </p>
                    <div className="flex flex-row items-center gap-x-1">
                        <p className="text-[20px] text-primary-100 font-semibold">
                            Favourite engineers by clicking the
                        </p>
                        <StarRateRoundedIcon fontSize="large" className="hover: cursor-pointer text-primary-100" />
                        <p className="text-[20px] text-primary-100 font-semibold">icon</p>
                    </div>
                    <button
                        onClick={() => navigate('/search')}
                        className="mt-[20px] rounded-md bg-primary-100
                        text-white font-medium
                        px-3 py-1
                        border-2
                        border-primary-100
                        hover:bg-[#3C2065]
                        hover:border-[#3C2065]
                        transition ease-in-out delay-50"
                    >
                        Find engineers
                    </button>
                </div>
            )}
            <div
                ref={favouritesRef}
                onScroll={() => handleScroll()}
                className="h-[calc(100vh-240px)] auto-rows-min overflow-x-scroll grid lg:grid-cols-3 max-sm:grid-cols-none md:grid-cols-2 gap-4 p-3 md:px-10 2xl:px-40 "
            >
                {favourites?.map((value) => <FavouritesCard key={value.uid} data={value} />)}
            </div>
        </div>
    );
}
export default FavouritesPage;

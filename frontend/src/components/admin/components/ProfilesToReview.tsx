import EngineerProfileCard from './EngineerProfileCard';
import { useEffect, useState, useContext } from 'react';
import { getAllEngineersToReview } from '../../../api/engineer';
import AuthenticationContext from '../../../context/AuthenticationContext';
import { getUserIdToken } from '../../../api/firebase';
import { CircularProgress } from '@mui/material';
import { EngineerProfileDTO } from '../../../types/Engineer';

export default function ProfilesToReview({ selectedEngineer, onEngineerSelect, fetchDataNeeded }) {
    const [engineers, setEngineers] = useState<EngineerProfileDTO[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { firebaseUser } = useContext(AuthenticationContext);

    useEffect(() => {
        if (firebaseUser) {
            const fetchData = async () => {
                setIsLoading(true);
                await getUserIdToken(firebaseUser).then((token) => {
                    getAllEngineersToReview(token).then((response) => {
                        setEngineers(response.data);
                        console.error(response);

                        if (response.data.length > 0) {
                            onEngineerSelect(response.data[0]);
                        }
                    });
                });

                setIsLoading(false);
            };

            fetchData();

            const refreshInterval = 300000; // 5 minutes in milliseconds

            const refreshData = () => {
                fetchData();
            };

            const intervalId = setInterval(refreshData, refreshInterval);

            // Clean up the interval when the component unmounts
            return () => clearInterval(intervalId);
        }
    }, [firebaseUser, fetchDataNeeded]);

    const handleEngineerClick = (engineerData) => {
        onEngineerSelect(engineerData); // Call the callback function to update selectedEngineer
    };

    return (
        <div className="bg-white w-1/3 shadow-lg rounded-lg p-4 mb-8 mr-8 flex flex-col">
            <h1 className="text-xl font-semibold text-[#7F7194]"> Profiles to Review</h1>
            <hr className="h-[2px] my-7 border-0 bg-[#E4E5E7] rounded-full" />

            {isLoading ? (
                <div className="m-auto text-center text-primary-100 flex-column text-xl font-semibold">
                    <CircularProgress size="50px" style={{ color: '#4F2D7F' }} />
                    <br />
                    Loading...
                </div>
            ) : (
                <div className="flex-col flex-grow overflow-y-scroll p-2">
                    {engineers.map((engineer, index) => (
                        <div
                            onClick={() => handleEngineerClick(engineer)}
                            className={`${
                                selectedEngineer === engineer ? 'bg-[#F5F1F5]' : 'bg-white'
                            } rounded-lg cursor-pointer transition-colors duration-300 hover:bg-[#F5F1F5]`}
                        >
                            <EngineerProfileCard key={index} result={engineer} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import { useContext, useState } from 'react';
import { EngineerProfileDTO as EngineerDTO } from '../../../types/Engineer';
import AuthenticationContext from '../../../context/AuthenticationContext';
import { deleteEngineer } from '../../../api/admin.ts';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { getUserIdToken } from '../../../api/firebase.ts';
import { CircularProgress } from '@mui/material';

interface EngineerDetails {
    result: EngineerDTO;
}

export default function EngineerProfileCard({ result }: EngineerDetails) {
    const { firebaseUser } = useContext(AuthenticationContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteIcon = () => {
        setModalOpen(true);
    };
    const handleDeleteButton = async () => {
        setIsLoading(true);
        try {
            const token = await getUserIdToken(firebaseUser!);
            const response = await deleteEngineer(result.userId, token);

            if (response) {
                window.location.reload();
            } else {
                toast.error('Unable to delete user. Please try again');
            }
        } catch (error) {
            toast.error('Unable to delete user. Please try again');
        } finally {
            setIsLoading(false);
            setModalOpen(false);
        }
    };

    return (
        <div className="relative rounded-lg p-4 flex hover:rounded-lg my-2">
            <ToastContainer></ToastContainer>
            <button
                className="absolute top-2 right-2 text-primary-100 rounded-full w-5 h-5 flex items-center justify-center p-1  hover:text-red-500 transition duration-300 ease-in-out"
                onClick={handleDeleteIcon}
            >
                <DeleteIcon fontSize="small" />
            </button>
            <div className="grid grid-cols-[64px_auto] gap-x-2">
                <div className="rounded-full border-white border-2 w-16 h-16 self-center">
                    {result.profilePictureURL ? (
                        <img
                            className="rounded-full w-full h-full object-cover object-center bg-gray-300"
                            src={result.profilePictureURL}
                        />
                    ) : (
                        <img className="w-full h-full object-cover object-center bg-gray-300"></img>
                    )}
                </div>

                <div className="w-full">
                    <p className="text-lg font-semibold">
                        {result.firstName} {result.lastName}
                    </p>

                    <p className="text-base text-[#7F7194] font-semibold">
                        {result.position} at {result.organisation}
                    </p>
                </div>
            </div>
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
                    <div className="absolute w-full h-full bg-black opacity-50 backdrop-blur-md transition-opacity duration-200 ease-in-out"></div>
                    <div className="bg-white p-4 rounded shadow-lg w-64 transition-transform transform scale-95 duration-200 ease-in-out">
                        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this Engineer?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                className="mr-2 bg-transparent hover:bg-gray-200 text-black py-1 px-4 rounded transition duration-300 ease-in-out"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white w-32 py-1 rounded transition duration-300 ease-in-out relative flex items-center justify-center"
                                onClick={handleDeleteButton}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="mr-3 ">Deleting...</span>
                                        <CircularProgress sx={{ color: '#4F2D7F' }} size={24} />
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

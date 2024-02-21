import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface FavouritesAccessDeniedModalProps {
    isOpen: boolean;
    handleCloseModal: () => void;
}

function FavouritesAccessDeniedModal({ isOpen, handleCloseModal }: FavouritesAccessDeniedModalProps) {
    const navigate = useNavigate();

    return (
        <Modal open={isOpen} onClose={() => handleCloseModal()}>
            <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-[40%] max-w-[45%] bg-white shadow-lg rounded-xl p-6 flex flex-col">
                <CloseRoundedIcon
                    sx={{ fontSize: '25px' }}
                    className="self-end text-primary-100 hover:text-[#3C2065] hover:cursor-pointer"
                    onClick={() => handleCloseModal()}
                />
                <div className="flex flex-col justify-between items-center">
                    <h1 className="text-primary-100 font-bold text-2xl mt-2">Oops!</h1>
                    <h1 className="text-primary-100 font-semibold text-xl mt-2 text-center">
                        Looks like you don't have access to this feature.
                    </h1>
                    <div className="flex flex-row w-full justify-center gap-x-4">
                        <button
                            className="rounded-md bg-white
                                text-primary-100 font-medium
                                px-3 py-1
                                border-2
                                mt-8
                                border-primary-100
                                hover:bg-primary-100
                                hover:border-primary-100
                                hover:text-white
                                transition ease-in-out delay-50 w-[30%] max-sm:w-[50%]"
                            onClick={() => navigate('/sign-up')}
                        >
                            Sign up
                        </button>
                        <button
                            className="rounded-md bg-primary-100
                                text-white font-medium
                                px-3 py-1
                                border-2
                                mt-8
                                border-primary-100
                                hover:bg-[#3C2065]
                                hover:border-[#3C2065]
                                transition ease-in-out delay-50 w-[30%] max-sm:w-[50%]"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default FavouritesAccessDeniedModal;

import { useNavigate } from 'react-router';

export default function ErrorPage() {
    const navigate = useNavigate();

    const handleClickGoHome = () => {
        navigate('/');
    };

    return (
        <div className="h-screen flex bg-background">
            <div className="m-auto text-center">
                <div className="text-[#4F2D7F] text-3xl font-bold mb-[20px]">Oops, something went wrong!</div>
                <button
                    onClick={handleClickGoHome}
                    className="h-[40px] w-[120px]
                                border-solid border-[#4F2D7F] rounded-md border-2
                                transition ease-in-out delay-50
                                bg-[#4F2D7F] text-white font-medium
                                hover:cursor-pointer hover:bg-[#3C2065] hover:text-white hover:border-[#3C2065]"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
}

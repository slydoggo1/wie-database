import { useNavigate } from 'react-router-dom';

export default function SignUpBanner() {
    const navigate = useNavigate();
    const handleClickRegister = () => {
        navigate('/sign-up');
    };

    return (
        <div>
            <div
                className="m-auto text-center align-middle w-2/3 h-[40px]
                        border-solid border-[#4F2D7F] rounded-md border-2
                        font-medium hover:text-primary-100 text-xl hover:bg-white
                        bg-primary-100 text-white hover:cursor-pointer pt-[3px]
                        transition ease-in-out delay-50"
                onClick={handleClickRegister}
            >
                Register as an engineer today!
            </div>
        </div>
    );
}

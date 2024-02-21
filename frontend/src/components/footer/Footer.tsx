import { NavLink } from 'react-router-dom';

export default function Footer() {
    return (
        <div className="bg-[#4F2D7F] w-full h-[50px] p-[10px] flex flex-col justify-center items-center text-white text-xs gap-1">
            <div className="">© 2023 Women In Engineering</div>
            <div className="flex justify-center items-center text-white text-xs">
                <NavLink to="/feedback" className="">
                    <div className="underline">Give us feedback</div>
                </NavLink>
                <span className="mx-1">|</span>
                <NavLink to="/contact-us" className="">
                    <div className="underline">Contact Us</div>
                </NavLink>
                <span className="mx-1">|</span>
                <NavLink to="/terms-and-conditions" className="">
                    <div className="underline">Terms and Conditions</div>
                </NavLink>
            </div>
        </div>
    );
}

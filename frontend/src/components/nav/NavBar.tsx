import logo from '../../assets/WiE_Logo.svg';
import NavbarMenu from './NavbarMenu.tsx';
import { NavLink } from 'react-router-dom';

function NavBar() {
    return (
        <div className="w-full h-[80px] flex flex-row justify-between p-[12px] md:px-10 md:py-[5px] 2xl:px-40 bg-white gap-x-4">
            <NavLink to="/">
                <img className="h-full" src={logo} alt="WiE Logo" />
            </NavLink>
            <NavbarMenu />
        </div>
    );
}

export default NavBar;

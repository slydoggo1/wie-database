import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AuthenticationContext from '../../context/AuthenticationContext.tsx';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

export default function NavbarMenu() {
    const { firebaseUser, claim } = useContext(AuthenticationContext);

    return (
        <div className="w-fit flex items-center justify-end justify-between ">
            <div className="pr-10 max-sm:pr-2.5 text-[#808080] hover:text-primary-100">
                <NavLink className={({ isActive }) => (isActive ? 'text-primary-100' : '')} to={'/search'}>
                    <div className="text-center max-sm:text-xs">
                        <SearchIcon />
                        <br />
                        Search
                    </div>
                </NavLink>
            </div>
            <div className="pr-10 max-sm:pr-2.5 text-[#808080] hover:text-primary-100">
                <NavLink className={({ isActive }) => (isActive ? 'text-primary-100' : '')} to={'/'}>
                    <div className="text-center max-sm:text-xs">
                        <HomeRoundedIcon />
                        <br />
                        Home
                    </div>
                </NavLink>
            </div>
            {firebaseUser ? (
                <>
                    {claim === 'admin' && (
                        <div className="pr-10 max-sm:pr-2.5 text-[#808080] hover:text-primary-100">
                            <NavLink
                                className={({ isActive }) => (isActive ? 'text-primary-100' : '')}
                                to={'/admin/account-management'}
                            >
                                <div className="text-center max-sm:text-xs">
                                    <SupervisorAccountIcon />
                                    <br />
                                    Admin
                                </div>
                            </NavLink>
                        </div>
                    )}
                    {claim !== 'admin' && claim !== 'engineer' && (
                        <div className="pr-10 max-sm:pr-2.5 text-[#808080] hover:text-primary-100">
                            <NavLink
                                className={({ isActive }) => (isActive ? 'text-primary-100' : '')}
                                to={'/favourites'}
                            >
                                <div className="text-center max-sm:text-xs">
                                    <StarRoundedIcon />
                                    <br />
                                    Favourites
                                </div>
                            </NavLink>
                        </div>
                    )}
                    {claim === 'engineer' && (
                        <div className="pr-10 max-sm:pr-2.5 text-[#808080] hover:text-primary-100">
                            <NavLink className={({ isActive }) => (isActive ? 'text-primary-100' : '')} to={'/profile'}>
                                <div className="text-center max-sm:text-xs">
                                    <AccountCircleRoundedIcon />
                                    <br />
                                    Profile
                                </div>
                            </NavLink>
                        </div>
                    )}
                    {claim !== 'admin' && claim !== 'engineer' && (
                        <div className="pr-10 max-sm:pr-2.5 text-[#808080] hover:text-primary-100">
                            <NavLink
                                className={({ isActive }) => (isActive ? 'text-primary-100' : '')}
                                to={'/user-profile'}
                            >
                                <div className="text-center max-sm:text-xs">
                                    <AccountCircleRoundedIcon />
                                    <br />
                                    Profile
                                </div>
                            </NavLink>
                        </div>
                    )}
                    <div className="text-[#808080] hover:text-primary-100">
                        <NavLink className={({ isActive }) => (isActive ? 'text-primary-100' : '')} to={'/logout'}>
                            <div className="text-center max-sm:text-xs">
                                <LogoutRoundedIcon />
                                <br />
                                Logout
                            </div>
                        </NavLink>
                    </div>
                </>
            ) : (
                <div>
                    <NavLink
                        className="text-center items-center w-[120px] h-[40px]
                            border-solid border-primary-100 rounded-md py-[10px] px-[30px] border-2
                            font-medium text-primary-100
                            hover:bg-primary-100 hover:text-white hover:cursor-pointer
                            transition ease-in-out delay-50"
                        to={'/login'}
                    >
                        Login
                    </NavLink>
                </div>
            )}
        </div>
    );
}

import SignalCellularAltRoundedIcon from '@mui/icons-material/SignalCellularAltRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import PortraitRoundedIcon from '@mui/icons-material/PortraitRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import { NavLink } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import AuthenticationContext from '../../context/AuthenticationContext';

function AdminNavBar() {
    const { firebaseUser } = useContext(AuthenticationContext);
    const [name, setName] = useState<string>('');

    useEffect(() => {
        if (firebaseUser && firebaseUser.displayName) {
            const adminName = firebaseUser!.displayName.split(' ');
            setName(`${adminName[0].charAt(0)}. ${adminName[1]}`);
        }
    }, [firebaseUser]);

    return (
        <div
            className="sm:min-w-[20%] xl:max-w-[25%] h-screen bg-[#4F2D7F]
    		flex flex-col justify-between"
        >
            <div className="p-4">
                <NavLink className={({ isActive }) => (isActive ? 'bg-[#3C2065] rounded-lg' : undefined)} to={'/'}>
                    <div className="hover:bg-[#3C2065] hover:rounded-lg p-2.5">
                        <div className="flex flex-row items-center gap-x-2 text-white text-sm">
                            <KeyboardArrowLeftRoundedIcon /> Home
                        </div>
                    </div>
                </NavLink>
                <div className="bg-[#3C2065] rounded-lg p-2.5 mt-4">
                    <h2 className="text-white font-semibold">{name}</h2>
                    <p className="text-white text-xs">Administrator</p>
                </div>
                <div className="mt-5 flex flex-col gap-2">
                    <NavLink
                        className={({ isActive }) => (isActive ? 'bg-[#3C2065] rounded-lg' : undefined)}
                        to={'/admin/analytics'}
                    >
                        <div className="hover:bg-[#3C2065] hover:rounded-lg p-2.5">
                            <div className="flex flex-row items-center gap-x-2 text-white text-sm">
                                <SignalCellularAltRoundedIcon /> Analytics
                            </div>
                        </div>
                    </NavLink>
                    <NavLink
                        className={({ isActive }) => (isActive ? 'bg-[#3C2065] rounded-lg' : undefined)}
                        to={'/admin/profile-review'}
                    >
                        <div className="hover:bg-[#3C2065] hover:rounded-lg p-2.5">
                            <div className="flex flex-row gap-x-2 items-center text-white text-sm">
                                <DoneAllRoundedIcon /> Profile Review
                            </div>
                        </div>
                    </NavLink>
                    <NavLink
                        className={({ isActive }) => (isActive ? 'bg-[#3C2065] rounded-lg' : undefined)}
                        to={'/admin/account-management'}
                    >
                        <div className=" hover:bg-[#3C2065] hover:rounded-lg p-2.5">
                            <div className="flex flex-row gap-x-2 items-center text-white text-sm">
                                <PortraitRoundedIcon /> Account Management
                            </div>
                        </div>
                    </NavLink>
                    <NavLink
                        className={({ isActive }) => (isActive ? 'bg-[#3C2065] rounded-lg' : undefined)}
                        to={'/admin/review-feedback'}
                    >
                        <div className="hover:bg-[#3C2065] hover:rounded-lg p-2.5">
                            <div className="flex flex-row gap-x-2 items-center text-white text-sm">
                                <ChatRoundedIcon /> Review Feedback
                            </div>
                        </div>
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default AdminNavBar;

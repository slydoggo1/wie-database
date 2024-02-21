import { UserProfileDTO } from '../../types/User';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';

interface UserProfileHeaderProps {
    data: UserProfileDTO | undefined;
}

function UserProfileHeader({ data }: UserProfileHeaderProps) {
    return (
        <div className="flex max-lg:flex-col flex-row self-center gap-4 w-full">
            <div className="w-[100%] max-lg:w-[100%] relative">
                <div className="bg-[#4F2D7F] rounded-t-lg h-[170px] bg-gradient-to-r from-[#5d258f] via-[#5532a6] to-[#009AC7]" />
                <div className="flex flex-col bg-white rounded-b-lg p-4 shadow-xl">
                    <div>
                        <div className="flex flex-row items-center mb-2 mt-5">
                            <h2 className="font-semibold text-2xl mr-[10px]">
                                {data?.firstName} {data?.lastName}
                            </h2>
                        </div>
                        <div className="flex flex-row max-lg:flex-col justify-between items-center max-lg:items-start">
                            <div className="flex flex-row items-center gap-2">
                                <SchoolIcon sx={{ color: '#4F2D7F' }} />
                                <p className="text-[#808080] text-base">
                                    {data?.role} at {data?.school}
                                </p>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <EmailIcon sx={{ color: '#4F2D7F' }} />
                                <p className="text-[#808080] text-base">{data?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfileHeader;

import { EngineerProfileDTO } from '../../types/Engineer';

interface ProfileHeaderProps {
    data: EngineerProfileDTO | undefined;
}

function ProfileBio({ data }: ProfileHeaderProps) {
    return (
        <div className="self-center w-full flex flex-col bg-white rounded-lg p-4 shadow-xl">
            <h2 className="font-semibold text-xl mb-2">About {data?.firstName}</h2>
            <p className="text-[#808080] text-base flex">{data?.bio}</p>
        </div>
    );
}

export default ProfileBio;

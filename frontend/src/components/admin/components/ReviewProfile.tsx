import { EngineerProfileDTO as EngineerDTO } from '../../../types/Engineer';
import ReactPlayer from 'react-player';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';

interface ReviewEngineerProfile {
    engineer: EngineerDTO | null;
    clearProfile: boolean;
}

export default function ReviewProfile({ engineer, clearProfile }: ReviewEngineerProfile) {
    return (
        <div className="bg-white h-1/2 shadow-lg rounded-lg p-4 mb-8 overflow-y-scroll">
            <div className="flex flex-grow">
                {engineer && !clearProfile ? (
                    <div className="flex flex-col">
                        {/* Profile Header */}
                        <div className="flex mb-4">
                            <div className="flex flex-col mr-8">
                                <div className="rounded-full border-white bg-slate-300 border-2 w-32 h-32 overflow-hidden">
                                    <img
                                        className="rounded-full w-full h-full object-cover object-center bg-gray-300"
                                        src={engineer?.profilePictureURL}
                                    />
                                </div>
                            </div>

                            <div className="flex-col">
                                <div className="flex flex-row mb-2">
                                    <p className="text-xl font-semibold">
                                        {engineer?.firstName} {engineer?.lastName}
                                    </p>

                                    <div className="gap-2 ml-4 flex-wrap flex-row flex">
                                        {engineer?.topics.map((topic: string, index: number) => (
                                            <div
                                                key={index}
                                                className="bg-[#4F2D7F] rounded-full w-fit text-white px-3 py-1"
                                            >
                                                <p className="font-semibold m-0 text-[14px]">{topic}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <p className="text-[#808080] text-base ">{engineer?.email}</p>
                                </div>

                                <div className="flex gap-x-[4px] mb-2">
                                    <LocationOnRoundedIcon className="text-[#808080]" />
                                    <p className="text-[#808080] text-base ">
                                        {engineer?.suburb}, {engineer?.city}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[#808080] text-base">
                                        {engineer?.position} at {engineer?.organisation}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Bio */}
                        <div className="flex-row mb-4">
                            <h1 className="font-semibold text-lg mb-2">About {engineer?.firstName}</h1>

                            <p className="flex-row font-regular text-[#808080] text-base">{engineer?.bio}</p>
                        </div>

                        {/* Profile LinkedIn */}
                        <div className="flex-row mb-4">
                            <h1 className="font-semibold text-lg mb-2">LinkedIn</h1>

                            <p className="flex-row font-regular text-[#808080] text-base">
                                {engineer?.linkedin ? engineer?.linkedin : 'N/A'}
                            </p>
                        </div>

                        {/* Personal/Additional website*/}
                        <div className="flex-row mb-4">
                            <h1 className="font-semibold text-lg mb-2">Personal/Additional website</h1>

                            <div>
                                {engineer?.personalWebsite ? (
                                    <a
                                        href={`${engineer?.personalWebsite}`}
                                        target="_blank"
                                        className="underline decoration-solid text-[#4F2D7F] hover:text-[#3C2065] transition ease-in-out delay-50"
                                    >
                                        {engineer?.personalWebsite}
                                    </a>
                                ) : (
                                    `N/A`
                                )}
                            </div>
                        </div>

                        {/* Profile Video */}
                        {engineer?.introductionVideoURL ? (
                            <div className="flex-row mb-4">
                                <h1 className="font-semibold text-lg mb-2">Video Introduction</h1>

                                <div className="max-w-2xl w-full rounded-lg border-4 border-solid border-[#4F2D7F]">
                                    <ReactPlayer
                                        url={engineer?.introductionVideoURL}
                                        width="100%"
                                        height="auto"
                                        controls
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex-row mb-4">
                                <h1 className="font-semibold text-lg mb-2">Video Introduction</h1>

                                <p className="flex-row font-regular text-[#808080] text-base">N/A</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-2xl font-semibold text-[#4F2D7F]">No profiles to review</p>
                )}
            </div>
        </div>
    );
}

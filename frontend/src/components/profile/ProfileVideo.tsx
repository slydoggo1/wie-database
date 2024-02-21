import ReactPlayer from 'react-player';

interface ProfileVideoProps {
    videoUrl: string | undefined;
}

function ProfileVideo({ videoUrl }: ProfileVideoProps) {
    return (
        <div className="flex flex-col bg-white rounded-lg p-4 shadow-xl w-full self-center">
            <h2 className="font-semibold text-xl">Video Introduction</h2>
            <div className="flex justify-center items-center p-5">
                <div className="max-w-3xl w-full rounded-lg overflow-hidden border-4 border-solid border-[#4F2D7F]">
                    <ReactPlayer url={videoUrl} width="100%" height="auto" controls />
                </div>
            </div>
        </div>
    );
}

export default ProfileVideo;

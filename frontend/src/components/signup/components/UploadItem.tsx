import React, { ChangeEvent } from 'react';
import ReactPlayer from 'react-player';

interface UploadItemProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    accept?: string;
    className?: string;
    id: string;
    type: 'image' | 'video';
    file: File | undefined;
    setFile: (file: File) => void;
    helperText?: string;
    existingImage?: string;
    existingVideo?: string;
}

export default function UploadItem({
    id,
    icon,
    label,
    onClick,
    className,
    accept,
    type,
    file,
    setFile,
    helperText,
    existingImage,
    existingVideo,
}: UploadItemProps) {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const imagePreview = (
        <>
            <img src={file ? URL.createObjectURL(file) : ''} alt="" width={150} className="hover:cursor-pointer" />
            <p>{file && file.name}</p>
            <p className="text-slate-500">Click image to Reupload</p>
        </>
    );

    const videoPreview = (
        <>
            <video src={file ? URL.createObjectURL(file) : ''} width={150} className="hover:cursor-pointer" />
            <p>{file && file.name}</p>
            <p className="text-slate-500">Click Video to Reupload</p>
        </>
    );

    return (
        <div className={`${className}`} onClick={onClick}>
            <label htmlFor={id}>
                {file ? (
                    <div className="flex flex-col items-center">{type === 'image' ? imagePreview : videoPreview}</div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-7 bg-[#EBEBEB] rounded-lg font-sans hover:cursor-pointer">
                        {existingImage || existingVideo ? (
                            <div>
                                {existingImage && (
                                    <div className="flex flex-col justify-center items-center">
                                        <p className="text-primary-100 mb-1 text-sm">Existing Profile Image </p>
                                        <div className="rounded-full bg-slate-300 border-2 w-[100px] h-[100px] overflow-hidden">
                                            <img
                                                src={existingImage}
                                                alt="profile picture"
                                                className="w-full h-full object-cover object-center"
                                            />
                                        </div>
                                    </div>
                                )}
                                {existingVideo && (
                                    <div className="flex flex-col justify-center items-center">
                                        <p className="text-primary-100 mb-1 text-sm">Existing Introduction Video</p>
                                        <div className="w-[170px] h-[100px]">
                                            <ReactPlayer url={existingVideo} width="100%" height="auto" controls />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-[124px] flex items-center">{icon}</div>
                        )}
                        <div className="mt-2">{label}</div>
                        <div className="text-[#d32f2f]">{helperText}</div>
                    </div>
                )}
            </label>
            <input id={id} type="file" onChange={handleFileChange} className="hidden" accept={accept} />
        </div>
    );
}

import React, { useState } from 'react';

interface InterstProps {
    icon: React.ReactNode;
    text: string;
    onClick?: () => void;
    initialSelect?: boolean;
}

export default function Interest({ icon, text, onClick, initialSelect }: InterstProps) {
    const [isSelected, setIsSelected] = useState(initialSelect);

    const handleClick = () => {
        setIsSelected(!isSelected);
        onClick && onClick();
    };

    return (
        <div className="flex flex-col items-center text-primary-100" onClick={handleClick}>
            <div
                className={` flex items-center justify-center p-3 border-solid border-2 border-primary-100 rounded-full hover:cursor-pointer ${
                    isSelected ? 'text-white bg-primary-100' : ''
                }`}
            >
                {icon}
            </div>
            <p className="font-sans font-bold text-md">{text}</p>
        </div>
    );
}

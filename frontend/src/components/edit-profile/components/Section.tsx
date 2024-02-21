interface SectionProps {
    number: number;
    label: string;
    onClick: () => void;
}

const Section = ({ number, label, onClick }: SectionProps) => {
    return (
        <div onClick={onClick} className="flex p-3 hover:cursor-pointer hover:bg-[#F9F2FA] rounded-md">
            <div className="flex">
                <div className="flex items-center font-semibold justify-center h-7 w-7 rounded-full bg-primary-100 text-white">
                    {number}
                </div>
            </div>
            <div className="grow px-3 text-md font-bold text-primary-100">{label}</div>
        </div>
    );
};

export default Section;

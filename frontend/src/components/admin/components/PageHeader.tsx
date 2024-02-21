interface PageHeaderProps {
    title: string;
}

function PageHeader({ title }: PageHeaderProps) {
    return (
        <>
            <h1 className="text-[26px] font-semibold text-[#4F2D7F] grow-0">{title}</h1>
            <hr className="h-[2px] my-7 border-0 bg-[#4F2D7F] rounded-full grow-0" />
        </>
    );
}

export default PageHeader;

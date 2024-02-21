interface PageContainerProps {
    children: React.ReactNode;
}

function PageContainer({ children }: PageContainerProps) {
    return <div className="h-screen w-screen bg-[#F5F1F5] p-4 flex flex-col">{children}</div>;
}

export default PageContainer;

interface TabsProps {
    tabs: string[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function Tabs({ tabs, activeTab, setActiveTab }: TabsProps) {
    return (
        <div className="flex grow-0">
            {tabs.map((tab, index) => {
                return (
                    <div
                        key={index}
                        className={`flex text-center bg-${
                            activeTab == tab ? 'slate-300' : ''
                        } text-primary-100 mr-1 hover:cursor-pointer py-1 px-4 rounded-md hover:bg-slate-100 `}
                        onClick={() => setActiveTab(tab)}
                    >
                        <p className={`font-semibold text-sm`}>{tab}</p>
                    </div>
                );
            })}
        </div>
    );
}

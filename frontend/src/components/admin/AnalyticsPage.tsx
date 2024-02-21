import PageContainer from './components/PageContainer';
import PageHeader from './components/PageHeader';

function AnalyticsPage() {
    const url = import.meta.env.VITE_FB_ANALYTICS_URL;
    const handleOpenAnalytics = () => {
        window.open(url, '_blank');
    };

    return (
        <PageContainer>
            <PageHeader title="Analytics" />
            <button
                onClick={handleOpenAnalytics}
                className="self-start mt-5 rounded-md bg-primary-100
                                text-white font-medium
                                px-3 py-1
                                border-2
                                border-primary-100
                                hover:bg-[#3C2065]
                                hover:border-[#3C2065]
                                transition ease-in-out delay-50"
            >
                Open Analytics
            </button>
        </PageContainer>
    );
}

export default AnalyticsPage;

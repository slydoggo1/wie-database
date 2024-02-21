import PageContainer from './components/PageContainer';
import PageHeader from './components/PageHeader';
import ProfilesToReview from './components/ProfilesToReview';
import ReviewProfile from './components/ReviewProfile';
import EngineerFeedback from './components/EngineerFeedback';
import { useState } from 'react';
import { EngineerProfileDTO as EngineerDTO } from '../../types/Engineer';

function ProfileReviewPage() {
    const [selectedEngineer, setSelectedEngineer] = useState<EngineerDTO | null>(null);

    const [fetchDataNeeded, setFetchDataNeeded] = useState(false);

    const handleEngineerSelect = (engineerData: EngineerDTO) => {
        setSelectedEngineer(engineerData);
        setFetchDataNeeded(false);
    };

    return (
        <PageContainer>
            <PageHeader title="Profile Review" />

            <div className="flex" style={{ height: 'calc(100vh - 113px)' }}>
                <ProfilesToReview
                    selectedEngineer={selectedEngineer}
                    onEngineerSelect={handleEngineerSelect}
                    fetchDataNeeded={fetchDataNeeded}
                />
                <div className="flex flex-col w-2/3">
                    <ReviewProfile engineer={selectedEngineer} clearProfile={fetchDataNeeded} />
                    <EngineerFeedback engineer={selectedEngineer} triggerFetchData={() => setFetchDataNeeded(true)} />
                </div>
            </div>
        </PageContainer>
    );
}

export default ProfileReviewPage;

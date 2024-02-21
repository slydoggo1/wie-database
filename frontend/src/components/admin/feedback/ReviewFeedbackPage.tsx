import PageContainer from '../components/PageContainer.tsx';
import PageHeader from '../components/PageHeader.tsx';
import { FeedbackList } from './components/types';
import { useContext, useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import AuthenticationContext from '../../../context/AuthenticationContext.tsx';
import FeedbackData from './components/FeedbackData.tsx';
import { toast, ToastContainer } from 'react-toastify';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { downloadJSONAsCSV } from './components/jsonToCSV.ts';
import { fetchFeedbackData } from '../../../api/user.ts';

function ReviewFeedbackPage() {
    const { firebaseUser } = useContext(AuthenticationContext);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    const [feedbackData, setFeedbackData] = useState<FeedbackList[]>([]);
    const [isExportLoading, setIsExportLoading] = useState<boolean>(false);

    const handleClickExportFeedback = () => {
        setIsExportLoading(true);

        if (feedbackData.length === 0) {
            toast.error('No feedback data to export');
        } else {
            downloadJSONAsCSV(feedbackData);
            toast.success('Export completed!');
        }

        setIsExportLoading(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const response = await fetchFeedbackData(firebaseUser);

            if (response) {
                setFeedbackData(response.data);
            } else {
                setIsError(true);
            }

            setIsLoading(false);
        };

        fetchData();
    }, []);

    return (
        <PageContainer>
            <PageHeader title="Review Feedback" />

            {isLoading ? (
                <div className="m-auto text-center text-primary-100 flex-column text-xl font-semibold">
                    <CircularProgress size="50px" style={{ color: '#4F2D7F' }} />
                    <br />
                    Loading...
                </div>
            ) : (
                <div className="flex flex-col justify-between flex-grow mb-[20px]">
                    <FeedbackData feedbackData={feedbackData} isError={isError} />
                    <div className="flex flex-row justify-normal mt-[20px]">
                        <button
                            onClick={handleClickExportFeedback}
                            className="text-center items-center w-[220px] h-[50px]
                                  border-solid border-[#4F2D7F] rounded-md py-[10px] px-[30px] border-2
                                  font-medium hover:text-white hover:bg-[#3C2065] hover:border-[#3C2065]
                                  bg-[#4F2D7F] text-white hover:cursor-pointer
                                  transition ease-in-out delay-50"
                        >
                            {isExportLoading ? (
                                <CircularProgress />
                            ) : (
                                <div className="flex justify-between">
                                    <DownloadRoundedIcon />
                                    Export Feedback
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            )}
            <ToastContainer />
        </PageContainer>
    );
}

export default ReviewFeedbackPage;

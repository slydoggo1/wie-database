import { useEffect, useState } from 'react';
import FeedbackTab from './FeedbackTab.tsx';
import FeedbackDetailsContainer from './FeedbackDetailsContainer.tsx';
import { FeedbackDataProps, FeedbackDetails, FeedbackList } from './types.ts';
import MonthDropdown from './MonthDropdown.tsx';

export default function FeedbackData({ feedbackData, isError }: FeedbackDataProps) {
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toLocaleString('default', { month: 'long' }));

    const [currentMonthsFeedback, setCurrentMonthsFeedback] = useState<FeedbackList | undefined>(
        feedbackData.find((item) => item.month === selectedMonth),
    );
    const [selectedFeedback, setSelectedFeedback] = useState<FeedbackDetails | undefined | null>(
        currentMonthsFeedback ? currentMonthsFeedback.feedback[0] : null,
    );
    const [selectedFeedbackId, setSelectedFeedbackId] = useState<string>('');

    useEffect(() => {
        const currentFeedbackList = feedbackData.find((item) => item.month === selectedMonth);
        setCurrentMonthsFeedback(currentFeedbackList);
        setSelectedFeedback(null);
        setSelectedFeedbackId('');
    }, [feedbackData, selectedMonth]);

    return (
        <div>
            {isError ? (
                <div className="m-auto text-center text-primary-100 flex-column text-xl font-semibold">
                    Something went wrong, please refresh the page
                </div>
            ) : (
                <div className="flex flex-col gap-y-5 justify-between h-[calc(100vh-200px)]">
                    <MonthDropdown currentMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
                    {currentMonthsFeedback ? (
                        <div className="flex flex-row flex-grow justify-between gap-5">
                            <FeedbackTab
                                feedbackList={currentMonthsFeedback!}
                                setSelectedFeedback={setSelectedFeedback}
                                setSelectedFeedbackId={setSelectedFeedbackId}
                                selectedFeedbackId={selectedFeedbackId}
                            />
                            <FeedbackDetailsContainer feedback={selectedFeedback} />
                        </div>
                    ) : (
                        <div className="m-auto text-center w-100% text-primary-100 flex-column text-xl font-semibold">
                            No feedback available for this month
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

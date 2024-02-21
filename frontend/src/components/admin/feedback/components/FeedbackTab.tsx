import { FeedbackTabProps } from './types.ts';
import { Tooltip } from '@mui/material';

export default function FeedbackTab({
    feedbackList,
    setSelectedFeedbackId,
    setSelectedFeedback,
    selectedFeedbackId,
}: FeedbackTabProps) {
    const handleChange = (_e, feedback) => {
        setSelectedFeedbackId(feedback.feedbackId);
        setSelectedFeedback(feedback);
    };

    return (
        <div
            className="flex-grow bg-white drop-shadow-md rounded-lg px-[10px] py-[20px] flex flex-col
                         max-w-[20%]"
        >
            <div className="text-base text-primary-100 font-medium mb-[15px]">Feedback</div>
            <div className="overflow-auto">
                {feedbackList.feedback.map((feedback, index) => (
                    <div
                        onClick={(e) => handleChange(e, feedback)}
                        className={`${
                            feedback.feedbackId === selectedFeedbackId ? 'bg-gray-200' : 'bg-white'
                        } w-full h-[100px]
                           rounded-md p-[10px] hover:bg-gray-100 hover:cursor-pointer transition ease-in-out delay-50
                           mb-[10px]
                       `}
                        key={index}
                    >
                        <Tooltip title={feedback.name}>
                            <div className="text-xl font-bold max-w-90% whitespace-nowrap overflow-hidden text-ellipsis">
                                {feedback.name}
                            </div>
                        </Tooltip>
                        <div className="text-lg">{feedback.feedbackType}</div>
                        <div className="text-sm">{feedback.time}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

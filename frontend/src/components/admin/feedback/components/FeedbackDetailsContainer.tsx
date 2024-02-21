import { FeedbackDetailsProps } from './types.ts';

export default function FeedbackDetailsContainer({ feedback }: FeedbackDetailsProps) {
    return (
        <div className="flex-grow-[3] bg-white drop-shadow-md rounded-lg">
            {feedback ? (
                <div className="m-[40px]">
                    <div className="flex flex-row justify-between">
                        <div>
                            <div className="text-4xl font-extrabold">{feedback.name}</div>

                            <div className="text-xl italic">{feedback.feedbackType}</div>
                        </div>

                        <div className="text-right">
                            <div className="text-base font-medium">{feedback.time}</div>

                            <div className="text-sm font-medium">{feedback.email}</div>
                        </div>
                    </div>

                    <div className="text-xl font-bold mt-[20px]">Feedback</div>

                    <div className="max-h-[calc(100%-100px)] overflow-auto mt-[5px]">
                        <div className="pr-[20px]">{feedback.feedback}</div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center w-full h-full">
                    <div className="text-center m-auto text-primary-100 flex-column text-xl font-semibold">
                        No feedback chosen
                    </div>
                </div>
            )}
        </div>
    );
}

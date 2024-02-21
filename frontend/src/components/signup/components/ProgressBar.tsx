import { ProgressBar as ProgressBarElement, Step } from 'react-step-progress-bar';
import 'react-step-progress-bar/styles.css';

interface ProgressBarProps {
    index: number;
    totalPageNum: number;
    goToPage: (number) => void;
}

export default function ProgressBar({ index, totalPageNum }: ProgressBarProps) {
    return (
        <ProgressBarElement percent={((index + 0.00001) / (totalPageNum - 1)) * 100} filledBackground="#4F2D7F">
            {[...Array(totalPageNum)].map((_, i) => (
                <Step key={i}>
                    {({ accomplished, index }) => (
                        <div
                            className={`${
                                accomplished ? 'bg-primary-100 text-white' : 'bg-white text-background'
                            } w-10 h-10 rounded-full flex items-center justify-center`}
                        >
                            {index + 1}
                        </div>
                    )}
                </Step>
            ))}
        </ProgressBarElement>
    );
}

import { CircularProgress } from '@mui/material';

interface ButtonProps {
    label: string;
    className?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    isDisabled?: boolean;
    loading?: boolean;
}

export default function Button({ label, className, onClick, variant, isDisabled, loading }: ButtonProps) {
    if (variant === 'secondary') {
        return (
            <button
                className={`rounded-md hover:bg-primary-100 w-full h-[60px]
          hover:text-white font-medium 
          border-primary-100 border-2 text-[#4F2D7F] bg-white ${className}`}
                onClick={onClick}
            >
                {label}
            </button>
        );
    }

    return (
        <button
            disabled={isDisabled}
            className={`rounded-md bg-[#4F2D7F] w-full h-[60px]
          text-white font-medium
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          hover:border-[#3C2065] hover:border-2 hover:text-white hover:bg-[#3C2065] ${className}`}
            onClick={onClick}
        >
            {loading ? <CircularProgress sx={{ color: 'white' }} /> : label}
        </button>
    );
}

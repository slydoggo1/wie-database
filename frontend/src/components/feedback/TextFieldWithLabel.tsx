import { StyledTextField } from './components.tsx';
import { ChangeEvent } from 'react';

interface Props {
    placeholder: string;
    title: string;
    value: string;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type: string;
    multiline: boolean;
}

export default function TextfieldWithLabel({ placeholder, title, value, handleChange, type, multiline }: Props) {
    return (
        <div className="flex-grow">
            <div className="font-medium text-base">{title}</div>
            <StyledTextField
                required
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                type={type}
                multiline={multiline}
                fullWidth
            />
        </div>
    );
}

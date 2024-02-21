import { useState } from 'react';
import { TextField as MUITextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { ChangeEvent } from 'react';

interface TextFieldProps {
    label?: string;
    className?: string;
    isPassword?: boolean;
    require?: boolean;
    error?: boolean;
    helperText?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    multiline?: boolean;
    rows?: number;
    value?: string;
}

export default function TextField({
    value,
    label,
    className,
    isPassword,
    require,
    error,
    helperText,
    onChange,
    name,
    multiline,
    rows,
}: TextFieldProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    function togglePasswordVisibility() {
        setIsPasswordVisible((prevState) => !prevState);
    }

    return (
        <div className={className}>
            <p className="mb-1 font-sans">
                {label} {require ? '*' : undefined}
            </p>
            <MUITextField
                value={value}
                type={!isPassword ? 'text' : isPasswordVisible ? 'text' : 'password'}
                className="text-['Poppins'] text-md border-primary-100 border-2 border-solid rounded-lg px-3 py-2 w-full"
                InputProps={{
                    endAdornment: isPassword && (
                        <span className="cursor-pointer" onClick={togglePasswordVisibility}>
                            {isPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </span>
                    ),
                }}
                name={name}
                error={error}
                helperText={helperText}
                onChange={onChange}
                multiline={multiline}
                rows={rows}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                            borderColor: '#4F2D7F',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#4F2D7F',
                        },
                    },
                }}
            />
        </div>
    );
}

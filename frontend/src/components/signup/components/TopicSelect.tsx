import React from 'react';
import { TextField as MUITextField } from '@mui/material';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete } from '@mui/material';

interface TopicsProps {
    setSpec: (icon: string[]) => void;
    specs: string[];
    onRemoveSpec: (icon: string) => void;
    label: string;
    options?: string[];
    require?: boolean;
    className?: string;
    helperText?: string;
    error?: boolean;
}

export default function TopicSelect({
    setSpec,
    specs,
    onRemoveSpec,
    label,
    require,
    className,
    helperText,
    error,
    options,
}: TopicsProps) {
    const handleInputChange = (e: React.SyntheticEvent<Element, Event>, value: string[]) => {
        e.target;

        setSpec(value);
    };

    return (
        <div className={`text-input-with-icons ${className}`}>
            <p className="mb-1 font-sans">
                {label} {require ? '*' : undefined}
            </p>
            <div className="input-container">
                <Autocomplete
                    clearIcon={false}
                    options={options || []}
                    freeSolo
                    multiple
                    onChange={handleInputChange}
                    autoSelect
                    value={specs}
                    renderTags={() =>
                        specs.map((option, index) => (
                            <Chip
                                key={index}
                                label={option}
                                onDelete={() => onRemoveSpec(option)}
                                variant="outlined"
                                deleteIcon={<CloseIcon />}
                                sx={{ backgroundColor: '#00000', color: '#4F2D7F', marginRight: '5px' }}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <MUITextField
                            type="text"
                            placeholder="Type and press Enter..."
                            error={!!error}
                            helperText={helperText}
                            className="text-['Poppins'] text-md border-slate-200 border-2 border-solid rounded-lg px-3 py-2 w-full"
                            {...params}
                        />
                    )}
                    sx={{
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#4F2D7F',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#4F2D7F',
                        },
                        '.MuiSvgIcon-root ': {
                            fill: '#4F2D7F',
                        },
                    }}
                />
            </div>
        </div>
    );
}

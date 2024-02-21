import { Select as MUISelect, MenuItem, SelectChangeEvent, FormHelperText } from '@mui/material';

interface SelectProps {
    label?: string;
    className?: string;
    require?: boolean;
    error?: boolean;
    helperText?: string;
    name?: string;
    options: string[];
    setSelect: (select: string) => void;
    select: string;
}

export default function Select({
    label,
    className,
    require,
    error,
    name,
    options,
    helperText,
    setSelect,
    select,
}: SelectProps) {
    const handleChange = (event: SelectChangeEvent) => {
        setSelect(event.target.value as string);
    };

    return (
        <div className={className}>
            <p className="mb-1 font-sans">
                {label} {require ? '*' : undefined}
            </p>
            <MUISelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={select}
                name={name}
                error={error}
                className="w-full"
                onChange={handleChange}
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
            >
                {options.map((option) => (
                    <MenuItem value={option} key={option}>
                        {option}
                    </MenuItem>
                ))}
            </MUISelect>
            <FormHelperText className="px-3" sx={{ color: '#f44336' }}>
                {helperText}
            </FormHelperText>
        </div>
    );
}

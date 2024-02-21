import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { MonthDropdownProps, MONTHS } from './types.ts';

export default function MonthDropdown({ currentMonth, setSelectedMonth }: MonthDropdownProps) {
    const handleSelectMonth = (event: SelectChangeEvent) => {
        setSelectedMonth(event.target.value);
    };

    return (
        <div className="flex flex-row justify-end">
            <FormControl className="w-[25%] bg-white">
                <Select
                    fullWidth
                    size="small"
                    value={currentMonth}
                    onChange={handleSelectMonth}
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
                    {MONTHS.map((value) => (
                        <MenuItem value={value} key={value}>
                            {value}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

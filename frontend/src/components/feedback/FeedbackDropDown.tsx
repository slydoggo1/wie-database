import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { FeedbackType } from '../../types/Feedback';

interface Props {
    handleChange: (e: SelectChangeEvent) => void;
    feedbackType: string;
}

export default function FeedbackDropDown({ handleChange, feedbackType }: Props) {
    return (
        <FormControl fullWidth>
            <Select
                displayEmpty
                value={feedbackType}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Without label' }}
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
                <MenuItem value={FeedbackType.Engineer}>{FeedbackType.Engineer}</MenuItem>
                <MenuItem value={FeedbackType.Website}>{FeedbackType.Website}</MenuItem>
                <MenuItem value={FeedbackType.Report}>{FeedbackType.Report}</MenuItem>
                <MenuItem value={FeedbackType.Other}>{FeedbackType.Other}</MenuItem>
            </Select>
        </FormControl>
    );
}

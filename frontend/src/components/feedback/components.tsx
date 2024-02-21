import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

export const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: '#4F2D7F',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#4F2D7F',
        },
    },
});

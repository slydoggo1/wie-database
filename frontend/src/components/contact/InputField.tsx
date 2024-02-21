import TextField from '@mui/material/TextField';

export default function InputField({ labelText, inputName, inputType = 'text', className, value, onChange }) {
    return (
        <div className={`flex flex-col flex-auto ${className}`}>
            <label className="pb-4" htmlFor={inputName}>
                {labelText} <span className="text-red-500">*</span>
            </label>
            <TextField
                type={inputType}
                name={inputName}
                value={value}
                onChange={onChange}
                fullWidth
                variant="outlined"
                required
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

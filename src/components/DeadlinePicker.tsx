import React from 'react';
import { DesktopDatePicker  } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Stack } from '@mui/material';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

interface DeadlinePickerProps {
    label?: string;
    value: Dayjs | null;
    onChange: (date: Dayjs | null) => void;
}

const DeadlinePicker: React.FC<DeadlinePickerProps> = ({ label = 'Deadline', value, onChange }) => (
    <Stack direction="row" spacing={2} alignItems="center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
            label={label}
            value={value}
            onChange={onChange}
            minDate={dayjs()}
            slotProps={{
                field: {
                    clearable: true,
                },
                textField: {
                    fullWidth: true,
                    margin: 'dense',
                    variant: 'outlined',
                    helperText: 'MM/DD/YYYY',
                },
            }}
        />
        </LocalizationProvider>
    </Stack>
);

export default DeadlinePicker;
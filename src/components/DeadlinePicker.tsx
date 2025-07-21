import React from 'react';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import { TextField, Button, Stack } from '@mui/material';
import {Dayjs} from 'dayjs';

interface DeadlinePickerProps {
    label?: string;
    value: Dayjs | null;
    onChange: (date: Dayjs | null) => void;
}

const DeadlinePicker: React.FC<DeadlinePickerProps> = ({ label = 'Deadline', value, onChange }) => (
    <Stack direction="row" spacing={2} alignItems="center">
        <DatePicker
            label={label}
            value={value}
            onChange={onChange}
            slotProps={{
                textField: {
                    fullWidth: true,
                    margin: 'dense',
                    variant: 'outlined',
                } as any
            }}
        />
        {value && (
            <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => onChange(null)}
            >
                Clear
            </Button>
        )}
    </Stack>
);

export default DeadlinePicker;
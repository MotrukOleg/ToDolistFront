import React from 'react';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {TextField, TextFieldProps} from '@mui/material';
import {Dayjs} from 'dayjs';

interface DeadlinePickerProps {
    label?: string;
    value: Dayjs | null;
    onChange: (date: Dayjs | null) => void;
}

const DeadlinePicker: React.FC<DeadlinePickerProps> = ({label = 'Deadline', value, onChange}) => (
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
);

export default DeadlinePicker;
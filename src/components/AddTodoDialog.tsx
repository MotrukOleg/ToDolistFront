import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';
import dayjs from 'dayjs';
import DeadlinePicker from './DeadlinePicker';

interface AddTodoDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (title: string, description: string, deadline: Date | null) => Promise<void>;
}


const AddTodoDialog: React.FC<AddTodoDialogProps> = ({ open, onClose, onAdd }) => {
    const [values, setValues] = useState<{ title: string, description: string }>({ title: '', description:'' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [newDeadline, setNewDeadline] = useState<Date | null>(null);

    const validateField = (name: string, value: string) => {
        if (name === 'title') {
            if (!value.trim()) return 'Todo is required';
            if (value.length > 100) return 'Todo must be less than 100 characters';
        }
        return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        Object.entries(values).forEach(([name, value]) => {
            const error = validateField(name, value);
            if (error) newErrors[name] = error;
        });
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        if (!values.title.trim()) return;
        await onAdd(values.title, values.description, newDeadline);
        setValues({ title: '', description: '' });
        setNewDeadline(null);
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontWeight: 700 }}>Add new todo</DialogTitle>
    <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
            <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        name="title"
                        fullWidth
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.todo}
                        helperText={errors.todo}
                        sx={{ mb: 1 } }
            />
            <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        fullWidth
                        multiline
                        rows={8}
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.description}
                        helperText={errors.description}
                        sx={{ mb: 2 } }
            />
    <DeadlinePicker
    value={newDeadline ? dayjs(newDeadline) : null}
    onChange={date => setNewDeadline(date ? date.toDate() : null)}
    />
    </DialogContent>
    <DialogActions>
        <Button
            variant="contained"
            sx={{
                backgroundColor: '#1976d2',
                color: '#fff',
                borderRadius: 2,
                fontWeight: 600,
                px: 3,
                py: 1,
                boxShadow: 2,
                '&:hover': { backgroundColor: '#1565c0' }
            }} onClick={onClose}>Cancel</Button>
        <Button
            type="submit"
            variant="contained"
            sx={{
                backgroundColor: '#1976d2',
                color: '#fff',
                borderRadius: 2,
                fontWeight: 600,
                px: 3,
                py: 1,
                boxShadow: 2,
                '&:hover': { backgroundColor: '#1565c0' }
            }}
        >
            Add
        </Button>
     </DialogActions>
    </Box>
</Dialog>
);
};

export default AddTodoDialog;
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import DeadlinePicker from './DeadlinePicker';
import dayjs from 'dayjs';
import { updateTodoStatus, deleteTodo as deleteTodoApi } from '../services/todoService';

interface Todo {
    recordId: BigInt;
    title: string;
    description: string;
    status: 'todo' | 'inprogress' | 'done';
    deadline?: Date | string | null;
}


interface EditTodoDialogProps {
    open: boolean;
    selectedTodo: Todo | null;
    onClose: () => void;
    onUpdate: (updatedTodo: Todo) => void;
    onDelete: (id: BigInt) => void;
}

const EditTodoDialog: React.FC<EditTodoDialogProps> = ({
                                                           open,
                                                           selectedTodo,
                                                           onClose,
                                                           onUpdate,
                                                           onDelete,
                                                       }) => {
    const [editText, setEditText] = useState(selectedTodo?.title || '');
    const [editDescriptionText, setEditDescriptionText] = useState(selectedTodo?.description || '');
    const [newDeadline, setNewDeadline] = useState<Date | null>(
        selectedTodo?.deadline ? new Date(selectedTodo.deadline as string) : null
    );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [error, setError] = useState('');

    useEffect(() => {
        setEditText(selectedTodo?.title || '');
        setEditDescriptionText(selectedTodo?.description || '');
        setNewDeadline(selectedTodo?.deadline ? new Date(selectedTodo.deadline as string) : null);
        setErrors({});
        setError('');
    }, [open, selectedTodo]);

    const validateFields = (title: string, description: string) => {
        const errors: { [key: string]: string } = {};
        if (!title.trim()) errors.title = 'Title is required';
        else if (title.length > 50) errors.title = 'Title must be less than 50 characters';
        if (description.length > 500) errors.description = 'Description must be less than 500 characters';
        return errors;
    };

    const handleSave = async () => {
        const validationErrors = validateFields(editText, editDescriptionText);
        if (Object.keys(validationErrors).length > 0 || !selectedTodo) {
            setErrors(validationErrors);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const formattedDeadline = newDeadline ? dayjs(newDeadline).format('YYYY-MM-DD') : null;
            await updateTodoStatus(
                token,
                selectedTodo.recordId.toString(),
                selectedTodo.status,
                editText,
                formattedDeadline,
                editDescriptionText
            );
            onUpdate({ ...selectedTodo, title: editText, description: editDescriptionText, deadline: formattedDeadline });
            onClose();
        } catch {
            setError('Failed to update todo');
        }
    };


    const handleDelete = async () => {
        if (!selectedTodo) return;
        try {
            const token = localStorage.getItem('token');
            await deleteTodoApi(token, selectedTodo.recordId.toString());
            onDelete(selectedTodo.recordId);
            onClose();
        } catch {
            setError('Failed to delete todo');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Todo</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Title"
                    fullWidth
                    value={editText}
                    onChange={e => { setEditText(e.target.value); setErrors({ ...errors, title: '' }); }}
                    onBlur={() => setErrors(validateFields(editText, editDescriptionText))}
                    error={!!errors.title}
                    helperText={errors.title}
                />
                <TextField
                    margin="dense"
                    label="Description"
                    fullWidth
                    multiline
                    rows={8}
                    value={editDescriptionText}
                    onChange={e => { setEditDescriptionText(e.target.value); setErrors({ ...errors, description: '' }); }}
                    onBlur={() => setErrors(validateFields(editText, editDescriptionText))}
                    error={!!errors.description}
                    helperText={errors.description}
                />

                <DeadlinePicker
                    value={newDeadline ? dayjs(newDeadline) : null}
                    onChange={date => setNewDeadline(date ? date.toDate() : null)}
                />
                {error && (
                    <div style={{ color: 'red', marginTop: 8 }}>{error}</div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="error" onClick={handleDelete}>Delete</Button>
                <Button variant="contained" onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditTodoDialog;
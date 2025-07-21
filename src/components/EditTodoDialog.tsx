import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import DeadlinePicker from './DeadlinePicker';
import dayjs from 'dayjs';
import { updateTodoStatus, deleteTodo as deleteTodoApi } from '../services/todoService';

interface Todo {
    recordId: BigInt;
    recordText: string;
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
    const [editText, setEditText] = useState(selectedTodo?.recordText || '');
    const [newDeadline, setNewDeadline] = useState<Date | null>(
        selectedTodo?.deadline ? new Date(selectedTodo.deadline as string) : null
    );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [error, setError] = useState('');

    useEffect(() => {
        setEditText(selectedTodo?.recordText || '');
        setNewDeadline(selectedTodo?.deadline ? new Date(selectedTodo.deadline as string) : null);
        setErrors({});
        setError('');
    }, [open, selectedTodo]);

    const validateField = (value: string) => {
        if (!value.trim()) return 'Todo is required';
        if (value.length > 100) return 'Todo must be less than 100 characters';
        return '';
    };

    const handleSave = async () => {
        const errorMsg = validateField(editText);
        if (errorMsg || !selectedTodo) {
            setErrors({ todo: errorMsg || 'No todo selected' });
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
                formattedDeadline
            );
            onUpdate({ ...selectedTodo, recordText: editText, deadline: formattedDeadline });
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
                    label="Todo"
                    fullWidth
                    value={editText}
                    onChange={e => { setEditText(e.target.value); setErrors({ todo: '' }); }}
                    onBlur={() => setErrors({ todo: validateField(editText) })}
                    error={!!errors.todo}
                    helperText={errors.todo}
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
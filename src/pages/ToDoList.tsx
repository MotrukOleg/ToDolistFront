import {
    fetchTodos,
    addTodo as addTodoApi,
    deleteTodo as deleteTodoApi,
    updateTodoStatus
} from '../services/todoService';
import React, {useEffect, useState} from 'react';
import {
    Container, Paper, Typography, Button, Alert, Box, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField
} from '@mui/material';
import {DragDropContext, Droppable, DropResult} from '@hello-pangea/dnd';
import DraggableTodo from '../components/DraggableTodo';
import Bg from '../components/BackGround';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from '../store';
import {setTodos, addTodo, updateTodo, deleteTodo, setSelectedTodo} from '../features/todosSlice';
import LogOut from '../components/LogoutButton';
import DeadlinePicker from '../components/DeadlinePicker';
import dayjs from "dayjs";

interface Todo {
    recordId: BigInt;
    recordText: string;
    status: 'todo' | 'inprogress' | 'done';
    deadline?: Date | string | null;
}

const columns = [
    {id: 'todo', title: 'To Do'},
    {id: 'inprogress', title: 'In Progress'},
    {id: 'done', title: 'Done'}
];

const ToDoList: React.FC = () => {
    const [newTodo, setNewTodo] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [editText, setEditText] = useState('')
    const todos = useSelector((state: RootState) => state.todos.todos);
    const selectedTodo = useSelector((state: RootState) => state.todos.selectedTodo);
    const [newTodoStatus, setNewTodoStatus] = useState<Todo['status']>('todo');
    const dispatch = useDispatch<AppDispatch>();
    const [newDeadline, setNewDeadline] = useState<Date | null>(null);

    useEffect(() => {
        const fetchAllTodos = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetchTodos(token);
                dispatch(setTodos(response));
            } catch {
                setError('Failed to fetch todos');
            }
        };
        fetchAllTodos();
    }, [dispatch]);

    useEffect(() => {
        if (selectedTodo && (selectedTodo as Todo).deadline) {
            setNewDeadline(new Date((selectedTodo as Todo).deadline!));
        } else {
            setNewDeadline(null);
        }
    }, [selectedTodo]);
    const handleTodoClick = (todo: Todo) => {
        dispatch(setSelectedTodo(todo));
        setEditText(todo.recordText);
    };


    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const formattedDeadline = newDeadline ? dayjs(newDeadline).format('YYYY-MM-DD') : null;
            const addedTodo = await addTodoApi(token, newTodo, formattedDeadline, newTodoStatus);
            dispatch(addTodo(addedTodo));
            setNewTodo('');
            setOpen(false);
        } catch {
            setError('Failed to add todo');
        }
    };

    const handleEditSave = async () => {
        if (!selectedTodo) return;
        try {
            const token = localStorage.getItem('token');
            const formattedDeadline = newDeadline ? dayjs(newDeadline).format('YYYY-MM-DD') : null;
            await updateTodoStatus(token, selectedTodo.recordId.toString(), selectedTodo.status, editText, formattedDeadline);
            dispatch(updateTodo({...selectedTodo, recordText: editText , deadline: formattedDeadline}));
            dispatch(setSelectedTodo(null));
        } catch {
            setError('Failed to update todo');
        }
    };

    const handleDelete = async () => {
        if (!selectedTodo) return;
        try {
            const token = localStorage.getItem('token');
            await deleteTodoApi(token, selectedTodo.recordId.toString());
            dispatch(deleteTodo(selectedTodo.recordId));
            dispatch(setSelectedTodo(null));
        } catch {
            setError('Failed to delete todo');
        }
    };

    const onDragEnd = async (result: DropResult) => {
        const {source, destination, draggableId} = result;
        if (!destination || source.droppableId === destination.droppableId) return;

        const todo = todos.find(t => t.recordId.toString() === draggableId);
        if (!todo) return;

        try {
            const token = localStorage.getItem('token');
            const formattedDeadline = todo.deadline ? dayjs(todo.deadline).format('YYYY-MM-DD') : null;
            console.log(formattedDeadline);
            await updateTodoStatus(token, todo.recordId.toString(), destination.droppableId, todo.recordText, formattedDeadline);
            dispatch(updateTodo({...todo, status: destination.droppableId as Todo['status']}));
        } catch {
            setError('Failed to update todo');
        }
    };


    return (
        <Bg>
            <Container maxWidth="xl" sx={{mt: 6}}>
                <Paper elevation={4} sx={{p: 4, borderRadius: 3, mb: 4}}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Board
                    </Typography>
                    <Box sx={{display: "flex", justifyContent: "flex-end", mb: 2}}>
                        <LogOut/>
                    </Box>
                    {error && (
                        <Alert severity="error" sx={{mb: 2}}>
                            {error}
                        </Alert>
                    )}
                </Paper>
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>Add new todo</DialogTitle>
                    <Box component="form" onSubmit={handleAddTodo}>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Todo"
                                fullWidth
                                value={newTodo}
                                onChange={e => setNewTodo(e.target.value)}
                            />
                            <DeadlinePicker
                                value={newDeadline ? dayjs(newDeadline) : null}
                                onChange={date => setNewDeadline(date ? date.toDate() : null)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="contained">Add</Button>
                        </DialogActions>
                    </Box>
                </Dialog>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Box sx={{display: 'flex', gap: 3, alignItems: 'flex-start', overflowX: 'auto', pb: 2}}>
                        {columns.map(col => (
                            <Droppable droppableId={col.id} key={col.id}>
                                {(provided) => (
                                    <Paper
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        elevation={3}
                                        sx={{flex: 1, minHeight: 500, p: 2, display: 'flex', flexDirection: 'column'}}
                                    >
                                        <Typography
                                            variant="h6"
                                            align="center"
                                            gutterBottom
                                            sx={{
                                                fontWeight: 600,
                                                color: '#42526e',
                                                mb: 2,
                                                letterSpacing: 1,
                                                borderBottom: '2px solid #e4e6ea',
                                                pb: 1,
                                            }}
                                        >
                                            {col.title}
                                        </Typography>
                                        <Box sx={{display: "flex", justifyContent: "center", mb: 4}}>
                                            <Button
                                                variant="contained"
                                                onClick={() =>{setNewTodoStatus(col.id as Todo['status']); setOpen(true) }}
                                                sx={{
                                                    backgroundColor: '#0079bf',
                                                    color: '#fff',
                                                    borderRadius: '3px',
                                                    fontWeight: 'bold',
                                                    boxShadow: '0 1px 0 #091e4240',
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        backgroundColor: '#026aa7',
                                                    },
                                                }}
                                            >
                                                + Add Record
                                            </Button>
                                        </Box>
                                        {todos
                                            .filter(todo => todo && todo.status && todo.recordId && todo.recordText && todo.status === col.id)
                                            .map((todo, idx) => (
                                                <DraggableTodo todo={todo} idx={idx} key={todo.recordId.toString()}
                                                               onClick={() => handleTodoClick(todo)}/>
                                            ))}
                                        {provided.placeholder}
                                    </Paper>
                                )}
                            </Droppable>
                        ))}
                    </Box>
                </DragDropContext>
                <Dialog open={!!selectedTodo} onClose={() => dispatch(setSelectedTodo(null))}>
                    <DialogTitle>Edit Todo</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Todo"
                            fullWidth
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                        />
                        <DeadlinePicker
                            value={newDeadline ? dayjs(newDeadline) : null}
                            onChange={date => setNewDeadline(date ? date.toDate() : null)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => dispatch(setSelectedTodo(null))}>Cancel</Button>
                        <Button color="error" onClick={handleDelete}>Delete</Button>
                        <Button variant="contained" onClick={handleEditSave}>Save</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Bg>

    );
};

export default ToDoList;
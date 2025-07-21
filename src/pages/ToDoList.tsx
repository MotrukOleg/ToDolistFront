import {
    fetchTodos,
    addTodo as addTodoApi,
    deleteTodo as deleteTodoApi,
    updateTodoStatus
} from '../services/todoService';
import React, {useEffect, useState} from 'react';
import {
    Container, Paper, Typography, Button, Alert, Box
} from '@mui/material';
import {DragDropContext, Droppable, DropResult} from '@hello-pangea/dnd';
import DraggableTodo from '../components/DraggableTodo';
import Bg from '../components/BackGround';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from '../store';
import {setTodos, addTodo, updateTodo, deleteTodo, setSelectedTodo} from '../features/todosSlice';
import LogOut from '../components/LogoutButton';
import dayjs from "dayjs";
import EditTodoDialog from '../components/EditTodoDialog';
import AddTodoDialog from '../components/AddTodoDialog';



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
    const [values, setValues] = useState<{ todo: string }>({ todo: '' });
    const [error, setError] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editText, setEditText] = useState('')
    const todos = useSelector((state: RootState) => state.todos.todos);
    const selectedTodo = useSelector((state: RootState) => state.todos.selectedTodo);
    const [newTodoStatus, setNewTodoStatus] = useState<Todo['status']>('todo');
    const dispatch = useDispatch<AppDispatch>();
    const [newDeadline, setNewDeadline] = useState<Date | null>(null);
    const isTodoTextValid = (text: string) => text.trim().length > 0 && text.length <= 100;
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

    const validateField = (name: string | null, value: string | null) => {
        if (name === 'todo') {
            if (!value || !value.trim()) return 'Todo is required';
            if (value.length > 100) return 'Todo must be less than 100 characters';
        }
        return '';
    };


    const handleAddTodo = async (todoText: string, deadline: Date | null) => {
        try {
            const token = localStorage.getItem('token');
            const formattedDeadline = deadline ? dayjs(deadline).format('YYYY-MM-DD') : null;
            const addedTodo = await addTodoApi(token, todoText, formattedDeadline, newTodoStatus);
            dispatch(addTodo(addedTodo));
        } catch {
            setError('Failed to add todo');
        }
    };


    const handleEditSave = async (text: string, deadline: Date | null) => {
        const error = validateField('todo', text);
        if (error) {
            setErrors({ todo: error });
            return;
        }
        if (!selectedTodo) return;
        try {
            const token = localStorage.getItem('token');
            const formattedDeadline = deadline ? dayjs(deadline).format('YYYY-MM-DD') : null;
            await updateTodoStatus(token, selectedTodo.recordId.toString(), selectedTodo.status, text, formattedDeadline);
            dispatch(updateTodo({ ...selectedTodo, recordText: text, deadline: formattedDeadline }));
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
                <AddTodoDialog
                    open={addDialogOpen}
                    onClose={() => setAddDialogOpen(false)}
                    onAdd={handleAddTodo}
                />
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
                                                onClick={() => { setNewTodoStatus(col.id as Todo['status']); setAddDialogOpen(true); }}
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
                <EditTodoDialog
                    open={!!selectedTodo}
                    selectedTodo={selectedTodo}
                    onClose={() => dispatch(setSelectedTodo(null))}
                    onUpdate={updatedTodo => dispatch(updateTodo(updatedTodo))}
                    onDelete={id => dispatch(deleteTodo(id))}
                />
            </Container>
        </Bg>

    );
};

export default ToDoList;
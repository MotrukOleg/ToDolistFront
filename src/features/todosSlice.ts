import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Todo {
    recordId: BigInt;
    recordText: string;
    status: 'todo' | 'inprogress' | 'done';
    deadline?: Date | string | null;
}

interface TodosState {
    todos: Todo[];
    selectedTodo: Todo | null;
}

const initialState: TodosState = {
    todos: [],
    selectedTodo: null,
};

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        setTodos(state, action: PayloadAction<Todo[]>) {
            state.todos = action.payload;
        },
        addTodo(state, action: PayloadAction<Todo>) {
            state.todos.unshift(action.payload);
        },
        updateTodo(state, action: PayloadAction<Todo>) {
            const index = state.todos.findIndex(
                t => t.recordId.toString() === action.payload.recordId.toString()
            );
            if (index !== -1) state.todos[index] = action.payload;
        },
        deleteTodo(state, action: PayloadAction<BigInt>) {
            state.todos = state.todos.filter(
                t => t.recordId.toString() !== action.payload.toString()
            );
        },
        setSelectedTodo(state, action: PayloadAction<Todo | null>) {
            state.selectedTodo = action.payload;
        },
    },
});

export const {setTodos, addTodo, updateTodo, deleteTodo, setSelectedTodo} = todosSlice.actions;
export default todosSlice.reducer;
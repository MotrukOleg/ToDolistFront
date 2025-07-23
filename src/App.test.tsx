import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './store';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ToDoList from './pages/ToDoList';
import AddTodoDialog from './components/AddTodoDialog';
import EditTodoDialog from './components/EditTodoDialog';
import DraggableTodo from './components/DraggableTodo';
import * as todoService from '../src/services/todoService';
import { act } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import dayjs from 'dayjs';

jest.mock('../src/services/todoService', () => ({
    updateTodoStatus: jest.fn().mockResolvedValue({}),
    deleteTodo: jest.fn().mockResolvedValue({}),
}));

describe('EditTodoDialog', () => {
    const todo = {
        recordId: BigInt(1),
        title: 'Old Title',
        description: 'Old Description',
        status: 'todo' as 'todo',
        deadline: null,
    };

    it('calls onUpdate with updated todo when Save is clicked', async () => {
        const onUpdate = jest.fn();
        const onClose = jest.fn();
        const onDelete = jest.fn();

        render(
            <EditTodoDialog
                open={true}
                selectedTodo={todo}
                onClose={onClose}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />
        );

        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Title' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'New Description' } });

        const newDate = dayjs('2025-07-23');
        const deadlineInput = screen.getByTestId('deadline-input');

        fireEvent.change(screen.getByTestId('deadline-input'), { target: { value: '2025-07-23' } });
        fireEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => {
            expect(onUpdate).toHaveBeenCalledWith({
                ...todo,
                title: 'New Title',
                description: 'New Description',
                deadline: null,
            });
        });
    });
});


test('renders login form', () => {
    render(
        <Provider store={store}>
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/password/i).length).toBeGreaterThanOrEqual(1);
});

test('renders register form', () => {
    render(
        <Provider store={store}>
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/password/i).length).toBeGreaterThanOrEqual(2);
});

test('can add a todo with title and description', async () => {
    const handleAdd = jest.fn();
    render(
        <AddTodoDialog open={true} onClose={() => { }} onAdd={handleAdd} />
    );
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Todo' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByTestId('deadline-input'), { target: { value: '2025-07-22' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    await waitFor(() =>
        expect(handleAdd).toHaveBeenCalledWith('Test Todo', 'Test Description', null)
    );
});



test('shows and hides long description', () => {
    const todo = {
        recordId: BigInt(2),
        title: 'Title',
        description: 'This is a long description that should be truncated and toggled.',
        status: 'todo' as 'todo',
        deadline: null,
    };

    render(
        <DragDropContext onDragEnd={() => { }}>
            <Droppable droppableId="test-droppable">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        <DraggableTodo todo={todo} idx={0} />
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );

    expect(screen.getByText(/This is a long desc.../i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/show more/i));
    expect(screen.getByText(todo.description)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/show less/i));
    expect(screen.getByText(/This is a long desc.../i)).toBeInTheDocument();
});


test('renders todo board columns', () => {
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ToDoList />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByText(/To Do/i)).toBeInTheDocument();
    expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Done/i)).toBeInTheDocument();
});

test('can click all "+ Add Record" buttons and open the add dialog', () => {
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ToDoList />
            </MemoryRouter>
        </Provider>
    );

    const addButtons = screen.getAllByRole('button', { name: /\+ Add Record/i });
    expect(addButtons.length).toBeGreaterThanOrEqual(3);

    addButtons.forEach((button) => {
        fireEvent.click(button);
        expect(screen.getByText(/Add new todo/i)).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    });
});



test('basic DOM test', () => {
    const div = document.createElement('div');
    expect(div).not.toBeNull();
});

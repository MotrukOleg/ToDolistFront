import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import AuthForm from './components/AuthForm';
import store from './store';
import '@testing-library/jest-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { MemoryRouter } from 'react-router-dom';

test('renders login form', () => {
    render(
        <Provider store={store}>
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        </Provider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});
test('renders login form', () => {
    render(
        <Provider store={store}>
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        </Provider>
    );

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});
test('basic DOM test', () => {
    const div = document.createElement('div');
    expect(div).not.toBeNull();
});

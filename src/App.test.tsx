
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders AuthForm on /login route', () => {
    render(
        <MemoryRouter initialEntries={['/login']}>
            <App />
        </MemoryRouter>
    );
    const loginElement = screen.getByText(/login/i);
    expect(loginElement).toBeInTheDocument();
});

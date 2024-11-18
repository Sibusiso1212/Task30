import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserDetails from '../UserDetails';

// Mock fetch function
global.fetch = jest.fn();

describe('UserDetails Component', () => {
    // Snapshot test
    test('matches snapshot', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/user/testuser']}>
                <Routes>
                    <Route path="/user/:username" element={<UserDetails />} />
                </Routes>
            </MemoryRouter>
        );
        expect(container).toMatchSnapshot();
    });

    // Loading state test
    test('displays loading state', () => {
        render(
            <MemoryRouter initialEntries={['/user/testuser']}>
                <Routes>
                    <Route path="/user/:username" element={<UserDetails />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    // User data display test
    test('displays user data when loaded', async () => {
        const mockData = {
            user: {
                login: 'testuser',
                name: 'Test User',
                bio: 'Test Bio',
                avatar_url: 'test.jpg'
            },
            repos: []
        };

        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockData)
        });

        render(
            <MemoryRouter initialEntries={['/user/testuser']}>
                <Routes>
                    <Route path="/user/:username" element={<UserDetails />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Test User')).toBeInTheDocument();
            expect(screen.getByText('Test Bio')).toBeInTheDocument();
        });
    });
});

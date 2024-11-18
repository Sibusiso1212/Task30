import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchBox from '../SearchBox';

// Mock fetch function
global.fetch = jest.fn();

describe('SearchBox Component', () => {
    // Snapshot test
    test('matches snapshot', () => {
        const { container } = render(
            <BrowserRouter>
                <SearchBox />
            </BrowserRouter>
        );
        expect(container).toMatchSnapshot();
    });

    // Input field test
    test('updates input value on change', () => {
        render(
            <BrowserRouter>
                <SearchBox />
            </BrowserRouter>
        );
        const input = screen.getByPlaceholderText('Search GitHub users...');
        fireEvent.change(input, { target: { value: 'test' } });
        expect(input.value).toBe('test');
    });

    // Search functionality test
    test('performs search on form submission', async () => {
        const mockData = {
            items: [
                { id: 1, login: 'user1', avatar_url: 'url1' },
                { id: 2, login: 'user2', avatar_url: 'url2' }
            ]
        };

        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockData)
        });

        render(
            <BrowserRouter>
                <SearchBox />
            </BrowserRouter>
        );

        const input = screen.getByPlaceholderText('Search GitHub users...');
        const button = screen.getByText('Search');

        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('user1')).toBeInTheDocument();
        });
    });
});
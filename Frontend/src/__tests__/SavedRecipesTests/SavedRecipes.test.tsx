import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SavedRecipes from '../../Components/SavedRecipes/SavedRecipes';

// Mock fetch API
beforeEach(() => {
    global.fetch = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('SavedRecipes Component', () => {
    test('renders loading state initially', () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ recipes: [] }),
        });

        render(<SavedRecipes />);
        expect(screen.getByText('Loading recipes...')).toBeInTheDocument();
    });

    test('renders error message on fetch failure', async () => {
        (fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

        render(<SavedRecipes />);

        await waitFor(() => {
            expect(screen.getByText(/Failed to load recipes/)).toBeInTheDocument();
        });
    });

    test('renders recipes correctly', async () => {
        const mockRecipes = [
            { PK: '1', name: 'Recipe 1', user_id: 'User 1', description: 'Description 1' },
            { PK: '2', name: 'Recipe 2', user_id: 'User 2', description: 'Description 2' },
        ];

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ recipes: mockRecipes }),
        });

        render(<SavedRecipes />);

        await waitFor(() => {
            expect(screen.getByText('Recipe 1')).toBeInTheDocument();
            expect(screen.getByText('Recipe 2')).toBeInTheDocument();
        });
    });

    test('handles delete functionality', async () => {
        const mockRecipes = [
            { PK: '1', name: 'Recipe 1', user_id: 'User 1', description: 'Description 1' },
        ];

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ recipes: mockRecipes }),
        });

        render(<SavedRecipes />);

        await waitFor(() => {
            expect(screen.getByText('Recipe 1')).toBeInTheDocument();
        });

        (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

        const deleteButton = screen.getByText(/🗑️/);
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.queryByText('Recipe 1')).not.toBeInTheDocument();
        });
    });
});
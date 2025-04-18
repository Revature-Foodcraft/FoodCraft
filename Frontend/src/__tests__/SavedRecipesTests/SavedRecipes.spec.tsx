import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SavedRecipes from '../../Components/SavedRecipes/SavedRecipes';
import { MemoryRouter } from 'react-router-dom';

beforeEach(() => {
    global.fetch = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('SavedRecipes Component', () => {

    test("placeholder", () => {

    })


});
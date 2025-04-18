import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SmartFridgeContainer from "../../Components/SmartFridge/SmartFridgeContainer";
import useIngredients from "../../Components/SmartFridge/useIngredients";
import { IngredientCategory } from "../../Types/Ingredient";

jest.mock("../../Components/SmartFridge/useIngredients");

describe("SmartFridgeContainer", () => {
    const mockUseIngredients = useIngredients as jest.MockedFunction<typeof useIngredients>;

    beforeEach(() => {
        mockUseIngredients.mockReturnValue({
            ingredients: [
                { id: "1", name: "Carrot", amount: 2, unit: "kg", category: IngredientCategory.Vegetables },
                { id: "2", name: "Chicken", amount: 1, unit: "kg", category: IngredientCategory.Meat },
            ],
            loading: false,
            error: null,
            addIngredient: jest.fn(),
            updateIngredient: jest.fn(),
            removeIngredient: jest.fn(),
            fetchIngredients: jest.fn(),
        });
    });

    it("renders the Smart Fridge title", () => {
        render(<SmartFridgeContainer />);
        expect(screen.getByText(/Smart Fridge/i)).toBeInTheDocument();
    });

    it("displays ingredients grouped by category", () => {
        render(<SmartFridgeContainer />);
        expect(screen.getByText(/Vegetables/i)).toBeInTheDocument();
        expect(screen.getByText(/Carrot/i)).toBeInTheDocument();
        expect(screen.getByText(/Meat/i)).toBeInTheDocument();
        expect(screen.getByText(/Chicken/i)).toBeInTheDocument();
    });

    it("opens the Add Ingredient modal when the button is clicked", () => {
        render(<SmartFridgeContainer />);
        const addButton = screen.getByText(/Add Ingredient/i);
        fireEvent.click(addButton);
        expect(screen.getByText(/Add Ingredient/i)).toBeInTheDocument();
    });

    it("handles ingredient removal", async () => {
        const removeIngredientMock = jest.fn();
        mockUseIngredients.mockReturnValueOnce({
            ...mockUseIngredients(null),
            removeIngredient: removeIngredientMock,
        });

        render(<SmartFridgeContainer />);
        const deleteButton = screen.getAllByRole("button", { name: "" })[0];
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(removeIngredientMock).toHaveBeenCalledWith("1");
        });
    });

    it("handles ingredient updates", async () => {
        const updateIngredientMock = jest.fn();
        mockUseIngredients.mockReturnValueOnce({
            ...mockUseIngredients(null),
            updateIngredient: updateIngredientMock,
        });

        render(<SmartFridgeContainer />);
        const editableText = screen.getByText(/2 kg/i);
        fireEvent.click(editableText);

        const inputField = screen.getByRole("spinbutton");
        fireEvent.change(inputField, { target: { value: "3" } });

        const saveButton = screen.getByText(/Save/i);
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(updateIngredientMock).toHaveBeenCalledWith("1", 3, "kg");
        });
    });

    it("adds a new ingredient and displays it in the correct category", async () => {
        const addIngredientMock = jest.fn();
        mockUseIngredients.mockReturnValueOnce({
            ...mockUseIngredients(null),
            addIngredient: addIngredientMock,
        });

        render(<SmartFridgeContainer />);

        // Open Add Ingredient modal
        const addButton = screen.getByText(/Add Ingredient/i);
        fireEvent.click(addButton);

        // Mock suggestions
        const nameInput = screen.getByLabelText(/Name:/i, { selector: 'input' });
        fireEvent.change(nameInput, { target: { value: "Tomato" } });

        // Simulate suggestion rendering
        const suggestionList = await screen.findByRole("list", { name: /suggestions/i });
        const suggestionItem = document.createElement("li");
        suggestionItem.textContent = "Tomato";
        suggestionList.appendChild(suggestionItem);

        // Simulate clicking a suggestion to populate the id field
        fireEvent.click(suggestionItem);

        // Fill out the rest of the form
        const amountInput = screen.getByLabelText(/Amount:/i, { selector: 'input' });
        const unitInput = screen.getByLabelText(/Unit:/i, { selector: 'select' });
        const categorySelect = screen.getByLabelText(/Category:/i, { selector: 'select' });

        fireEvent.change(amountInput, { target: { value: "5" } });
        fireEvent.change(unitInput, { target: { value: "kg" } });
        fireEvent.change(categorySelect, { target: { value: "Vegetables" } });

        // Submit the form
        const saveButton = screen.getByText(/Save/i);
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(addIngredientMock).toHaveBeenCalledWith({
                id: expect.any(String), // Ensure id is populated
                name: "Tomato",
                amount: 5,
                unit: "kg",
                category: "Vegetables",
            });
        });

        // Verify the new ingredient is displayed
        expect(screen.getByText(/Tomato/i)).toBeInTheDocument();
        expect(screen.getByText(/5 kg/i)).toBeInTheDocument();
    });
});
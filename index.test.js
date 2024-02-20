const BudgetService = require("./index");
const Budget = require("./budget");

describe("", () => {
    const budgetService = new BudgetService();

    it("invalid", () => {
        budgetService.getAll = () => {
            return [
                new Budget("202312", 31),
                new Budget("202401", 310),
                new Budget("202402", 29),
                new Budget("202403", 620),
                new Budget("202405", 600),
            ];
        };
        const result = budgetService.query("2024-01-10", "2024-01-01");
        expect(result).toBe(0);
    });

    it("query one day", () => {
        budgetService.getAll = () => {
            return [new Budget("202401", 620)];
        };
        const result = budgetService.query("2024-01-01", "2024-01-01");
        expect(result).toBe(20);
    });

    it("start end in same month ", () => {
        budgetService.getAll = () => {
            return [new Budget("202401", 620)];
        };
        const result = budgetService.query("2024-01-01", "2024-01-10");
        expect(result).toBe(200);
    });

    it("cross month", () => {
        budgetService.getAll = () => {
            return [new Budget("202401", 310), new Budget("202402", 29)];
        };
        const result = budgetService.query("2024-01-29", "2024-02-02");
        expect(result).toBe(32);
    });

    it("null data month", () => {
        budgetService.getAll = () => {
            return [new Budget("202401", 310), new Budget("202402", 29)];
        };
        const result = budgetService.query("2024-03-29", "2024-03-31");
        expect(result).toBe(0);
    });

    it("cross null data month", () => {
        budgetService.getAll = () => {
            return [new Budget("202401", 310), new Budget("202403", 620)];
        };
        const result = budgetService.query("2024-01-29", "2024-03-31");
        expect(result).toBe(650);
    });

    it("cross year", () => {
        budgetService.getAll = () => {
            return [
                new Budget("202312", 31),
                new Budget("202401", 310),
                new Budget("202403", 620),
            ];
        };
        const result = budgetService.query("2023-12-30", "2024-03-30");
        expect(result).toBe(912);
    });
});

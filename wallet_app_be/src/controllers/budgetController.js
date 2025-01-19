import BudgetService from '../services/budgetService';

class BudgetController {
    async createBudget(req, res) {
        try {
            const budget = await BudgetService.createBudget(req.body);
            res.status(201).json(budget);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getBudgetById(req, res) {
        try {
            const budget = await BudgetService.getBudgetById(req.params.id);
            res.status(200).json(budget);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateBudget(req, res) {
        try {
            const budget = await BudgetService.updateBudget(req.params.id, req.body);
            res.status(200).json(budget);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteBudget(req, res) {
        try {
            const budget = await BudgetService.deleteBudget(req.params.id);
            res.status(200).json({ message: 'Budget deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAllBudgets(req, res) {
        try {
            const budgets = await BudgetService.getAllBudgets();
            res.status(200).json(budgets);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new BudgetController();
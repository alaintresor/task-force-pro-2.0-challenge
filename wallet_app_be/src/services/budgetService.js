import Budget from '../models/Budget';

class BudgetService {
    async createBudget(budgetData) {
        try {
            const budget = new Budget(budgetData);
            await budget.save();
            return budget;
        } catch (error) {
            throw new Error('Error creating budget: ' + error.message);
        }
    }

    async getBudgetById(budgetId) {
        try {
            const budget = await Budget.findById(budgetId).populate('categoryId');
            if (!budget) {
                throw new Error('Budget not found');
            }
            return budget;
        } catch (error) {
            throw new Error('Error fetching budget: ' + error.message);
        }
    }

    async updateBudget(budgetId, budgetData) {
        try {
            const budget = await Budget.findByIdAndUpdate(budgetId, budgetData, { new: true });
            if (!budget) {
                throw new Error('Budget not found');
            }
            return budget;
        } catch (error) {
            throw new Error('Error updating budget: ' + error.message);
        }
    }

    async deleteBudget(budgetId) {
        try {
            const budget = await Budget.findByIdAndDelete(budgetId);
            if (!budget) {
                throw new Error('Budget not found');
            }
            return budget;
        } catch (error) {
            throw new Error('Error deleting budget: ' + error.message);
        }
    }

    async getAllBudgets() {
        try {
            const budgets = await Budget.find().populate('categoryId');
            return budgets;
        } catch (error) {
            throw new Error('Error fetching budgets: ' + error.message);
        }
    }
}

export default new BudgetService();
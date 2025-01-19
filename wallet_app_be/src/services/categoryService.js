import Category from '../models/Category';

class CategoryService {
    async createCategory(data) {
        try {
            const category = new Category(data);
            return await category.save();
        } catch (error) {
            throw new Error('Error creating category: ' + error.message);
        }
    }

    async getCategoryById(id) {
        try {
            return await Category.findById(id);
        } catch (error) {
            throw new Error('Error fetching category: ' + error.message);
        }
    }

    async getAllCategories() {
        try {
            return await Category.find();
        } catch (error) {
            throw new Error('Error fetching categories: ' + error.message);
        }
    }

    async updateCategory(id, data) {
        try {
            return await Category.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw new Error('Error updating category: ' + error.message);
        }
    }

    async deleteCategory(id) {
        try {
            return await Category.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Error deleting category: ' + error.message);
        }
    }
}

export default new CategoryService();
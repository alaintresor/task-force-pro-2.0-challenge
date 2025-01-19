import SubCategory from '../models/SubCategory';

class SubCategoryService {
    async createSubCategory(data) {
        try {
            const subCategory = new SubCategory(data);
            await subCategory.save();
            return subCategory;
        } catch (error) {
            throw new Error(`Unable to create sub-category: ${error.message}`);
        }
    }

    async getSubCategoryById(id) {
        try {
            const subCategory = await SubCategory.findById(id).populate('categoryId');
            if (!subCategory) {
                throw new Error('Sub-category not found');
            }
            return subCategory;
        } catch (error) {
            throw new Error(`Unable to get sub-category: ${error.message}`);
        }
    }

    async getAllSubCategories() {
        try {
            const subCategories = await SubCategory.find().populate({
                path: 'categoryId',
            });
            return subCategories;
        } catch (error) {
            throw new Error(`Unable to get sub-categories: ${error.message}`);
        }
    }

    async updateSubCategory(id, data) {
        try {
            const subCategory = await SubCategory.findByIdAndUpdate(id, data, { new: true });
            if (!subCategory) {
                throw new Error('Sub-category not found');
            }
            return subCategory;
        } catch (error) {
            throw new Error(`Unable to update sub-category: ${error.message}`);
        }
    }

    async deleteSubCategory(id) {
        try {
            const subCategory = await SubCategory.findByIdAndDelete(id);
            if (!subCategory) {
                throw new Error('Sub-category not found');
            }
            return subCategory;
        } catch (error) {
            throw new Error(`Unable to delete sub-category: ${error.message}`);
        }
    }
}

export default new SubCategoryService();